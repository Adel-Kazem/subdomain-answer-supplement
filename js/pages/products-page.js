// pages/products-page.js - Products Page Logic for GreenLion SPA
document.addEventListener('alpine:init', () => {
    Alpine.data('productsPage', () => ({
        products: [],
        filteredProducts: [],
        categories: [],
        currentCategory: '',
        currentSearch: '',
        currentBrand: '',
        priceRange: { min: 0, max: 1000 },
        selectedPriceRange: { min: 0, max: 1000 },
        sortBy: 'name',
        sortOrder: 'asc',
        viewMode: 'grid',
        currentPage: 1,
        itemsPerPage: 12,
        isLoading: false,
        showFilters: false,

        brands: [],
        priceRanges: [
            { label: 'Under $25', min: 0, max: 25 },
            { label: '$25 - $50', min: 25, max: 50 },
            { label: '$50 - $100', min: 50, max: 100 },
            { label: '$100 - $200', min: 100, max: 200 },
            { label: 'Over $200', min: 200, max: 1000 }
        ],

        init() {
            this.loadProducts();
            this.loadCategories();
            this.extractBrands();
            this.watchRouteParams();
            this.applyInitialFilters();
        },

        watchRouteParams() {
            this.$watch('$store.router.currentParams', () => {
                this.applyInitialFilters();
            });
        },

        loadProducts() {
            this.isLoading = true;
            setTimeout(() => {
                if (typeof PRODUCTS !== 'undefined') {
                    this.products = [...PRODUCTS];
                    this.calculatePriceRange();
                    this.filterProducts();
                }
                this.isLoading = false;
            }, 300);
        },

        loadCategories() {
            if (typeof CATEGORIES !== 'undefined') {
                this.categories = [...CATEGORIES];
            }
        },

        extractBrands() {
            const brandSet = new Set();
            this.products.forEach(product => {
                if (product.brand) {
                    brandSet.add(product.brand);
                }
            });
            this.brands = Array.from(brandSet).sort();
        },

        calculatePriceRange() {
            if (this.products.length > 0) {
                const prices = this.products.map(p => parseFloat(p.price));
                this.priceRange.min = Math.floor(Math.min(...prices));
                this.priceRange.max = Math.ceil(Math.max(...prices));
                this.selectedPriceRange = { ...this.priceRange };
            }
        },

        applyInitialFilters() {
            const params = this.$store.router.getCurrentParams();

            if (params.category) {
                this.currentCategory = params.category;
            } else {
                this.currentCategory = '';
            }

            if (params.search) {
                this.currentSearch = params.search;
            } else {
                this.currentSearch = '';
            }

            if (params.brand) {
                this.currentBrand = params.brand;
            } else {
                this.currentBrand = '';
            }

            this.filterProducts();
        },

        filterProducts() {
            let filtered = [...this.products];

            // Category filter - improved logic
            if (this.currentCategory) {
                filtered = filtered.filter(product => {
                    if (!product.category) return false;

                    const productCategorySlug = product.category.toLowerCase().replace(/\s+/g, '-');

                    return (
                        productCategorySlug === this.currentCategory ||
                        product.category.toLowerCase() === this.currentCategory ||
                        product.category === this.currentCategory
                    );
                });
            }

            // Search filter
            if (this.currentSearch) {
                const searchTerm = this.currentSearch.toLowerCase();
                filtered = filtered.filter(product =>
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm) ||
                    (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
                    (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
                );
            }

            // Brand filter
            if (this.currentBrand) {
                filtered = filtered.filter(product =>
                    product.brand && product.brand.toLowerCase() === this.currentBrand.toLowerCase()
                );
            }

            // Price range filter
            filtered = filtered.filter(product => {
                const price = parseFloat(product.price);
                return price >= this.selectedPriceRange.min && price <= this.selectedPriceRange.max;
            });

            this.sortProducts(filtered);
            this.currentPage = 1;
        },

        sortProducts(products) {
            products.sort((a, b) => {
                let aValue, bValue;

                switch (this.sortBy) {
                    case 'price':
                        aValue = parseFloat(a.price);
                        bValue = parseFloat(b.price);
                        break;
                    case 'name':
                        aValue = a.name.toLowerCase();
                        bValue = b.name.toLowerCase();
                        break;
                    case 'rating':
                        aValue = parseFloat(a.rating) || 0;
                        bValue = parseFloat(b.rating) || 0;
                        break;
                    case 'newest':
                        aValue = new Date(a.createdAt || 0);
                        bValue = new Date(b.createdAt || 0);
                        break;
                    default:
                        aValue = a.name.toLowerCase();
                        bValue = b.name.toLowerCase();
                }

                if (this.sortOrder === 'asc') {
                    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                } else {
                    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
                }
            });

            this.filteredProducts = products;
        },

        // Pagination
        get paginatedProducts() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredProducts.slice(start, end);
        },

        get totalPages() {
            return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        },

        get hasNextPage() {
            return this.currentPage < this.totalPages;
        },

        get hasPrevPage() {
            return this.currentPage > 1;
        },

        nextPage() {
            if (this.hasNextPage) {
                this.currentPage++;
                this.scrollToTop();
            }
        },

        prevPage() {
            if (this.hasPrevPage) {
                this.currentPage--;
                this.scrollToTop();
            }
        },

        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.scrollToTop();
            }
        },

        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        // Filter actions
        selectCategory(category) {
            this.currentCategory = category;
            this.$store.router.navigate('products', { category: category });
        },

        selectBrand(brand) {
            this.currentBrand = brand;
            this.filterProducts();
        },

        selectPriceRange(range) {
            this.selectedPriceRange = { min: range.min, max: range.max };
            this.filterProducts();
        },

        clearFilters() {
            this.currentCategory = '';
            this.currentSearch = '';
            this.currentBrand = '';
            this.selectedPriceRange = { ...this.priceRange };
            this.$store.router.navigate('products');
        },

        performSearch() {
            if (this.currentSearch.trim()) {
                this.$store.router.navigate('products', { search: this.currentSearch });
            } else {
                this.$store.router.navigate('products');
            }
        },

        setViewMode(mode) {
            this.viewMode = mode;
        },

        // Product actions
        addToCart(product) {
            this.$store.cart.addItem(product);
        },

        toggleWishlist(product) {
            this.$store.wishlist.toggleItem(product);
        },

        viewProduct(product) {
            this.$store.router.navigate('product', { slug: product.slug });
        }
    }));
});

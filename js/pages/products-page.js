// pages/products-page.js - CLEANED Enhanced Products Page Logic for GreenLion SPA
document.addEventListener('alpine:init', () => {
    Alpine.data('productsPage', () => ({
        // Core data
        products: [],
        filteredProducts: [],
        categories: [],
        brands: [],

        // Filter states
        currentCategory: '',
        currentSearch: '',
        currentBrand: '',
        priceRanges: [],
        selectedPriceRange: { min: 0, max: 1000 },
        showNew: false,
        showSale: false,
        inStock: false,

        // UI states
        sortBy: 'featured',
        sortOrder: 'asc',
        viewMode: 'grid',
        currentPage: 1,
        itemsPerPage: 12,
        isLoading: false,
        showFilters: false,
        mobileFiltersOpen: false,

        // Pagination
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,

        // Price range options
        priceRangeOptions: [
            { label: 'Under $25', value: '0-25', min: 0, max: 25 },
            { label: '$25 - $50', value: '25-50', min: 25, max: 50 },
            { label: '$50 - $100', value: '50-100', min: 50, max: 100 },
            { label: '$100 - $200', value: '100-200', min: 100, max: 200 },
            { label: 'Over $200', value: '200+', min: 200, max: 1000 }
        ],

        // Sort options
        sortOptions: [
            { value: 'featured', label: 'Featured' },
            { value: 'name', label: 'Name A-Z' },
            { value: 'name-desc', label: 'Name Z-A' },
            { value: 'price-asc', label: 'Price: Low to High' },
            { value: 'price-desc', label: 'Price: High to Low' },
            { value: 'rating', label: 'Highest Rated' },
            { value: 'newest', label: 'Newest First' }
        ],

        init() {
            this.loadProducts();
            this.loadCategories();
            this.loadBrands();
            this.watchRouteParams();
            this.loadViewPreference();
            this.applyInitialFilters();
            this.updatePageTitle();
        },

        watchRouteParams() {
            this.$watch('$store.router.currentParams', () => {
                this.applyInitialFilters();
                this.updatePageTitle();
            });
        },

        loadProducts() {
            this.isLoading = true;

            // For instant data, use immediate check
            this.$nextTick(() => {
                if (typeof PRODUCTS !== 'undefined') {
                    this.products = [...PRODUCTS];
                    this.calculatePriceRange();
                    this.filterProducts();
                } else {
                    console.warn('PRODUCTS data not available');
                }
                this.isLoading = false;
            });
        },

        loadCategories() {
            if (typeof CATEGORIES !== 'undefined') {
                this.categories = [...CATEGORIES];
            } else {
                this.categories = [
                    { id: 1, name: 'Mobile Accessories', slug: 'mobile-accessories', parent_id: null },
                    { id: 2, name: 'Smart Gadgets', slug: 'smart-gadgets', parent_id: null },
                    { id: 3, name: 'Grooming Tools', slug: 'grooming-tools', parent_id: null },
                    { id: 4, name: 'Home Appliances', slug: 'home-appliances', parent_id: null }
                ];
            }
        },

        loadBrands() {
            this.brands = extractBrands();
        },

        calculatePriceRange() {
            if (this.products.length > 0) {
                const priceRange = calculatePriceRange();
                this.selectedPriceRange = {
                    min: priceRange.min,
                    max: priceRange.max
                };
            }
        },

        getProductPrice(product) {
            return parseFloat(product.salePrice || product.base_price || product.price || 0);
        },

        loadViewPreference() {
            const savedView = this.$store.utils.getStorage('greenlion_product_view');
            if (savedView && ['grid', 'list'].includes(savedView)) {
                this.viewMode = savedView;
            }
        },

        saveViewPreference() {
            this.$store.utils.setStorage('greenlion_product_view', this.viewMode);
        },

        updatePageTitle() {
            const params = this.$store.router.getCurrentParams();
            let title = 'Shop Electronics';

            if (params.category) {
                const category = getCategoryBySlug(params.category);
                title = category ? category.name : 'Products';
            } else if (params.search) {
                title = `Search Results for "${params.search}"`;
            }

            document.title = `${title} - GreenLion`;
        },

        applyInitialFilters() {
            const params = this.$store.router.getCurrentParams();

            // Reset filters
            this.currentCategory = '';
            this.currentSearch = '';
            this.currentBrand = '';
            this.showNew = false;
            this.showSale = false;
            this.inStock = false;
            this.priceRanges = [];

            // Apply URL parameters
            if (params.category) {
                this.currentCategory = params.category;
            }

            if (params.search) {
                this.currentSearch = params.search;
            }

            if (params.brand) {
                this.currentBrand = params.brand;
            }

            if (params.filter) {
                switch (params.filter) {
                    case 'new':
                        this.showNew = true;
                        break;
                    case 'sale':
                        this.showSale = true;
                        break;
                    case 'featured':
                        this.sortBy = 'featured';
                        break;
                }
            }

            if (params.price) {
                this.priceRanges = params.price.split(',');
            }

            if (params.sort) {
                this.sortBy = params.sort;
            }

            this.filterProducts();
        },

        // Product filtering logic
        filterProducts() {
            let filtered = [...this.products];

            // Category filter
            if (this.currentCategory) {
                const category = getCategoryBySlug(this.currentCategory);
                if (category) {
                    const categoryIdsToCheck = [
                        category.id,
                        ...this.getAllDescendantCategoryIds(category.id)
                    ];

                    filtered = filtered.filter(product => {
                        if (Array.isArray(product.categories)) {
                            return product.categories.some(catId => categoryIdsToCheck.includes(catId));
                        }

                        if (product.category) {
                            const productCategorySlug = this.$store.utils.encodeSlug(product.category);
                            return categoryIdsToCheck.includes(category.id) ||
                                productCategorySlug === this.currentCategory ||
                                product.category.toLowerCase() === category.name.toLowerCase();
                        }

                        return false;
                    });
                }
            }

            // Search filter
            if (this.currentSearch) {
                const searchTerm = this.currentSearch.toLowerCase();
                filtered = filtered.filter(product => {
                    const searchableText = [
                        product.name,
                        product.description,
                        product.category,
                        product.brand,
                        ...(product.tags || [])
                    ].filter(Boolean).join(' ').toLowerCase();

                    return searchableText.includes(searchTerm);
                });
            }

            // Brand filter
            if (this.currentBrand) {
                filtered = filtered.filter(product =>
                    product.brand && product.brand.toLowerCase() === this.currentBrand.toLowerCase()
                );
            }

            // Price range filter
            if (this.priceRanges.length > 0) {
                filtered = filtered.filter(product => {
                    const price = this.getProductPrice(product);
                    return this.priceRanges.some(range => {
                        if (range === '200+') {
                            return price >= 200;
                        }
                        const [min, max] = range.split('-').map(Number);
                        return price >= min && price <= max;
                    });
                });
            }

            // Status filters
            if (this.showNew) {
                filtered = filtered.filter(product => product.isNew);
            }

            if (this.showSale) {
                filtered = filtered.filter(product => product.isOnSale || product.salePrice);
            }

            if (this.inStock) {
                filtered = filtered.filter(product => {
                    if (product.hasVariants) {
                        return (product.totalVariantStock || 0) > 0;
                    }
                    return (product.stock || 0) > 0;
                });
            }

            // Sort products
            this.sortProducts(filtered);

            // Update pagination
            this.currentPage = 1;
            this.updatePagination();
        },

        sortProducts(products) {
            products.sort((a, b) => {
                let aValue, bValue;

                switch (this.sortBy) {
                    case 'price-asc':
                        aValue = this.getProductPrice(a);
                        bValue = this.getProductPrice(b);
                        return aValue - bValue;

                    case 'price-desc':
                        aValue = this.getProductPrice(a);
                        bValue = this.getProductPrice(b);
                        return bValue - aValue;

                    case 'name':
                        aValue = a.name.toLowerCase();
                        bValue = b.name.toLowerCase();
                        return aValue.localeCompare(bValue);

                    case 'name-desc':
                        aValue = a.name.toLowerCase();
                        bValue = b.name.toLowerCase();
                        return bValue.localeCompare(aValue);

                    case 'rating':
                        aValue = parseFloat(a.rating) || 0;
                        bValue = parseFloat(b.rating) || 0;
                        return bValue - aValue;

                    case 'newest':
                        aValue = new Date(a.createdAt || a.dateAdded || 0);
                        bValue = new Date(b.createdAt || b.dateAdded || 0);
                        return bValue - aValue;

                    case 'featured':
                    default:
                        const aScore = (a.isFeatured ? 1000 : 0) + (a.isNew ? 100 : 0) + (a.isOnSale ? 10 : 0);
                        const bScore = (b.isFeatured ? 1000 : 0) + (b.isNew ? 100 : 0) + (b.isOnSale ? 10 : 0);
                        return bScore - aScore;
                }
            });

            this.filteredProducts = products;
        },

        getAllDescendantCategoryIds(parentId) {
            let ids = [];
            this.categories.forEach(cat => {
                if (cat.parent_id === parentId) {
                    ids.push(cat.id);
                    ids = ids.concat(this.getAllDescendantCategoryIds(cat.id));
                }
            });
            return ids;
        },

        getParentCategories() {
            return this.categories.filter(cat => cat.parent_id === null);
        },

        // Pagination
        updatePagination() {
            this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
            this.hasNextPage = this.currentPage < this.totalPages;
            this.hasPrevPage = this.currentPage > 1;
        },

        get paginatedProducts() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredProducts.slice(start, end);
        },

        get resultsInfo() {
            const start = ((this.currentPage - 1) * this.itemsPerPage) + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredProducts.length);
            const total = this.filteredProducts.length;

            return { start, end, total };
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
        selectCategory(categorySlug) {
            this.currentCategory = categorySlug;
            this.updateURL();
            this.filterProducts();
        },

        selectBrand(brand) {
            this.currentBrand = brand;
            this.updateURL();
            this.filterProducts();
        },

        selectPriceRange(range) {
            const index = this.priceRanges.indexOf(range.value);
            if (index > -1) {
                this.priceRanges.splice(index, 1);
            } else {
                this.priceRanges.push(range.value);
            }
            this.updateURL();
            this.filterProducts();
        },

        toggleStatusFilter(filter) {
            switch (filter) {
                case 'new':
                    this.showNew = !this.showNew;
                    break;
                case 'sale':
                    this.showSale = !this.showSale;
                    break;
                case 'stock':
                    this.inStock = !this.inStock;
                    break;
            }
            this.updateURL();
            this.filterProducts();
        },

        clearFilters() {
            this.currentCategory = '';
            this.currentSearch = '';
            this.currentBrand = '';
            this.priceRanges = [];
            this.showNew = false;
            this.showSale = false;
            this.inStock = false;
            this.sortBy = 'featured';

            this.$store.router.navigate('products');
        },

        performSearch() {
            if (this.currentSearch.trim()) {
                this.updateURL();
                this.filterProducts();
            } else {
                this.currentSearch = '';
                this.updateURL();
                this.filterProducts();
            }
        },

        updateURL() {
            const params = {};

            if (this.currentCategory) params.category = this.currentCategory;
            if (this.currentSearch) params.search = this.currentSearch;
            if (this.currentBrand) params.brand = this.currentBrand;
            if (this.priceRanges.length > 0) params.price = this.priceRanges.join(',');
            if (this.sortBy !== 'featured') params.sort = this.sortBy;

            const statusFilters = [];
            if (this.showNew) statusFilters.push('new');
            if (this.showSale) statusFilters.push('sale');
            if (this.inStock) statusFilters.push('stock');
            if (statusFilters.length > 0) params.filter = statusFilters.join(',');

            this.$store.router.navigate('products', params);
        },

        // View management
        setViewMode(mode) {
            this.viewMode = mode;
            this.saveViewPreference();
        },

        toggleMobileFilters() {
            this.mobileFiltersOpen = !this.mobileFiltersOpen;
        },

        // Product actions
        addToCart(product, event) {
            event?.stopPropagation();
            this.$store.cart.addItem(product);
        },

        toggleWishlist(product, event) {
            event?.stopPropagation();
            this.$store.wishlist.toggleItem(product);
        },

        viewProduct(product, event) {
            event?.stopPropagation();
            this.$store.router.navigate('product', { slug: product.slug });
        },

        shareProduct(product, event) {
            event?.stopPropagation();
            this.$store.ui.shareProduct(product);
        },

        inquireAboutProduct(product, event) {
            event?.stopPropagation();
            const message = `Hello! I'm interested in the ${product.name}. Could you provide more information about this product?`;
            this.$store.ui.openWhatsApp(message);
        },

        // Utility methods
        getProductStock(product) {
            if (product.hasVariants) {
                return product.totalVariantStock || 0;
            }
            return product.stock || 0;
        },

        isProductInStock(product) {
            return this.getProductStock(product) > 0;
        },

        hasActiveFilters() {
            return !!(
                this.currentCategory ||
                this.currentSearch ||
                this.currentBrand ||
                this.priceRanges.length > 0 ||
                this.showNew ||
                this.showSale ||
                this.inStock
            );
        },

        getActiveFiltersCount() {
            let count = 0;
            if (this.currentCategory) count++;
            if (this.currentSearch) count++;
            if (this.currentBrand) count++;
            if (this.priceRanges.length > 0) count += this.priceRanges.length;
            if (this.showNew) count++;
            if (this.showSale) count++;
            if (this.inStock) count++;
            return count;
        },

        quickFilterByCategory(categorySlug) {
            this.selectCategory(categorySlug);
        },

        subscribeToNewsletter() {
            const email = this.$refs.newsletterEmail?.value;
            if (email && this.$store.utils.isValidEmail(email)) {
                this.$store.ui.showNotification('Thank you for subscribing!', 'success');
                this.$refs.newsletterEmail.value = '';
            } else {
                this.$store.ui.showNotification('Please enter a valid email address.', 'error');
            }
        }
    }));
});

// pages/product-page.js - Product Detail Page Logic for GreenLion SPA
document.addEventListener('alpine:init', () => {
    Alpine.data('productPage', () => ({
        product: null,
        selectedOptions: {},
        quantity: 1,
        selectedImageIndex: 0,
        relatedProducts: [],
        reviews: [],
        showImageModal: false,
        activeTab: 'description',
        isLoading: true,
        error: null,

        sampleReviews: [
            {
                id: 1,
                name: "Ahmad Khalil",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                rating: 5,
                comment: "Excellent product! Works exactly as described and the build quality is outstanding.",
                date: "2024-01-15",
                verified: true
            },
            {
                id: 2,
                name: "Sara Mahmoud",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                rating: 5,
                comment: "Fast delivery and great customer service. Very satisfied with my purchase!",
                date: "2024-01-10",
                verified: true
            },
            {
                id: 3,
                name: "Omar Hassan",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                rating: 4,
                comment: "Good quality product, but shipping took a bit longer than expected.",
                date: "2024-01-05",
                verified: false
            }
        ],

        init() {
            this.loadProduct();
            this.watchRouteParams();
        },

        watchRouteParams() {
            this.$watch('$store.router.currentParams', () => {
                this.loadProduct();
            });
        },

        loadProduct() {
            this.isLoading = true;
            this.error = null;

            const slug = this.$store.router.getParam('slug');

            if (!slug) {
                this.error = 'Product not found';
                this.isLoading = false;
                return;
            }

            setTimeout(() => {
                if (typeof PRODUCTS !== 'undefined') {
                    this.product = PRODUCTS.find(p => p.slug === slug);

                    if (this.product) {
                        this.initializeOptions();
                        this.loadRelatedProducts();
                        this.loadReviews();
                        this.selectedImageIndex = 0;
                    } else {
                        this.error = 'Product not found';
                    }
                } else {
                    this.error = 'Products data not available';
                }

                this.isLoading = false;
            }, 300);
        },

        initializeOptions() {
            if (this.product && this.product.options) {
                Object.keys(this.product.options).forEach(optionName => {
                    const options = this.product.options[optionName];
                    if (Array.isArray(options) && options.length > 0) {
                        this.selectedOptions[optionName] = typeof options[0] === 'object' ? options[0].value : options[0];
                    }
                });
            }
        },

        loadRelatedProducts() {
            if (this.product && typeof PRODUCTS !== 'undefined') {
                this.relatedProducts = PRODUCTS
                    .filter(p => p.category === this.product.category && p.id !== this.product.id)
                    .slice(0, 4);
            }
        },

        loadReviews() {
            this.reviews = this.sampleReviews;
        },

        get productImages() {
            if (!this.product) return [];

            const images = [this.product.image];
            if (this.product.gallery && Array.isArray(this.product.gallery)) {
                images.push(...this.product.gallery);
            }
            return images;
        },

        selectImage(index) {
            this.selectedImageIndex = index;
        },

        nextImage() {
            this.selectedImageIndex = (this.selectedImageIndex + 1) % this.productImages.length;
        },

        prevImage() {
            this.selectedImageIndex = this.selectedImageIndex === 0 ? this.productImages.length - 1 : this.selectedImageIndex - 1;
        },

        openImageModal() {
            this.showImageModal = true;
            document.body.style.overflow = 'hidden';
        },

        closeImageModal() {
            this.showImageModal = false;
            document.body.style.overflow = 'auto';
        },

        selectOption(optionName, value) {
            this.selectedOptions[optionName] = value;
        },

        getOptionPrice(optionName, value) {
            if (!this.product.options || !this.product.options[optionName]) return 0;

            const option = this.product.options[optionName].find(opt =>
                (typeof opt === 'object' && opt.value === value) ||
                (typeof opt === 'string' && opt === value)
            );

            return option && option.priceModifier ? parseFloat(option.priceModifier) : 0;
        },

        get finalPrice() {
            let price = parseFloat(this.product?.price || 0);

            Object.keys(this.selectedOptions).forEach(optionName => {
                price += this.getOptionPrice(optionName, this.selectedOptions[optionName]);
            });

            return price;
        },

        get totalPrice() {
            return this.finalPrice * this.quantity;
        },

        incrementQuantity() {
            if (this.quantity < 10) {
                this.quantity++;
            }
        },

        decrementQuantity() {
            if (this.quantity > 1) {
                this.quantity--;
            }
        },

        addToCart() {
            if (!this.product) return;

            this.$store.cart.addItem(
                this.product,
                this.quantity,
                this.selectedOptions
            );
        },

        buyNow() {
            this.addToCart();
            this.$store.router.navigate('cart');
        },

        toggleWishlist() {
            if (!this.product) return;
            this.$store.wishlist.toggleItem(this.product);
        },

        shareProduct() {
            if (!this.product) return;
            this.$store.ui.shareProduct(this.product);
        },

        get averageRating() {
            if (this.reviews.length === 0) return 0;
            const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
            return (sum / this.reviews.length).toFixed(1);
        },

        get ratingDistribution() {
            const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            this.reviews.forEach(review => {
                distribution[review.rating]++;
            });

            Object.keys(distribution).forEach(rating => {
                distribution[rating] = this.reviews.length > 0
                    ? Math.round((distribution[rating] / this.reviews.length) * 100)
                    : 0;
            });

            return distribution;
        },

        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        contactWhatsApp() {
            const message = `Hello! I'm interested in the ${this.product?.name}. Can you provide more information?`;
            this.$store.ui.openWhatsApp(message);
        }
    }));
});

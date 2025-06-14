// pages/home-page.js - FIXED Home Page Logic for GreenLion SPA
document.addEventListener('alpine:init', () => {
    Alpine.data('homePage', () => ({
        featuredProducts: [],
        categories: [],

        // Image Configuration - ADD THIS
        imageBaseUrl: window.location.origin + '/',

        testimonials: [
            {
                id: 1,
                name: "Sarah Martinez",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                rating: 5,
                comment: "Amazing quality products! My GreenLion wireless charger works perfectly and the build quality is exceptional.",
                location: "Beirut, Lebanon"
            },
            {
                id: 2,
                name: "Ahmad Hassan",
                avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                rating: 5,
                comment: "Fast delivery and excellent customer service. The power bank I ordered exceeded my expectations!",
                location: "Tripoli, Lebanon"
            },
            {
                id: 3,
                name: "Maya Khalil",
                avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                rating: 5,
                comment: "Love the smart home devices from GreenLion. They've made my daily routine so much easier!",
                location: "Sidon, Lebanon"
            }
        ],
        stats: [
            { label: "Happy Customers", value: "10,000+", icon: "icon-heart" },
            { label: "Products Sold", value: "25,000+", icon: "icon-shopping-bag" },
            { label: "5-Star Reviews", value: "95%", icon: "icon-star" },
            { label: "Countries Served", value: "5+", icon: "icon-location" }
        ],

        init() {
            this.loadFeaturedProducts();
            this.loadCategories();
        },

        loadFeaturedProducts() {
            if (typeof PRODUCTS !== 'undefined') {
                this.featuredProducts = PRODUCTS.slice(0, 8);
            }
        },

        loadCategories() {
            if (typeof CATEGORIES !== 'undefined') {
                this.categories = CATEGORIES.slice(0, 6);
            }
        },

        // ADD THESE IMAGE METHODS
        getFullImageUrl(imagePath) {
            if (!imagePath) return this.getPlaceholderImage();

            if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('//')) {
                return imagePath;
            }

            return this.imageBaseUrl + imagePath;
        },

        getPlaceholderImage() {
            return "data:image/svg+xml;charset=UTF-8,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='18' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
        },

        getProductImage(product) {
            let imagePath = '';

            if (product.images) {
                if (Array.isArray(product.images)) {
                    imagePath = product.images[0];
                } else {
                    imagePath = product.images;
                }
            } else if (product.image) {
                imagePath = product.image;
            }

            return this.getFullImageUrl(imagePath);
        },

        getCategoryImage(category) {
            return this.getFullImageUrl(category.image);
        },

        handleImageError(event) {
            console.warn('Image failed to load:', event.target.src);
            event.target.src = this.getPlaceholderImage();
        },

        // ADD PRICE FORMATTING
        formatPrice(price) {
            if (!price || isNaN(price)) return '$0.00';
            return `$${parseFloat(price).toFixed(2)}`;
        },

        getProductPrice(product) {
            return parseFloat(product.salePrice || product.base_price || product.price || 0);
        },

        scrollToSection(sectionId) {
            this.$store.ui?.scrollToElement ?
                this.$store.ui.scrollToElement(sectionId, 80) :
                document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }
    }));
});

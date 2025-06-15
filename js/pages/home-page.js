// pages/home-page.js - CLEANED Home Page Logic for GreenLion SPA
document.addEventListener('alpine:init', () => {
    Alpine.data('homePage', () => ({
        featuredProducts: [],
        categories: [],

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

        async init() {
            await this.$nextTick();

            this.loadFeaturedProducts();
            this.loadCategories();

            // Set homepage SEO with a small delay to ensure everything is loaded
            setTimeout(() => {
                if (typeof SEOManager !== 'undefined') {
                    SEOManager.setHomeSEO({
                        name: "GreenLion - Premium Consumer Electronics & Smart Gadgets in Lebanon",
                        description: "Discover cutting-edge technology and smart gadgets that enhance your digital lifestyle. From wireless chargers to smart home devices, we bring innovation to Lebanon.",
                        logo: "/images/logo.jpg",
                        url: window.location.origin
                    });
                }
            }, 100);
        },

        handleImageError(event) {
            this.$store.utils.handleImageError(event);
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

            return this.$store.utils.getFullImageUrl(imagePath);
        },

        getCategoryImage(category) {
            return this.$store.utils.getFullImageUrl(category.image);
        },

        getProductPrice(product) {
            return parseFloat(product.salePrice || product.base_price || product.price || 0);
        },

        scrollToSection(sectionId) {
            this.$store.ui.scrollToElement(sectionId, 80);
        }
    }));
});

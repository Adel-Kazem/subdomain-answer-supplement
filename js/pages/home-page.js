// pages/home-page.js - Home Page Logic for GreenLion SPA
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

        scrollToSection(sectionId) {
            this.$store.ui.scrollToElement(sectionId, 80);
        }
    }));
});

// data-helpers.js - Helper Functions for Product and Category Data
window.DataHelpers = {

    // Product Helper Functions
    getProductById(id) {
        return PRODUCTS.find(product => product.id === id);
    },

    getProductBySlug(slug) {
        return PRODUCTS.find(product => product.slug === slug);
    },

    getProductsByCategory(category) {
        return PRODUCTS.filter(product => product.category === category);
    },

    getFeaturedProducts(limit = 8) {
        return PRODUCTS.filter(product => product.badge).slice(0, limit);
    },

    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        return PRODUCTS.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
    },

    getProductsByPriceRange(min, max) {
        return PRODUCTS.filter(product => {
            const price = parseFloat(product.price);
            return price >= min && price <= max;
        });
    },

    getRelatedProducts(productId, limit = 4) {
        const product = this.getProductById(productId);
        if (!product) return [];

        return PRODUCTS
            .filter(p => p.category === product.category && p.id !== productId)
            .slice(0, limit);
    },

    // Category Helper Functions
    getCategoryBySlug(slug) {
        return CATEGORIES.find(category => category.slug === slug && category.active);
    },

    getCategoryById(id) {
        return CATEGORIES.find(category => category.id === id && category.active);
    },

    getActiveCategories() {
        return CATEGORIES.filter(category => category.active);
    },

    getFeaturedCategories() {
        return CATEGORIES.filter(category => category.active && category.featured);
    },

    getCategoryNameFromSlug(slug) {
        const category = this.getCategoryBySlug(slug);
        return category ? category.name : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },

    // Utility Functions
    extractBrands() {
        const brandSet = new Set();
        PRODUCTS.forEach(product => {
            if (product.brand) {
                brandSet.add(product.brand);
            }
        });
        return Array.from(brandSet).sort();
    },

    calculatePriceRange() {
        if (PRODUCTS.length === 0) return { min: 0, max: 1000 };

        const prices = PRODUCTS.map(p => parseFloat(p.price));
        return {
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices))
        };
    }
};

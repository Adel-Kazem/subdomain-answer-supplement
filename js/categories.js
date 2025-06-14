// js/categories.js - Category Data for GreenLion Electronics SPA
const CATEGORIES = [
    {
        id: 466617751,
        name: "Mobile Accessories",
        slug: "mobile-accessories",
        description: "Essential accessories for your mobile devices including chargers, cables, power banks, cases, and screen protectors.",
        parent_id: null,
        level: 0,
        sort_order: 1,
        is_active: true,
        is_featured: true,
        image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        icon: "📱",
        seo_title: "Mobile Accessories - Phone Chargers, Cases & More | GreenLion",
        seo_description: "Shop premium mobile accessories including fast chargers, protective cases, power banks, and cables for all smartphone brands.",
        seo_keywords: ["mobile accessories", "phone chargers", "power banks", "phone cases", "mobile cables"],
        product_count: 0,
        subcategories: [
            {
                id: 466617752,
                name: "Chargers & Cables",
                slug: "chargers-cables",
                description: "Fast chargers, wireless chargers, USB cables, and lightning cables.",
                parent_id: 466617751,
                level: 1,
                sort_order: 1,
                is_active: true,
                is_featured: true,
                image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                icon: "🔌",
                product_count: 0
            },
            {
                id: 466617753,
                name: "Power Banks",
                slug: "power-banks",
                description: "Portable power banks and wireless charging pads for on-the-go charging.",
                parent_id: 466617751,
                level: 1,
                sort_order: 2,
                is_active: true,
                is_featured: true,
                image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                icon: "🔋",
                product_count: 0
            },
            {
                id: 466617754,
                name: "Phone Cases & Covers",
                slug: "phone-cases-covers",
                description: "Protective cases, covers, and screen protectors for all phone models.",
                parent_id: 466617751,
                level: 1,
                sort_order: 3,
                is_active: true,
                is_featured: false,
                image: "https://images.unsplash.com/photo-1601593346740-925612772716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                icon: "🛡️",
                product_count: 0
            }
        ],
        created_at: "2025-01-15T10:00:00.000Z",
        updated_at: "2025-06-12T15:43:00.000Z"
    },
    {
        id: 1017426431,
        name: "Smart Gadgets",
        slug: "smart-gadgets",
        description: "Innovative smart gadgets including wireless earbuds, smart speakers, fitness trackers, and connected devices.",
        parent_id: null,
        level: 0,
        sort_order: 2,
        is_active: true,
        is_featured: true,
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        icon: "🎧",
        seo_title: "Smart Gadgets - Wireless Earbuds, Smart Speakers & More | GreenLion",
        seo_description: "Discover cutting-edge smart gadgets including wireless earbuds, smart speakers, fitness trackers, and innovative tech accessories.",
        seo_keywords: ["smart gadgets", "wireless earbuds", "smart speakers", "fitness trackers", "wearable tech"],
        product_count: 0,
        subcategories: [
            {
                id: 1017426432,
                name: "Audio Devices",
                slug: "audio-devices",
                description: "Wireless earbuds, headphones, speakers, and audio accessories.",
                parent_id: 1017426431,
                level: 1,
                sort_order: 1,
                is_active: true,
                is_featured: true,
                image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                icon: "🎵",
                product_count: 0
            },
            {
                id: 1017426433,
                name: "Wearable Tech",
                slug: "wearable-tech",
                description: "Smartwatches, fitness trackers, and health monitoring devices.",
                parent_id: 1017426431,
                level: 1,
                sort_order: 2,
                is_active: true,
                is_featured: true,
                image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                icon: "⌚",
                product_count: 0
            },
            {
                id: 1017426434,
                name: "Smart Home Accessories",
                slug: "smart-home-accessories",
                description: "Smart plugs, sensors, and home automation accessories.",
                parent_id: 1017426431,
                level: 1,
                sort_order: 3,
                is_active: true,
                is_featured: false,
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                icon: "🏠",
                product_count: 0
            }
        ],
        created_at: "2025-01-15T10:00:00.000Z",
        updated_at: "2025-06-12T15:43:00.000Z"
    },
    {
        id: 789012345,
        name: "Grooming Tools",
        slug: "grooming-tools",
        description: "Professional grooming tools including hair trimmers, electric shavers, and personal care devices.",
        parent_id: null,
        level: 0,
        sort_order: 3,
        is_active: true,
        is_featured: true,
        image: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        icon: "✂️",
        seo_title: "Grooming Tools - Hair Trimmers, Electric Shavers & More | GreenLion",
        seo_description: "Professional grooming tools for men including hair trimmers, electric shavers, beard trimmers, and personal care accessories.",
        seo_keywords: ["grooming tools", "hair trimmer", "electric shaver", "beard trimmer", "personal care"],
        product_count: 0,
        subcategories: [
            {
                id: 789012346,
                name: "Hair Trimmers",
                slug: "hair-trimmers",
                description: "Professional hair trimmers and clippers for precise cutting.",
                parent_id: 789012345,
                level: 1,
                sort_order: 1,
                is_active: true,
                is_featured: true,
                image: "https://images.unsplash.com/photo-1581404343475-5ac25fe18df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                icon: "💇",
                product_count: 0
            },
            {
                id: 789012347,
                name: "Electric Shavers",
                slug: "electric-shavers",
                description: "Premium electric shavers for smooth and comfortable shaving.",
                parent_id: 789012345,
                level: 1,
                sort_order: 2,
                is_active: true,
                is_featured: true,
                image: "https://images.unsplash.com/photo-1609252739686-22d5b0c2f06c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                icon: "🪒",
                product_count: 0
            },
            {
                id: 789012348,
                name: "Personal Care",
                slug: "personal-care",
                description: "Personal care devices and grooming accessories.",
                parent_id: 789012345,
                level: 1,
                sort_order: 3,
                is_active: true,
                is_featured: false,
                image: "https://images.unsplash.com/photo-1556229174-f6803faab5fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                icon: "🧴",
                product_count: 0
            }
        ],
        created_at: "2025-01-15T10:00:00.000Z",
        updated_at: "2025-06-12T15:43:00.000Z"
    },
    {
        id: 20182851,
        name: "Home Appliances",
        slug: "home-appliances",
        description: "Smart home appliances including security cameras, digital frames, garment steamers, and innovative household devices.",
        parent_id: null,
        level: 0,
        sort_order: 4,
        is_active: true,
        is_featured: true,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        icon: "🏠",
        seo_title: "Home Appliances - Smart Cameras, Steamers & More | GreenLion",
        seo_description: "Modern home appliances including smart security cameras, garment steamers, digital frames, and innovative household devices.",
        seo_keywords: ["home appliances", "smart camera", "garment steamer", "digital frame", "household devices"],
        product_count: 0,
        subcategories: [
            {
                id: 20182852,
                name: "Security & Surveillance",
                slug: "security-surveillance",
                description: "Smart security cameras, doorbells, and surveillance systems.",
                parent_id: 20182851,
                level: 1,
                sort_order: 1,
                is_active: true,
                is_featured: true,
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                icon: "📹",
                product_count: 0
            },
            {
                id: 20182853,
                name: "Clothing Care",
                slug: "clothing-care",
                description: "Garment steamers, irons, and clothing care appliances.",
                parent_id: 20182851,
                level: 1,
                sort_order: 2,
                is_active: true,
                is_featured: true,
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                icon: "👔",
                product_count: 0
            },
            {
                id: 20182854,
                name: "Digital Displays",
                slug: "digital-displays",
                description: "Digital photo frames and smart display devices.",
                parent_id: 20182851,
                level: 1,
                sort_order: 3,
                is_active: true,
                is_featured: false,
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                icon: "🖼️",
                product_count: 0
            },
            {
                id: 20182855,
                name: "Kitchen Appliances",
                slug: "kitchen-appliances",
                description: "Small kitchen appliances and cooking gadgets.",
                parent_id: 20182851,
                level: 1,
                sort_order: 4,
                is_active: true,
                is_featured: false,
                image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                icon: "🍳",
                product_count: 0
            }
        ],
        created_at: "2025-01-15T10:00:00.000Z",
        updated_at: "2025-06-12T15:43:00.000Z"
    }
];

// Calculate product counts for categories after products are loaded
function updateCategoryProductCounts() {
    if (typeof PRODUCTS !== 'undefined') {
        // Reset all counts
        CATEGORIES.forEach(category => {
            category.product_count = 0;
            if (category.subcategories) {
                category.subcategories.forEach(sub => {
                    sub.product_count = 0;
                });
            }
        });

        // Count products in each category
        PRODUCTS.forEach(product => {
            if (product.categories && Array.isArray(product.categories)) {
                product.categories.forEach(categoryId => {
                    // Find main category
                    const mainCategory = CATEGORIES.find(cat => cat.id === categoryId);
                    if (mainCategory) {
                        mainCategory.product_count++;
                    }

                    // Find subcategory
                    CATEGORIES.forEach(category => {
                        if (category.subcategories) {
                            const subcategory = category.subcategories.find(sub => sub.id === categoryId);
                            if (subcategory) {
                                subcategory.product_count++;
                                // Also increment parent category count
                                category.product_count++;
                            }
                        }
                    });
                });
            }
        });
    }
}

// Utility functions for category management
const CategoryUtils = {
    // Get all categories (flat array including subcategories)
    getAllCategories() {
        const allCategories = [...CATEGORIES];
        CATEGORIES.forEach(category => {
            if (category.subcategories) {
                allCategories.push(...category.subcategories);
            }
        });
        return allCategories;
    },

    // Get category by ID
    getCategoryById(id) {
        return this.getAllCategories().find(cat => cat.id === id);
    },

    // Get category by slug
    getCategoryBySlug(slug) {
        return this.getAllCategories().find(cat => cat.slug === slug);
    },

    // Get main categories only
    getMainCategories() {
        return CATEGORIES.filter(cat => cat.level === 0);
    },

    // Get featured categories
    getFeaturedCategories() {
        return CATEGORIES.filter(cat => cat.is_featured && cat.level === 0);
    },

    // Get subcategories for a category
    getSubcategories(categoryId) {
        const category = CATEGORIES.find(cat => cat.id === categoryId);
        return category ? category.subcategories || [] : [];
    },

    // Get category hierarchy (breadcrumb path)
    getCategoryHierarchy(categoryId) {
        const category = this.getCategoryById(categoryId);
        if (!category) return [];

        const hierarchy = [category];

        // If it's a subcategory, find its parent
        if (category.parent_id) {
            const parent = this.getCategoryById(category.parent_id);
            if (parent) {
                hierarchy.unshift(parent);
            }
        }

        return hierarchy;
    },

    // Generate category URL
    getCategoryUrl(categorySlug) {
        return `#/products?category=${categorySlug}`;
    },

    // Check if category has products
    hasProducts(categoryId) {
        if (typeof PRODUCTS === 'undefined') return false;
        return PRODUCTS.some(product =>
            product.categories && product.categories.includes(categoryId)
        );
    }
};

// Initialize category product counts when products are available
if (typeof window !== 'undefined') {
    // Run immediately if products are already loaded
    if (typeof PRODUCTS !== 'undefined') {
        updateCategoryProductCounts();
    }

    // Also run when DOM is loaded to ensure products are available
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(updateCategoryProductCounts, 100);
    });

    // Make categories globally available
    window.CATEGORIES = CATEGORIES;
    window.CategoryUtils = CategoryUtils;
}

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CATEGORIES, CategoryUtils };
}

// app.js - Complete Main Application Controller for GreenLion SPA
// Including Data Helper Functions and All Store Logic

// =============================================================================
// GLOBAL DATA HELPER FUNCTIONS
// =============================================================================

window.getProductById = (id) => {
    if (typeof PRODUCTS === 'undefined') return null;
    return PRODUCTS.find(product => product.id === id);
};

window.getProductBySlug = (slug) => {
    if (typeof PRODUCTS === 'undefined') return null;
    return PRODUCTS.find(product => product.slug === slug);
};

window.getProductsByCategory = (category) => {
    if (typeof PRODUCTS === 'undefined') return [];
    return PRODUCTS.filter(product => product.category === category);
};

window.getFeaturedProducts = (limit = 8) => {
    if (typeof PRODUCTS === 'undefined') return [];
    return PRODUCTS.filter(product => product.badge).slice(0, limit);
};

window.searchProducts = (query) => {
    if (typeof PRODUCTS === 'undefined') return [];
    const searchTerm = query.toLowerCase();
    return PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
};

window.getProductsByPriceRange = (min, max) => {
    if (typeof PRODUCTS === 'undefined') return [];
    return PRODUCTS.filter(product => {
        const price = parseFloat(product.price);
        return price >= min && price <= max;
    });
};

window.getRelatedProducts = (productId, limit = 4) => {
    const product = getProductById(productId);
    if (!product || typeof PRODUCTS === 'undefined') return [];

    return PRODUCTS
        .filter(p => p.category === product.category && p.id !== productId)
        .slice(0, limit);
};

window.getCategoryBySlug = (slug) => {
    if (typeof CATEGORIES === 'undefined') return null;
    return CATEGORIES.find(category => category.slug === slug && category.active);
};

window.getCategoryById = (id) => {
    if (typeof CATEGORIES === 'undefined') return null;
    return CATEGORIES.find(category => category.id === id && category.active);
};

window.getActiveCategories = () => {
    if (typeof CATEGORIES === 'undefined') return [];
    return CATEGORIES.filter(category => category.active);
};

window.getFeaturedCategories = () => {
    if (typeof CATEGORIES === 'undefined') return [];
    return CATEGORIES.filter(category => category.active && category.featured);
};

window.getCategoryNameFromSlug = (slug) => {
    const category = getCategoryBySlug(slug);
    return category ? category.name : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

window.extractBrands = () => {
    if (typeof PRODUCTS === 'undefined') return [];
    const brandSet = new Set();
    PRODUCTS.forEach(product => {
        if (product.brand) {
            brandSet.add(product.brand);
        }
    });
    return Array.from(brandSet).sort();
};

window.calculatePriceRange = () => {
    if (typeof PRODUCTS === 'undefined' || PRODUCTS.length === 0) {
        return { min: 0, max: 1000 };
    }

    const prices = PRODUCTS.map(p => parseFloat(p.price));
    return {
        min: Math.floor(Math.min(...prices)),
        max: Math.ceil(Math.max(...prices))
    };
};

// =============================================================================
// ALPINE.JS APPLICATION INITIALIZATION
// =============================================================================

document.addEventListener('alpine:init', () => {

    // =========================================================================
    // UTILITIES STORE - CENTRALIZED UTILITY FUNCTIONS
    // =========================================================================
    Alpine.store('utils', {
        // Image handling
        imageBaseUrl: window.location.origin + '/',

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

        handleImageError(event) {
            console.warn('Image failed to load:', event.target.src);
            event.target.src = this.getPlaceholderImage();
        },

        // Slug utilities
        encodeSlug(text) {
            return text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        },

        decodeSlug(slug) {
            return slug
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        },

        // Validation utilities
        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },

        isValidPhone(phone, country = 'LB') {
            if (country === 'LB') {
                return /^(\+961|961|0)?[0-9]{8}$/.test(phone.replace(/\s/g, ''));
            }
            return phone.length >= 8;
        },

        // Text utilities
        truncateText(text, maxLength = 100) {
            if (!text || text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        },

        capitalizeFirst(text) {
            if (!text) return '';
            return text.charAt(0).toUpperCase() + text.slice(1);
        },

        // Array utilities
        shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        },

        // Local storage utilities
        setStorage(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error('Failed to save to localStorage:', error);
            }
        },

        getStorage(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error('Failed to load from localStorage:', error);
                return null;
            }
        },

        removeStorage(key) {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.error('Failed to remove from localStorage:', error);
            }
        }
    });

    // =========================================================================
    // MAIN APP CONTROLLER
    // =========================================================================
    Alpine.data('appController', () => ({
        scrollTop: false,
        isInitialized: false,

        async init() {
            // Initialize router first
            Alpine.store('router').init();

            // Load initial templates
            await this.loadInitialTemplates();

            // Initialize stores
            Alpine.store('cart').init();
            Alpine.store('wishlist').init();

            this.isInitialized = true;
        },

        async loadInitialTemplates() {
            try {
                // Load core component templates
                await Promise.all([
                    this.loadNavigation(),
                    this.loadFooter(),
                    this.loadFloatingButtons()
                ]);

                // Preload page templates for faster navigation
                window.templateLoader.preloadTemplates([
                    'templates/pages/home-page.html',
                    'templates/pages/products-page.html',
                    'templates/pages/product-page.html',
                    'templates/pages/cart-page.html'
                ]);
            } catch (error) {
                console.error('Failed to load initial templates:', error);
            }
        },

        async loadNavigation() {
            try {
                const template = await window.templateLoader.loadComponentTemplate('navigation');
                document.getElementById('navigation').innerHTML = template;
            } catch (error) {
                console.error('Failed to load navigation:', error);
            }
        },

        async loadFooter() {
            try {
                const template = await window.templateLoader.loadComponentTemplate('footer');
                document.getElementById('footer').innerHTML = template;
            } catch (error) {
                console.error('Failed to load footer:', error);
            }
        },

        async loadFloatingButtons() {
            try {
                const template = await window.templateLoader.loadComponentTemplate('floating-buttons');
                document.getElementById('floating-buttons').innerHTML = template;
            } catch (error) {
                console.error('Failed to load floating buttons:', error);
            }
        }
    }));

    // =========================================================================
    // UI STORE - HANDLES GLOBAL UI STATE
    // =========================================================================
    Alpine.store('ui', {
        searchOpen: false,
        searchQuery: '',
        mobileMenuOpen: false,
        loadingStates: {},
        notifications: [],

        // Search functionality
        toggleSearch() {
            this.searchOpen = !this.searchOpen;
            if (this.searchOpen) {
                setTimeout(() => {
                    const searchInput = document.querySelector('input[x-model="$store.ui.searchQuery"]');
                    if (searchInput) searchInput.focus();
                }, 100);
            }
        },

        clearSearch() {
            this.searchQuery = '';
            this.searchOpen = false;
        },

        // Mobile menu
        toggleMobileMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
        },

        closeMobileMenu() {
            this.mobileMenuOpen = false;
        },

        // Loading states for different components
        setLoading(key, state) {
            this.loadingStates[key] = state;
        },

        isLoading(key) {
            return this.loadingStates[key] || false;
        },

        // Notifications system
        showNotification(message, type = 'info', duration = 3000) {
            const id = Date.now();
            const notification = {
                id,
                message,
                type, // 'success', 'error', 'warning', 'info'
                timestamp: new Date()
            };

            this.notifications.push(notification);
            this.renderNotifications();

            // Auto remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    this.removeNotification(id);
                }, duration);
            }

            return id;
        },

        removeNotification(id) {
            this.notifications = this.notifications.filter(n => n.id !== id);
            this.renderNotifications();
        },

        renderNotifications() {
            const container = document.getElementById('notifications');
            if (!container) return;

            container.innerHTML = this.notifications.map(notification => `
                <div x-data="{ show: true }"
                     x-show="show"
                     x-transition:enter="transition ease-out duration-300 transform"
                     x-transition:enter-start="opacity-0 translate-x-full"
                     x-transition:enter-end="opacity-100 translate-x-0"
                     x-transition:leave="transition ease-in duration-200 transform"
                     x-transition:leave-start="opacity-100 translate-x-0"
                     x-transition:leave-end="opacity-0 translate-x-full"
                     class="max-w-sm p-4 rounded-lg shadow-lg text-white flex items-center justify-between ${this.getNotificationClasses(notification.type)}">
                    <div class="flex items-center space-x-3">
                        <div>${this.getNotificationIcon(notification.type)}</div>
                        <span class="font-medium">${notification.message}</span>
                    </div>
                    <button @click="$store.ui.removeNotification(${notification.id})" 
                            class="ml-4 hover:bg-black hover:bg-opacity-20 rounded p-1 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            `).join('');
        },

        getNotificationClasses(type) {
            const classes = {
                'success': 'bg-green-600',
                'error': 'bg-red-600',
                'warning': 'bg-yellow-600',
                'info': 'bg-blue-600'
            };
            return classes[type] || classes.info;
        },

        getNotificationIcon(type) {
            const icons = {
                'success': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
                'error': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
                'warning': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
                'info': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
            };
            return icons[type] || icons.info;
        },

        // WhatsApp integration
        openWhatsApp(message = '') {
            const phoneNumber = '+96171234567'; // Replace with actual WhatsApp number
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        },

        // Share functionality
        shareProduct(product) {
            if (navigator.share) {
                navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.origin + Alpine.store('router').generateProductUrl(product)
                }).catch(console.error);
            } else {
                // Fallback: copy to clipboard
                const url = window.location.origin + Alpine.store('router').generateProductUrl(product);
                this.copyToClipboard(url);
                this.showNotification('Product link copied to clipboard!', 'success');
            }
        },

        // Utility functions
        copyToClipboard(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).catch(console.error);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
        },

        // Format currency
        formatPrice(price) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }).format(price);
        },

        // Format date
        formatDate(date) {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(new Date(date));
        },

        // Scroll to element
        scrollToElement(elementId, offset = 100) {
            const element = document.getElementById(elementId);
            if (element) {
                const elementPosition = element.offsetTop - offset;
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        }
    });

    // =========================================================================
    // CART STORE - HANDLES SHOPPING CART FUNCTIONALITY
    // =========================================================================
    Alpine.store('cart', {
        items: [],
        isOpen: false,

        init() {
            this.loadFromStorage();
        },

        addItem(product, quantity = 1, selectedOptions = {}) {
            const existingItemIndex = this.findExistingItem(product, selectedOptions);

            if (existingItemIndex !== -1) {
                this.items[existingItemIndex].quantity += quantity;
            } else {
                const cartItem = {
                    id: this.generateCartItemId(),
                    product: { ...product },
                    quantity: quantity,
                    selectedOptions: { ...selectedOptions },
                    addedAt: new Date().toISOString(),
                    price: this.calculateItemPrice(product, selectedOptions)
                };
                this.items.push(cartItem);
            }

            this.saveToStorage();
            Alpine.store('ui').showNotification(`${product.name} added to cart!`, 'success');
            this.trackAddToCart(product, quantity);
        },

        removeItem(itemId) {
            const item = this.items.find(item => item.id === itemId);
            if (item) {
                this.items = this.items.filter(item => item.id !== itemId);
                this.saveToStorage();
                Alpine.store('ui').showNotification(`${item.product.name} removed from cart`, 'info');
            }
        },

        updateQuantity(itemId, newQuantity) {
            if (newQuantity <= 0) {
                this.removeItem(itemId);
                return;
            }

            const item = this.items.find(item => item.id === itemId);
            if (item) {
                item.quantity = newQuantity;
                this.saveToStorage();
            }
        },

        clearCart() {
            this.items = [];
            this.saveToStorage();
            Alpine.store('ui').showNotification('Cart cleared', 'info');
        },

        findExistingItem(product, selectedOptions) {
            return this.items.findIndex(item =>
                item.product.id === product.id &&
                JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
            );
        },

        calculateItemPrice(product, selectedOptions) {
            let basePrice = parseFloat(product.price) || 0;

            if (product.options && selectedOptions) {
                Object.keys(selectedOptions).forEach(optionName => {
                    const selectedValue = selectedOptions[optionName];
                    const option = product.options[optionName];
                    if (option && Array.isArray(option)) {
                        const optionObj = option.find(opt =>
                            (typeof opt === 'object' && opt.value === selectedValue) ||
                            (typeof opt === 'string' && opt === selectedValue)
                        );
                        if (optionObj && optionObj.priceModifier) {
                            basePrice += parseFloat(optionObj.priceModifier);
                        }
                    }
                });
            }

            return basePrice;
        },

        generateCartItemId() {
            return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        },

        getTotalItems() {
            return this.items.reduce((total, item) => total + item.quantity, 0);
        },

        getTotalPrice() {
            return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        },

        getSubtotal() {
            return this.getTotalPrice();
        },

        getTax(rate = 0.11) {
            return this.getSubtotal() * rate;
        },

        getShippingCost() {
            const subtotal = this.getSubtotal();
            if (subtotal >= 100) return 0;
            return 10;
        },

        getFinalTotal() {
            return this.getSubtotal() + this.getTax() + this.getShippingCost();
        },

        isEmpty() {
            return this.items.length === 0;
        },

        getCartSummary() {
            return {
                items: this.items,
                itemCount: this.getTotalItems(),
                subtotal: this.getSubtotal(),
                tax: this.getTax(),
                shipping: this.getShippingCost(),
                total: this.getFinalTotal()
            };
        },

        saveToStorage() {
            Alpine.store('utils').setStorage('greenlion_cart', this.items);
        },

        loadFromStorage() {
            const savedCart = Alpine.store('utils').getStorage('greenlion_cart');
            if (savedCart) {
                this.items = savedCart;
            }
        },

        trackAddToCart(product, quantity) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'add_to_cart', {
                    currency: 'USD',
                    value: parseFloat(product.price) * quantity,
                    items: [{
                        item_id: product.id,
                        item_name: product.name,
                        category: product.category,
                        quantity: quantity,
                        price: parseFloat(product.price)
                    }]
                });
            }
        },

        trackCartView() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'view_cart', {
                    currency: 'USD',
                    value: this.getTotalPrice(),
                    items: this.items.map(item => ({
                        item_id: item.product.id,
                        item_name: item.product.name,
                        category: item.product.category,
                        quantity: item.quantity,
                        price: item.price
                    }))
                });
            }
        },

        checkoutViaWhatsApp() {
            const summary = this.getCartSummary();
            let message = "🛒 *GreenLion Order Request*\n\n";

            summary.items.forEach((item, index) => {
                message += `${index + 1}. *${item.product.name}*\n`;
                message += `   Quantity: ${item.quantity}\n`;
                message += `   Price: ${Alpine.store('ui').formatPrice(item.price)}\n`;

                if (Object.keys(item.selectedOptions).length > 0) {
                    message += `   Options: ${Object.entries(item.selectedOptions).map(([key, value]) => `${key}: ${value}`).join(', ')}\n`;
                }
                message += "\n";
            });

            message += `📊 *Order Summary:*\n`;
            message += `Subtotal: ${Alpine.store('ui').formatPrice(summary.subtotal)}\n`;
            message += `Tax: ${Alpine.store('ui').formatPrice(summary.tax)}\n`;
            message += `Shipping: ${Alpine.store('ui').formatPrice(summary.shipping)}\n`;
            message += `*Total: ${Alpine.store('ui').formatPrice(summary.total)}*\n\n`;
            message += "Please confirm this order and provide delivery details.";

            Alpine.store('ui').openWhatsApp(message);
            this.trackCheckoutBegin();
        },

        trackCheckoutBegin() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'begin_checkout', {
                    currency: 'USD',
                    value: this.getTotalPrice(),
                    items: this.items.map(item => ({
                        item_id: item.product.id,
                        item_name: item.product.name,
                        category: item.product.category,
                        quantity: item.quantity,
                        price: item.price
                    }))
                });
            }
        }
    });

    // =========================================================================
    // WISHLIST STORE - HANDLES WISHLIST FUNCTIONALITY
    // =========================================================================
    Alpine.store('wishlist', {
        items: [],

        init() {
            this.loadFromStorage();
        },

        addItem(product) {
            if (!this.isInWishlist(product.id)) {
                this.items.push({
                    id: product.id,
                    product: { ...product },
                    addedAt: new Date().toISOString()
                });
                this.saveToStorage();
                Alpine.store('ui').showNotification(`${product.name} added to wishlist!`, 'success');
            }
        },

        removeItem(productId) {
            const item = this.items.find(item => item.product.id === productId);
            if (item) {
                this.items = this.items.filter(item => item.product.id !== productId);
                this.saveToStorage();
                Alpine.store('ui').showNotification(`${item.product.name} removed from wishlist`, 'info');
            }
        },

        toggleItem(product) {
            if (this.isInWishlist(product.id)) {
                this.removeItem(product.id);
            } else {
                this.addItem(product);
            }
        },

        isInWishlist(productId) {
            return this.items.some(item => item.product.id === productId);
        },

        getItems() {
            return this.items;
        },

        getCount() {
            return this.items.length;
        },

        clearWishlist() {
            this.items = [];
            this.saveToStorage();
            Alpine.store('ui').showNotification('Wishlist cleared', 'info');
        },

        saveToStorage() {
            Alpine.store('utils').setStorage('greenlion_wishlist', this.items);
        },

        loadFromStorage() {
            const savedWishlist = Alpine.store('utils').getStorage('greenlion_wishlist');
            if (savedWishlist) {
                this.items = savedWishlist;
            }
        }
    });
});

// =============================================================================
// GLOBAL ERROR HANDLERS
// =============================================================================

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// js/components.js - Shared Alpine.js Components for GreenLion SPA
document.addEventListener('alpine:init', () => {
    // Site Header Component - Updated for SPA navigation
    Alpine.data('siteHeader', (config = {}) => {
        return {
            activeLink: config.activeLink || '',
            isOpen: false,

            init() {
                // Listen for route changes to update active states
                this.updateActiveLink();
            },

            // Update active link based on current route
            updateActiveLink() {
                const currentRoute = window.SPARouter?.getCurrentRoute();
                if (currentRoute) {
                    const path = currentRoute.path;
                    if (path === '/') {
                        this.activeLink = 'home';
                    } else if (path.startsWith('/products') || path.startsWith('/product')) {
                        this.activeLink = 'shop';
                    } else if (path === '/cart') {
                        this.activeLink = 'cart';
                    } else {
                        this.activeLink = '';
                    }
                }
            },

            // Navigate using SPA router
            navigateTo(path) {
                if (window.SPAUtils) {
                    window.SPAUtils.navigateTo(path);
                    this.isOpen = false; // Close mobile menu
                }
            },

            // Navigate to section within home page
            navigateToSection(sectionId) {
                if (window.SPARouter?.getCurrentRoute()?.path === '/') {
                    // Already on home page, just scroll to section
                    const element = document.getElementById(sectionId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    // Navigate to home page first, then scroll
                    this.navigateTo('/');
                    setTimeout(() => {
                        const element = document.getElementById(sectionId);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 500);
                }
                this.isOpen = false;
            },

            template: `
                <nav class="fixed w-full z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100">
                    <div class="max-w-7xl mx-auto px-6 py-4">
                        <div class="flex items-center justify-between">
                            <!-- Logo -->
                            <button @click="navigateTo('/')" class="flex items-center space-x-3 cursor-pointer">
                                <div class="w-10 h-10 bg-primary text-white font-bold text-xl flex items-center justify-center">
                                    GL
                                </div>
                                <div class="text-2xl font-bold text-primary">GreenLion</div>
                            </button>

                            <!-- Desktop Menu -->
                            <div class="hidden md:flex items-center space-x-8">
                                <button @click="navigateTo('/')" 
                                        id="nav-home" 
                                        class="text-gray-700 hover:text-primary font-medium transition-colors spa-link"
                                        :class="activeLink === 'home' ? 'text-primary border-b-2 border-primary pb-1' : ''">
                                    Home
                                </button>
                                <button @click="navigateTo('/products')" 
                                        id="nav-shop" 
                                        class="text-gray-700 hover:text-primary font-medium transition-colors spa-link"
                                        :class="activeLink === 'shop' ? 'text-primary border-b-2 border-primary pb-1' : ''">
                                    Shop
                                </button>
                                <button @click="navigateToSection('about')" 
                                        id="nav-about" 
                                        class="text-gray-700 hover:text-primary font-medium transition-colors spa-link">
                                    About
                                </button>
                                <button @click="navigateToSection('contact')" 
                                        id="nav-contact" 
                                        class="text-gray-700 hover:text-primary font-medium transition-colors spa-link">
                                    Contact
                                </button>
                            </div>

                            <!-- Right Actions -->
                            <div class="flex items-center space-x-4">
                                <!-- Search Button -->
                                <button id="search-toggle" class="hidden md:block text-gray-600 hover:text-primary transition-colors p-2">
                                    <svg class="h-5 w-5">
                                        <use xlink:href="#icon-search"></use>
                                    </svg>
                                </button>

                                <!-- Cart -->
                                <button @click="navigateTo('/cart')" 
                                        id="cart-link" 
                                        class="relative text-gray-600 hover:text-primary transition-colors p-2 spa-link"
                                        :class="activeLink === 'cart' ? 'text-primary' : ''">
                                    <svg class="h-6 w-6">
                                        <use xlink:href="#icon-shopping-bag"></use>
                                    </svg>
                                    <span class="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium" 
                                          x-text="$store.cart.getTotalItems()" 
                                          x-show="$store.cart.getTotalItems() > 0">0</span>
                                </button>

                                <!-- WhatsApp Contact -->
                                <button @click="$store.ui.openWhatsApp('Hello GreenLion! I have a question about your electronics products.')" 
                                        id="header-whatsapp-button" 
                                        class="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 font-medium transition-colors">
                                    <svg class="h-4 w-4">
                                        <use xlink:href="#icon-whatsapp"></use>
                                    </svg>
                                    <span>Chat</span>
                                </button>

                                <!-- Mobile Menu Toggle -->
                                <button class="md:hidden p-2 text-gray-600 hover:text-primary transition-colors" 
                                        @click="isOpen = !isOpen">
                                    <svg x-show="!isOpen" class="h-6 w-6">
                                        <use xlink:href="#icon-menu"></use>
                                    </svg>
                                    <svg x-show="isOpen" class="h-6 w-6">
                                        <use xlink:href="#icon-close"></use>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Mobile Menu -->
                        <div class="md:hidden" 
                             x-show="isOpen" 
                             x-transition:enter="transition ease-out duration-200"
                             x-transition:enter-start="opacity-0 -translate-y-4"
                             x-transition:enter-end="opacity-100 translate-y-0"
                             x-transition:leave="transition ease-in duration-150"
                             x-transition:leave-start="opacity-100 translate-y-0"
                             x-transition:leave-end="opacity-0 -translate-y-4"
                             @click.away="isOpen = false">
                            <div class="mt-4 py-6 px-4 bg-white border border-gray-100 shadow-lg space-y-6">
                                <button @click="navigateTo('/')" 
                                        id="mobile-nav-home" 
                                        class="block w-full text-left text-gray-700 hover:text-primary font-medium transition-colors spa-link"
                                        :class="activeLink === 'home' ? 'text-primary' : ''">
                                    Home
                                </button>
                                <button @click="navigateTo('/products')" 
                                        id="mobile-nav-shop" 
                                        class="block w-full text-left text-gray-700 hover:text-primary font-medium transition-colors spa-link"
                                        :class="activeLink === 'shop' ? 'text-primary' : ''">
                                    Shop
                                </button>
                                <button @click="navigateToSection('about')" 
                                        id="mobile-nav-about" 
                                        class="block w-full text-left text-gray-700 hover:text-primary font-medium transition-colors spa-link">
                                    About
                                </button>
                                <button @click="navigateToSection('contact')" 
                                        id="mobile-nav-contact" 
                                        class="block w-full text-left text-gray-700 hover:text-primary font-medium transition-colors spa-link">
                                    Contact
                                </button>

                                <!-- Mobile WhatsApp Button -->
                                <button @click="$store.ui.openWhatsApp('Hello GreenLion! I have a question about your electronics products.'); isOpen = false" 
                                        id="mobile-whatsapp-button" 
                                        class="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 font-medium transition-colors">
                                    <svg class="h-5 w-5">
                                        <use xlink:href="#icon-whatsapp"></use>
                                    </svg>
                                    <span>WhatsApp Chat</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            `
        };
    });

    // Site Footer Component - Updated for SPA navigation
    Alpine.data('siteFooter', () => {
        return {
            // Navigate using SPA router
            navigateTo(path) {
                if (window.SPAUtils) {
                    window.SPAUtils.navigateTo(path);
                }
            },

            // Navigate to section within home page
            navigateToSection(sectionId) {
                if (window.SPARouter?.getCurrentRoute()?.path === '/') {
                    // Already on home page, just scroll to section
                    const element = document.getElementById(sectionId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    // Navigate to home page first, then scroll
                    this.navigateTo('/');
                    setTimeout(() => {
                        const element = document.getElementById(sectionId);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 500);
                }
            },

            template: `
                <footer id="contact" class="bg-gray-900 text-white py-16">
                    <div class="max-w-7xl mx-auto px-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <!-- Company Info -->
                            <div class="lg:col-span-2">
                                <div class="flex items-center space-x-3 mb-6">
                                    <div class="w-12 h-12 bg-primary text-white font-bold text-xl flex items-center justify-center">
                                        GL
                                    </div>
                                    <h3 id="footer-logo" class="text-2xl font-bold">GreenLion</h3>
                                </div>
                                <p id="footer-description" class="text-gray-400 mb-6 leading-relaxed max-w-md">
                                    Lebanon's premier destination for premium consumer electronics, mobile accessories, smart gadgets, grooming tools, and innovative home appliances.
                                </p>
                                <div class="space-y-2">
                                    <div class="flex items-center gap-3">
                                        <svg class="h-5 w-5 text-primary flex-shrink-0">
                                            <use xlink:href="#icon-location"></use>
                                        </svg>
                                        <span id="footer-location" class="text-gray-400">Lebanon</span>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <svg class="h-5 w-5 text-green-500 flex-shrink-0">
                                            <use xlink:href="#icon-whatsapp"></use>
                                        </svg>
                                        <a href="https://wa.me/96170608543" id="footer-whatsapp" class="text-gray-400 hover:text-white transition-colors">
                                            +961 70 608 543
                                        </a>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <svg class="h-5 w-5 text-primary flex-shrink-0">
                                            <use xlink:href="#icon-email"></use>
                                        </svg>
                                        <a href="mailto:info@greenlion.com" id="footer-email" class="text-gray-400 hover:text-white transition-colors">
                                            info@greenlion.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <!-- Product Categories -->
                            <div>
                                <h4 id="footer-categories-heading" class="font-semibold mb-6 text-lg">Categories</h4>
                                <ul class="space-y-3">
                                    <li>
                                        <button @click="navigateTo('/products?category=mobile-accessories')" 
                                                id="footer-mobile-link" 
                                                class="text-gray-400 hover:text-white transition-colors spa-link">
                                            Mobile Accessories
                                        </button>
                                    </li>
                                    <li>
                                        <button @click="navigateTo('/products?category=smart-gadgets')" 
                                                id="footer-smart-link" 
                                                class="text-gray-400 hover:text-white transition-colors spa-link">
                                            Smart Gadgets
                                        </button>
                                    </li>
                                    <li>
                                        <button @click="navigateTo('/products?category=grooming-tools')" 
                                                id="footer-grooming-link" 
                                                class="text-gray-400 hover:text-white transition-colors spa-link">
                                            Grooming Tools
                                        </button>
                                    </li>
                                    <li>
                                        <button @click="navigateTo('/products?category=home-appliances')" 
                                                id="footer-home-link" 
                                                class="text-gray-400 hover:text-white transition-colors spa-link">
                                            Home Appliances
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <!-- Quick Links -->
                            <div>
                                <h4 id="footer-links-heading" class="font-semibold mb-6 text-lg">Quick Links</h4>
                                <ul class="space-y-3">
                                    <li>
                                        <button @click="navigateTo('/')" 
                                                id="footer-home-link" 
                                                class="text-gray-400 hover:text-white transition-colors spa-link">
                                            Home
                                        </button>
                                    </li>
                                    <li>
                                        <button @click="navigateTo('/products')" 
                                                id="footer-products-link" 
                                                class="text-gray-400 hover:text-white transition-colors spa-link">
                                            All Products
                                        </button>
                                    </li>
                                    <li>
                                        <button @click="navigateToSection('about')" 
                                                id="footer-about-link" 
                                                class="text-gray-400 hover:text-white transition-colors spa-link">
                                            About Us
                                        </button>
                                    </li>
                                    <li>
                                        <button @click="navigateTo('/cart')" 
                                                id="footer-cart-link" 
                                                class="text-gray-400 hover:text-white transition-colors spa-link">
                                            Shopping Cart
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- Newsletter Signup -->
                        <div class="mt-12 pt-8 border-t border-gray-800">
                            <div class="max-w-md mx-auto text-center">
                                <h4 id="newsletter-heading" class="font-semibold mb-4 text-lg">Stay Updated</h4>
                                <p id="newsletter-description" class="text-gray-400 mb-6">
                                    Get the latest updates on new electronics and exclusive deals.
                                </p>
                                <div class="flex gap-3">
                                    <input type="email" 
                                           id="newsletter-email" 
                                           placeholder="Enter your email" 
                                           class="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                    <button id="newsletter-submit" 
                                            class="bg-primary hover:bg-primary-hover text-white px-6 py-3 font-medium transition-colors">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Bottom Section -->
                        <div class="mt-12 pt-8 border-t border-gray-800">
                            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                                <!-- Copyright -->
                                <div class="text-center md:text-left">
                                    <p id="footer-copyright" class="text-gray-400">
                                        &copy; 2025 GreenLion. All rights reserved.
                                    </p>
                                    <p id="footer-credit" class="text-gray-500 text-sm mt-1">
                                        Website designed with ♥ by RN Team
                                    </p>
                                </div>

                                <!-- Social Links -->
                                <div class="flex items-center gap-4">
                                    <a href="#" id="social-facebook" class="text-gray-400 hover:text-white transition-colors p-2">
                                        <svg class="h-5 w-5">
                                            <use xlink:href="#icon-facebook"></use>
                                        </svg>
                                    </a>
                                    <a href="#" id="social-instagram" class="text-gray-400 hover:text-white transition-colors p-2">
                                        <svg class="h-5 w-5">
                                            <use xlink:href="#icon-instagram"></use>
                                        </svg>
                                    </a>
                                    <a href="#" id="social-youtube" class="text-gray-400 hover:text-white transition-colors p-2">
                                        <svg class="h-5 w-5">
                                            <use xlink:href="#icon-youtube"></use>
                                        </svg>
                                    </a>
                                    <a href="https://wa.me/96170608543" id="social-whatsapp" class="text-gray-400 hover:text-green-500 transition-colors p-2">
                                        <svg class="h-5 w-5">
                                            <use xlink:href="#icon-whatsapp"></use>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            `
        };
    });

    // SVG Sprites Component (unchanged)
    Alpine.data('svgSprites', () => {
        return {
            template: `
                <svg xmlns="http://www.w3.org/2000/svg" class="hidden">
                    <!-- Shopping Bag Icon -->
                    <symbol id="icon-shopping-bag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 01-8 0"/>
                    </symbol>

                    <!-- Menu Icon -->
                    <symbol id="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="4" y1="6" x2="20" y2="6"/>
                        <line x1="4" y1="12" x2="20" y2="12"/>
                        <line x1="4" y1="18" x2="20" y2="18"/>
                    </symbol>

                    <!-- Close Icon -->
                    <symbol id="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </symbol>

                    <!-- Search Icon -->
                    <symbol id="icon-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </symbol>

                    <!-- WhatsApp Icon -->
                    <symbol id="icon-whatsapp" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </symbol>

                    <!-- Arrow Up Icon -->
                    <symbol id="icon-arrow-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="19" x2="12" y2="5"/>
                        <polyline points="5,12 12,5 19,12"/>
                    </symbol>

                    <!-- Plus Icon -->
                    <symbol id="icon-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </symbol>

                    <!-- Minus Icon -->
                    <symbol id="icon-minus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </symbol>

                    <!-- Star Icon -->
                    <symbol id="icon-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
                    </symbol>

                    <!-- Star Filled Icon -->
                    <symbol id="icon-star-filled" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
                    </symbol>

                    <!-- Check Icon -->
                    <symbol id="icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20,6 9,17 4,12"/>
                    </symbol>

                    <!-- Heart Icon -->
                    <symbol id="icon-heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                    </symbol>

                    <!-- Location Icon -->
                    <symbol id="icon-location" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </symbol>

                    <!-- Email Icon -->
                    <symbol id="icon-email" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                    </symbol>

                    <!-- Facebook Icon -->
                    <symbol id="icon-facebook" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </symbol>

                    <!-- Instagram Icon -->
                    <symbol id="icon-instagram" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </symbol>

                    <!-- YouTube Icon -->
                    <symbol id="icon-youtube" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </symbol>

                    <!-- Filter Icon -->
                    <symbol id="icon-filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
                    </symbol>

                    <!-- Grid Icon -->
                    <symbol id="icon-grid" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                    </symbol>

                    <!-- List Icon -->
                    <symbol id="icon-list" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6"/>
                        <line x1="8" y1="12" x2="21" y2="12"/>
                        <line x1="8" y1="18" x2="21" y2="18"/>
                        <line x1="3" y1="6" x2="3.01" y2="6"/>
                        <line x1="3" y1="12" x2="3.01" y2="12"/>
                        <line x1="3" y1="18" x2="3.01" y2="18"/>
                    </symbol>
                </svg>
            `
        };
    });

    // WhatsApp Button & Go Up Button Component
    Alpine.data('floatingButtons', () => {
        return {
            template: `
                <!-- WhatsApp Button -->
                <a href="#" 
                   id="whatsapp-button" 
                   class="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-green-500 hover:bg-green-600 text-white p-3 md:p-4 shadow-lg z-40 transition-all duration-300 hover:scale-110" 
                   @click.prevent="$store.ui.openWhatsApp('Hello GreenLion! I would like to know more about your electronics products.')" 
                   style="border-radius: 50%;">
                    <svg class="h-6 w-6 md:h-7 md:w-7">
                        <use xlink:href="#icon-whatsapp"></use>
                    </svg>
                </a>

                <!-- Go Up Button -->
                <button id="go-up-button" 
                        class="fixed bottom-4 left-4 md:bottom-6 md:left-6 bg-primary hover:bg-primary-hover text-white p-3 md:p-4 shadow-lg z-40 transition-all duration-300 hover:scale-110" 
                        x-show="scrollTop" 
                        @click="$store.ui.scrollToTop()" 
                        x-transition:enter="transition ease-out duration-300"
                        x-transition:enter-start="opacity-0 translate-y-4 scale-95"
                        x-transition:enter-end="opacity-100 translate-y-0 scale-100"
                        x-transition:leave="transition ease-in duration-300"
                        x-transition:leave-start="opacity-100 translate-y-0 scale-100"
                        x-transition:leave-end="opacity-0 translate-y-4 scale-95"
                        style="border-radius: 50%;">
                    <svg class="h-5 w-5 md:h-6 md:w-6">
                        <use xlink:href="#icon-arrow-up"></use>
                    </svg>
                </button>
            `
        };
    });

    console.log('SPA Components loaded successfully');
});
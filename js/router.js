// router.js - Updated SPA Router for GreenLion Electronics Store
document.addEventListener('alpine:init', () => {
    Alpine.store('router', {
        currentRoute: 'home',
        currentParams: {},
        isLoading: false,
        previousRoute: null,

        init() {
            this.handleInitialRoute();

            window.addEventListener('hashchange', () => {
                this.handleRouteChange();
            });

            window.addEventListener('popstate', () => {
                this.handleRouteChange();
            });

            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href^="#"]');
                if (link && !link.hasAttribute('data-external')) {
                    e.preventDefault();
                }
            });
        },

        handleInitialRoute() {
            const hash = window.location.hash;
            if (hash && hash.length > 1) {
                this.parseAndNavigate(hash);
            } else {
                this.currentRoute = 'home';
                this.currentParams = {};
                this.loadPageContent('home');
                this.updateDocumentTitle();
            }
        },

        handleRouteChange() {
            const hash = window.location.hash;
            this.parseAndNavigate(hash);
        },

        async parseAndNavigate(hash) {
            const path = hash.replace('#', '').split('/').filter(segment => segment.length > 0);
            const route = path[0] || 'home';

            this.previousRoute = this.currentRoute;
            this.isLoading = true;

            try {
                await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for loading indicator

                switch (route) {
                    case 'home':
                    case '':
                        await this.navigateToHome();
                        break;
                    case 'products':
                        await this.navigateToProducts(path);
                        break;
                    case 'product':
                        await this.navigateToProduct(path);
                        break;
                    case 'cart':
                        await this.navigateToCart();
                        break;
                    default:
                        await this.navigateToHome();
                        break;
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });

            } catch (error) {
                console.error('Navigation error:', error);
                await this.navigateToHome();
            } finally {
                this.isLoading = false;
            }
        },

        async navigateToHome() {
            this.currentRoute = 'home';
            this.currentParams = {};
            await this.loadPageContent('home');
            this.updateDocumentTitle('GreenLion - Premium Consumer Electronics & Smart Gadgets in Lebanon');
        },

        async navigateToProducts(path) {
            this.currentRoute = 'products';
            this.currentParams = {};

            if (path[1] === 'category' && path[2]) {
                this.currentParams.category = Alpine.store('utils').decodeSlug(path[2]);
                const categoryName = getCategoryNameFromSlug(path[2]);
                this.updateDocumentTitle(`${categoryName} - Products | GreenLion`);
            } else if (path[1] === 'search' && path[2]) {
                this.currentParams.search = decodeURIComponent(path[2]);
                this.updateDocumentTitle(`Search: "${this.currentParams.search}" - Products | GreenLion`);
            } else if (path[1] === 'brand' && path[2]) {
                this.currentParams.brand = Alpine.store('utils').decodeSlug(path[2]);
                this.updateDocumentTitle(`${this.currentParams.brand} Products | GreenLion`);
            } else {
                this.updateDocumentTitle('All Products | GreenLion Electronics');
            }

            await this.loadPageContent('products');
        },

        async navigateToProduct(path) {
            this.currentRoute = 'product';
            this.currentParams = {};

            if (path[1]) {
                const slug = path[1];
                this.currentParams.slug = slug;

                const product = getProductBySlug(slug);
                if (product) {
                    this.currentParams.product = product;
                    this.updateDocumentTitle(`${product.name} | GreenLion Electronics`);
                    this.updateMetaDescription(product.description || `${product.name} - Premium electronics at GreenLion Lebanon`);
                    await this.loadPageContent('product');
                } else {
                    console.warn(`Product with slug "${slug}" not found`);
                    this.navigate('products');
                    return;
                }
            } else {
                this.navigate('products');
                return;
            }
        },

        async navigateToCart() {
            this.currentRoute = 'cart';
            this.currentParams = {};
            await this.loadPageContent('cart');
            this.updateDocumentTitle('Shopping Cart | GreenLion');
        },

        async loadPageContent(pageName) {
            try {
                const template = await window.templateLoader.loadPageTemplate(`${pageName}-page`);
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.innerHTML = `
                        <div x-data="${pageName}Page" 
                             x-show="$store.router.isCurrentRoute('${pageName}')"
                             x-transition:enter="transition ease-out duration-300"
                             x-transition:enter-start="opacity-0"
                             x-transition:enter-end="opacity-100">
                            ${template}
                        </div>
                    `;
                }
            } catch (error) {
                console.error(`Failed to load page content for ${pageName}:`, error);
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.innerHTML = `
                        <div class="flex items-center justify-center min-h-screen">
                            <div class="text-center">
                                <h1 class="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                                <p class="text-gray-600 mb-6">The page you're looking for couldn't be loaded.</p>
                                <button onclick="Alpine.store('router').navigate('home')" 
                                        class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
                                    Go Home
                                </button>
                            </div>
                        </div>
                    `;
                }
            }
        },

        // Navigation method
        navigate(route, params = {}) {
            let hash = '#' + route;

            switch (route) {
                case 'home':
                    hash = '#home';
                    break;
                case 'products':
                    if (params.category) {
                        hash += '/category/' + Alpine.store('utils').encodeSlug(params.category);
                    } else if (params.search) {
                        hash += '/search/' + encodeURIComponent(params.search);
                    } else if (params.brand) {
                        hash += '/brand/' + Alpine.store('utils').encodeSlug(params.brand);
                    }
                    break;
                case 'product':
                    if (params.slug) {
                        hash += '/' + params.slug;
                    } else if (params.id) {
                        const product = getProductById(params.id);
                        if (product && product.slug) {
                            hash += '/' + product.slug;
                        } else {
                            hash = '#products';
                        }
                    } else if (params.product && params.product.slug) {
                        hash += '/' + params.product.slug;
                    }
                    break;
                case 'cart':
                    hash = '#cart';
                    break;
            }

            if (window.location.hash !== hash) {
                window.location.hash = hash;
            } else {
                this.parseAndNavigate(hash);
            }
        },

        // Helper methods
        isCurrentRoute(route) {
            return this.currentRoute === route;
        },

        getParam(key) {
            return this.currentParams[key];
        },

        getCurrentRoute() {
            return this.currentRoute;
        },

        getCurrentParams() {
            return this.currentParams;
        },

        goBack() {
            if (this.previousRoute && this.previousRoute !== this.currentRoute) {
                this.navigate(this.previousRoute);
            } else {
                this.navigate('home');
            }
        },

        updateDocumentTitle(title) {
            document.title = title;
        },

        updateMetaDescription(description) {
            let metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            } else {
                metaDescription = document.createElement('meta');
                metaDescription.name = 'description';
                metaDescription.content = description;
                document.getElementsByTagName('head')[0].appendChild(metaDescription);
            }
        },

        getCanonicalUrl() {
            const baseUrl = window.location.origin + window.location.pathname;
            const hash = window.location.hash;
            return baseUrl + hash;
        },

        generateProductUrl(product) {
            if (product && product.slug) {
                return `#product/${product.slug}`;
            }
            return '#products';
        },

        generateCategoryUrl(category) {
            if (category) {
                const slug = typeof category === 'string' ? category : category.name;
                return `#products/category/${Alpine.store('utils').encodeSlug(slug)}`;
            }
            return '#products';
        },

        generateSearchUrl(query) {
            if (query && query.trim()) {
                return `#products/search/${encodeURIComponent(query.trim())}`;
            }
            return '#products';
        },

        generateBreadcrumbs() {
            const breadcrumbs = [{ name: 'Home', url: '#home' }];

            switch (this.currentRoute) {
                case 'products':
                    breadcrumbs.push({ name: 'Products', url: '#products' });
                    if (this.currentParams.category) {
                        breadcrumbs.push({
                            name: Alpine.store('utils').decodeSlug(this.currentParams.category),
                            url: this.generateCategoryUrl(this.currentParams.category)
                        });
                    } else if (this.currentParams.search) {
                        breadcrumbs.push({
                            name: `Search: "${this.currentParams.search}"`,
                            url: this.generateSearchUrl(this.currentParams.search)
                        });
                    }
                    break;

                case 'product':
                    breadcrumbs.push({ name: 'Products', url: '#products' });
                    if (this.currentParams.product) {
                        breadcrumbs.push({
                            name: this.currentParams.product.name,
                            url: this.generateProductUrl(this.currentParams.product)
                        });
                    }
                    break;

                case 'cart':
                    breadcrumbs.push({ name: 'Shopping Cart', url: '#cart' });
                    break;
            }

            return breadcrumbs;
        }
    });
});

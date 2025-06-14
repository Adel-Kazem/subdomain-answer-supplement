// js/page-manager.js - Page Manager for SPA Template Loading and Management
class PageManager {
    constructor() {
        this.templates = new Map();
        this.currentPage = null;
        this.contentContainer = null;
        this.loadingStates = new Map();

        console.log('PageManager initialized');
    }

    /**
     * Initialize the page manager
     * @param {string} containerSelector - CSS selector for main content container
     */
    init(containerSelector = '#main-content') {
        this.contentContainer = document.querySelector(containerSelector);

        if (!this.contentContainer) {
            console.error(`Container not found: ${containerSelector}`);
            return false;
        }

        console.log('PageManager initialized with container:', containerSelector);
        return true;
    }

    /**
     * Load a page template from file
     * @param {string} pageName - Name of the page (e.g., 'home', 'products', 'product')
     * @param {boolean} useCache - Whether to use cached version if available
     * @returns {Promise<string>} - HTML template content
     */
    async loadTemplate(pageName, useCache = true) {
        // Check cache first
        if (useCache && this.templates.has(pageName)) {
            console.log(`Loading ${pageName} from cache`);
            return this.templates.get(pageName);
        }

        // Check if already loading
        if (this.loadingStates.has(pageName)) {
            console.log(`Waiting for ${pageName} to finish loading`);
            return await this.loadingStates.get(pageName);
        }

        // Create loading promise
        const loadingPromise = this.fetchTemplate(pageName);
        this.loadingStates.set(pageName, loadingPromise);

        try {
            const template = await loadingPromise;

            // Cache the template
            this.templates.set(pageName, template);

            // Clean up loading state
            this.loadingStates.delete(pageName);

            console.log(`Template ${pageName} loaded and cached`);
            return template;

        } catch (error) {
            // Clean up loading state on error
            this.loadingStates.delete(pageName);
            throw error;
        }
    }

    /**
     * Fetch template from server
     * @param {string} pageName - Name of the page template to fetch
     * @returns {Promise<string>} - HTML content
     */
    async fetchTemplate(pageName) {
        const templatePath = `pages/${pageName}.html`;

        try {
            console.log(`Fetching template: ${templatePath}`);

            const response = await fetch(templatePath);

            if (!response.ok) {
                throw new Error(`Failed to load template: ${templatePath} (${response.status})`);
            }

            const html = await response.text();

            if (!html.trim()) {
                throw new Error(`Empty template: ${templatePath}`);
            }

            return html;

        } catch (error) {
            console.error(`Error fetching template ${templatePath}:`, error);

            // Return fallback template
            return this.getFallbackTemplate(pageName);
        }
    }

    /**
     * Get fallback template for failed loads
     * @param {string} pageName - Page name that failed to load
     * @returns {string} - Fallback HTML content
     */
    getFallbackTemplate(pageName) {
        return `
            <div class="max-w-4xl mx-auto px-6 py-16 text-center">
                <div class="space-y-6">
                    <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                        <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                    </div>
                    <h1 class="text-3xl font-bold text-gray-900">Page Not Available</h1>
                    <p class="text-lg text-gray-600">Sorry, this page is currently not available. Please try again later.</p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="#/" class="bg-primary text-white px-6 py-3 font-medium hover:bg-primary-hover transition-colors">
                            Go Home
                        </a>
                        <button onclick="location.reload()" class="border-2 border-primary text-primary px-6 py-3 font-medium hover:bg-primary hover:text-white transition-colors">
                            Reload Page
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Load and display a page
     * @param {string} pageName - Name of the page to load
     * @param {object} data - Data to pass to the page
     * @param {boolean} animate - Whether to animate the transition
     * @returns {Promise<boolean>} - Success status
     */
    async loadPage(pageName, data = {}, animate = true) {
        try {
            console.log(`Loading page: ${pageName}`);

            // Show loading state
            if (animate) {
                this.showLoadingState();
            }

            // Load template
            const template = await this.loadTemplate(pageName);

            // Update content
            await this.updateContent(template, animate);

            // Store current page
            this.currentPage = {
                name: pageName,
                data,
                loadedAt: Date.now()
            };

            // Scroll to top
            this.scrollToTop();

            console.log(`Page ${pageName} loaded successfully`);
            return true;

        } catch (error) {
            console.error(`Error loading page ${pageName}:`, error);

            // Show error page
            await this.showErrorPage(error.message);
            return false;
        }
    }

    /**
     * Update content container with new HTML
     * @param {string} html - HTML content to insert
     * @param {boolean} animate - Whether to animate the transition
     */
    async updateContent(html, animate = true) {
        if (!this.contentContainer) {
            console.error('Content container not found');
            return;
        }

        if (animate) {
            // Fade out current content
            this.contentContainer.style.opacity = '0';
            this.contentContainer.style.transform = 'translateY(10px)';

            // Wait for fade out
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        // Update content
        this.contentContainer.innerHTML = html;

        if (animate) {
            // Force reflow
            this.contentContainer.offsetHeight;

            // Fade in new content
            this.contentContainer.style.opacity = '1';
            this.contentContainer.style.transform = 'translateY(0)';
        }

        // Re-initialize Alpine.js for new content
        if (window.Alpine) {
            Alpine.initTree(this.contentContainer);
        }
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        if (!this.contentContainer) return;

        const loadingHtml = `
            <div class="flex items-center justify-center min-h-96">
                <div class="flex flex-col items-center space-y-4">
                    <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    <p class="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        `;

        this.updateContent(loadingHtml, false);
    }

    /**
     * Show error page
     * @param {string} errorMessage - Error message to display
     */
    async showErrorPage(errorMessage = 'An error occurred') {
        const errorHtml = `
            <div class="max-w-4xl mx-auto px-6 py-16 text-center">
                <div class="space-y-6">
                    <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <svg class="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <h1 class="text-3xl font-bold text-gray-900">Oops! Something went wrong</h1>
                    <p class="text-lg text-gray-600">${errorMessage}</p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="#/" class="bg-primary text-white px-6 py-3 font-medium hover:bg-primary-hover transition-colors">
                            Go Home
                        </a>
                        <button onclick="location.reload()" class="border-2 border-primary text-primary px-6 py-3 font-medium hover:bg-primary hover:text-white transition-colors">
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        `;

        await this.updateContent(errorHtml, true);
    }

    /**
     * Scroll to top of page
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Get current page information
     * @returns {object|null} - Current page data
     */
    getCurrentPage() {
        return this.currentPage;
    }

    /**
     * Clear template cache
     * @param {string} pageName - Specific page to clear, or undefined for all
     */
    clearCache(pageName) {
        if (pageName) {
            this.templates.delete(pageName);
            console.log(`Cache cleared for: ${pageName}`);
        } else {
            this.templates.clear();
            console.log('All template cache cleared');
        }
    }

    /**
     * Preload templates for better performance
     * @param {Array<string>} pageNames - Array of page names to preload
     */
    async preloadTemplates(pageNames) {
        console.log('Preloading templates:', pageNames);

        const loadPromises = pageNames.map(pageName =>
            this.loadTemplate(pageName, false).catch(error => {
                console.warn(`Failed to preload ${pageName}:`, error);
                return null;
            })
        );

        await Promise.all(loadPromises);
        console.log('Template preloading completed');
    }

    /**
     * Get cache statistics
     * @returns {object} - Cache statistics
     */
    getCacheStats() {
        return {
            totalCached: this.templates.size,
            cachedPages: Array.from(this.templates.keys()),
            currentlyLoading: Array.from(this.loadingStates.keys())
        };
    }

    /**
     * Destroy page manager and clean up
     */
    destroy() {
        this.templates.clear();
        this.loadingStates.clear();
        this.currentPage = null;
        this.contentContainer = null;
        console.log('PageManager destroyed');
    }
}

// Create and export page manager instance
const pageManager = new PageManager();

// Make page manager globally available
window.PageManager = pageManager;
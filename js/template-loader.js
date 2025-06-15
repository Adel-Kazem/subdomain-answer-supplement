class TemplateLoader {
    constructor() {
        this.cache = new Map();
        this.loadingPromises = new Map();
    }

    async loadTemplate(path) {
        // Check if template is already cached
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }

        // Check if template is currently being loaded
        if (this.loadingPromises.has(path)) {
            return this.loadingPromises.get(path);
        }

        // Create loading promise
        const loadingPromise = this.fetchTemplate(path);
        this.loadingPromises.set(path, loadingPromise);

        try {
            const template = await loadingPromise;
            this.cache.set(path, template);
            this.loadingPromises.delete(path);
            return template;
        } catch (error) {
            this.loadingPromises.delete(path);
            throw error;
        }
    }

    async fetchTemplate(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load template: ${path} (${response.status})`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Template loading error for ${path}:`, error);
            throw new Error(`Template not found: ${path}`);
        }
    }

    async loadPageTemplate(pageName) {
        return this.loadTemplate(`templates/pages/${pageName}.html`);
    }

    async loadComponentTemplate(componentName) {
        return this.loadTemplate(`templates/components/${componentName}.html`);
    }

    clearCache() {
        this.cache.clear();
    }

    preloadTemplates(paths) {
        return Promise.all(paths.map(path => this.loadTemplate(path).catch(console.error)));
    }
}

// Global template loader instance
window.templateLoader = new TemplateLoader();

// Helper function for Alpine.js components
window.loadTemplate = async (path) => {
    try {
        return await window.templateLoader.loadTemplate(path);
    } catch (error) {
        console.error('Template loading failed:', error);
        return '<div class="text-red-500 p-4">Template loading failed</div>';
    }
};

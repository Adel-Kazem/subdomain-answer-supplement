// seo.js - Fixed version with proper title handling

window.SEOManager = {

    // Main function to set page SEO
    setPageSEO: function(metaTagsHTML = '', jsonLdData = null, pageTitle = '') {
        const container = document.getElementById('dynamic-seo-container');
        if (!container) {
            console.warn('SEO container not found.');
            return;
        }

        // HANDLE TITLE SEPARATELY (not in container)
        if (pageTitle) {
            document.title = pageTitle;  // Direct assignment to document.title
        }

        // Clear container content
        container.innerHTML = '';

        // Build HTML content (WITHOUT title tag)
        let fullHTML = '';

        if (metaTagsHTML) {
            fullHTML += metaTagsHTML;
        }

        if (jsonLdData) {
            fullHTML += `<script type="application/ld+json">${JSON.stringify(jsonLdData, null, 2)}</script>`;
        }

        container.innerHTML = fullHTML;
    },

    // Helper to generate product SEO
    setProductSEO: function(product) {
        if (!product) {
            console.warn('Product data is missing for SEO');
            return;
        }

        const pageTitle = `${product.name} - ${product.brand || 'Store'}`;

        const metaHTML = `
            <meta name="description" content="${product.description}">
            <meta property="og:title" content="${product.name}">
            <meta property="og:description" content="${product.description}">
            <meta property="og:image" content="${Array.isArray(product.images) ? product.images[0] : product.images}">
            <meta property="og:url" content="${window.location.href}">
            <meta property="og:type" content="product">
        `;

        const jsonLd = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": Array.isArray(product.images) ? product.images : [product.images],
            "description": product.description,
            "sku": product.sku || 'N/A',
            "brand": {"@type": "Brand", "name": product.brand || 'Generic'},
            "offers": {
                "@type": "Offer",
                "price": product.price || '0',
                "priceCurrency": "USD",
                "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
        };

        this.setPageSEO(metaHTML, jsonLd, pageTitle);  // Pass title separately
    },

    // Helper to generate homepage SEO
    setHomeSEO: function(storeInfo) {
        if (!storeInfo) {
            console.warn('Store info is missing for homepage SEO');
            return;
        }

        const pageTitle = storeInfo.name;

        const metaHTML = `
            <meta name="description" content="${storeInfo.description}">
            <meta property="og:title" content="${storeInfo.name}">
            <meta property="og:description" content="${storeInfo.description}">
            <meta property="og:image" content="${storeInfo.logo}">
            <meta property="og:url" content="${window.location.href}">
            <meta property="og:type" content="website">
        `;

        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": storeInfo.name,
            "url": storeInfo.url
        };

        this.setPageSEO(metaHTML, jsonLd, pageTitle);  // Pass title separately
    }
};

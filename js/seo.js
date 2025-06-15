// seo.js - Simple SEO Management (Your Original Idea)

window.SEOManager = {

    // Main function to set page SEO - SIMPLE!
    setPageSEO: function(metaTagsHTML = '', jsonLdData = null) {
        const container = document.getElementById('dynamic-seo-container');
        if (!container) {
            console.warn('SEO container not found. Add <script type="seo-container" id="dynamic-seo-container"></script> to your <head>');
            return;
        }

        // SIMPLE: Clear everything at once (your original idea!)
        container.innerHTML = '';

        // Build complete HTML content
        let fullHTML = '';

        // Add meta tags
        if (metaTagsHTML) {
            fullHTML += metaTagsHTML;
        }

        // Add JSON-LD
        if (jsonLdData) {
            fullHTML += `<script type="application/ld+json">${JSON.stringify(jsonLdData, null, 2)}</script>`;
        }

        // SIMPLE: Set all content at once
        container.innerHTML = fullHTML;
    },

    // Helper to generate product SEO
    setProductSEO: function(product) {
        if (!product) {
            console.warn('Product data is missing for SEO');
            return;
        }

        const metaHTML = `
            <title>${product.name} - ${product.brand || 'Store'}</title>
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

        this.setPageSEO(metaHTML, jsonLd);
    },

    // Helper to generate homepage SEO
    setHomeSEO: function(storeInfo) {
        if (!storeInfo) {
            console.warn('Store info is missing for homepage SEO');
            return;
        }

        const metaHTML = `
            <title>${storeInfo.name}</title>
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

        this.setPageSEO(metaHTML, jsonLd);
    }
};

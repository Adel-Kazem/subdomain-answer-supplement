// seo.js - Final working version that Google will recognize

window.SEOManager = {

    // Clear all dynamic SEO tags
    clearDynamicSEO: function() {
        document.querySelectorAll('.dynamic-seo-tag').forEach(el => el.remove());
    },

    // Main function to set page SEO - INSERTS DIRECTLY INTO HEAD
    setPageSEO: function(metaTagsHTML = '', jsonLdData = null, pageTitle = '') {
        const head = document.head;
        const marker = document.getElementById('dynamic-seo-container');

        if (!marker) {
            console.warn('SEO container marker not found.');
            return;
        }

        // Clear previous dynamic SEO content
        this.clearDynamicSEO();

        // SET TITLE DIRECTLY (not in container)
        if (pageTitle && pageTitle !== 'undefined' && pageTitle.trim() !== '') {
            document.title = pageTitle;
        }

        // INSERT META TAGS DIRECTLY INTO HEAD (as siblings to marker)
        if (metaTagsHTML) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = metaTagsHTML;

            Array.from(tempDiv.children).forEach(element => {
                element.classList.add('dynamic-seo-tag');
                // Insert directly into head, after the marker
                head.insertBefore(element, marker.nextSibling);
            });
        }

        // INSERT JSON-LD DIRECTLY INTO HEAD
        if (jsonLdData) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.classList.add('dynamic-seo-tag');
            script.textContent = JSON.stringify(jsonLdData, null, 2);
            // Insert directly into head
            head.insertBefore(script, marker.nextSibling);
        }
    },

    // Product SEO with canonical URL
    setProductSEO: function(product) {
        if (!product || !product.name || product.name === 'undefined') {
            console.warn('Invalid product data for SEO');
            return;
        }

        const pageTitle = `${product.name} - ${product.brand || 'GreenLion'}`;

        const metaHTML = `
            <meta name="description" content="${product.description}">
            <meta property="og:title" content="${product.name}">
            <meta property="og:description" content="${product.description}">
            <meta property="og:image" content="${Array.isArray(product.images) ? product.images[0] : product.images}">
            <meta property="og:url" content="${window.location.href}">
            <meta property="og:type" content="product">
            <link rel="canonical" href="${window.location.href}">
        `;

        const jsonLd = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": Array.isArray(product.images) ? product.images : [product.images],
            "description": product.description,
            "sku": product.sku || 'N/A',
            "brand": {"@type": "Brand", "name": product.brand || 'GreenLion'},
            "offers": {
                "@type": "Offer",
                "price": product.price || '0',
                "priceCurrency": "USD",
                "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "url": window.location.href
            }
        };

        this.setPageSEO(metaHTML, jsonLd, pageTitle);
    },

    // Homepage SEO
    setHomeSEO: function(storeInfo) {
        const pageTitle = storeInfo.name;

        const metaHTML = `
            <meta name="description" content="${storeInfo.description}">
            <meta property="og:title" content="${storeInfo.name}">
            <meta property="og:description" content="${storeInfo.description}">
            <meta property="og:image" content="${storeInfo.logo}">
            <meta property="og:url" content="${window.location.href}">
            <meta property="og:type" content="website">
            <link rel="canonical" href="${window.location.href}">
        `;

        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": storeInfo.name,
            "url": storeInfo.url,
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${storeInfo.url}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
            }
        };

        this.setPageSEO(metaHTML, jsonLd, pageTitle);
    }
};

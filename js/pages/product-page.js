// pages/product-page.js - CLEANED Product Detail Page Logic for GreenLion SPA
document.addEventListener('alpine:init', () => {
    Alpine.data('productPage', () => ({
        // Core Product Data
        product: null,
        selectedOptions: {},
        quantity: 1,
        selectedImageIndex: 0,
        selectedImage: '',
        relatedProducts: [],
        reviews: [],

        // UI State
        showImageModal: false,
        activeTab: 'description',
        isLoading: true,
        error: null,

        // Image Viewer Properties
        isScrollLeftEnd: true,
        isScrollRightEnd: false,
        zoomed: false,
        isTouchDevice: false,
        scale: 2,
        origin: '50% 50%',
        panX: 0,
        panY: 0,
        minPanX: 0,
        maxPanX: 0,
        minPanY: 0,
        maxPanY: 0,
        dragStartX: 0,
        dragStartY: 0,
        dragging: false,
        lastTap: 0,
        imgStyle: '',

        // Sample Reviews Data
        sampleReviews: [
            {
                id: 1,
                name: "Ahmad Khalil",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                rating: 5,
                comment: "Excellent product! Works exactly as described and the build quality is outstanding.",
                date: "2024-01-15",
                verified: true
            },
            {
                id: 2,
                name: "Sara Mahmoud",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                rating: 5,
                comment: "Fast delivery and great customer service. Very satisfied with my purchase!",
                date: "2024-01-10",
                verified: true
            },
            {
                id: 3,
                name: "Omar Hassan",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                rating: 4,
                comment: "Good quality product, but shipping took a bit longer than expected.",
                date: "2024-01-05",
                verified: false
            }
        ],

        // Initialization
        init() {
            this.loadProduct();
            this.watchRouteParams();
            this.initImageViewer();
            this.detectTouchDevice();
        },

        watchRouteParams() {
            this.$watch('$store.router.currentParams', () => {
                this.loadProduct();
            });
        },

        detectTouchDevice() {
            this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        },

        // Product Loading
        loadProduct() {
            this.isLoading = true;
            this.error = null;
            const slug = this.$store.router.getParam('slug');

            if (!slug) {
                this.error = 'Product not found';
                this.isLoading = false;
                return;
            }

            setTimeout(() => {
                if (typeof PRODUCTS !== 'undefined') {
                    this.product = PRODUCTS.find(p => p.slug === slug);
                    if (this.product) {
                        this.initializeProduct();
                        this.loadRelatedProducts();
                        this.loadReviews();
                        this.updatePageMeta();
                    } else {
                        this.error = 'Product not found';
                    }
                } else {
                    this.error = 'Products data not available';
                }
                this.isLoading = false;
            }, 300);
        },

        initializeProduct() {
            this.initializeOptions();
            this.initializeImages();
            this.selectedImageIndex = 0;
            this.quantity = 1;
            this.activeTab = 'description';
        },

        updatePageMeta() {
            if (this.product) {
                document.title = `${this.product.name} - GreenLion`;
            }
        },

        initializeOptions() {
            if (this.product && this.product.options) {
                Object.keys(this.product.options).forEach(optionName => {
                    const options = this.product.options[optionName];
                    if (Array.isArray(options) && options.length > 0) {
                        this.selectedOptions[optionName] = typeof options[0] === 'object' ? options[0].value : options[0];
                    }
                });
            }
            this.updateVariantInfo();
        },

        initializeImages() {
            this.selectedImage = '';
            this.imgStyle = 'transform: scale(1); transform-origin: 50% 50%;';
            this.resetZoom();
        },

        initImageViewer() {
            this.$nextTick(() => {
                this.checkScrollPosition();
            });
        },

        loadRelatedProducts() {
            if (this.product && typeof PRODUCTS !== 'undefined') {
                this.relatedProducts = PRODUCTS
                    .filter(p => p.category === this.product.category && p.id !== this.product.id)
                    .slice(0, 4);
            }
        },

        loadReviews() {
            this.reviews = this.sampleReviews;
        },

        // Product Images Management
        get productImages() {
            if (!this.product) return [this.$store.utils.getPlaceholderImage()];

            let images = [];

            if (this.product.images) {
                if (Array.isArray(this.product.images)) {
                    images.push(...this.product.images.map(img => this.$store.utils.getFullImageUrl(img)));
                } else {
                    images.push(this.$store.utils.getFullImageUrl(this.product.images));
                }
            } else if (this.product.image) {
                images.push(this.$store.utils.getFullImageUrl(this.product.image));
            }

            if (this.product.gallery && Array.isArray(this.product.gallery)) {
                images.push(...this.product.gallery.map(img => this.$store.utils.getFullImageUrl(img)));
            }

            if (images.length === 0) {
                images.push(this.$store.utils.getPlaceholderImage());
            }

            return images;
        },

        get allThumbnails() {
            if (!this.product) return [];

            let thumbnails = [];

            // Main product images
            const mainImages = this.product.images || (this.product.image ? [this.product.image] : []);
            const imageArray = Array.isArray(mainImages) ? mainImages : [mainImages];

            imageArray.forEach(img => {
                if (img) {
                    thumbnails.push({
                        type: 'main',
                        image: this.$store.utils.getFullImageUrl(img),
                        key: img
                    });
                }
            });

            // Option images
            if (this.product.option_images) {
                Object.entries(this.product.option_images).forEach(([optionName, optionTypes]) => {
                    Object.entries(optionTypes).forEach(([optionValue, images]) => {
                        if (Array.isArray(images)) {
                            images.forEach(img => {
                                thumbnails.push({
                                    type: 'option',
                                    image: this.$store.utils.getFullImageUrl(img),
                                    key: `${optionName}-${optionValue}`,
                                    optionName,
                                    optionValue
                                });
                            });
                        }
                    });
                });
            }

            // Variant images
            if (this.product.variant_images) {
                Object.entries(this.product.variant_images).forEach(([variantKey, variantImage]) => {
                    if (Array.isArray(variantImage)) {
                        variantImage.forEach(img => {
                            thumbnails.push({
                                type: 'variant',
                                image: this.$store.utils.getFullImageUrl(img),
                                key: variantKey,
                                variantKey
                            });
                        });
                    } else if (variantImage) {
                        thumbnails.push({
                            type: 'variant',
                            image: this.$store.utils.getFullImageUrl(variantImage),
                            key: variantKey,
                            variantKey
                        });
                    }
                });
            }

            // Remove duplicates
            const uniqueThumbnails = [];
            const seenImages = new Set();

            thumbnails.forEach(thumb => {
                if (thumb.image && !seenImages.has(thumb.image)) {
                    seenImages.add(thumb.image);
                    uniqueThumbnails.push(thumb);
                }
            });

            return uniqueThumbnails;
        },

        get hasThumbnails() {
            return this.allThumbnails.length > 1;
        },

        getSelectedImage() {
            if (!this.product) return this.$store.utils.getPlaceholderImage();

            try {
                if (this.selectedImage && this.selectedImage !== '') {
                    return this.$store.utils.getFullImageUrl(this.selectedImage);
                }

                const variantKey = this.getVariantKey();
                if (variantKey && this.product.variant_images && this.product.variant_images[variantKey]) {
                    const variantImage = this.product.variant_images[variantKey];
                    const imageUrl = Array.isArray(variantImage) ? variantImage[0] : variantImage;
                    return this.$store.utils.getFullImageUrl(imageUrl);
                }

                if (this.product.option_images && this.selectedOptions) {
                    for (const [option, value] of Object.entries(this.selectedOptions)) {
                        if (this.product.option_images[option] &&
                            this.product.option_images[option][value] &&
                            Array.isArray(this.product.option_images[option][value]) &&
                            this.product.option_images[option][value].length > 0) {
                            return this.$store.utils.getFullImageUrl(this.product.option_images[option][value][0]);
                        }
                    }
                }

                const mainImages = this.productImages;
                if (mainImages.length > 0) {
                    return mainImages[0];
                }

                return this.$store.utils.getPlaceholderImage();
            } catch (error) {
                console.error("Error in getSelectedImage:", error);
                return this.$store.utils.getPlaceholderImage();
            }
        },

        selectImage(image) {
            if (!image) return;

            this.selectedImage = image;
            this.resetZoom();
            this.updateOptionsFromImage(image);
        },

        updateOptionsFromImage(selectedImage) {
            if (!this.product?.option_images || !selectedImage) return;

            for (const [optionName, optionValues] of Object.entries(this.product.option_images)) {
                for (const [optionValue, images] of Object.entries(optionValues)) {
                    if (Array.isArray(images)) {
                        const fullImageUrls = images.map(img => this.$store.utils.getFullImageUrl(img));
                        if (fullImageUrls.includes(selectedImage)) {
                            this.selectOption(optionName, optionValue);
                            return;
                        }
                    }
                }
            }

            if (this.product?.variant_images) {
                for (const [variantKey, variantImage] of Object.entries(this.product.variant_images)) {
                    const fullUrls = Array.isArray(variantImage) ?
                        variantImage.map(img => this.$store.utils.getFullImageUrl(img)) :
                        [this.$store.utils.getFullImageUrl(variantImage)];

                    if (fullUrls.includes(selectedImage)) {
                        this.selectVariantFromKey(variantKey);
                        return;
                    }
                }
            }
        },

        selectImageIndex(index) {
            if (index >= 0 && index < this.productImages.length) {
                this.selectedImageIndex = index;
                this.selectImage(this.productImages[index]);
            }
        },

        nextImage() {
            const currentIndex = this.productImages.indexOf(this.getSelectedImage());
            const nextIndex = (currentIndex + 1) % this.productImages.length;
            this.selectImageIndex(nextIndex);
        },

        prevImage() {
            const currentIndex = this.productImages.indexOf(this.getSelectedImage());
            const prevIndex = currentIndex === 0 ? this.productImages.length - 1 : currentIndex - 1;
            this.selectImageIndex(prevIndex);
        },

        // Variant and Options Management
        getVariantKey() {
            if (!this.product?.hasVariants) return null;
            const optionKeys = Object.keys(this.product.options || {});
            const optionValues = optionKeys.map(key => this.selectedOptions[key]);
            return optionValues.join('|');
        },

        selectVariantFromKey(key) {
            if (!key) return;
            const parts = key.split('|');
            const optionNames = Object.keys(this.product.options || {});
            for (let i = 0; i < parts.length && i < optionNames.length; i++) {
                this.selectedOptions[optionNames[i]] = parts[i];
            }
            this.updateVariantInfo();
        },

        selectOption(optionName, value) {
            this.selectedOptions[optionName] = value;
            this.resetZoom();
            this.updateVariantInfo();
            this.$nextTick(() => {
                this.scrollToOptionThumbnails();
            });
        },

        updateVariantInfo() {
            this.selectedOptions = {...this.selectedOptions};
        },

        isOptionValueAvailable(optionType, optionValue) {
            if (!this.product || !this.product.hasVariants) return true;

            const tempSelection = {...this.selectedOptions};
            tempSelection[optionType] = optionValue;
            const optionKeys = Object.keys(this.product.options);
            const optionValues = optionKeys.map(key => tempSelection[key]);
            const variantKey = optionValues.join('|');

            return (this.product.option_variants_stock?.[variantKey] || 0) > 0;
        },

        getOptionPrice(optionName, value) {
            if (!this.product?.options || !this.product.options[optionName]) return 0;

            const option = this.product.options[optionName].find(opt =>
                (typeof opt === 'object' && opt.value === value) ||
                (typeof opt === 'string' && opt === value)
            );

            return option?.priceModifier ? parseFloat(option.priceModifier) : 0;
        },

        // Pricing
        get finalPrice() {
            if (!this.product) return 0;

            let price = this.getVariantPrice();

            Object.keys(this.selectedOptions).forEach(optionName => {
                price += this.getOptionPrice(optionName, this.selectedOptions[optionName]);
            });

            return Math.max(0, price);
        },

        getVariantPrice() {
            if (!this.product) return 0;

            let price = this.product.base_price || this.product.price || 0;

            if (this.product.option_price_adjustments) {
                Object.entries(this.selectedOptions).forEach(([optionName, optionValue]) => {
                    if (this.product.option_price_adjustments[optionName] &&
                        this.product.option_price_adjustments[optionName][optionValue]) {
                        price += this.product.option_price_adjustments[optionName][optionValue];
                    }
                });
            }

            return Math.max(0, price);
        },

        get totalPrice() {
            return this.finalPrice * this.quantity;
        },

        get discountPercentage() {
            if (this.product?.originalPrice && this.product.originalPrice > this.finalPrice) {
                return Math.round(((this.product.originalPrice - this.finalPrice) / this.product.originalPrice) * 100);
            }
            return 0;
        },

        // Stock Management
        isVariantInStock() {
            if (!this.product) return false;

            if (!this.product.hasVariants) {
                return (this.product.stock || 0) > 0;
            }

            const variantKey = this.getVariantKey();
            if (variantKey && this.product.option_variants_stock) {
                return (this.product.option_variants_stock[variantKey] || 0) > 0;
            }

            return (this.product.stock || 0) > 0;
        },

        getVariantStock() {
            if (!this.product) return 0;

            if (!this.product.hasVariants) {
                return this.product.stock || 0;
            }

            const variantKey = this.getVariantKey();
            if (variantKey && this.product.option_variants_stock) {
                return this.product.option_variants_stock[variantKey] || 0;
            }

            return 0;
        },

        // Shipping
        getVariantShippingCost() {
            if (!this.product) return 0;

            if (this.product.free_shipping) {
                return 0;
            }

            let shippingCost = this.product.base_shipping_cost || 0;

            if (this.product.option_shipping_adjustments) {
                Object.entries(this.selectedOptions).forEach(([optionName, optionValue]) => {
                    if (this.product.option_shipping_adjustments[optionName] &&
                        this.product.option_shipping_adjustments[optionName][optionValue] !== undefined) {
                        shippingCost += this.product.option_shipping_adjustments[optionName][optionValue];
                    }
                });
            }

            return Math.max(0, shippingCost);
        },

        // Product Specifications
        getProductWeight() {
            if (!this.product) return { value: 0, unit: 'kg' };

            let weight = {...(this.product.weight || { value: 0, unit: 'kg' })};

            if (this.product.option_dimension_overrides) {
                Object.entries(this.selectedOptions).forEach(([optionName, optionValue]) => {
                    if (this.product.option_dimension_overrides[optionName] &&
                        this.product.option_dimension_overrides[optionName][optionValue] &&
                        this.product.option_dimension_overrides[optionName][optionValue].weight) {
                        weight = this.product.option_dimension_overrides[optionName][optionValue].weight;
                    }
                });
            }

            return weight;
        },

        getProductDimensions() {
            if (!this.product) return { length: 0, width: 0, height: 0, unit: 'cm' };

            let dimensions = {...(this.product.dimensions || { length: 0, width: 0, height: 0, unit: 'cm' })};

            if (this.product.option_dimension_overrides) {
                Object.entries(this.selectedOptions).forEach(([optionName, optionValue]) => {
                    if (this.product.option_dimension_overrides[optionName] &&
                        this.product.option_dimension_overrides[optionName][optionValue] &&
                        this.product.option_dimension_overrides[optionName][optionValue].dimensions) {
                        dimensions = this.product.option_dimension_overrides[optionName][optionValue].dimensions;
                    }
                });
            }

            return dimensions;
        },

        // Quantity Management
        incrementQuantity() {
            const maxStock = this.getVariantStock();
            if (this.quantity < maxStock && this.quantity < 10) {
                this.quantity++;
            }
        },

        decrementQuantity() {
            if (this.quantity > 1) {
                this.quantity--;
            }
        },

        // Cart Actions
        addToCart() {
            if (!this.product || !this.isVariantInStock()) return;

            try {
                this.$store.cart.addItem(
                    this.product,
                    this.quantity,
                    this.selectedOptions
                );

                this.$store.ui.showNotification('Product added to cart!', 'success');
            } catch (error) {
                console.error('Error adding to cart:', error);
                this.$store.ui.showNotification('Error adding product to cart', 'error');
            }
        },

        buyNow() {
            this.addToCart();
            this.$store.router.navigate('cart');
        },

        // Wishlist
        toggleWishlist() {
            if (!this.product) return;
            this.$store.wishlist.toggleItem(this.product);
        },

        isInWishlist() {
            return this.product && this.$store.wishlist.isInWishlist(this.product.id);
        },

        // Share
        shareProduct() {
            if (!this.product) return;

            if (navigator.share) {
                navigator.share({
                    title: this.product.name,
                    text: this.product.description,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    this.$store.ui.showNotification('Product link copied to clipboard!', 'success');
                });
            }
        },

        // WhatsApp Integration
        contactWhatsApp() {
            if (!this.product) return;

            let message = `Hello! I'm interested in: ${this.product.name}`;

            if (this.quantity > 1) {
                message += ` (Quantity: ${this.quantity})`;
            }

            message += `\nPrice: ${this.$store.ui.formatPrice(this.finalPrice)}`;

            if (this.selectedOptions && Object.keys(this.selectedOptions).length > 0) {
                message += '\nSelected options:';
                Object.entries(this.selectedOptions).forEach(([option, value]) => {
                    message += `\n- ${this.formatOptionName(option)}: ${value}`;
                });
            }

            const shippingCost = this.getVariantShippingCost();
            message += `\nShipping: ${shippingCost === 0 ? 'Free' : this.$store.ui.formatPrice(shippingCost)}`;

            const stock = this.getVariantStock();
            message += `\nStock: ${stock > 0 ? `${stock} available` : 'Out of stock'}`;

            if (this.totalPrice !== this.finalPrice) {
                message += `\nTotal: ${this.$store.ui.formatPrice(this.totalPrice)}`;
            }

            message += '\n\nCould you provide me with more information about this product?';

            const phoneNumber = '96171123456';
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        },

        // Image Modal
        openImageModal() {
            this.showImageModal = true;
            document.body.style.overflow = 'hidden';
        },

        closeImageModal() {
            this.showImageModal = false;
            document.body.style.overflow = 'auto';
            this.resetZoom();
        },

        // Thumbnail Scrolling
        scrollThumbnails(direction) {
            const container = this.$refs.thumbnailsContainer;
            if (!container) return;

            const scrollAmount = container.clientWidth * 0.75;
            if (direction === 'left') {
                container.scrollLeft -= scrollAmount;
            } else {
                container.scrollLeft += scrollAmount;
            }

            setTimeout(() => {
                this.checkScrollPosition();
            }, 100);
        },

        checkScrollPosition() {
            const container = this.$refs.thumbnailsContainer;
            if (!container) return;

            this.isScrollLeftEnd = container.scrollLeft <= 0;
            this.isScrollRightEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 5;
        },

        scrollToOptionThumbnails() {
            const container = this.$refs.thumbnailsContainer;
            if (!container) return;

            this.$nextTick(() => {
                let thumbnailSelector = null;

                for (const [option, value] of Object.entries(this.selectedOptions)) {
                    if (this.product.option_images &&
                        this.product.option_images[option] &&
                        this.product.option_images[option][value]) {
                        thumbnailSelector = `[data-thumbnail-type="option"][data-option-type="${option}"][data-option-value="${value}"]`;
                        break;
                    }
                }

                if (!thumbnailSelector) {
                    const variantKey = this.getVariantKey();
                    if (variantKey && this.product.variant_images && this.product.variant_images[variantKey]) {
                        thumbnailSelector = `[data-thumbnail-type="variant"][data-variant-key="${variantKey}"]`;
                    }
                }

                if (thumbnailSelector) {
                    const thumbnail = container.querySelector(thumbnailSelector);
                    if (thumbnail) {
                        thumbnail.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'center'
                        });
                    }
                }

                this.checkScrollPosition();
            });
        },

        // Zoom Functionality
        mouseMove(e) {
            if (!this.zoomed || this.isTouchDevice) return;

            const img = this.$refs.mainImage;
            if (!img) return;

            const rect = img.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            this.origin = `${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`;
            this.updateZoomStyle();
        },

        mouseEnter(e) {
            if (this.isTouchDevice) return;
            this.zoomed = true;
            this.mouseMove(e);
        },

        mouseLeave() {
            if (this.isTouchDevice) return;
            this.zoomed = false;
            this.resetZoom();
        },

        touchStart(e) {
            if (e.touches.length > 1) return;

            const now = Date.now();
            if (now - this.lastTap < 300) {
                this.zoomed = !this.zoomed;
                if (this.zoomed) {
                    const img = this.$refs.mainImage;
                    if (!img) return;

                    const rect = img.getBoundingClientRect();
                    const touch = e.touches[0];
                    const x = ((touch.clientX - rect.left) / rect.width) * 100;
                    const y = ((touch.clientY - rect.top) / rect.height) * 100;

                    this.origin = `${x}% ${y}%`;
                    this.panX = 0;
                    this.panY = 0;
                    this.calculatePanLimits();
                    this.updateZoomStyle();
                } else {
                    this.resetZoom();
                }
                e.preventDefault();
            } else if (this.zoomed) {
                this.dragging = true;
                this.dragStartX = e.touches[0].clientX - this.panX;
                this.dragStartY = e.touches[0].clientY - this.panY;
            }

            this.lastTap = now;
        },

        touchMove(e) {
            if (!this.zoomed || !this.dragging || e.touches.length > 1) return;

            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;

            this.panX = touchX - this.dragStartX;
            this.panY = touchY - this.dragStartY;

            this.panX = Math.max(this.minPanX, Math.min(this.maxPanX, this.panX));
            this.panY = Math.max(this.minPanY, Math.min(this.maxPanY, this.panY));

            this.updateZoomStyle();
            e.preventDefault();
        },

        touchEnd() {
            this.dragging = false;
        },

        updateZoomStyle() {
            if (!this.zoomed) {
                this.imgStyle = 'transform: scale(1); transform-origin: 50% 50%; transition: transform 0.3s ease;';
                return;
            }

            if (this.isTouchDevice) {
                const transform = `scale(${this.scale}) translate(${this.panX}px, ${this.panY}px)`;
                this.imgStyle = `transform: ${transform}; transform-origin: ${this.origin}; transition: none;`;
            } else {
                this.imgStyle = `transform: scale(${this.scale}); transform-origin: ${this.origin}; transition: transform-origin 0.1s ease;`;
            }
        },

        resetZoom() {
            this.zoomed = false;
            this.panX = 0;
            this.panY = 0;
            this.origin = '50% 50%';
            this.dragging = false;
            this.updateZoomStyle();
        },

        calculatePanLimits() {
            const img = this.$refs.mainImage;
            if (!img) return;

            const rect = img.getBoundingClientRect();
            this.maxPanX = (rect.width * (this.scale - 1)) / 2;
            this.minPanX = -this.maxPanX;
            this.maxPanY = (rect.height * (this.scale - 1)) / 2;
            this.minPanY = -this.maxPanY;
        },

        // Reviews
        get averageRating() {
            if (this.reviews.length === 0) return 0;
            const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
            return Number((sum / this.reviews.length).toFixed(1));
        },

        get ratingDistribution() {
            const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

            this.reviews.forEach(review => {
                if (review.rating >= 1 && review.rating <= 5) {
                    distribution[review.rating]++;
                }
            });

            Object.keys(distribution).forEach(rating => {
                distribution[rating] = this.reviews.length > 0 ?
                    Math.round((distribution[rating] / this.reviews.length) * 100) : 0;
            });

            return distribution;
        },

        formatDate(dateString) {
            try {
                return new Date(dateString).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch (error) {
                return dateString;
            }
        },

        // Utility Functions - Using centralized utilities
        formatOptionName(name) {
            return this.$store.utils.capitalizeFirst(name.replace(/_/g, ' '));
        },

        formatFeatureKey(key) {
            return this.$store.utils.capitalizeFirst(key.replace(/_/g, ' '));
        }
    }));
});

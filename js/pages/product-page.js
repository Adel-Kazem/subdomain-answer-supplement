// pages/product-page.js - Complete Enhanced Product Detail Page Logic for GreenLion SPA
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

        // Image Configuration
        imageBaseUrl: window.location.origin + '/subdomain-answer-supplement/',

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
                comment: "Excellent product! Works exactly as described and the build quality is outstanding. Fast shipping and professional packaging.",
                date: "2024-01-15",
                verified: true
            },
            {
                id: 2,
                name: "Sara Mahmoud",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                rating: 5,
                comment: "Fast delivery and great customer service. Very satisfied with my purchase! The product exceeded my expectations.",
                date: "2024-01-10",
                verified: true
            },
            {
                id: 3,
                name: "Omar Hassan",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                rating: 4,
                comment: "Good quality product, but shipping took a bit longer than expected. Overall satisfied with the purchase.",
                date: "2024-01-05",
                verified: false
            },
            {
                id: 4,
                name: "Layla Farah",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                rating: 5,
                comment: "Amazing product quality and excellent customer support. Highly recommend GreenLion!",
                date: "2023-12-28",
                verified: true
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

            // Simulate loading delay for better UX
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

                // Update meta description if available
                const metaDescription = document.querySelector('meta[name="description"]');
                if (metaDescription && this.product.description) {
                    metaDescription.setAttribute('content', this.product.description.substring(0, 150) + '...');
                }
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

        // Image URL Handling
        getFullImageUrl(imagePath) {
            if (!imagePath) return this.getPlaceholderImage();

            // If it's already a full URL, return as is
            if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('//')) {
                return imagePath;
            }

            // Convert relative path to full URL
            return this.imageBaseUrl + imagePath;
        },

        getPlaceholderImage() {
            return "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Product+Image";
        },

        // Product Images Management
        get productImages() {
            if (!this.product) return [];

            let images = [];

            // Add main images
            if (this.product.images) {
                if (Array.isArray(this.product.images)) {
                    images.push(...this.product.images.map(img => this.getFullImageUrl(img)));
                } else {
                    images.push(this.getFullImageUrl(this.product.images));
                }
            } else if (this.product.image) {
                images.push(this.getFullImageUrl(this.product.image));
            }

            // Add gallery images
            if (this.product.gallery && Array.isArray(this.product.gallery)) {
                images.push(...this.product.gallery.map(img => this.getFullImageUrl(img)));
            }

            // Ensure we have at least one image
            if (images.length === 0) {
                images.push(this.getPlaceholderImage());
            }

            return images;
        },

        get allThumbnails() {
            let thumbnails = [];

            // Main product images
            if (this.product?.images && Array.isArray(this.product.images)) {
                thumbnails.push(...this.product.images.map(img => ({
                    type: 'main',
                    image: this.getFullImageUrl(img),
                    key: img
                })));
            } else if (this.product?.image) {
                thumbnails.push({
                    type: 'main',
                    image: this.getFullImageUrl(this.product.image),
                    key: this.product.image
                });
            }

            // Option images
            if (this.product?.option_images) {
                Object.entries(this.product.option_images).forEach(([optionName, optionTypes]) => {
                    Object.entries(optionTypes).forEach(([optionValue, images]) => {
                        if (Array.isArray(images)) {
                            images.forEach(img => {
                                thumbnails.push({
                                    type: 'option',
                                    image: this.getFullImageUrl(img),
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
            if (this.product?.variant_images) {
                Object.entries(this.product.variant_images).forEach(([variantKey, variantImage]) => {
                    if (Array.isArray(variantImage)) {
                        variantImage.forEach(img => {
                            thumbnails.push({
                                type: 'variant',
                                image: this.getFullImageUrl(img),
                                key: variantKey,
                                variantKey
                            });
                        });
                    } else {
                        thumbnails.push({
                            type: 'variant',
                            image: this.getFullImageUrl(variantImage),
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
                if (!seenImages.has(thumb.image)) {
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
            if (!this.product) return this.getPlaceholderImage();

            try {
                if (this.selectedImage) {
                    return this.selectedImage;
                }

                // Check variant images first
                const variantKey = this.getVariantKey();
                if (variantKey && this.product.variant_images && this.product.variant_images[variantKey]) {
                    const variantImage = this.product.variant_images[variantKey];
                    const imageUrl = Array.isArray(variantImage) ? variantImage[0] : variantImage;
                    return this.getFullImageUrl(imageUrl);
                }

                // Check option images
                if (this.product.option_images) {
                    for (const [option, value] of Object.entries(this.selectedOptions)) {
                        if (this.product.option_images[option] &&
                            this.product.option_images[option][value] &&
                            this.product.option_images[option][value].length > 0) {
                            return this.getFullImageUrl(this.product.option_images[option][value][0]);
                        }
                    }
                }

                // Return first main image
                if (this.productImages.length > 0) {
                    return this.productImages[0];
                }

                return this.getPlaceholderImage();
            } catch (error) {
                console.error("Error in getSelectedImage:", error);
                return this.getPlaceholderImage();
            }
        },

        selectImage(image) {
            this.selectedImage = image;
            this.resetZoom();

            // Update selected options based on image
            if (this.product?.option_images) {
                for (const [option, values] of Object.entries(this.product.option_images)) {
                    for (const [value, images] of Object.entries(values)) {
                        if (images.map(img => this.getFullImageUrl(img)).includes(image)) {
                            this.selectOption(option, value);
                            return;
                        }
                    }
                }
            }

            if (this.product?.variant_images) {
                for (const [key, variantImage] of Object.entries(this.product.variant_images)) {
                    const fullUrls = Array.isArray(variantImage) ?
                        variantImage.map(img => this.getFullImageUrl(img)) :
                        [this.getFullImageUrl(variantImage)];

                    if (fullUrls.includes(image)) {
                        this.selectVariantFromKey(key);
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
            this.selectedImage = '';
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

        // Pricing Calculations
        get finalPrice() {
            if (!this.product) return 0;

            let price = this.getVariantPrice();

            // Add option price modifiers
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

        get stockStatus() {
            const stock = this.getVariantStock();
            if (stock <= 0) return { status: 'out-of-stock', message: 'Out of Stock', color: 'text-red-600' };
            if (stock <= 5) return { status: 'low-stock', message: `Only ${stock} left`, color: 'text-orange-600' };
            return { status: 'in-stock', message: `${stock} available`, color: 'text-green-600' };
        },

        // Shipping Calculations
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

        get shippingInfo() {
            const cost = this.getVariantShippingCost();
            return {
                cost: cost,
                isFree: cost === 0,
                message: cost === 0 ? 'Free shipping' : `Shipping: ${this.formatPrice(cost)}`
            };
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

        updateQuantity(value) {
            const newQuantity = parseInt(value) || 1;
            const maxStock = this.getVariantStock();
            this.quantity = Math.max(1, Math.min(newQuantity, maxStock, 10));
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

                // Show success notification
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

        // Wishlist Actions
        toggleWishlist() {
            if (!this.product) return;
            this.$store.wishlist.toggleItem(this.product);
        },

        isInWishlist() {
            return this.product && this.$store.wishlist.isInWishlist(this.product.id);
        },

        // Share Functionality
        shareProduct() {
            if (!this.product) return;

            if (navigator.share) {
                navigator.share({
                    title: this.product.name,
                    text: this.product.description,
                    url: window.location.href
                });
            } else {
                // Fallback: Copy to clipboard
                navigator.clipboard.writeText(window.location.href).then(() => {
                    this.$store.ui.showNotification('Product link copied to clipboard!', 'success');
                });
            }
        },

        // WhatsApp Integration
        contactWhatsApp() {
            if (!this.product) return;

            let message = `🛍️ Hello! I'm interested in: *${this.product.name}*\n\n`;

            if (this.quantity > 1) {
                message += `📦 Quantity: ${this.quantity}\n`;
            }

            message += `💰 Price: ${this.formatPrice(this.finalPrice)}\n`;

            if (this.selectedOptions && Object.keys(this.selectedOptions).length > 0) {
                message += '\n🎯 Selected options:\n';
                Object.entries(this.selectedOptions).forEach(([option, value]) => {
                    message += `• ${this.formatOptionName(option)}: ${value}\n`;
                });
            }

            const shippingCost = this.getVariantShippingCost();
            message += `\n🚚 Shipping: ${shippingCost === 0 ? 'Free' : this.formatPrice(shippingCost)}\n`;

            const stock = this.getVariantStock();
            message += `📊 Stock: ${stock > 0 ? `${stock} available` : 'Out of stock'}\n`;

            if (this.totalPrice !== this.finalPrice) {
                message += `\n💳 Total: ${this.formatPrice(this.totalPrice)}\n`;
            }

            message += '\n❓ Could you provide me with more information about this product?';

            const phoneNumber = '96171123456'; // Replace with your WhatsApp number
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        },

        // Image Modal Functions
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

                // Find thumbnail for current options
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
                // Double tap to zoom
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
                // Start panning
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

            // Constrain panning within bounds
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

        // Error Handling
        handleImageError(event) {
            console.warn('Image failed to load:', event.target.src);
            event.target.src = this.getPlaceholderImage();
        },

        // Reviews System
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

        // Utility Functions
        formatPrice(price) {
            return this.$store.ui?.formatPrice ? this.$store.ui.formatPrice(price) : `$${price.toFixed(2)}`;
        },

        formatOptionName(name) {
            return name.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
        },

        formatFeatureKey(key) {
            return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
        },

        formatVariantName(variant) {
            return variant
                .split('|')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join(' + ');
        },

        // Tab Management
        switchTab(tab) {
            this.activeTab = tab;
        },

        // Debugging Functions
        debugImages() {
            if (this.product) {
                console.log('Product:', this.product);
                console.log('Product images:', this.product.images);
                console.log('Processed images:', this.productImages);
                console.log('All thumbnails:', this.allThumbnails);
                console.log('Image base URL:', this.imageBaseUrl);
                console.log('Selected image:', this.getSelectedImage());
                console.log('Selected options:', this.selectedOptions);
            }
        },

        debugPricing() {
            console.log('Base price:', this.product?.base_price || this.product?.price);
            console.log('Variant price:', this.getVariantPrice());
            console.log('Final price:', this.finalPrice);
            console.log('Total price:', this.totalPrice);
            console.log('Selected options:', this.selectedOptions);
        },

        debugStock() {
            console.log('Has variants:', this.product?.hasVariants);
            console.log('Variant key:', this.getVariantKey());
            console.log('Variant stock:', this.getVariantStock());
            console.log('Is in stock:', this.isVariantInStock());
            console.log('Stock status:', this.stockStatus);
        }
    }));
});

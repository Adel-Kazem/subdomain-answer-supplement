// pages/cart-page.js - Shopping Cart Page Logic for GreenLion SPA
document.addEventListener('alpine:init', () => {
    Alpine.data('cartPage', () => ({
        isLoading: false,
        showCheckoutModal: false,
        checkoutStep: 1,
        shippingMethod: 'standard',
        paymentMethod: 'whatsapp',

        customerDetails: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            postalCode: '',
            notes: ''
        },

        shippingOptions: [
            {
                id: 'standard',
                name: 'Standard Delivery',
                description: '3-5 business days',
                price: 10,
                estimatedDays: '3-5'
            },
            {
                id: 'express',
                name: 'Express Delivery',
                description: '1-2 business days',
                price: 20,
                estimatedDays: '1-2'
            },
            {
                id: 'pickup',
                name: 'Store Pickup',
                description: 'Pickup from our store',
                price: 0,
                estimatedDays: '0'
            }
        ],

        paymentOptions: [
            {
                id: 'whatsapp',
                name: 'WhatsApp Order',
                description: 'Complete your order via WhatsApp',
                icon: 'icon-whatsapp'
            },
            {
                id: 'cod',
                name: 'Cash on Delivery',
                description: 'Pay when you receive your order',
                icon: 'icon-truck'
            }
        ],

        init() {
            this.$store.cart.trackCartView();
        },

        updateQuantity(itemId, newQuantity) {
            this.$store.cart.updateQuantity(itemId, newQuantity);
        },

        removeItem(itemId) {
            this.$store.cart.removeItem(itemId);
        },

        clearCart() {
            if (confirm('Are you sure you want to clear your cart?')) {
                this.$store.cart.clearCart();
            }
        },

        startCheckout() {
            if (this.$store.cart.isEmpty()) {
                this.$store.ui.showNotification('Your cart is empty', 'warning');
                return;
            }
            this.showCheckoutModal = true;
            this.checkoutStep = 1;
            document.body.style.overflow = 'hidden';
        },

        closeCheckout() {
            this.showCheckoutModal = false;
            this.checkoutStep = 1;
            document.body.style.overflow = 'auto';
        },

        nextStep() {
            if (this.validateStep()) {
                this.checkoutStep++;
            }
        },

        prevStep() {
            this.checkoutStep--;
        },

        validateStep() {
            if (this.checkoutStep === 1) {
                const required = ['firstName', 'lastName', 'phone', 'address', 'city'];
                const missing = required.filter(field => !this.customerDetails[field].trim());

                if (missing.length > 0) {
                    this.$store.ui.showNotification('Please fill in all required fields', 'error');
                    return false;
                }

                const phoneRegex = /^(\+961|961|0)?[0-9]{8}$/;
                if (!phoneRegex.test(this.customerDetails.phone.replace(/\s/g, ''))) {
                    this.$store.ui.showNotification('Please enter a valid Lebanese phone number', 'error');
                    return false;
                }

                if (this.customerDetails.email && !/\S+@\S+\.\S+/.test(this.customerDetails.email)) {
                    this.$store.ui.showNotification('Please enter a valid email address', 'error');
                    return false;
                }
            }
            return true;
        },

        get selectedShipping() {
            return this.shippingOptions.find(option => option.id === this.shippingMethod);
        },

        get cartSummary() {
            const cart = this.$store.cart.getCartSummary();
            const shippingCost = this.selectedShipping ? this.selectedShipping.price : 0;

            return {
                ...cart,
                shipping: shippingCost,
                total: cart.subtotal + cart.tax + shippingCost
            };
        },

        completeOrder() {
            this.isLoading = true;

            setTimeout(() => {
                if (this.paymentMethod === 'whatsapp') {
                    this.processWhatsAppOrder();
                } else {
                    this.processCODOrder();
                }
                this.isLoading = false;
            }, 1000);
        },

        processWhatsAppOrder() {
            const summary = this.cartSummary;
            const shipping = this.selectedShipping;

            let message = "🛒 *New Order from GreenLion*\n\n";

            message += "👤 *Customer Information:*\n";
            message += `Name: ${this.customerDetails.firstName} ${this.customerDetails.lastName}\n`;
            message += `Phone: ${this.customerDetails.phone}\n`;
            if (this.customerDetails.email) {
                message += `Email: ${this.customerDetails.email}\n`;
            }
            message += `Address: ${this.customerDetails.address}, ${this.customerDetails.city}\n`;
            if (this.customerDetails.postalCode) {
                message += `Postal Code: ${this.customerDetails.postalCode}\n`;
            }
            message += "\n";

            message += "📦 *Order Items:*\n";
            summary.items.forEach((item, index) => {
                message += `${index + 1}. *${item.product.name}*\n`;
                message += `   Quantity: ${item.quantity}\n`;
                message += `   Unit Price: ${this.$store.ui.formatPrice(item.price)}\n`;
                message += `   Total: ${this.$store.ui.formatPrice(item.price * item.quantity)}\n`;

                if (Object.keys(item.selectedOptions).length > 0) {
                    message += `   Options: ${Object.entries(item.selectedOptions).map(([key, value]) => `${key}: ${value}`).join(', ')}\n`;
                }
                message += "\n";
            });

            message += "🚚 *Shipping:*\n";
            message += `Method: ${shipping.name}\n`;
            message += `Cost: ${this.$store.ui.formatPrice(shipping.price)}\n`;
            message += `Estimated Delivery: ${shipping.estimatedDays} business days\n\n`;

            message += "💰 *Order Summary:*\n";
            message += `Subtotal: ${this.$store.ui.formatPrice(summary.subtotal)}\n`;
            message += `Tax (11%): ${this.$store.ui.formatPrice(summary.tax)}\n`;
            message += `Shipping: ${this.$store.ui.formatPrice(summary.shipping)}\n`;
            message += `*Total: ${this.$store.ui.formatPrice(summary.total)}*\n\n`;

            message += "💳 *Payment Method:* WhatsApp Order\n\n";

            if (this.customerDetails.notes) {
                message += `📝 *Notes:* ${this.customerDetails.notes}\n\n`;
            }

            message += "Thank you for your order! We'll confirm details and arrange delivery.";

            this.$store.ui.openWhatsApp(message);
            this.orderComplete();
        },

        processCODOrder() {
            this.$store.ui.showNotification('Order placed successfully! We will contact you soon.', 'success');
            this.orderComplete();
        },

        orderComplete() {
            this.$store.cart.clearCart();
            this.closeCheckout();
            this.$store.ui.showNotification('Thank you for your order!', 'success', 5000);

            setTimeout(() => {
                this.$store.router.navigate('home');
            }, 2000);
        },

        formatPrice(price) {
            return this.$store.ui.formatPrice(price);
        },

        continueShopping() {
            this.$store.router.navigate('products');
        }
    }));
});

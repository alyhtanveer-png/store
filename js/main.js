/* Main JavaScript for Rhyll Static Site */

// Shared Logic
document.addEventListener('alpine:init', () => {
    // Index Page Data
    Alpine.data('indexPage', () => ({
        mobileMenuOpen: false,
        isLoggedIn: false,
        isAdminLoggedIn: false,
        user: { name: '', email: '' },
        shareModalOpen: false,
        cartDrawerOpen: false,
        wishlistDrawerOpen: false,
        shareProductName: '',
        shareUrl: '',
        cart: [],
        wishlist: [],
        cartCount: 0,
        wishlistCount: 0,
        addToCart(product) {
            const existingItem = this.cart.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.cart.push({ ...product, quantity: 1 });
            }
            this.updateCartCount();
            this.saveCart();

            // Show feedback (optional toast could be added here)
            const btn = event.target.closest('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i data-lucide="check" class="w-5 h-5 mx-auto"></i>';
            if (window.lucide) window.lucide.createIcons();
            setTimeout(() => {
                btn.innerHTML = originalText;
                if (window.lucide) window.lucide.createIcons();
            }, 1000);
        },
        updateCartCount() {
            this.cartCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        },
        saveCart() {
            localStorage.setItem('rhyll_cart', JSON.stringify(this.cart));
        },
        loadCart() {
            const savedCart = localStorage.getItem('rhyll_cart');
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
                this.updateCartCount();
            }
        },
        toggleWishlist(product) {
            const index = this.wishlist.findIndex(item => item.id === product.id);
            if (index > -1) {
                this.wishlist.splice(index, 1);
            } else {
                this.wishlist.push(product);
            }
            this.updateWishlistCount();
            this.saveWishlist();
        },
        updateWishlistCount() {
            this.wishlistCount = this.wishlist.length;
        },
        saveWishlist() {
            localStorage.setItem('rhyll_wishlist', JSON.stringify(this.wishlist));
        },
        loadWishlist() {
            const savedWishlist = localStorage.getItem('rhyll_wishlist');
            if (savedWishlist) {
                this.wishlist = JSON.parse(savedWishlist);
                this.updateWishlistCount();
            }
        },
        isInWishlist(id) {
            return this.wishlist.some(item => item.id === id);
        },
        heroSliderIndex: 0,
        heroSlides: [
            { id: 1, title: 'Elevate Your Lifestyle', subtitle: 'Premium Selection', desc: 'Curated premium groceries and artisanal goods delivered with uncompromising quality.', cta: 'Start Shopping', image: 'images/grocery-shopping-fresh-produce-and-products.jpg', accent: 'blue' },
            { id: 2, title: 'Artisanal Bakery Freshness', subtitle: 'Handcrafted Daily', desc: 'Experience the rich aroma of freshly baked sourdough and delicate pastries.', cta: 'Explore Bakery', image: 'images/artisan-sourdough-loaf.jpg', accent: 'amber' },
            { id: 3, title: 'Luxury In Every Scent', subtitle: 'Exclusive Collection', desc: 'Discover our collection of premium perfumes and designer fragrances.', cta: 'Shop Perfumes', image: 'images/midnight-oud.png', accent: 'indigo' }
        ],
        sliderIndex: 0,
        sliderProducts: [
            { id: 1, name: 'Organic Brown Rice', price: 8.99, rating: 4.8, image: 'images/organic-brown-rice-2kg.jpg', category: 'Grocery', description: 'Premium quality organic brown rice, perfect for healthy meals and family dinners.' },
            { id: 32, name: 'Fresh Orange Juice', price: 4.99, rating: 4.9, image: 'images/fresh-orange-juice.png', category: 'Beverages', description: '100% pure squeezed orange juice with no added sugar.' },
            { id: 5, name: 'Artisan Sourdough Loaf', price: 6.49, rating: 4.9, image: 'images/artisan-sourdough-loaf.jpg', category: 'Bakery', description: 'Freshly baked artisan sourdough with authentic flavor and texture.' },
            { id: 19, name: 'Premium Coffee Beans', price: 12.99, rating: 4.9, image: 'images/premium-coffee-beans.jpg', category: 'Beverages', description: 'Single-origin specialty coffee beans with rich, complex flavors.' }
        ],
        topProducts: [
            { id: 32, name: 'Fresh Orange Juice', price: 4.99, rating: 4.9, image: 'images/fresh-orange-juice.png' },
            { id: 5, name: 'Artisan Sourdough Loaf', price: 6.49, rating: 4.9, image: 'images/artisan-sourdough-loaf.jpg' },
            { id: 13, name: 'Vitamin C Serum 30ml', price: 22.99, rating: 4.9, image: 'images/vitamin-c-serum.png' },
            { id: 17, name: 'Midnight Oud EDP 100ml', price: 89.99, rating: 4.9, image: 'images/midnight-oud.png' }
        ],
        groceryProducts: [
            { id: 1, name: 'Organic Brown Rice 2kg', price: 8.99, rating: 4.8, image: 'images/organic-brown-rice-2kg.jpg' },
            { id: 2, name: 'Extra Virgin Olive Oil 500ml', price: 12.99, rating: 4.9, image: 'images/extra-virgin-olive-oil.jpg' },
            { id: 3, name: 'Whole Wheat Flour 1kg', price: 5.99, rating: 4.7, image: 'images/whole-wheat-flour.png' },
            { id: 4, name: 'Frozen Mixed Vegetables', price: 4.49, rating: 4.6, image: 'images/frozen-mixed-vegetables.jpg' }
        ],
        bakeryProducts: [
            { id: 5, name: 'Artisan Sourdough Loaf', price: 6.49, rating: 4.9, image: 'images/artisan-sourdough-loaf.jpg' },
            { id: 6, name: 'Fresh Croissants Pack', price: 7.99, rating: 4.8, image: 'images/fresh-croissants.jpg' },
            { id: 7, name: 'Choco Chip Muffins 6pc', price: 5.49, rating: 4.7, image: 'images/chocolate-chip-muffins.jpg' },
            { id: 8, name: 'Rustic Sourdough', price: 6.99, rating: 4.8, image: 'images/rustic-sourdough-loaf.png' }
        ],
        babyProducts: [
            { id: 9, name: 'Baby Formula 500g', price: 16.99, rating: 4.8, image: 'images/baby-formula.jpg' },
            { id: 10, name: 'Gentle Baby Wipes', price: 8.99, rating: 4.9, image: 'images/baby-wipes.jpg' },
            { id: 11, name: 'Infant Diapers Pack', price: 19.99, rating: 4.7, image: 'images/baby-diapers.png' },
            { id: 12, name: 'Baby Care Kit', price: 24.99, rating: 4.8, image: 'images/baby-care-kit.png' }
        ],
        healthBeautyProducts: [
            { id: 13, name: 'Vitamin C Serum 30ml', price: 22.99, rating: 4.9, image: 'images/vitamin-c-serum.png' },
            { id: 14, name: 'Natural Moisturizer', price: 14.99, rating: 4.8, image: 'images/face-moisturizer-cream.png' },
            { id: 15, name: 'Whitening Toothpaste', price: 5.99, rating: 4.6, image: 'images/whitening-toothpaste.jpg' },
            { id: 16, name: 'Vitamin Serum Lux', price: 25.00, rating: 4.9, image: 'images/vitamin-serum.jpg' }
        ],
        perfumeProducts: [
            { id: 17, name: 'Midnight Oud EDP 100ml', price: 89.99, rating: 4.9, image: 'images/midnight-oud.png' },
            { id: 18, name: 'Floral Bloom 50ml', price: 65.00, rating: 4.8, image: 'images/floral-bloom.png' },
            { id: 19, name: 'Classic Silver EDT 100ml', price: 55.49, rating: 4.7, image: 'images/classic-silver.png' },
            { id: 20, name: 'Velvet Rose Parfum 75ml', price: 79.99, rating: 4.9, image: 'images/velvet-rose.png' }
        ],
        produceProducts: [
            { id: 33, name: 'Fresh Fruit Basket', price: 24.99, rating: 4.8, image: 'images/grocery-shopping-fresh-produce-and-products.jpg' },
            { id: 34, name: 'Organic Honey 500g', price: 12.49, rating: 4.9, image: 'images/extra-virgin-olive-oil.jpg' },
            { id: 35, name: 'Premium Pasta 1kg', price: 5.99, rating: 4.7, image: 'images/organic-brown-rice-2kg.jpg' },
            { id: 36, name: 'Baby Spinach 200g', price: 2.99, rating: 4.8, image: 'images/frozen-mixed-vegetables.jpg' }
        ],
        beverageProducts: [
            { id: 32, name: 'Fresh Orange Juice', price: 4.99, rating: 4.9, image: 'images/fresh-orange-juice.png' },
            { id: 37, name: 'Green Tea Bags 50pc', price: 6.99, rating: 4.8, image: 'images/green-tea-bags.jpg' },
            { id: 38, name: 'Specialty Coffee', price: 12.99, rating: 4.9, image: 'images/pile-of-coffee-beans.png' },
            { id: 39, name: 'Premium Coffee 250g', price: 9.49, rating: 4.7, image: 'images/premium-coffee-beans.jpg' }
        ],
        init() {
            this.isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';

            // Initialize products from localStorage if available
            const savedProducts = localStorage.getItem('products');
            if (savedProducts) {
                const lp = JSON.parse(savedProducts);
                this.groceryProducts = lp.filter(p => p.category === 'Grocery');
                this.produceProducts = lp.filter(p => p.category === 'Produce');
                this.bakeryProducts = lp.filter(p => p.category === 'Bakery');
                this.beverageProducts = lp.filter(p => p.category === 'Beverages');
                this.babyProducts = lp.filter(p => p.category === 'Baby Care');
                this.healthBeautyProducts = lp.filter(p => p.category === 'Beauty');
                this.perfumeProducts = lp.filter(p => p.category === 'Perfumes');

                // FORCE REFRESH: If any product has a broken image path or missing sections, reset from verified sources
                const hasBrokenImages = lp.some(p => !p.image || p.image.includes('placeholder'));
                const hasProduce = lp.some(p => p.category === 'Produce');
                const hasBeverage = lp.some(p => p.category === 'Beverages');

                if (hasBrokenImages || !hasProduce || !hasBeverage) {
                    console.log('Rhyll: Repairing product catalog integrity...');

                    // Verified Clean Data Source
                    const cleanProduce = [
                        { id: 33, name: 'Fresh Fruit Basket', price: 24.99, rating: 4.8, image: 'images/grocery-shopping-fresh-produce-and-products.jpg', category: 'Produce', featured: true },
                        { id: 34, name: 'Organic Honey 500g', price: 12.49, rating: 4.9, image: 'images/extra-virgin-olive-oil.jpg', category: 'Produce' },
                        { id: 35, name: 'Premium Pasta 1kg', price: 5.99, rating: 4.7, image: 'images/organic-brown-rice-2kg.jpg', category: 'Produce' },
                        { id: 36, name: 'Baby Spinach 200g', price: 2.99, rating: 4.8, image: 'images/frozen-mixed-vegetables.jpg', category: 'Produce' }
                    ];

                    const cleanBeverages = [
                        { id: 32, name: 'Fresh Orange Juice', price: 4.99, rating: 4.9, image: 'images/fresh-orange-juice.png', category: 'Beverages', featured: true },
                        { id: 37, name: 'Green Tea Bags 50pc', price: 6.99, rating: 4.8, image: 'images/green-tea-bags.jpg', category: 'Beverages' },
                        { id: 38, name: 'Specialty Coffee', price: 12.99, rating: 4.9, image: 'images/pile-of-coffee-beans.png', category: 'Beverages' },
                        { id: 39, name: 'Premium Coffee 250g', price: 9.49, rating: 4.7, image: 'images/premium-coffee-beans.jpg', category: 'Beverages' }
                    ];

                    const otherProducts = lp.filter(p => p.category !== 'Produce' && p.category !== 'Beverages');
                    const updatedLP = [...otherProducts, ...cleanProduce, ...cleanBeverages];

                    localStorage.setItem('products', JSON.stringify(updatedLP));

                    // Update current state
                    this.produceProducts = cleanProduce;
                    this.beverageProducts = cleanBeverages;
                    this.groceryProducts = updatedLP.filter(p => p.category === 'Grocery');
                    this.bakeryProducts = updatedLP.filter(p => p.category === 'Bakery');
                    this.babyProducts = updatedLP.filter(p => p.category === 'Baby Care');
                    this.healthBeautyProducts = updatedLP.filter(p => p.category === 'Beauty');
                    this.perfumeProducts = updatedLP.filter(p => p.category === 'Perfumes');
                }

                // Final sync for slider/top products
                const currentLP = JSON.parse(localStorage.getItem('products'));
                this.sliderProducts = currentLP.filter(p => p.featured).slice(0, 4);
                if (this.sliderProducts.length === 0) this.sliderProducts = currentLP.slice(0, 4);
                this.topProducts = [...currentLP].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);
            } else {
                // First time load: save default products to localStorage for admin management
                const allDefaults = [
                    ...this.groceryProducts.map(p => ({ ...p, category: 'Grocery' })),
                    ...this.produceProducts.map(p => ({ ...p, category: 'Produce' })),
                    ...this.bakeryProducts.map(p => ({ ...p, category: 'Bakery' })),
                    ...this.beverageProducts.map(p => ({ ...p, category: 'Beverages' })),
                    ...this.babyProducts.map(p => ({ ...p, category: 'Baby Care' })),
                    ...this.healthBeautyProducts.map(p => ({ ...p, category: 'Beauty' })),
                    ...this.perfumeProducts.map(p => ({ ...p, category: 'Perfumes' }))
                ];
                localStorage.setItem('products', JSON.stringify(allDefaults));
            }

            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                this.user = JSON.parse(savedUser);
                this.isLoggedIn = true;
            }
            this.loadCart();
            this.loadWishlist();
            setInterval(() => {
                this.heroSliderIndex = (this.heroSliderIndex + 1) % this.heroSlides.length;
            }, 6000);
            setInterval(() => {
                this.sliderIndex = (this.sliderIndex + 1) % this.sliderProducts.length;
            }, 5000);

            // Re-initialize Lucide icons after Alpine rendered templates
            this.$nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        },
        openShareModal(name) {
            this.shareProductName = name;
            this.shareUrl = window.location.href + '?product=' + encodeURIComponent(name);
            this.shareModalOpen = true;
        },
        copyToClipboard() {
            navigator.clipboard.writeText(this.shareUrl);
            alert('Link copied to clipboard!');
        },
        logout() {
            localStorage.removeItem('user');
            this.isLoggedIn = false;
            this.user = null;
        }
    }));

    // Login Page Data
    Alpine.data('loginPage', () => ({
        email: '',
        password: '',
        error: '',
        loading: false,
        handleSubmit() {
            this.error = '';
            this.loading = true;

            setTimeout(() => {
                if (this.email === 'user@example.com' && this.password === 'password123') {
                    localStorage.setItem('user', JSON.stringify({ name: 'John Doe', email: this.email }));
                    window.location.href = 'index.html';
                } else {
                    this.error = 'Invalid credentials';
                }
                this.loading = false;
            }, 1000);
        }
    }));

    // Signup Page Data
    Alpine.data('signupPage', () => ({
        name: '',
        email: '',
        password: '',
        loading: false,
        handleSubmit() {
            this.loading = true;
            setTimeout(() => {
                localStorage.setItem('user', JSON.stringify({ name: this.name, email: this.email }));
                window.location.href = 'index.html';
                this.loading = false;
            }, 1000);
        }
    }));
});

// Initialize Lucide Icons on initial load
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }
});

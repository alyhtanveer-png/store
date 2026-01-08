document.addEventListener('alpine:init', () => {
    Alpine.data('indexPage', () => ({
        mobileMenuOpen: false,
        cartDrawerOpen: false,
        wishlistDrawerOpen: false,
        wishlistCount: 0,
        cartCount: 0,
        cartTotal: 0,
        isLoggedIn: false,
        isAdminLoggedIn: false,
        user: { name: 'Guest' },
        sliderIndex: 0,
        heroSliderIndex: 0,
        dropdownOpen: false,

        // Data Arrays
        heroSlides: [
            {
                id: 1,
                type: 'collage',
                title: 'We Believe in Quality and Services',
                subtitle: 'Premium Selection',
                desc: 'Experience the best products delivered to your doorstep.',
                cta: 'Buy Online',
                accent: 'yellow',
                images: ['images/coke-bottle.png', 'images/rocket.png', 'images/baby-diapers.png', 'images/laundry-detergent.png']
            }
        ],

        promoBannerSlides: [
            { id: 1, title: 'Weekend Mega Sale', discount: 'Up to 50% OFF', desc: 'Get huge discounts on pantry staples this weekend only.', bg: 'bg-indigo-600', image: 'images/shopping-bags-and-products.jpg' },
            { id: 2, title: 'Freshness Guaranteed', discount: 'Fresh Produce', desc: 'Farm fresh vegetables delivered straight to your doorstep.', bg: 'bg-emerald-600', image: 'images/grocery-shopping-fresh-produce-and-products.jpg' },
            { id: 3, title: 'Beauty Bonanza', discount: 'Buy 1 Get 1', desc: 'Exclusive offers on top brand shampoos and skincare.', bg: 'bg-pink-600', image: 'images/vitamin-c-serum.png' }
        ],

        promoBannerIndex: 0,

        dairyBannerSlides: [
            { id: 1, title: 'Fresh Dairy Deals', discount: 'Flat 20% OFF', desc: 'Starting your day with pure, calcium-rich milk and cheese.', bg: 'bg-sky-600', image: 'images/baby-formula.jpg' },
            { id: 2, title: 'Yogurt Festival', discount: 'Buy 2 Get 1', desc: 'Creamy, probiotic-rich yogurt available in all flavors.', bg: 'bg-teal-600', image: 'images/baby-formula.jpg' },
            { id: 3, title: 'Cheese Lovers', discount: 'Special Price', desc: 'Premium cheddar and mozzarella blocks for your recipes.', bg: 'bg-blue-600', image: 'images/grocery-shopping-fresh-produce-and-products.jpg' }
        ],

        dairyBannerIndex: 0,

        packagedBannerSlides: [
            { id: 1, title: 'Pantry Essentials', discount: 'Bundle Offer', desc: 'Stock up on ketchups, sauces, and instant meals.', bg: 'bg-red-600', image: 'images/fresh-orange-juice.png' },
            { id: 2, title: 'Canned Delights', discount: 'Buy 3 Get 1', desc: 'Premium quality canned fruits and vegetables for your convenience.', bg: 'bg-amber-600', image: 'images/frozen-mixed-vegetables.jpg' },
            { id: 3, title: 'Sauce & Spices', discount: 'Flat 15% OFF', desc: 'Add zest to your meals with our range of soy and chilli sauces.', bg: 'bg-orange-600', image: 'images/extra-virgin-olive-oil.jpg' }
        ],

        packagedBannerIndex: 0,

        beverageBannerSlides: [
            { id: 1, title: 'Summer Refreshers', discount: 'Buy 1 Get 1', desc: 'Beat the heat with our chilled variety of juices and sodas.', bg: 'bg-lime-600', image: 'images/fresh-orange-juice.png' },
            { id: 2, title: 'Tea & Coffee Time', discount: 'Combo Saver', desc: 'Premium tea blends and roasts for your perfect morning brew.', bg: 'bg-emerald-600', image: 'images/green-tea-bags.jpg' },
            { id: 3, title: 'Energize Your Day', discount: 'Flat 20% OFF', desc: 'Sports drinks and energy boosters at unbeatable prices.', bg: 'bg-cyan-600', image: 'images/grocery-shopping-fresh-produce-and-products.jpg' }
        ],

        beverageBannerIndex: 0,

        // New Categorized Product Arrays
        freshProduce: [],
        groceryStaples: [],
        spicesMasala: [],
        dairyProducts: [],
        meatFrozen: [],
        packagedCanned: [],
        snacksBakery: [],
        beverages: [],
        householdCleaning: [],
        personalCare: [],
        pakistaniProducts: [],
        indianProducts: [],
        africanProducts: [],
        filipinoProducts: [],

        sliderProducts: [],
        topProducts: [],
        cart: [],
        wishlist: [],

        init() {
            this.isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';



            // Define the massive static catalog
            const fullCatalog = {
                freshProduce: [
                    { id: 101, name: 'Farm Fresh Vegetable Box', price: 12.99, rating: 4.9, image: 'images/grocery-shopping-fresh-produce-and-products.jpg', category: 'Fresh Produce' },
                    { id: 115, name: 'Premium Veggie Basket', price: 15.50, rating: 5.0, image: 'images/fresh-basket-1.jpg', category: 'Fresh Produce' },
                    { id: 116, name: 'Organic Greens Mix', price: 9.99, rating: 4.8, image: 'images/fresh-basket-2.jpg', category: 'Fresh Produce' },
                    { id: 120, name: 'Onion 8kg', price: 5.00, rating: 4.5, image: 'images/red-onion.jpg', category: 'Fresh Produce' },
                    { id: 121, name: 'Onion 18kg', price: 10.00, rating: 4.5, image: 'images/red-onion.jpg', category: 'Fresh Produce' }
                ],
                groceryStaples: [
                    { id: 222, name: 'Dalda Sunflower Oil', price: 8.99, rating: 4.9, image: 'images/grocery-oil-1.jpg', category: 'Grocery & Staples' },
                    { id: 201, name: 'Premium Aged Basmati Rice', price: 18.99, rating: 4.9, image: 'images/organic-brown-rice-2kg.jpg', category: 'Grocery & Staples' },
                    { id: 203, name: 'Organic Whole Wheat Flour', price: 12.99, rating: 4.9, image: 'images/whole-wheat-flour.png', category: 'Grocery & Staples' },
                    { id: 223, name: 'Dalda Cooking Oil', price: 7.99, rating: 4.9, image: 'images/grocery-oil-2.jpg', category: 'Grocery & Staples' },
                    { id: 221, name: 'Premium Grocery Item', price: 5.99, rating: 4.8, image: 'images/grocery-new-1.webp', category: 'Grocery & Staples' }
                ],
                spicesMasala: [
                    { id: 304, name: 'Cumin Seeds 100g', price: 3.49, rating: 4.8, image: 'images/pile-of-coffee-beans.png', category: 'Spices & Masala' },
                    { id: 310, name: 'Premium Masala Box', price: 12.99, rating: 5.0, image: 'images/masala-box.jpg', category: 'Spices & Masala' },
                    { id: 311, name: 'National Biryani Mix', price: 1.25, rating: 4.9, image: 'images/national-biryani.jpg', category: 'Spices & Masala' },
                    { id: 312, name: 'National Quorma Mix', price: 1.25, rating: 4.8, image: 'images/national-quorma.jpg', category: 'Spices & Masala' },
                    { id: 313, name: 'National Karahi Mix', price: 1.25, rating: 4.8, image: 'images/national-karahi.jpg', category: 'Spices & Masala' }
                ],
                dairyProducts: [
                    { id: 415, name: 'Olpers Fresh Milk 1L', price: 1.99, rating: 4.9, image: 'images/dairy-1.jpg', category: 'Dairy Products' },
                    { id: 416, name: 'Milk Pak Full Cream 1L', price: 1.89, rating: 4.8, image: 'images/dairy-2.jpg', category: 'Dairy Products' },
                    { id: 417, name: 'Premium Dairy Collection', price: 8.99, rating: 4.9, image: 'images/dairy-3.jpg', category: 'Dairy Products' },
                    { id: 418, name: 'Olpers Milk Pack', price: 1.95, rating: 4.8, image: 'images/dairy-4.jpg', category: 'Dairy Products' }
                ],
                meatFrozen: [
                    { id: 510, name: 'Sabroso Nuggets Saver 1kg', price: 4.25, rating: 4.8, image: 'images/meat-frozen-1.jpg', category: 'Meat & Frozen' },
                    { id: 511, name: 'K&Ns Burger Patties', price: 5.50, rating: 4.7, image: 'images/meat-frozen-2.jpg', category: 'Meat & Frozen' },
                    { id: 501, name: 'Whole Chicken (1kg)', price: 6.99, rating: 4.8, image: 'images/meat-frozen-3.jpg', category: 'Meat & Frozen' },
                    { id: 503, name: 'Premium Beef Cubes 1kg', price: 12.99, rating: 4.9, image: 'images/meat-frozen-1.jpg', category: 'Meat & Frozen' },
                    { id: 514, name: 'Premium Frozen Meat Selection', price: 15.99, rating: 4.9, image: 'images/meat-frozen-1.jpg', category: 'Meat & Frozen' },
                    { id: 515, name: 'Assorted Meat Variety Pack', price: 18.99, rating: 4.8, image: 'images/meat-frozen-2.jpg', category: 'Meat & Frozen' },
                    { id: 516, name: 'Gourmet Frozen Meat Collection', price: 17.49, rating: 4.9, image: 'images/meat-frozen-3.jpg', category: 'Meat & Frozen' }
                ],
                packagedCanned: [
                    { id: 610, name: 'Premium Breakfast Meal Can', price: 3.99, rating: 4.9, image: 'images/packaged-1.jpg', category: 'Packaged Food' },
                    { id: 611, name: 'Gourmet Canned Collection', price: 5.49, rating: 4.8, image: 'images/packaged-2.jpg', category: 'Packaged Food' },
                    { id: 612, name: 'Assorted Canned Delights', price: 4.99, rating: 4.7, image: 'images/packaged-3.jpg', category: 'Packaged Food' },
                    { id: 613, name: 'Lunch & Dinner Variety Pack', price: 6.99, rating: 4.9, image: 'images/packaged-4.jpg', category: 'Packaged Food' }
                ],
                snacksBakery: [
                    { id: 717, name: 'Premium Bakery Assortment', price: 8.99, rating: 4.9, image: 'images/snacks-1.jpg', category: 'Snacks & Bakery' },
                    { id: 718, name: 'Gourmet Snack Selection', price: 6.49, rating: 4.8, image: 'images/snacks-2.jpg', category: 'Snacks & Bakery' },
                    { id: 719, name: 'SMUB Snack Pack', price: 2.99, rating: 4.7, image: 'images/snacks-3.jpg', category: 'Snacks & Bakery' },
                    { id: 720, name: 'Crispy Chips Pack', price: 1.99, rating: 4.8, image: 'images/snacks-4.png', category: 'Snacks & Bakery' }
                ],
                beverages: [
                    { id: 820, name: 'Premium Soft Drinks Collection', price: 12.99, rating: 4.9, image: 'images/beverage-1.jpg', category: 'Beverages' },
                    { id: 821, name: 'Fanta & Sprite Variety Pack', price: 6.99, rating: 4.8, image: 'images/beverage-2.jpg', category: 'Beverages' },
                    { id: 822, name: 'Classic Soda Bottles', price: 8.49, rating: 4.9, image: 'images/beverage-3.jpg', category: 'Beverages' },
                    { id: 823, name: 'Shezan Mango Drink', price: 2.99, rating: 4.8, image: 'images/beverage-4.jpg', category: 'Beverages' },
                    { id: 830, name: 'Drink cans 24x330ml', price: 9.99, rating: 4.9, image: 'images/beverage-2.jpg', category: 'Beverages', description: 'Pepsi, Coke, Fanta, Dr Pepper' }
                ],
                householdCleaning: [
                    { id: 901, name: 'Ariel Washing Powder', price: 5.99, rating: 4.8, image: 'images/laundry-detergent.png', category: 'Household' },
                    { id: 903, name: 'Lemon Dishwashing Liquid', price: 3.49, rating: 4.8, image: 'images/dish-soap.png', category: 'Household' },
                    { id: 906, name: 'Glass Cleaner Spray', price: 3.99, rating: 4.7, image: 'images/multi-surface-cleaner.png', category: 'Household' },
                    { id: 920, name: 'Toilet tissue 40 roll', price: 10.00, rating: 4.8, image: 'images/toilet-roll.jpg', category: 'Household' }
                ],
                personalCare: [
                    { id: 1010, name: 'SIRONA Personal Care Kit', price: 12.99, rating: 4.9, image: 'images/personal-care-1.jpg', category: 'Personal Care' },
                    { id: 1011, name: 'Dove Fresh Touch Collection', price: 8.99, rating: 4.8, image: 'images/personal-care-2.jpg', category: 'Personal Care' },
                    { id: 1012, name: 'Premium Skincare Gift Set', price: 15.49, rating: 4.9, image: 'images/personal-care-3.jpg', category: 'Personal Care' },
                    { id: 1009, name: 'Body Spray Deodorant', price: 3.99, rating: 4.7, image: 'images/velvet-rose.png', category: 'Personal Care' }
                ],
                pakistaniProducts: [
                    { id: 1101, name: 'Shan Biryani Masala', price: 1.99, rating: 5.0, image: 'images/national-biryani.jpg', category: 'Pakistani' },
                    { id: 1102, name: 'Tapal Danedar Tea', price: 4.99, rating: 4.9, image: 'images/green-tea-bags.jpg', category: 'Pakistani' },
                    { id: 1103, name: 'National Pickle Mix', price: 2.49, rating: 4.8, image: 'images/national-karahi.jpg', category: 'Pakistani' },
                    { id: 1104, name: 'Laziza Kheer Mix', price: 1.50, rating: 4.9, image: 'images/snacks-3.jpg', category: 'Pakistani' }
                ],
                indianProducts: [
                    { id: 1201, name: 'MDH Curry Powder', price: 2.99, rating: 4.9, image: 'images/pile-of-coffee-beans.png', category: 'Indian' },
                    { id: 1202, name: 'Tata Tea Gold', price: 5.99, rating: 4.8, image: 'images/green-tea-bags.jpg', category: 'Indian' },
                    { id: 1203, name: 'Haldirams Bhujia', price: 3.49, rating: 4.9, image: 'images/snacks-1.jpg', category: 'Indian' },
                    { id: 1204, name: 'Ghee Pure Butter', price: 9.99, rating: 5.0, image: 'images/dairy-1.jpg', category: 'Indian' }
                ],
                africanProducts: [
                    { id: 1301, name: 'Jollof Rice Spice', price: 3.99, rating: 4.9, image: 'images/masala-box.jpg', category: 'African' },
                    { id: 1302, name: 'Yam Flour (Poundo)', price: 8.99, rating: 4.8, image: 'images/whole-wheat-flour.png', category: 'African' },
                    { id: 1303, name: 'Palm Oil 1L', price: 6.99, rating: 4.7, image: 'images/grocery-oil-1.jpg', category: 'African' },
                    { id: 1304, name: 'Plantain Chips', price: 2.99, rating: 4.9, image: 'images/snacks-4.png', category: 'African' }
                ],
                filipinoProducts: [
                    { id: 1401, name: 'Datu Puti Vinegar', price: 2.49, rating: 4.9, image: 'images/beverage-1.jpg', category: 'Filipino' },
                    { id: 1402, name: 'Silver Swan Soy Sauce', price: 2.49, rating: 4.8, image: 'images/beverage-2.jpg', category: 'Filipino' },
                    { id: 1403, name: 'Dried Mangoes 100g', price: 4.99, rating: 5.0, image: 'images/snacks-2.jpg', category: 'Filipino' },
                    { id: 1404, name: 'Pancit Canton', price: 1.25, rating: 4.8, image: 'images/packaged-1.jpg', category: 'Filipino' }
                ]
            };

            // Flatten for slider/top products logic
            const allProducts = Object.values(fullCatalog).flat();

            // Force save this massive new catalog to localStorage
            // content-visibility: auto to prevent blocking verify
            try {
                console.log('Rhyl: Initializing massive catalog expansion...');
                localStorage.setItem('products', JSON.stringify(allProducts));
            } catch (e) {
                console.error('Rhyl: LocalStorage save failed', e);
            }

            // Populate State
            this.freshProduce = fullCatalog.freshProduce;
            this.groceryStaples = fullCatalog.groceryStaples;
            this.spicesMasala = fullCatalog.spicesMasala;
            this.dairyProducts = fullCatalog.dairyProducts;
            this.meatFrozen = fullCatalog.meatFrozen;
            this.packagedCanned = fullCatalog.packagedCanned;
            this.snacksBakery = fullCatalog.snacksBakery;
            this.beverages = fullCatalog.beverages;
            this.householdCleaning = fullCatalog.householdCleaning;
            this.personalCare = fullCatalog.personalCare;
            this.pakistaniProducts = fullCatalog.pakistaniProducts;
            this.indianProducts = fullCatalog.indianProducts;
            this.africanProducts = fullCatalog.africanProducts;
            this.filipinoProducts = fullCatalog.filipinoProducts;
            this.babyProducts = fullCatalog.babyProducts;

            // Slider & Top Products Logic
            // Curated Premium Featured Collection
            this.sliderProducts = [
                { id: 410, name: 'Olpers Full Cream Milk', price: 1.45, rating: 4.9, description: '100% Pure UHT Milk, perfect for tea and coffee.', image: 'images/olpers-milk.png', category: 'Dairy' },
                { id: 510, name: 'Sabroso Chicken Nuggets', price: 4.25, rating: 4.9, description: 'The original crispy chicken nuggets tailored for taste.', image: 'images/sabroso-nuggets.png', category: 'Frozen' },
                { id: 810, name: 'Tapal Danedar Pouch', price: 3.85, rating: 5.0, description: 'Pakistan\'s No. 1 strong tea brand.', image: 'images/tapal-tea.png', category: 'Beverages' },
                { id: 220, name: 'Dalda Banaspati 5kg', price: 12.50, rating: 4.9, description: 'Generations of trust and taste.', image: 'images/grocery-oil-1.jpg', category: 'Grocery' },
                { id: 1001, name: 'Sunsilk Black Shine', price: 3.99, rating: 4.8, description: 'For long lasting shine and black hair.', image: 'images/shampoo.png', category: 'Personal Care' }
            ];

            this.topProducts = [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 4);

            this.updateCartCount();
            // Hero Slider Removed
            this.startFeaturedSlider();
            this.startPromoSlider();
            this.startDairySlider();
            this.startPackagedSlider();
            this.startBeverageSlider();
            // Initialize icons after Alpine renders
            setTimeout(() => {
                lucide.createIcons();
            }, 100);
        },

        startHeroSlider() {
            // Disabled
        },

        startFeaturedSlider() {
            setInterval(() => {
                this.sliderIndex = (this.sliderIndex + 1) % this.sliderProducts.length;
            }, 2500);
        },

        startPromoSlider() {
            setInterval(() => {
                this.promoBannerIndex = (this.promoBannerIndex + 1) % this.promoBannerSlides.length;
            }, 3500);
        },

        startDairySlider() {
            setInterval(() => {
                this.dairyBannerIndex = (this.dairyBannerIndex + 1) % this.dairyBannerSlides.length;
            }, 4000); // Slightly different timing
        },

        startPackagedSlider() {
            setInterval(() => {
                this.packagedBannerIndex = (this.packagedBannerIndex + 1) % this.packagedBannerSlides.length;
            }, 5000); // Slowest rotation
        },

        startBeverageSlider() {
            setInterval(() => {
                this.beverageBannerIndex = (this.beverageBannerIndex + 1) % this.beverageBannerSlides.length;
            }, 3000); // Fast rotation for energy
        },

        // Cart & Wishlist Logic (Preserved)
        addToCart(product) {
            const existing = this.cart.find(item => item.id === product.id);
            if (existing) {
                existing.quantity++;
            } else {
                this.cart.push({ ...product, quantity: 1 });
            }
            this.updateCartCount();
            this.showNotification('Added to cart');
        },
        updateCartCount() {
            this.cartCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            this.cartTotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },
        toggleWishlist(product) {
            const index = this.wishlist.findIndex(item => item.id === product.id);
            if (index > -1) {
                this.wishlist.splice(index, 1);
                this.showNotification('Removed from wishlist');
            } else {
                this.wishlist.push(product);
                this.showNotification('Added to wishlist');
            }
            this.wishlistCount = this.wishlist.length;
            localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
        },
        logout() {
            this.isLoggedIn = false;
            this.isAdminLoggedIn = false;
            this.user = { name: 'Guest' };
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('adminLoggedIn');
            window.location.href = 'index.html';
        },
        showNotification(message) {
            const el = document.createElement('div');
            el.className = 'fixed bottom-4 right-4 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-xl z-50 animate-fade-in-up';
            el.textContent = message;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 3000);
        }
    }));
});

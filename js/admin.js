// --- DATA MANAGEMENT ---
function getProducts() {
    const p = localStorage.getItem('products');
    return p ? JSON.parse(p) : [];
}

function getOrders() {
    const o = localStorage.getItem('orders');
    return o ? JSON.parse(o) : [
        { id: 1001, customer: "John Doe", amount: 125.50, status: "Delivered", date: "2023-10-25" },
        { id: 1002, customer: "Alice Smith", amount: 45.00, status: "Shipped", date: "2023-10-26" },
        { id: 1003, customer: "Bob Wilson", amount: 299.99, status: "Pending", date: "2023-10-27" }
    ];
}

function getCustomers() {
    return JSON.parse(localStorage.getItem('users')) || [
        { name: "John Doe", orders: 15, spend: 1250.00, status: "VIP" },
        { name: "Alice Smith", orders: 2, spend: 85.50, status: "Active" },
        { name: "Bob Wilson", orders: 8, spend: 450.00, status: "Active" },
        { name: "Charlie Brown", orders: 0, spend: 0.00, status: "New" }
    ];
}

function getCategories() {
    return JSON.parse(localStorage.getItem('categories')) || [
        { id: 1, name: "Produce", icon: "fas fa-apple-alt", priority: 1, visible: true },
        { id: 2, name: "Bakery", icon: "fas fa-bread-slice", priority: 2, visible: true },
        { id: 3, name: "Grocery", icon: "fas fa-shopping-basket", priority: 3, visible: true },
        { id: 4, name: "Beverages", icon: "fas fa-coffee", priority: 4, visible: true },
        { id: 5, name: "Beauty", icon: "fas fa-magic", priority: 5, visible: true }
    ];
}

// --- AUTH & INITIALIZATION ---
const loginOverlay = document.getElementById('login-overlay');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('login-form');

if (localStorage.getItem('adminLoggedIn') === 'true') {
    showAdminPanel();
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    if (u === 'admin' && p === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
    } else {
        alert('Invalid credentials!');
    }
});

function showAdminPanel() {
    loginOverlay.style.display = 'none';
    adminPanel.style.display = 'flex';
    initDashboard();
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    location.reload();
}

// --- NAVIGATION ---
window.switchTab = function (tabId) {
    document.querySelectorAll('.admin-tab').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));

    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) targetTab.style.display = 'block';

    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        if (item.getAttribute('onclick').includes(`'${tabId}'`)) {
            item.classList.add('active');
        }
    });

    document.getElementById('page-title').innerText = tabId.charAt(0).toUpperCase() + tabId.slice(1) + ' Overview';

    if (tabId === 'dashboard') initDashboard();
    if (tabId === 'products') renderAdminProducts();
    if (tabId === 'categories') renderAdminCategories();
    if (tabId === 'orders') renderAdminOrders();
    if (tabId === 'inventory') renderAdminInventory();
    if (tabId === 'customers') renderAdminCustomers();
    if (tabId === 'discounts') renderAdminDiscounts();
    if (tabId === 'analytics') renderAdminAnalytics();
    if (tabId === 'roles') renderAdminRoles();
    if (tabId === 'cms') renderAdminCMS();
    if (tabId === 'settings') renderAdminSettings();
};

// --- CORE MODULES ---
function initDashboard() {
    updateStats();
    renderRecentOrders();
    renderLowStock();
    initSalesChart();
}

function updateStats() {
    const products = getProducts();
    const orders = getOrders();
    const customers = getCustomers();

    document.getElementById('stat-products').innerText = products.length;
    document.getElementById('stat-orders').innerText = orders.length;
    document.getElementById('stat-customers').innerText = customers.length;

    const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);
    document.getElementById('stat-sales').innerText = `£${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

function renderRecentOrders() {
    const list = document.getElementById('recent-orders-list');
    const orders = getOrders().slice(0, 5);
    list.innerHTML = orders.map(o => `
        <tr>
            <td>#${o.id}</td>
            <td>${o.customer}</td>
            <td>£${o.amount.toFixed(2)}</td>
            <td><span class="status-badge badge-${o.status.toLowerCase()}">${o.status}</span></td>
        </tr>
    `).join('');
}

function renderLowStock() {
    const table = document.getElementById('low-stock-table');
    const lowStock = getProducts().filter(p => !p.stock || p.stock < 10);

    if (lowStock.length === 0) {
        table.innerHTML = '<tr><td colspan="3" style="text-align:center;">All products are well stocked.</td></tr>';
        return;
    }

    table.innerHTML = lowStock.map(p => `
        <tr>
            <td>${p.name}</td>
            <td style="color:var(--danger); font-weight:700;">${p.stock || 0} left</td>
            <td><button class="btn btn-outline btn-sm" onclick="switchTab('inventory')">Refill</button></td>
        </tr>
    `).join('');
}

function initSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    if (window.myChart) window.myChart.destroy();

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Sales Revenue (£)',
                data: [1200, 1900, 1500, 2500, 2200, 3100, 2800],
                borderColor: '#0d9488',
                backgroundColor: 'rgba(13, 148, 136, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// --- IMAGE UPLOAD / PREVIEW STATE ---
let tempImageDataUrl = null; // stores data URL of chosen file for preview and saving


// --- PRODUCT MANAGEMENT ---
window.renderAdminProducts = function () {
    const list = document.getElementById('admin-product-list');
    const products = getProducts();
    list.innerHTML = products.map(p => `
        <tr>
            <td><img src="${p.image}" class="table-img" style="width:50px; height:50px; object-fit:cover; border-radius:8px;"></td>
            <td><strong>${p.name}</strong><br><small>${p.category}</small></td>
            <td>£${p.price.toFixed(2)}</td>
            <td>${p.stock || 0}</td>
            <td><span class="status-badge ${p.enabled !== false ? 'badge-success' : 'badge-danger'}">${p.enabled !== false ? 'Active' : 'Hidden'}</span></td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-outline btn-sm" onclick="deleteProduct(${p.id})" style="color:var(--danger);"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
};

window.openAddProductModal = function () {
    document.getElementById('modal-title').innerText = 'Add New Product';
    document.getElementById('product-form').reset();
    // clear any previously chosen image
    tempImageDataUrl = null;
    const fileInput = document.getElementById('p-image-file'); if (fileInput) fileInput.value = '';
    document.getElementById('live-preview-container').innerHTML = '<div class="preview-placeholder">Enter product details to see preview</div>';
    document.getElementById('product-modal').style.display = 'block';
};

window.closeModal = function (id) {
    document.getElementById(id).style.display = 'none';
};

window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

const productForm = document.getElementById('product-form');
if (productForm) {
    ['input', 'textarea', 'select'].forEach(evt => {
        productForm.addEventListener(evt, updateLivePreview);
    });
    // wire file input change to read file and update preview
    const fileInput = document.getElementById('p-image-file');
    if (fileInput) {
        fileInput.addEventListener('change', function (e) {
            const file = e.target.files && e.target.files[0];
            if (!file) { tempImageDataUrl = null; updateLivePreview(); return; }
            const reader = new FileReader();
            reader.onload = function () { tempImageDataUrl = reader.result; updateLivePreview(); };
            reader.readAsDataURL(file);
        });
    }

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('p-name').value;
        const price = parseFloat(document.getElementById('p-price').value);
        const category = document.getElementById('p-category').value;
        // prefer uploaded image data URL; otherwise fall back to any image field
        const imageData = tempImageDataUrl || (document.getElementById('p-images') ? document.getElementById('p-images').value.split(',').map(s => s.trim())[0] : null);
        const discount = parseInt(document.getElementById('p-discount').value) || 0;
        const stock = parseInt(document.getElementById('p-stock').value) || 0;
        const featured = document.getElementById('p-featured').checked;
        const enabled = document.getElementById('p-enabled').checked;

        const products = getProducts();
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

        const newProduct = {
            id: newId,
            name,
            price,
            category,
            image: imageData || 'https://via.placeholder.com/300x310?text=No+Image',
            images: imageData ? [imageData] : (document.getElementById('p-images') ? document.getElementById('p-images').value.split(',').map(s => s.trim()) : []),
            discount,
            stock,
            featured,
            enabled,
            rating: 5.0,
            badge: discount > 0 ? `-${discount}%` : (featured ? 'Featured' : '')
        };

        products.unshift(newProduct);
        localStorage.setItem('products', JSON.stringify(products));

        closeModal('product-modal');
        renderAdminProducts();
        updateStats();
        alert('Product Saved Successfully!');
    });
}

function updateLivePreview() {
    const name = document.getElementById('p-name').value || 'Product Title';
    const price = parseFloat(document.getElementById('p-price').value) || 0;
    const discount = parseInt(document.getElementById('p-discount').value) || 0;
    // prefer uploaded image data URL
    const images = tempImageDataUrl ? [tempImageDataUrl] : (document.getElementById('p-images') ? document.getElementById('p-images').value.split(',').map(s => s.trim()) : []);
    const featured = document.getElementById('p-featured').checked;
    const category = document.getElementById('p-category').value;

    const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;
    const primaryImage = images[0] || 'https://via.placeholder.com/300x310?text=No+Image';

    const container = document.getElementById('live-preview-container');
    container.innerHTML = `
        <div class="product-card" style="width: 280px; margin: 0; pointer-events: none;">
            ${discount > 0 ? `<div class="product-badge">-${discount}%</div>` : (featured ? `<div class="product-badge" style="background:#0d9488">Featured</div>` : '')}
            <div class="product-img-container" style="height: 200px;">
                <img src="${primaryImage}" class="product-img">
            </div>
            <div class="product-details" style="padding: 15px;">
                <span class="product-category">${category}</span>
                <h3 class="product-name" style="font-size: 1rem;">${name}</h3>
                <div class="product-rating" style="margin-bottom: 10px;">
                    <i class="fas fa-star" style="color:#f59e0b"></i>
                    <i class="fas fa-star" style="color:#f59e0b"></i>
                    <i class="fas fa-star" style="color:#f59e0b"></i>
                    <i class="fas fa-star" style="color:#f59e0b"></i>
                    <i class="fas fa-star" style="color:#f59e0b"></i>
                </div>
                <div class="product-bottom">
                    <span class="product-price">£${finalPrice.toFixed(2)}</span>
                    <button class="add-btn" type="button"><i class="fas fa-plus"></i></button>
                </div>
            </div>
        </div>
    `;
}

window.deleteProduct = function (id) {
    if (confirm('Are you sure you want to delete this product?')) {
        const products = getProducts();
        const filtered = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(filtered));
        renderAdminProducts();
        updateStats();
    }
};

window.editProduct = function (id) {
    const product = getProducts().find(p => p.id === id);
    if (!product) return;

    openAddProductModal();
    document.getElementById('modal-title').innerText = 'Edit Product';
    document.getElementById('p-name').value = product.name;
    document.getElementById('p-price').value = product.price;
    document.getElementById('p-category').value = product.category;
    // set image preview from existing product image (can be URL or dataURL)
    tempImageDataUrl = product.image || (product.images && product.images[0]) || null;
    const fileInput = document.getElementById('p-image-file'); if (fileInput) fileInput.value = '';
    document.getElementById('p-discount').value = product.discount || 0;
    document.getElementById('p-stock').value = product.stock || 0;
    document.getElementById('p-featured').checked = product.featured || false;
    document.getElementById('p-enabled').checked = product.enabled !== false;
    updateLivePreview();
};

// --- CATEGORY MANAGEMENT ---
window.renderAdminCategories = function () {
    const list = document.getElementById('admin-category-list');
    const categories = getCategories();
    list.innerHTML = categories.map(c => `
        <tr>
            <td><i class="${c.icon}" style="font-size: 1.2rem; color: #0d9488;"></i></td>
            <td><strong>${c.name}</strong></td>
            <td>${c.priority}</td>
            <td><span class="status-badge ${c.visible ? 'badge-success' : 'badge-danger'}">${c.visible ? 'Visible' : 'Hidden'}</span></td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="alert('Editing Category')"><i class="fas fa-edit"></i></button>
            </td>
        </tr>
    `).join('');
};

// --- ORDER MANAGEMENT ---
window.renderAdminOrders = function (filter = 'All') {
    const list = document.getElementById('admin-order-list');
    let orders = getOrders();

    if (filter !== 'All') {
        orders = orders.filter(o => o.status === filter);
    }

    list.innerHTML = orders.map(o => `
        <tr>
            <td>#${o.id}</td>
            <td>${o.date}</td>
            <td>${o.customer}</td>
            <td>£${o.amount.toFixed(2)}</td>
            <td>
                <select class="form-control" style="width:130px; font-size:0.8rem; padding:4px 8px;" onchange="updateOrderStatus(${o.id}, this.value)">
                    <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Confirmed" ${o.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="viewOrderDetails(${o.id})"><i class="fas fa-eye"></i></button>
                <button class="btn btn-outline btn-sm" onclick="printInvoice(${o.id})"><i class="fas fa-print"></i></button>
            </td>
        </tr>
    `).join('');
};

window.filterOrders = function (status) {
    renderAdminOrders(status);
};

window.updateOrderStatus = function (id, newStatus) {
    let orders = getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
        orders[index].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        updateStats();
    }
};

window.printInvoice = function (id) {
    alert(`Generating invoice for Order #${id}... (Simulation)`);
};

window.viewOrderDetails = function (id) {
    const order = getOrders().find(o => o.id === id);
    alert(`Order Details for #${id}\nCustomer: ${order.customer}\nAmount: £${order.amount}\nStatus: ${order.status}`);
};

// --- INVENTORY MANAGEMENT ---
window.renderAdminInventory = function () {
    const list = document.getElementById('admin-inventory-list');
    const products = getProducts();
    list.innerHTML = products.map(p => {
        const stock = p.stock || 0;
        const statusClass = stock < 10 ? 'badge-danger' : (stock < 20 ? 'badge-warning' : 'badge-success');
        const statusText = stock < 10 ? 'Low Stock' : (stock < 20 ? 'Medium' : 'In Stock');

        return `
            <tr>
                <td><strong>${p.name}</strong><br><small>${p.category}</small></td>
                <td>${stock} Units</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="refillStock(${p.id})"><i class="fas fa-plus"></i> Refill</button>
                </td>
            </tr>
        `;
    }).join('');
};

window.refillStock = function (id) {
    let products = getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index].stock = (products[index].stock || 0) + 50;
        localStorage.setItem('products', JSON.stringify(products));
        renderAdminInventory();
        updateStats();
        renderLowStock();
    }
};

window.bulkStockUpdate = function () {
    if (confirm('Restock all low-stock items by 50 units?')) {
        let products = getProducts();
        products.forEach(p => {
            if (!p.stock || p.stock < 10) {
                p.stock = (p.stock || 0) + 50;
            }
        });
        localStorage.setItem('products', JSON.stringify(products));
        renderAdminInventory();
        updateStats();
        renderLowStock();
    }
};

// --- CUSTOMER MANAGEMENT ---
window.renderAdminCustomers = function () {
    const list = document.getElementById('admin-customer-list');
    const customers = getCustomers();

    list.innerHTML = customers.map(c => `
        <tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.orders}</td>
            <td>£${c.spend.toFixed(2)}</td>
            <td><span class="status-badge ${c.status === 'VIP' ? 'badge-success' : 'badge-warning'}">${c.status}</span></td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="alert('Viewing history for ${c.name}')"><i class="fas fa-history"></i></button>
                <button class="btn btn-outline btn-sm" onclick="alert('User settings for ${c.name}')" style="color:#0d9488;"><i class="fas fa-user-cog"></i></button>
            </td>
        </tr>
    `).join('');
};

// --- DISCOUNT MANAGEMENT ---
window.renderAdminDiscounts = function () {
    const list = document.getElementById('admin-coupon-list');
    const coupons = JSON.parse(localStorage.getItem('coupons')) || [
        { code: "SAVE10", type: "Percentage", value: "10%", status: "Active" },
        { code: "FREE50", type: "Fixed Amount", value: "£50.00", status: "Active" },
        { code: "WELCOME", type: "Percentage", value: "20%", status: "Expired" }
    ];

    list.innerHTML = coupons.map(c => `
        <tr>
            <td><strong>${c.code}</strong></td>
            <td>${c.type}</td>
            <td>${c.value}</td>
            <td><span class="status-badge ${c.status === 'Active' ? 'badge-success' : 'badge-danger'}">${c.status}</span></td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="alert('Editing Coupon ${c.code}')"><i class="fas fa-edit"></i></button>
            </td>
        </tr>
    `).join('');
};

// --- ANALYTICS MODULE ---
window.renderAdminAnalytics = function () {
    renderBestSellers();
    initRevenueChart();
    initCategoryChart();
};

function renderBestSellers() {
    const list = document.getElementById('best-sellers-list');
    const products = getProducts().slice(0, 5); // Mock best sellers
    list.innerHTML = products.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${Math.floor(Math.random() * 50) + 10}</td>
        </tr>
    `).join('');
}

function initRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Revenue (£)',
                data: [5000, 7500, 6200, 9100, 8400, 10500],
                backgroundColor: '#0d9488'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function initCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Electronics', 'Fashion', 'Grocery', 'Home'],
            datasets: [{
                data: [40, 25, 20, 15],
                backgroundColor: ['#0d9488', '#0f766e', '#14b8a6', '#5eead4']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// --- OPTIONAL MODULES (Skeletal) ---
window.renderAdminRoles = () => { alert('Roles module initialized'); };
window.renderAdminCMS = () => { alert('CMS module initialized'); };
window.renderAdminSettings = () => { alert('Settings module initialized'); };

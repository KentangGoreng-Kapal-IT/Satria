// State & Local Storage Management
const STORAGE_KEY_PRODUCTS = 'TOKOHIJAU_PRODUCTS';
const STORAGE_KEY_ADDRESS = 'TOKOHIJAU_ADDRESS';
const STORAGE_KEY_ABOUT = 'TOKOHIJAU_ABOUT';
const STORAGE_KEY_PROFILE = 'TOKOHIJAU_PROFILE';
const STORAGE_KEY_WA = 'TOKOHIJAU_WA';

// Defaults
const defaultProducts = [
    {
        id: 1,
        name: "Sepatu Sneakers Premium",
        img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
        link: "https://shopee.co.id/"
    },
    {
        id: 2,
        name: "Jam Tangan Minimalis",
        img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
        link: "https://tokopedia.com/"
    },
    {
        id: 3,
        name: "Tas Ransel Kanvas",
        img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
        link: "https://tiktok.com/"
    }
];

const defaultAddress = "Kp. Ciburial RT/RW 004/008 Ds.Dano Kec.Leles Kab.Garut";
const defaultAbout = "Kami adalah penyedia layanan dan produk unggulan yang berfokus pada kepuasan pelanggan. Dengan dedikasi tinggi, kami selalu berusaha menghadirkan inovasi dan kemudahan berbelanja bagi Anda.";
const defaultProfile = { name: "Pemilik Toko", desc: "Seorang wirausahawan yang berkomitmen untuk memberikan nilai tambah kepada pelanggan. Berpengalaman dalam kurasi produk dan layanan prima." };
const defaultWa = "+62 812-3456-7890";

let products = JSON.parse(localStorage.getItem(STORAGE_KEY_PRODUCTS)) || defaultProducts;
let storeAddress = localStorage.getItem(STORAGE_KEY_ADDRESS) || defaultAddress;
let aboutText = localStorage.getItem(STORAGE_KEY_ABOUT) || defaultAbout;
let profileData = JSON.parse(localStorage.getItem(STORAGE_KEY_PROFILE)) || defaultProfile;
let waNumber = localStorage.getItem(STORAGE_KEY_WA) || defaultWa;

// DOM Elements
const productGrid = document.getElementById('productGrid');
const storeAddressDisplay = document.getElementById('storeAddressDisplay');
const tentangTextEl = document.getElementById('tentangText');
const profileNameEl = document.getElementById('profileName');
const profileDescEl = document.getElementById('profileDesc');
const whatsappDisplayEl = document.getElementById('whatsappDisplay');

const loginBtnNav = document.getElementById('loginBtnNav');
const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const loginForm = document.getElementById('loginForm');
const adminPanel = document.getElementById('adminPanel');
const logoutBtn = document.getElementById('logoutBtn');
const addProductForm = document.getElementById('addProductForm');

const orderModal = document.getElementById('orderModal');
const closeOrderModal = document.getElementById('closeOrderModal');
const modalProductName = document.getElementById('modalProductName');
const marketplaceLinks = document.getElementById('marketplaceLinks');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Edit Modals Elements
const editModal = document.getElementById('editModal');
const closeEditModal = document.getElementById('closeEditModal');
const editForm = document.getElementById('editForm');
const editModalTitle = document.getElementById('editModalTitle');
const editType = document.getElementById('editType');
const editNameGroup = document.getElementById('editNameGroup');
const editName = document.getElementById('editName');
const editValueLabel = document.getElementById('editValueLabel');
const editValue = document.getElementById('editValue');

const editProductModal = document.getElementById('editProductModal');
const closeEditProductModal = document.getElementById('closeEditProductModal');
const editProductForm = document.getElementById('editProductForm');
const editProdId = document.getElementById('editProdId');
const editProdName = document.getElementById('editProdName');
const editProdImg = document.getElementById('editProdImg');
const editProdLink = document.getElementById('editProdLink');

// Init
function init() {
    renderData();
    checkLoginState();
}

function renderData() {
    tentangTextEl.textContent = aboutText;
    profileNameEl.textContent = profileData.name;
    profileDescEl.textContent = profileData.desc;
    whatsappDisplayEl.textContent = waNumber;
    storeAddressDisplay.textContent = storeAddress;
}

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Render Products
function renderProducts() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    productGrid.innerHTML = '';
    products.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.position = 'relative';
        
        let adminBtns = '';
        if (isLoggedIn) {
            adminBtns = `
                <div class="admin-actions admin-only">
                    <button class="btn btn-sm btn-secondary" onclick="openEditProductModal(${prod.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${prod.id})"><i class="fas fa-trash"></i></button>
                </div>
            `;
        }
        
        card.innerHTML = `
            ${adminBtns}
            <img src="${prod.img}" alt="${prod.name}" class="product-img">
            <div class="product-info">
                <h3>${prod.name}</h3>
                <button class="btn btn-primary" onclick="openOrderModal('${prod.name}', '${prod.link}')">Pesan Sekarang</button>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// Order Modal Logic
window.openOrderModal = function(name, link) {
    modalProductName.textContent = name;
    marketplaceLinks.innerHTML = '';
    if(link.toLowerCase().includes('shopee')) {
        marketplaceLinks.innerHTML += `<a href="${link}" target="_blank" class="marketplace-btn btn-shopee"><i class="fas fa-shopping-bag"></i> Beli di Shopee</a>`;
    } else if(link.toLowerCase().includes('tokopedia')) {
        marketplaceLinks.innerHTML += `<a href="${link}" target="_blank" class="marketplace-btn btn-tokopedia"><i class="fas fa-store"></i> Beli di Tokopedia</a>`;
    } else if(link.toLowerCase().includes('tiktok')) {
        marketplaceLinks.innerHTML += `<a href="${link}" target="_blank" class="marketplace-btn btn-tiktok"><i class="fab fa-tiktok"></i> Beli di TikTok Shop</a>`;
    } else {
        marketplaceLinks.innerHTML += `<a href="${link}" target="_blank" class="marketplace-btn btn-primary"><i class="fas fa-shopping-cart"></i> Menuju Toko</a>`;
    }
    orderModal.style.display = 'flex';
}

closeOrderModal.addEventListener('click', () => {
    orderModal.style.display = 'none';
});

// Login Logic
loginBtnNav.addEventListener('click', (e) => {
    e.preventDefault();
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        adminPanel.classList.toggle('hidden');
    } else {
        loginModal.style.display = 'flex';
    }
});

closeLoginModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    
    if (user === 'admin' && pass === 'admin123') {
        sessionStorage.setItem('isLoggedIn', 'true');
        loginModal.style.display = 'none';
        alert('Login Berhasil!');
        checkLoginState();
    } else {
        alert('Username atau Password salah!');
    }
});

logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('isLoggedIn');
    checkLoginState();
});

function checkLoginState() {
    const adminElements = document.querySelectorAll('.admin-only');
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        loginBtnNav.textContent = 'Admin Panel';
        adminPanel.classList.remove('hidden');
        adminElements.forEach(el => el.classList.remove('hidden'));
    } else {
        loginBtnNav.textContent = 'Login';
        adminPanel.classList.add('hidden');
        adminElements.forEach(el => el.classList.add('hidden'));
    }
    renderProducts();
}

// Admin Logic - Add Product
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('newProdName').value;
    const img = document.getElementById('newProdImg').value;
    const link = document.getElementById('newProdLink').value;
    
    products.push({ id: Date.now(), name, img, link });
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    renderProducts();
    addProductForm.reset();
    alert('Produk berhasil ditambahkan!');
});

// Admin Logic - Edit & Delete Product
window.deleteProduct = function(id) {
    if(confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
        renderProducts();
    }
}

window.openEditProductModal = function(id) {
    const prod = products.find(p => p.id === id);
    if(prod) {
        editProdId.value = prod.id;
        editProdName.value = prod.name;
        editProdImg.value = prod.img;
        editProdLink.value = prod.link;
        editProductModal.style.display = 'flex';
    }
}

closeEditProductModal.addEventListener('click', () => {
    editProductModal.style.display = 'none';
});

editProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(editProdId.value);
    const prodIndex = products.findIndex(p => p.id === id);
    if(prodIndex !== -1) {
        products[prodIndex] = {
            id: id,
            name: editProdName.value,
            img: editProdImg.value,
            link: editProdLink.value
        };
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
        renderProducts();
        editProductModal.style.display = 'none';
        alert('Produk berhasil diubah!');
    }
});

// Admin Logic - General Edit/Delete
window.openEditModal = function(type) {
    editType.value = type;
    editNameGroup.style.display = 'none';
    editName.required = false;
    
    if (type === 'tentang') {
        editModalTitle.innerHTML = 'Edit <span class="highlight">Tentang Kami</span>';
        editValueLabel.textContent = 'Deskripsi';
        editValue.value = aboutText;
    } else if (type === 'profile') {
        editModalTitle.innerHTML = 'Edit <span class="highlight">Profile</span>';
        editNameGroup.style.display = 'block';
        editName.required = true;
        editName.value = profileData.name;
        editValueLabel.textContent = 'Deskripsi';
        editValue.value = profileData.desc;
    } else if (type === 'whatsapp') {
        editModalTitle.innerHTML = 'Edit <span class="highlight">WhatsApp</span>';
        editValueLabel.textContent = 'Nomor WhatsApp';
        editValue.value = waNumber;
    } else if (type === 'alamat') {
        editModalTitle.innerHTML = 'Edit <span class="highlight">Alamat</span>';
        editValueLabel.textContent = 'Alamat Lengkap';
        editValue.value = storeAddress;
    }
    editModal.style.display = 'flex';
}

closeEditModal.addEventListener('click', () => {
    editModal.style.display = 'none';
});

editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = editType.value;
    
    if (type === 'tentang') {
        aboutText = editValue.value;
        localStorage.setItem(STORAGE_KEY_ABOUT, aboutText);
    } else if (type === 'profile') {
        profileData = { name: editName.value, desc: editValue.value };
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profileData));
    } else if (type === 'whatsapp') {
        waNumber = editValue.value;
        localStorage.setItem(STORAGE_KEY_WA, waNumber);
    } else if (type === 'alamat') {
        storeAddress = editValue.value;
        localStorage.setItem(STORAGE_KEY_ADDRESS, storeAddress);
    }
    
    renderData();
    editModal.style.display = 'none';
    alert('Data berhasil diubah!');
});

window.deleteData = function(type) {
    if(!confirm('Anda yakin ingin mengosongkan data ini?')) return;
    
    if (type === 'tentang') {
        aboutText = '-';
        localStorage.setItem(STORAGE_KEY_ABOUT, aboutText);
    } else if (type === 'profile') {
        profileData = { name: '-', desc: '-' };
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profileData));
    } else if (type === 'whatsapp') {
        waNumber = '-';
        localStorage.setItem(STORAGE_KEY_WA, waNumber);
    } else if (type === 'alamat') {
        storeAddress = '-';
        localStorage.setItem(STORAGE_KEY_ADDRESS, storeAddress);
    }
    renderData();
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === orderModal) orderModal.style.display = 'none';
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === editModal) editModal.style.display = 'none';
    if (e.target === editProductModal) editProductModal.style.display = 'none';
});

// Run Init
init();
// --- 1. FITUR GANTI FOTO ---
function gantiFoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const urlFoto = e.target.result;
            // Update tampilan
            document.getElementById('fotoProfile').src = urlFoto;
            document.getElementById('fotoProfile').style.display = 'block';
            document.getElementById('ikonDefault').style.display = 'none';
            // Simpan ke localStorage
            localStorage.setItem('profile_img', urlFoto);
        };
        reader.readAsDataURL(file);
    }
}

// --- 2. FITUR EDIT PROFIL (Nama & Deskripsi) ---
function openEditModal(type) {
    if(type === 'profile') {
        const namaLama = document.getElementById('profileName').innerText;
        const descLama = document.getElementById('profileDesc').innerText;
        
        const namaBaru = prompt("Edit Nama Pemilik:", namaLama);
        const descBaru = prompt("Edit Deskripsi:", descLama);
        
        if (namaBaru) document.getElementById('profileName').innerText = namaBaru;
        if (descBaru) document.getElementById('profileDesc').innerText = descBaru;
        
        // Simpan ke localStorage
        localStorage.setItem('profile_name', namaBaru || namaLama);
        localStorage.setItem('profile_desc', descBaru || descLama);
    }
}

// --- 3. FITUR HAPUS DATA ---
function deleteData(type) {
    if (confirm("Apakah Anda yakin ingin menghapus data " + type + "?")) {
        if (type === 'profile') {
            // Reset tampilan ke default
            document.getElementById('profileName').innerText = "Nama Pemilik";
            document.getElementById('profileDesc').innerText = "Deskripsi profil...";
            document.getElementById('fotoProfile').style.display = 'none';
            document.getElementById('ikonDefault').style.display = 'block';
            
            // Hapus dari localStorage
            localStorage.removeItem('profile_name');
            localStorage.removeItem('profile_desc');
            localStorage.removeItem('profile_img');
        }
    }
}

// --- LOAD DATA SAAT REFRESH ---
window.onload = function() {
    const savedName = localStorage.getItem('profile_name');
    const savedDesc = localStorage.getItem('profile_desc');
    const savedImg = localStorage.getItem('profile_img');
    
    if(savedName) document.getElementById('profileName').innerText = savedName;
    if(savedDesc) document.getElementById('profileDesc').innerText = savedDesc;
    if(savedImg) {
        document.getElementById('fotoProfile').src = savedImg;
        document.getElementById('fotoProfile').style.display = 'block';
        document.getElementById('ikonDefault').style.display = 'none';
    }
};
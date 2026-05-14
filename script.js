const supabaseUrl = 'https://gietajtfcmiznxpmohbn.supabase.co';
const supabaseKey = 'sb_publishable_gDEqhZY-MzrZbWOok-J-7A_gNjHpfv3';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

let products = [];
let currentCategory = 'semua';
let currentSort = 'terbaru';
const MAX_WORDS = 50; 

window.toggleTheme = () => {
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        icon.className = 'fa-solid fa-moon text-xs sm:text-sm';
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        icon.className = 'fa-solid fa-sun text-xs sm:text-sm';
    }
};

const initThemeIcon = () => {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        if (document.documentElement.classList.contains('dark')) {
            icon.className = 'fa-solid fa-sun text-xs sm:text-sm';
        } else {
            icon.className = 'fa-solid fa-moon text-xs sm:text-sm';
        }
    }
};

window.closeAllDropdowns = (e) => {
    if (!e.target.closest('.dropdown-container')) {
        const menus = ['customSortMenu', 'formCatMenu', 'countryMenu'];
        const arrows = ['sortArrow', 'formCatArrow', 'countryArrow'];
        
        menus.forEach((id, i) => {
            const menu = document.getElementById(id);
            const arrow = document.getElementById(arrows[i]);
            if (menu && !menu.classList.contains('opacity-0')) {
                menu.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
                if (arrow) arrow.classList.remove('-rotate-180');
            }
        });
    }
};

window.toggleSortMenu = (e) => {
    e.stopPropagation();
    const menu = document.getElementById('customSortMenu');
    const arrow = document.getElementById('sortArrow');
    
    if (menu.classList.contains('opacity-0')) {
        window.closeAllDropdowns({ target: document.body });
        menu.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
        arrow.classList.add('-rotate-180');
    } else {
        menu.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
        arrow.classList.remove('-rotate-180');
    }
};

window.selectSortOption = (val, label, e) => {
    e.stopPropagation();
    currentSort = val;
    document.getElementById('sortLabel').innerText = label;
    
    const items = document.querySelectorAll('#customSortMenu .sort-item');
    items.forEach(item => {
        item.classList.remove('active');
        item.querySelector('.check-icon').classList.add('hidden');
    });
    
    const clicked = e.target.closest('.sort-item');
    clicked.classList.add('active');
    clicked.querySelector('.check-icon').classList.remove('hidden');
    
    document.getElementById('customSortMenu').classList.add('scale-95', 'opacity-0', 'pointer-events-none');
    document.getElementById('sortArrow').classList.remove('-rotate-180');
    
    applyFilters();
};

window.toggleFormCatMenu = (e) => {
    e.stopPropagation();
    const menu = document.getElementById('formCatMenu');
    const arrow = document.getElementById('formCatArrow');
    
    if (menu.classList.contains('opacity-0')) {
        window.closeAllDropdowns({ target: document.body });
        menu.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
        arrow.classList.add('-rotate-180');
    } else {
        menu.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
        arrow.classList.remove('-rotate-180');
    }
};

window.selectFormCat = (val, label, e) => {
    e.stopPropagation();
    document.getElementById('productCat').value = val;
    document.getElementById('formCatLabel').innerText = label;
    
    document.querySelectorAll('#formCatMenu .cat-item').forEach(item => item.classList.remove('active'));
    e.target.classList.add('active');
    
    document.getElementById('formCatMenu').classList.add('scale-95', 'opacity-0', 'pointer-events-none');
    document.getElementById('formCatArrow').classList.remove('-rotate-180');
};

window.toggleCountryMenu = (e) => {
    e.stopPropagation();
    const menu = document.getElementById('countryMenu');
    const arrow = document.getElementById('countryArrow');
    
    if (menu.classList.contains('opacity-0')) {
        window.closeAllDropdowns({ target: document.body });
        menu.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
        arrow.classList.add('-rotate-180');
    } else {
        menu.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
        arrow.classList.remove('-rotate-180');
    }
};

window.selectCountry = (val, label, e) => {
    e.stopPropagation();
    document.getElementById('countryCode').value = val;
    document.getElementById('countryLabel').innerText = label;
    
    document.querySelectorAll('#countryMenu .country-item').forEach(item => item.classList.remove('active'));
    e.target.classList.add('active');
    
    document.getElementById('countryMenu').classList.add('scale-95', 'opacity-0', 'pointer-events-none');
    document.getElementById('countryArrow').classList.remove('-rotate-180');
    
    const waInput = document.getElementById('sellerWA');
    if (waInput.value) window.formatInputWA(waInput);
};

const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
};

window.formatInputHarga = (element) => {
    let value = element.value.replace(/[^0-9]/g, '');
    if (value.length > 9) value = value.substring(0, 9);
    element.value = value ? new Intl.NumberFormat('id-ID').format(value) : '';
};

window.formatInputWA = (element) => {
    let cleaned = element.value.replace(/\D/g, '');
    const countryCode = document.getElementById('countryCode').value;
    if (countryCode === '62' && cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1);
    }

    let formatted = '';
    if (cleaned.length > 0) formatted += cleaned.substring(0, 3);
    if (cleaned.length > 3) formatted += '-' + cleaned.substring(3, 7);
    if (cleaned.length > 7) formatted += '-' + cleaned.substring(7, 15);
    
    element.value = formatted;

    const waError = document.getElementById('waError');
    const submitBtn = document.getElementById('submitBtn');
    
    if (cleaned.length > 0 && cleaned.length < 9) {
        waError.classList.remove('hidden');
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        waError.classList.add('hidden');
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
};

window.checkWordCount = (element) => {
    let text = element.value.trim();
    let words = text === '' ? [] : text.split(/\s+/);
    let wordCount = words.length;
    
    const display = document.getElementById('wordCountDisplay');
    display.innerText = `${wordCount}/${MAX_WORDS} kata`;

    if (wordCount > MAX_WORDS) {
        display.classList.remove('text-slate-400');
        display.classList.add('text-red-500', 'font-bold');
        element.value = words.slice(0, MAX_WORDS).join(' ');
        display.innerText = `${MAX_WORDS}/${MAX_WORDS} kata`;
    } else {
        display.classList.add('text-slate-400');
        display.classList.remove('text-red-500', 'font-bold');
    }
};

const compressImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800; 
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                } else {
                    if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                }
                canvas.width = width; canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.75));
            };
        };
        reader.onerror = (error) => reject(error);
    });
};

const fetchProducts = async () => {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = `<div class="col-span-full flex justify-center items-center py-16 text-brand dark:text-emerald-400"><i class="fa-solid fa-circle-notch animate-spin text-3xl"></i></div>`;

    const { data, error } = await supabaseClient.from('products').select('*').order('created_at', { ascending: false });

    if (error) {
        grid.innerHTML = `<div class="col-span-full text-center py-12 text-red-500 font-medium">Koneksi etalase terputus.</div>`;
        return;
    }
    products = data || [];
    applyFilters();
};

const renderProducts = (items) => {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = `<div class="col-span-full flex flex-col items-center justify-center py-16 text-slate-300 dark:text-slate-700 fade-in-up"><i class="fa-solid fa-boxes-stacked text-4xl mb-3"></i><p class="text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-500">Belum ada karya di ruang ini.</p></div>`;
        return;
    }

    items.forEach((p, index) => {
        const delay = index * 40; 
        const waText = encodeURIComponent(`Halo ${p.seller}, saya tertarik mengoleksi karya *${p.title}* (${formatRupiah(p.price)}) di Galeri Gisikdrono. Bisakah kita berdiskusi?`);
        const waLink = `https://wa.me/${p.wa}?text=${waText}`;

        let catColor = "bg-emerald-50 dark:bg-emerald-950/80 text-brand dark:text-emerald-400 border-emerald-100 dark:border-emerald-900";
        if (p.cat === "kerajinan") catColor = "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900";
        if (p.cat === "kuliner") catColor = "bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900";

        const card = `
            <div class="fade-in-up group relative bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100/80 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_12px_30px_-4px_rgba(5,150,105,0.1)] dark:hover:border-slate-700 transition-all duration-500 flex flex-col justify-between" style="animation-delay: ${delay}ms;">
                
                <div class="relative overflow-hidden rounded-[1.2rem] sm:rounded-[1.5rem] bg-slate-50 dark:bg-slate-800/50 aspect-square mb-3 sm:mb-4">
                    <img src="${p.img}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out">
                    
                    <span class="absolute top-3 left-3 border text-[9px] sm:text-[10px] font-extrabold px-3 py-1 rounded-full shadow-xs uppercase tracking-wider backdrop-blur-md ${catColor}">
                        ${p.cat}
                    </span>
                </div>

                <div class="flex-1 flex flex-col justify-between px-1">
                    <div class="w-full overflow-hidden">
                        <div class="flex items-center gap-1.5 mb-1 sm:mb-1.5">
                            <span class="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-brand dark:bg-emerald-400 shrink-0"></span>
                            <span class="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wide truncate">${p.seller}</span>
                        </div>
                        <h4 class="font-extrabold text-slate-900 dark:text-white text-sm sm:text-lg leading-snug group-hover:text-brand dark:group-hover:text-emerald-400 transition-colors line-clamp-1 sm:line-clamp-2">${p.title}</h4>
                        <p class="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs mt-1.5 line-clamp-2 leading-relaxed hidden sm:block font-normal">${p.desc}</p>
                    </div>

                    <div class="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1 sm:gap-2 min-w-0">
                        <div class="font-black text-slate-900 dark:text-white text-xs sm:text-base tracking-tight truncate max-w-[60%] sm:max-w-[65%] flex-shrink" title="${formatRupiah(p.price)}">
                            ${formatRupiah(p.price)}
                        </div>
                        
                        <a href="${waLink}" target="_blank" class="rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-brand dark:hover:bg-emerald-500 text-slate-600 dark:text-slate-200 hover:text-white dark:hover:text-white px-2.5 sm:px-4 py-2 text-[11px] sm:text-xs font-bold transition-all duration-300 flex items-center gap-1.5 active:scale-95 flex-shrink-0 group/btn">
                            <i class="fa-brands fa-whatsapp text-xs sm:text-sm text-emerald-500 dark:text-emerald-400 group-hover/btn:text-white transition-colors"></i> 
                            <span class="hidden sm:inline">Koleksi</span>
                        </a>
                    </div>
                </div>
            </div>`;
        grid.innerHTML += card;
    });
};

const applyFilters = () => {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = products.filter(p => {
        const matchQuery = p.title.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query) || p.seller.toLowerCase().includes(query);
        const matchCat = currentCategory === 'semua' || p.cat === currentCategory;
        return matchQuery && matchCat;
    });

    if (currentSort === 'termurah') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'termahal') {
        filtered.sort((a, b) => b.price - a.price);
    } else {
        filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    renderProducts(filtered);
};

document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('searchBtn').addEventListener('click', applyFilters);

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.getAttribute('data-cat');
        applyFilters();
    });
});

const modal = document.getElementById('productModal');
const modalBox = modal.querySelector('div');

window.openModal = () => {
    modal.classList.remove('hidden'); void modal.offsetWidth; 
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modalBox.classList.remove('scale-95'); modalBox.classList.add('scale-100');
};

window.closeModal = () => {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modalBox.classList.remove('scale-100'); modalBox.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
};

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const rawNumber = document.getElementById('sellerWA').value.replace(/\D/g, '');
    if (rawNumber.length < 9) {
        alert('Gagal: Nomor WhatsApp tidak valid.');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch animate-spin"></i> Menenun Data...`;

    try {
        const rawPrice = document.getElementById('productPriceDisplay').value.replace(/\./g, '');
        const cleanPrice = parseFloat(rawPrice);
        const countryCode = document.getElementById('countryCode').value;
        const completeWANumber = countryCode + rawNumber; 

        const fileInput = document.getElementById('productImgFile');
        let compressedImgString = '';
        if (fileInput.files && fileInput.files[0]) {
            compressedImgString = await compressImage(fileInput.files[0]);
        }

        const newProduct = {
            seller: document.getElementById('sellerName').value,
            title: document.getElementById('productTitle').value,
            cat: document.getElementById('productCat').value,
            price: cleanPrice,
            wa: completeWANumber, 
            img: compressedImgString,
            desc: document.getElementById('productDesc').value
        };

        const { data, error } = await supabaseClient.from('products').insert([newProduct]).select();
        if (error) throw error;

        if (data && data.length > 0) { products.unshift(data[0]); } else { await fetchProducts(); }
        
        applyFilters(); closeModal(); e.target.reset();
        document.getElementById('wordCountDisplay').innerText = '0/50 kata';
        alert('Luar biasa! Karya estetikmu kini bersinar di etalase galeri.');

    } catch (err) {
        console.error('Submission Error:', err);
        alert('Gagal menyematkan karya. Pastikan koneksi atau foto stabil.');
    } finally {
        submitBtn.disabled = false; submitBtn.innerHTML = originalText;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initThemeIcon();
    fetchProducts();
});
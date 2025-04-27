// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', () => {
    loadGuests();
    document.getElementById('guestForm').addEventListener('submit', addGuest);
});

// Fungsi untuk menambah tamu baru
function addGuest(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('guestName');
    const addressInput = document.getElementById('address');
    const messageInput = document.getElementById('guestMessage');
    
    const guest = {
        id: Date.now(),
        name: nameInput.value,
        address: addressInput.value,
        message: messageInput.value,
        date: new Date().toLocaleString('id-ID'),
        completed: false
    };
    
    // Mendapatkan daftar tamu yang ada
    let guests = getGuestsFromStorage();
    
    // Menambahkan tamu baru
    guests.push(guest);
    
    // Menyimpan ke local storage
    saveGuestsToStorage(guests);
    
    // Memperbarui tampilan
    renderGuests();
    
    // Reset form
    nameInput.value = '';
    addressInput.value = '';
    messageInput.value = '';
}

// Fungsi untuk menghapus tamu
function deleteGuest(id) {
    let guests = getGuestsFromStorage();
    guests = guests.filter(guest => guest.id !== id);
    saveGuestsToStorage(guests);
    renderGuests();
}

// Fungsi untuk menandai tamu sebagai selesai/diproses
function toggleComplete(id) {
    let guests = getGuestsFromStorage();
    guests = guests.map(guest => {
        if(guest.id === id) {
            guest.completed = !guest.completed;
        }
        return guest;
    });
    saveGuestsToStorage(guests);
    renderGuests();
}

// Fungsi untuk mengambil data dari local storage
function getGuestsFromStorage() {
    let guests;
    if(localStorage.getItem('guests') === null) {
        guests = [];
    } else {
        guests = JSON.parse(localStorage.getItem('guests'));
    }
    return guests;
}

// Fungsi untuk menyimpan data ke local storage
function saveGuestsToStorage(guests) {
    localStorage.setItem('guests', JSON.stringify(guests));
}

// Fungsi untuk memuat data tamu saat halaman dimuat
function loadGuests() {
    renderGuests();
}

// Fungsi untuk menampilkan daftar tamu
function renderGuests() {
    const guestItems = document.getElementById('guestItems');
    const guests = getGuestsFromStorage();
    
    guestItems.innerHTML = '';
    
    if(guests.length === 0) {
        guestItems.innerHTML = '<div class="no-items">Belum ada tamu yang terdaftar</div>';
        return;
    }
    
    guests.forEach(guest => {
        const item = document.createElement('div');
        item.classList.add('guest-item');
        if(guest.completed) {
            item.classList.add('completed');
        }
        
        item.innerHTML = `
            <div class="guest-info">
                <div class="guest-name">${guest.name}</div>
                <div class="guest-message">${guest.message}</div>
                <div class="guest-date">Alamat: ${guest.address} | Tanggal: ${guest.date}</div>
            </div>
            <div class="actions">
                <button class="action-btn complete-btn" onclick="toggleComplete(${guest.id})">
                    ${guest.completed ? 'Batal Selesai' : 'Tandai Selesai'}
                </button>
                <button class="action-btn delete-btn" onclick="deleteGuest(${guest.id})">Hapus</button>
            </div>
        `;
        
        guestItems.appendChild(item);
    });
}
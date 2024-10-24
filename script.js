// Inisialisasi data dari localStorage atau array kosong jika belum ada data
let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];

function validateForm(event) {
    event.preventDefault();
    
    const nama = document.getElementById('nama');
    const email = document.getElementById('email');
    const telepon = document.getElementById('telepon');
    const pesan = document.getElementById('pesan');
    
    document.querySelectorAll('.error').forEach(error => {
        error.style.display = 'none';
    });
    
    let isValid = true;
    
    if (nama.value.trim() === '') {
        document.getElementById('namaError').style.display = 'block';
        isValid = false;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }
    
    if (telepon.value.trim() === '') {
        document.getElementById('teleponError').style.display = 'block';
        isValid = false;
    }
    
    if (pesan.value.trim() === '') {
        document.getElementById('pesanError').style.display = 'block';
        isValid = false;
    }
    
    if (isValid) {
        // Membuat objek pesan baru
        const newMessage = {
            id: Date.now(), // Menggunakan timestamp sebagai ID unik
            date: new Date().toLocaleString('id-ID'),
            nama: nama.value.trim(),
            email: email.value.trim(),
            telepon: telepon.value.trim(),
            pesan: pesan.value.trim()
        };
        
        // Menambahkan pesan ke array dan menyimpan ke localStorage
        messages.unshift(newMessage); // Menambahkan di awal array
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        // Memperbarui tampilan tabel
        displayMessages();
        
        // Reset form
        document.getElementById('contactForm').reset();
        alert('Pesan berhasil dikirim!');
    }
    
    return isValid;
}

function displayMessages(filteredMessages = null) {
    const messageList = document.getElementById('messageList');
    const noMessages = document.getElementById('noMessages');
    const messagesToDisplay = filteredMessages || messages;
    
    messageList.innerHTML = '';
    
    if (messagesToDisplay.length === 0) {
        noMessages.style.display = 'block';
        return;
    }
    
    noMessages.style.display = 'none';
    
    messagesToDisplay.forEach(message => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${message.date}</td>
            <td>${message.nama}</td>
            <td>${message.email}</td>
            <td>${message.telepon}</td>
            <td>${message.pesan}</td>
            <td class="message-actions">
                <button class="delete-btn" onclick="deleteMessage(${message.id})">Hapus</button>
            </td>
        `;
        messageList.appendChild(row);
    });
}

function deleteMessage(id) {
    if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
        messages = messages.filter(message => message.id !== id);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        displayMessages();
    }
}

function searchMessages() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm === '') {
        displayMessages();
        return;
    }
    
    const filteredMessages = messages.filter(message => 
        message.nama.toLowerCase().includes(searchTerm) ||
        message.email.toLowerCase().includes(searchTerm) ||
        message.pesan.toLowerCase().includes(searchTerm)
    );
    
    displayMessages(filteredMessages);
}

// Menampilkan pesan saat halaman dimuat
displayMessages();

document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

document.getElementById('signupForm').addEventListener('submit', function (e) {
    let isValid = true;

    // Lấy giá trị từ các trường
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const fullname = document.getElementById('fullname').value.trim();
    const birthdate = document.getElementById('birthdate').value.trim();
    const phoneNumber = document.getElementById('phone_number').value.trim();
    const address = document.getElementById('address').value.trim();
    const email = document.getElementById('gmail').value.trim();

    // Kiểm tra từng trường
    if (!username) {
        isValid = false;
        document.getElementById('usernameError').classList.remove('d-none');
    } else {
        document.getElementById('usernameError').classList.add('d-none');
    }

    if (!password) {
        isValid = false;
        document.getElementById('passwordError').classList.remove('d-none');
    } else {
        document.getElementById('passwordError').classList.add('d-none');
    }

    if (!fullname) {
        isValid = false;
        document.getElementById('fullnameError').classList.remove('d-none');
    } else {
        document.getElementById('fullnameError').classList.add('d-none');
    }

    if (!birthdate) {
        isValid = false;
        document.getElementById('birthdateError').classList.remove('d-none');
    } else {
        document.getElementById('birthdateError').classList.add('d-none');
    }

    if (!phoneNumber.match(/^\d{10,15}$/)) {
        isValid = false;
        document.getElementById('phoneError').classList.remove('d-none');
    } else {
        document.getElementById('phoneError').classList.add('d-none');
    }

    if (!address) {
        isValid = false;
        document.getElementById('addressError').classList.remove('d-none');
    } else {
        document.getElementById('addressError').classList.add('d-none');
    }

    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        isValid = false;
        document.getElementById('emailError').classList.remove('d-none');
    } else {
        document.getElementById('emailError').classList.add('d-none');
    }

    // Nếu không hợp lệ, ngăn form gửi đi
    if (!isValid) {
        e.preventDefault();
    }
});

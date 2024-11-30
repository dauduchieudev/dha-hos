document.getElementById('banner-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn chặn hành động submit mặc định, không reload trang
    
    // Lấy dữ liệu CAPTCHA từ Google reCAPTCHA
    const captchaResponse = grecaptcha.getResponse();
    const symptomInput = document.getElementById('search-input').value;

    if (captchaResponse.length === 0) {
        alert("Vui lòng xác minh CAPTCHA!");
        return;
    }

    // Gửi dữ liệu đến server (có thể dùng fetch API)
    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'g-recaptcha-response': captchaResponse,
            'symptom': symptomInput
        })
    })
    .then(response => response.json())  // Giả sử server trả về JSON
    .then(data => {
        // Sau khi nhận kết quả từ server, hiển thị vào thẻ <p>
        if (data.success) {
            document.getElementById('result').innerText = `Chuyên khoa phù hợp: ${data.specialty}`;
        } else {
            document.getElementById('result').innerText = "Xác minh CAPTCHA thất bại. Vui lòng thử lại.";
        }
    })
    .catch(error => {
        console.error('Có lỗi xảy ra:', error);
        document.getElementById('result').innerText = "Đã có lỗi xảy ra, vui lòng thử lại.";
    });
});
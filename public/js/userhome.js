document.getElementById('banner-form').addEventListener('submit', function(event) {
    document.getElementById('result').innerText = `Đang phân tích...`;
    event.preventDefault();

    const captchaResponse = grecaptcha.getResponse();
    const symptomInput = document.getElementById('search-input').value;

    if (captchaResponse.length === 0) {
        alert("Vui lòng xác minh CAPTCHA!");
        return;
    }

    fetch('/symptom-search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'g-recaptcha-response': captchaResponse,
            'symptom': symptomInput
        })
    })
    .then(response => response.json())
    .then(data => {
        if (1 || data.success) {
            if (data.specialty === "Non-Medical") {
                document.getElementById('result').innerText = `Bạn chưa nhập đúng những triệu chứng y khoa. Vui lòng thử lại!`;
            } else {
                document.getElementById('result').innerText = `Chuyên khoa phù hợp: ${data.specialty}`;
            }
        } else {
            document.getElementById('result').innerText = "Xác minh CAPTCHA thất bại. Vui lòng thử lại.";
        }
    })
    .catch(error => {
        console.error('Có lỗi xảy ra:', error);
        document.getElementById('result').innerText = "Đã có lỗi xảy ra, vui lòng thử lại.";
    });
});
document.querySelector('.search-shift-schedule').addEventListener('submit', function(event) {
    const searchDate = document.querySelector('.form-control').value;

    if (searchDate === "") {
        event.preventDefault(); 
        alert('Vui lòng nhập ngày tìm kiếm!');
        return;
    }
});

document.getElementById('resetSearch').addEventListener('click', function() {
    window.location.href = '/doctor/shift-schedule';
});
function toggleSection(sectionId) {
    // Lấy tất cả các section
    var sections = document.querySelectorAll('.section');
    
    // Ẩn tất cả các section
    sections.forEach(function(section) {
        section.style.display = 'none';
    });
    
    // Hiển thị section được chọn
    var section = document.getElementById(sectionId);
    section.style.display = 'block';

    const menuItems = document.querySelectorAll('.sidebar li');
    menuItems.forEach(item => item.classList.remove('active'));

    // Thêm class 'active' vào mục menu được chọn
    const activeItem = document.querySelector(`.sidebar li[onclick="toggleSection('${sectionId}')"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }

}

document.addEventListener('DOMContentLoaded', function () {
    toggleSection('diagnosis-section');
});
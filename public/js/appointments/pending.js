document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.appointment-card .delete');

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const dialog = button.parentElement.querySelector('.confirmation-dialog');
            dialog.style.display = 'block';
        });
    });

    const cancelButtons = document.querySelectorAll('.confirmation-dialog .cancel');
    
    cancelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const dialog = button.closest('.confirmation-dialog');
            dialog.style.display = 'none';
        });
    });

    const confirmButtons = document.querySelectorAll('.confirm');
        
    confirmButtons.forEach(button => {
        button.addEventListener('click', () => {
            const appointmentId = button.dataset.appointmentId; 

            fetch('/appointment/pending/cancel', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ appointment_id: appointmentId }) 
            })
            .then(response => {
                if (response.ok) {
                    alert('Lịch khám đã được hủy thành công.');
                    location.reload();
                } else {
                    alert('Hủy lịch khám thất bại, vui lòng thử lại.');
                }
            })
            .catch(error => {
                console.error('Lỗi khi hủy lịch khám:', error);
                alert('Đã xảy ra lỗi, vui lòng thử lại.');
            });
        });
    });
});

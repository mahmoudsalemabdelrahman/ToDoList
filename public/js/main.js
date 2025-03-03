
// تأكيد حذف المهمة
function confirmDelete(e) {
  if (!confirm('هل أنت متأكد من رغبتك في حذف هذه المهمة؟')) {
    e.preventDefault();
  }
}

// إضافة مستمعي الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  // تطبيق مستمع لأزرار الحذف
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', confirmDelete);
  });

  // إظهار/إخفاء التنبيهات تلقائيًا
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.classList.add('fade');
      setTimeout(() => {
        alert.remove();
      }, 500);
    }, 5000);
  });

  // تنسيق التواريخ
  const dateTimes = document.querySelectorAll('.date-time');
  dateTimes.forEach(dateTime => {
    const date = new Date(dateTime.getAttribute('data-date'));
    dateTime.textContent = new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  });

  // تفعيل tooltips في Bootstrap
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  });
});

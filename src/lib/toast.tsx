import Swal from 'sweetalert2';

// ثيم مخصص يتماشى مع ألوان الـ Admin Dark & Gold اللي عندك
export const toast = {
  success: (title: string) => {
    Swal.fire({
      icon: 'success',
      title: title,
      timer: 2500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      background: 'var(--adm-surface, #1e1e1e)',
      color: 'var(--adm-text, #ffffff)',
      iconColor: 'var(--adm-gold, #caa253)',
    });
  },
  
  error: (title: string, text?: string) => {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: 'OK',
      confirmButtonColor: 'var(--adm-gold, #caa253)',
      background: 'var(--adm-surface, #1e1e1e)',
      color: 'var(--adm-text, #ffffff)',
      iconColor: '#ef4444',
    });
  },

  // مخصصة لحوار الـ Confirm بتاع الحذف بدل confirm() العادية
  confirm: (title: string, text: string, onConfirm: () => void) => {
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // أحمر للحذف
      cancelButtonColor: 'var(--adm-border, #333)',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: 'var(--adm-surface, #1e1e1e)',
      color: 'var(--adm-text, #ffffff)',
      iconColor: 'var(--adm-gold, #caa253)',
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  }
};
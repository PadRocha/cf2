import Swal from "sweetalert2";

export const Alert = Swal.mixin({
  position: 'bottom-right',
  showConfirmButton: false,
  backdrop: false,
  timer: 2_000,
  width: '17rem',
  showClass: {
    popup: 'animate__animated animate__backInUp'
  },
  hideClass: {
    popup: 'animate__animated animate__backOutDown'
  }
});

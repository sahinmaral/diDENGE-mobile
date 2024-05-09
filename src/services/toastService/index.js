class ToastService {
  constructor(toast) {
    this.toast = toast;
  }
  showToast(message, options) {
    this.toast.show(message, options);
  }
}

export default ToastService;

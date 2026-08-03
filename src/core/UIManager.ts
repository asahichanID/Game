import { DialogOptions, ToastNotification } from '../types/manager';

type UIListener = () => void;

class UIManagerClass {
  private toasts: ToastNotification[] = [];
  private dialog: DialogOptions | null = null;
  private popupContent: { id: string; title: string; componentName: string; props?: Record<string, unknown> } | null = null;
  private isLoading = false;
  private loadingMessage = 'Loading...';
  private transitionState: { isTransitioning: boolean; targetRoute?: string } = { isTransitioning: false };

  private listeners: Set<UIListener> = new Set();

  public subscribe(listener: UIListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  // --- Notification Toast Manager ---
  public showToast(title: string, message: string, type: ToastNotification['type'] = 'info', durationMs = 3500): string {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastNotification = { id, title, message, type, durationMs };
    this.toasts.push(newToast);
    this.notify();

    setTimeout(() => {
      this.dismissToast(id);
    }, durationMs);

    return id;
  }

  public dismissToast(id: string): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  public getToasts(): ToastNotification[] {
    return [...this.toasts];
  }

  // --- Dialog Manager ---
  public showDialog(options: Omit<DialogOptions, 'id'>): string {
    const id = `dialog_${Date.now()}`;
    this.dialog = { id, ...options };
    this.notify();
    return id;
  }

  public closeDialog(): void {
    if (this.dialog && this.dialog.onCancel) {
      this.dialog.onCancel();
    }
    this.dialog = null;
    this.notify();
  }

  public getDialog(): DialogOptions | null {
    return this.dialog;
  }

  // --- Popup Panel Manager ---
  public openPopup(title: string, componentName: string, props?: Record<string, unknown>): void {
    this.popupContent = { id: `popup_${Date.now()}`, title, componentName, props };
    this.notify();
  }

  public closePopup(): void {
    this.popupContent = null;
    this.notify();
  }

  public getPopup() {
    return this.popupContent;
  }

  // --- Loading Manager ---
  public showLoading(message = 'Memuat Resource Game...'): void {
    this.isLoading = true;
    this.loadingMessage = message;
    this.notify();
  }

  public hideLoading(): void {
    this.isLoading = false;
    this.notify();
  }

  public getLoadingState() {
    return { isLoading: this.isLoading, message: this.loadingMessage };
  }

  // --- Screen Transition Manager ---
  public triggerTransition(targetRoute?: string, durationMs = 400): Promise<void> {
    return new Promise((resolve) => {
      this.transitionState = { isTransitioning: true, targetRoute };
      this.notify();

      setTimeout(() => {
        this.transitionState = { isTransitioning: false, targetRoute };
        this.notify();
        resolve();
      }, durationMs);
    });
  }

  public getTransitionState() {
    return { ...this.transitionState };
  }
}

export const UIManager = new UIManagerClass();

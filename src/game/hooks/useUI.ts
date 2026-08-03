import { useEffect, useState } from 'react';
import { UIManager } from '../../core/UIManager';

export function useUI() {
  const [toasts, setToasts] = useState(UIManager.getToasts());
  const [dialog, setDialog] = useState(UIManager.getDialog());
  const [popup, setPopup] = useState(UIManager.getPopup());
  const [loading, setLoading] = useState(UIManager.getLoadingState());
  const [transition, setTransition] = useState(UIManager.getTransitionState());

  useEffect(() => {
    const unsub = UIManager.subscribe(() => {
      setToasts(UIManager.getToasts());
      setDialog(UIManager.getDialog());
      setPopup(UIManager.getPopup());
      setLoading(UIManager.getLoadingState());
      setTransition(UIManager.getTransitionState());
    });
    return unsub;
  }, []);

  return {
    toasts,
    dialog,
    popup,
    loading,
    transition,
    showToast: (title: string, msg: string, type?: 'info' | 'success' | 'warning' | 'error') =>
      UIManager.showToast(title, msg, type),
    dismissToast: (id: string) => UIManager.dismissToast(id),
    showDialog: (opts: Parameters<typeof UIManager.showDialog>[0]) => UIManager.showDialog(opts),
    closeDialog: () => UIManager.closeDialog(),
    openPopup: (title: string, componentName: string, props?: Record<string, unknown>) =>
      UIManager.openPopup(title, componentName, props),
    closePopup: () => UIManager.closePopup(),
    showLoading: (msg?: string) => UIManager.showLoading(msg),
    hideLoading: () => UIManager.hideLoading(),
    triggerTransition: (targetRoute?: string) => UIManager.triggerTransition(targetRoute),
  };
}

/**
 * Confirmation Modal Component
 * Displays a confirmation dialog for destructive actions
 */

interface ConfirmModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Modal title */
  title: string;
  /** Modal message */
  message: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button variant */
  confirmVariant?: 'error' | 'warning' | 'primary';
  /** Callback when confirmed */
  onConfirm: () => void;
  /** Callback when cancelled */
  onCancel: () => void;
}

/**
 * Confirmation modal for destructive actions
 * Shows a dialog with confirm/cancel buttons
 */
export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'error',
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getConfirmClass = () => {
    switch (confirmVariant) {
      case 'error':
        return 'btn-error';
      case 'warning':
        return 'btn-warning';
      case 'primary':
        return 'btn-primary';
      default:
        return 'btn-error';
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button onClick={onCancel} className="btn btn-ghost">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`btn ${getConfirmClass()}`}>
            {confirmText}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onCancel}>
        <button>close</button>
      </form>
    </dialog>
  );
}

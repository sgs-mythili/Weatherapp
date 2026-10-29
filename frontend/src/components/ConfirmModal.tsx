import { cn } from "../utils/cn";

interface ConfirmModalProps {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  isConfirming?: boolean;
}

export default function ConfirmModal({
  title,
  description,
  confirmText,
  cancelText,
  isOpen,
  onConfirm,
  onClose,
  isConfirming = false,
}: ConfirmModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
        className={cn(
          "w-full max-w-md rounded-xl bg-surface p-6 shadow-xl"
        )}
      >
        <h2
          id="confirm-modal-title"
          className="mb-3 text-xl font-bold"
        >
          {title}
        </h2>

        <p
          id="confirm-modal-description"
          className="mb-6 text-muted"
        >
          {description}
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isConfirming}
            className="rounded-lg border border-border px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="rounded-lg bg-danger px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {isConfirming ? "Deleting..." : confirmText}
          </button>
        </div>
      </section>
    </div>
  );
}

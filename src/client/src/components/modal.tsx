import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  closeOnBackdrop?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  closeOnBackdrop = true,
  size = "md",
}) => {
  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-2xl",
    lg: "max-w-5xl",
  };

  return (
    <div className="modal modal-open">
      <div className={`modal-box ${sizeClasses[size]}`}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">{title}</h3>
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}

        <div className="py-4">{children}</div>

        {actions && <div className="modal-action">{actions}</div>}
      </div>

      <div className="modal-backdrop" onClick={handleBackdropClick} />
    </div>
  );
};

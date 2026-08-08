import { AlertTriangle, Loader2 } from "lucide-react";
import Modal from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message?: string;
  icon?: typeof AlertTriangle;
  pending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmDialog = ({
  open,
  title,
  message,
  icon: Icon = AlertTriangle,
  pending = false,
  onClose,
  onConfirm,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}: ConfirmDialogProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      className="text-center"
      title={
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </span>
          <span>{title}</span>
        </div>
      }
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={pending}
            className="px-4 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={pending}
            className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
          >
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      }
    >
      <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
    </Modal>
  );
};

export default ConfirmDialog;

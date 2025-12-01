"use client";

import { toast, ToastContentProps } from "react-toastify";

type ConfirmToastProps = {
  message: string;
  onConfirm: () => void;
};

export const showConfirmToast = ({ message, onConfirm }: ConfirmToastProps) => {
  toast(
    ({ closeToast }: ToastContentProps) => (
      <div className="flex flex-col gap-2">
        <p>{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              onConfirm();
              closeToast?.();
            }}
            className="px-4 py-1 bg-red-500 text-white rounded-4xl hover:bg-red-600 cursor-pointer"
          >
            Confirmer
          </button>
          <button
            onClick={closeToast}
            className="px-4 py-1 bg-gray-300 text-black rounded-4xl hover:bg-gray-400 cursor-pointer"
          >
            Annuler
          </button>
        </div>
      </div>
    ),
    { autoClose: false }
  );
};

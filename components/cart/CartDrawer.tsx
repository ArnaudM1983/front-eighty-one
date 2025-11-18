"use client";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  close: () => void;
  children?: React.ReactNode;
};

export default function CartDrawer({ isOpen, close, children }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={close}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 w-full md:w-96 h-screen bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 cursor-pointer"
          onClick={close}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full">
          {children || <p>Votre panier est vide</p>}
        </div>
      </div>
    </>
  );
}

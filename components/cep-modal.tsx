"use client";

import { useState, useEffect } from "react";
import { MapPinIcon, X } from "lucide-react";

interface CepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cep: string) => void;
  category: string;
}

export function CepModal({ isOpen, onClose, onSubmit, category }: CepModalProps) {
  const [cep, setCep] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setCep("");
    }
  }, [isOpen]);

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cep.length >= 8) {
      onSubmit(cep);
    }
  };

  if (!isOpen) return null;

  return (
    /* Bottom-sheet on mobile, centered on sm+ */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl px-5 py-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideInUp 0.4s ease-out forwards" }}
      >
        {/* Drag handle (mobile only) */}
        <div className="sm:hidden w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-[#5eb3b3] to-[#4a9d9d] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <MapPinIcon className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1.5">
            Encontrar profissionais
          </h2>
          <p className="text-sm text-gray-500">
            Digite seu CEP para encontrar {category} perto de você
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Seu CEP
            </label>
            <input
              type="text"
              value={cep}
              onChange={(e) => setCep(formatCEP(e.target.value))}
              placeholder="00000-000"
              maxLength={9}
              className="w-full px-5 py-3.5 text-lg rounded-xl border-2 border-gray-200 focus:border-[#5eb3b3] focus:ring-0 outline-none transition-colors"
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Usaremos para encontrar os melhores profissionais próximos
            </p>
          </div>

          <button
            type="submit"
            disabled={cep.length < 8}
            className="w-full bg-gradient-to-r from-[#5eb3b3] to-[#4a9d9d] text-white font-semibold py-3.5 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buscar Profissionais
          </button>
        </form>

        <button
          onClick={onClose}
          className="w-full mt-3 text-gray-400 hover:text-gray-600 py-2 text-sm transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}


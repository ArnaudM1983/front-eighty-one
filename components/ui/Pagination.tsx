"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 pb-12 flex-wrap bg-(--background-secondary)">
      {/* Précédent */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-3xl border border-gray-700 hover:bg-gray-100 disabled:opacity-30 transition cursor-pointer"
      >
        Précédent
      </button>

      {/* Numéros de page */}
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`cursor-pointer px-4 py-2 rounded-3xl border border-gray-300 transition
            ${currentPage === i + 1 ? "bg-(--primary) text-white border-blue-400" : "hover:bg-gray-100"}
          `}
        >
          {i + 1}
        </button>
      ))}

      {/* Suivant */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-3xl border border-gray-700 hover:bg-gray-100 disabled:opacity-30 transition cursor-pointer"
      >
        Suivant
      </button>
    </div>
  );
}

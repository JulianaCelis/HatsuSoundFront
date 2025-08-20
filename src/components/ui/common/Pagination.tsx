import React from 'react';
import { PaginationInfo } from '../../../types/audio-product.model';
import './Pagination.css';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages, total } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 4) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 3) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        <span className="pagination-text">
          Mostrando página {currentPage} de {totalPages} ({total} productos)
        </span>
      </div>

      <div className="pagination-controls">
        {/* First page button */}
        <button
          className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          title="Primera página"
        >
          ««
        </button>

        {/* Previous page button */}
        <button
          className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Página anterior"
        >
          «
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="pagination-ellipsis">...</span>
            ) : (
              <button
                className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(page as number)}
                title={`Página ${page}`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next page button */}
        <button
          className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Página siguiente"
        >
          »
        </button>

        {/* Last page button */}
        <button
          className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Última página"
        >
          »»
        </button>
      </div>

      {/* Quick navigation */}
      <div className="pagination-quick-nav">
        <span className="quick-nav-label">Ir a página:</span>
        <input
          type="number"
          className="quick-nav-input"
          min="1"
          max={totalPages}
          value=""
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page && page >= 1 && page <= totalPages) {
              handlePageChange(page);
              e.target.value = '';
            }
          }}
          placeholder={`1-${totalPages}`}
        />
        <button
          className="quick-nav-btn"
          onClick={(e) => {
            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
            const page = parseInt(input.value);
            if (page && page >= 1 && page <= totalPages) {
              handlePageChange(page);
              input.value = '';
            }
          }}
        >
          Ir
        </button>
      </div>
    </div>
  );
};

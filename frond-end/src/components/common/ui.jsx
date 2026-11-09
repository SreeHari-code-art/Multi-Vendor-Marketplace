import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border',
  };

  return (
    <div className={`d-flex justify-content-center align-items-center ${className}`}>
      <div
        className={`spinner-border text-primary ${sizeClasses[size]}`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variantClasses = {
    default: 'text-bg-secondary',
    primary: 'text-bg-primary',
    success: 'text-bg-success',
    warning: 'text-bg-warning',
    danger: 'text-bg-danger',
    info: 'text-bg-info',
  };

  return (
    <span className={`badge rounded-pill ${variantClasses[variant] || variantClasses.default} ${className}`}>
      {children}
    </span>
  );
};

export const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
  const alertStyles = {
    info: { variant: 'info', icon: <Info className="flex-shrink-0" /> },
    success: { variant: 'success', icon: <CheckCircle2 className="flex-shrink-0" /> },
    warning: { variant: 'warning', icon: <AlertCircle className="flex-shrink-0" /> },
    danger: { variant: 'danger', icon: <XCircle className="flex-shrink-0" /> },
  };
  const currentStyle = alertStyles[type] || alertStyles.info;

  return (
    <div className={`alert alert-${currentStyle.variant} d-flex align-items-start ${className}`} role="alert">
      {currentStyle.icon}
      <div className="ms-3 flex-fill">
        {title && <h4 className="h6 fw-semibold">{title}</h4>}
        {message && <p className="mb-0">{message}</p>}
      </div>
      {onClose && (
        <button type="button" className="btn-close ms-auto" onClick={onClose} aria-label="Close" />
      )}
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'modal-sm',
    md: '',
    lg: 'modal-lg',
    xl: 'modal-xl',
  };

  return (
    <>
      <div className="modal-backdrop show" onClick={onClose} />
      <div className="modal d-block" role="dialog" aria-modal="true" aria-labelledby="marketplace-modal-title">
        <div className={`modal-dialog modal-dialog-centered ${sizeClasses[size] || ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5" id="marketplace-modal-title">{title}</h2>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Pagination">
      <ul className={`pagination justify-content-center ${className}`}>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>
        {pages.map((page) => (
          <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

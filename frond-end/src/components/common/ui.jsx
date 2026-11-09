import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

/**
 * ==========================================
 * 1. Spinner (Indicador de carga)
 * ==========================================
 */
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-indigo-600 border-t-transparent ${sizeClasses[size]}`}
        role="status"
        aria-label="Cargando..."
      />
    </div>
  );
};

/**
 * ==========================================
 * 2. Badge (Insignia de estado)
 * ==========================================
 */
export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

/**
 * ==========================================
 * 3. Alert (Alertas y mensajes de notificación)
 * ==========================================
 */
export const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
  const alertStyles = {
    info: {
      bg: 'bg-sky-50 border-sky-200 text-sky-800',
      icon: <Info className="h-5 w-5 text-sky-500 shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />,
    },
    danger: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: <XCircle className="h-5 w-5 text-rose-500 shrink-0" />,
    },
  };

  const currentStyle = alertStyles[type] || alertStyles.info;

  return (
    <div className={`flex items-start p-4 rounded-lg border ${currentStyle.bg} ${className}`}>
      {currentStyle.icon}
      <div className="ml-3 flex-1 text-sm">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        {message && <p>{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto -mx-1.5 -my-1.5 p-1.5 inline-flex items-center justify-center rounded-md hover:bg-black/5 transition-colors focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

/**
 * ==========================================
 * 4. Modal (Diálogo emergente reutilizable)
 * ==========================================
 */
export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Fondo sombreado (Backdrop) */}
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Contenedor del Modal */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div
          className={`w-full ${maxWidthClasses[size]} transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all z-10 border border-gray-100`}
        >
          {/* Cabecera */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 rounded-lg p-1 transition-colors focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cuerpo */}
          <div className="px-6 py-4">{children}</div>

          {/* Pie (opcional) */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-3.5 bg-gray-50 border-t border-gray-100">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * ==========================================
 * 5. Pagination (Control de paginación)
 * ==========================================
 */
export const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Anterior
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3.5 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
            page === currentPage
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Siguiente
      </button>
    </div>
  );
};
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../store/slices/uiSlice';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const dispatch = useDispatch();
  const toasts = useSelector(state => state.ui.toasts);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: 'calc(100% - 48px)'
      }}
      className="no-print"
    >
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const iconColor = isSuccess ? '#10B981' : isError ? '#EF4444' : '#3B82F6';
        const borderColor = isSuccess ? '#10B98140' : isError ? '#EF444440' : '#3B82F640';

        return (
          <div
            key={toast.id}
            style={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '14px 16px',
              border: `1px solid ${borderColor}`,
              boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: 'slideUp 0.25s ease'
            }}
          >
            <div style={{ marginTop: '2px', color: iconColor }}>
              {isSuccess && <CheckCircle2 size={18} />}
              {isError && <AlertTriangle size={18} />}
              {!isSuccess && !isError && <Info size={18} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {toast.title && (
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '2px' }}>
                  {toast.title}
                </div>
              )}
              <div style={{ fontSize: '0.815rem', color: '#CBD5E1', lineHeight: '1.4' }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => dispatch(removeToast(toast.id))}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Dismiss"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

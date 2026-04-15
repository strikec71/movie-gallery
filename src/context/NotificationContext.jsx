import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(({ message, type = 'info', ttl = 2800 }) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => removeNotification(id), ttl);
  }, [removeNotification]);

  const value = useMemo(() => ({
    notifications,
    notify,
    removeNotification,
  }), [notifications, notify, removeNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="notification-stack" aria-live="polite" aria-atomic="true">
        {notifications.map((item) => (
          <div key={item.id} className={`notification-toast ${item.type}`}>
            <span>{item.message}</span>
            <button
              type="button"
              className="notification-close"
              onClick={() => removeNotification(item.id)}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

import { useSelector, useDispatch } from 'react-redux';
import { clearNotification } from '../store/uiSlice';
import { useEffect } from 'react';

export default function Notification() {
  // useSelector allows us to grab exactly the data we need from the Store
  const notification = useSelector((state) => state.ui.notification);
  const dispatch = useDispatch();

  // Auto-hide the notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      return () => clearTimeout(timer); // Cleanup if another notification fires
    }
  }, [notification, dispatch]);

  if (!notification) return null;

  const backgroundColor = notification.type === 'error' ? '#ff4d4f' : '#52c41a';

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: backgroundColor,
      color: 'white',
      padding: '12px 20px',
      borderRadius: '4px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      transition: 'all 0.3s ease-in-out'
    }}>
      {notification.message}
    </div>
  );
}

// components/Notification.tsx
interface NotificationProps {
  type: 'success' | 'error';
  message: string;
}

export default function Notification({ type, message }: NotificationProps) {
  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200'
  };

  return (
    <div className={`${styles[type]} p-4 rounded-lg border mb-4 transition-all duration-300 ease-in-out`}>
      {message}
    </div>
  );
}

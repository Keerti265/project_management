import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle, FiX } from 'react-icons/fi';

const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  const types = {
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: <FiInfo className="w-5 h-5" />,
    },
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: <FiCheckCircle className="w-5 h-5" />,
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      icon: <FiAlertCircle className="w-5 h-5" />,
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: <FiXCircle className="w-5 h-5" />,
    },
  };

  const { bg, text, icon } = types[type];

  return (
    <div
      className={`flex items-center p-4 border rounded-lg ${bg} ${text} ${className}`}
      role="alert"
    >
      <span className="mr-3 flex-shrink-0">{icon}</span>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <FiX className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Alert;

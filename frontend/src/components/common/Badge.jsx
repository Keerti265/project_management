const Badge = ({ status, className = '' }) => {
  const statusStyles = {
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    delayed: 'bg-red-100 text-red-800',
    active: 'bg-emerald-100 text-emerald-800',
    on_hold: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  const statusLabels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
    delayed: 'Delayed',
    active: 'Active',
    on_hold: 'On Hold',
    cancelled: 'Cancelled',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusStyles[status] || statusStyles.pending
      } ${className}`}
    >
      {statusLabels[status] || status}
    </span>
  );
};

export default Badge;

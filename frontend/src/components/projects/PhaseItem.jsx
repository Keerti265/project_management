import { useState } from 'react';
import { Badge, Button, Select } from '../common';
import { FiMessageSquare, FiClock, FiUser, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const PhaseItem = ({
  phase,
  onStatusChange,
  onAddComment,
  canUpdateStatus = false,
  isManager = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue =
    phase.status !== 'completed' && new Date(phase.deadline) < new Date();

  const handleStatusChange = (e) => {
    onStatusChange(phase._id, e.target.value);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(phase._id, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className={`p-4 cursor-pointer transition-colors ${
          expanded ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {expanded ? (
              <FiChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <FiChevronDown className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <h4 className="font-medium text-gray-900">{phase.name}</h4>
              {phase.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                  {phase.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge status={phase.status} />
            {isOverdue && (
              <span className="text-xs text-red-600 font-medium">Overdue</span>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <FiClock className="w-4 h-4" />
            <span>Due: {formatDate(phase.deadline)}</span>
          </div>
          {phase.assignedDeveloper && (
            <div className="flex items-center space-x-1">
              <FiUser className="w-4 h-4" />
              <span>{phase.assignedDeveloper.name || 'Unassigned'}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <FiMessageSquare className="w-4 h-4" />
            <span>{phase.comments?.length || 0} comments</span>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="p-4 border-t border-gray-200 bg-white">
          {/* Status update */}
          {canUpdateStatus && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Status
              </label>
              <div className="flex items-center space-x-3">
                <select
                  value={phase.status}
                  onChange={handleStatusChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
            </div>
          )}

          {/* Phase details */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="text-gray-500">Deadline:</span>
              <span className="ml-2 font-medium text-gray-900">
                {formatDate(phase.deadline)}
              </span>
            </div>
            {phase.completedAt && (
              <div>
                <span className="text-gray-500">Completed:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {formatDate(phase.completedAt)}
                </span>
              </div>
            )}
          </div>

          {/* Comments section */}
          <div className="border-t border-gray-100 pt-4">
            <button
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 mb-3"
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(!showComments);
              }}
            >
              <FiMessageSquare className="w-4 h-4" />
              <span>
                {showComments ? 'Hide' : 'Show'} Comments (
                {phase.comments?.length || 0})
              </span>
            </button>

            {showComments && (
              <div className="space-y-3">
                {/* Comment list */}
                {phase.comments?.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {phase.comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {comment.author?.name || 'Unknown'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No comments yet</p>
                )}

                {/* Add comment */}
                <div className="flex items-start space-x-2 mt-3">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm resize-none"
                    rows={2}
                  />
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddComment();
                    }}
                    disabled={!newComment.trim()}
                  >
                    Post
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseItem;

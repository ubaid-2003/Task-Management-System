import React from 'react';

const TaskCard = ({ task, onClick, onEdit, onDelete }) => {
  const getStatusBadge = () => {
    // Completed takes highest priority
    if (task.completed) {
      return (
        <span className="absolute flex items-center px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full shadow-sm top-2 right-2">
          ✅ Completed
        </span>
      );
    }

    // Then check if read
    if (task.read) {
      return (
        <span className="absolute flex items-center px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full shadow-sm top-2 right-2">
          👀 Viewed
        </span>
      );
    }

    // Default to new task
    return (
      <span className="absolute flex items-center px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full shadow-sm top-2 right-2">
        ✨ New
      </span>
    );
  };

  const shortDescription =
    task?.description?.length > 60
      ? `${task.description.slice(0, 60)}...`
      : task.description || 'No description provided';

  const priorityColorMap = {
    High: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      emoji: '🔥',
      border: 'border-red-300',
    },
    Medium: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      emoji: '⚠️',
      border: 'border-yellow-300',
    },
    Low: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      emoji: '🌱',
      border: 'border-green-300',
    },
  };

  const priority =
    task?.priority?.charAt(0).toUpperCase() + task?.priority?.slice(1) || 'Low';
  const priorityStyle = priorityColorMap[priority] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    emoji: '🔹',
    border: 'border-gray-300',
  };

  const getTaskEmoji = () => {
    if (task.completed) return '✅';
    if (task.title.toLowerCase().includes('meeting')) return '📅';
    if (task.title.toLowerCase().includes('buy')) return '🛒';
    if (task.title.toLowerCase().includes('call')) return '📞';
    if (task.title.toLowerCase().includes('email')) return '✉️';
    return '📝';
  };

  return (
    <div
      onClick={() => onClick(task)}
      className={`relative cursor-pointer p-6 rounded-2xl shadow-md transition duration-300 ease-in-out 
        hover:shadow-lg hover:-translate-y-1 hover:scale-[1.015] border-t-4
        ${task.completed
          ? 'border-green-400 bg-green-50'
          : task.read
            ? 'border-blue-400 bg-blue-50'
            : 'border-yellow-400 bg-yellow-50'
        }`}
    >
      {getStatusBadge()}

      <div className="flex items-start mb-3">
        <span className="mr-3 text-3xl">{getTaskEmoji()}</span>
        <div>
          <h3 className="mb-1 text-xl font-bold text-gray-800 transition hover:text-blue-600">
            {task.title}
          </h3>
          <p className="text-sm text-gray-600">{shortDescription}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
        <span
          className={`px-3 py-1.5 text-xs font-semibold rounded-full ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border} border flex items-center`}
        >
          <span className="mr-1.5">{priorityStyle.emoji}</span>
          {priority} Priority
        </span>

        {task?.dueDate && (
          <span className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-full border border-gray-200 flex items-center">
            <span className="mr-1.5">⏰</span>
            {new Date(task.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        )}
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg 
          transition hover:from-blue-600 hover:to-blue-700 active:scale-95"
        >
          ✏️ <span>Edit</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg 
          transition hover:from-red-600 hover:to-red-700 active:scale-95"
        >
          🗑️ <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
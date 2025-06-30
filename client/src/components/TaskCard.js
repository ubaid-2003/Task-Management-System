import React from 'react';

const TaskCard = ({ task, onClick, onEdit, onDelete }) => {
  const getStatusBadge = () => {
    if (task.completed) {
      return (
        <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium text-green-800 bg-green-100 rounded-full shadow-sm">
          ✅ Done
        </span>
      );
    } else if (task.read) {
      return (
        <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium text-blue-800 bg-blue-100 rounded-full shadow-sm">
          📖 Viewed
        </span>
      );
    } else {
      return (
        <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full shadow-sm">
          🕵️‍♂️ Unread
        </span>
      );
    }
  };

  const shortDescription =
    task?.description?.length > 60
      ? `${task.description.slice(0, 60)}...`
      : task.description || 'No description';

  const priorityColorMap = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700',
  };

  const formattedPriority =
    task?.priority?.charAt(0).toUpperCase() + task?.priority?.slice(1) || 'Low';

  return (
    <div
      onClick={() => onClick(task)}
      className={`relative cursor-pointer p-5 rounded-2xl shadow-lg border-l-8 transition-all duration-300 hover:shadow-2xl transform hover:scale-[1.01]
        ${task.completed
          ? 'border-green-500 bg-green-50'
          : task.read
          ? 'border-blue-500 bg-blue-50'
          : 'border-yellow-500 bg-white'
        }`}
    >
      {getStatusBadge()}

      <h3 className="mb-1 text-xl font-bold text-gray-800">{task.title}</h3>
      <p className="mb-2 text-sm text-gray-600">{shortDescription}</p>

      <div className="flex items-center justify-between text-xs">
        <span
          className={`px-2 py-1 font-medium rounded-full ${
            priorityColorMap[formattedPriority] || 'bg-gray-100 text-gray-700'
          }`}
        >
          🚦 {formattedPriority}
        </span>
        {task?.dueDate && (
          <span className="px-2 py-1 text-gray-600 bg-gray-100 rounded-full">
            📅 {task.dueDate.slice(0, 10)}
          </span>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="px-4 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
        >
          ✏️ Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id);
          }}
          className="px-4 py-1.5 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 shadow-sm"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;

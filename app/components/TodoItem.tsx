interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  // Format date to a readable string, precise to minute
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString([], { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="p-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={(e) => onToggle(todo.id, e.target.checked)}
            className="w-5 h-5 mt-1 text-blue-500 rounded focus:ring-blue-500"
          />
          <div>
            <span
              className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
            >
              {todo.title}
            </span>
            <div className="mt-1 text-xs text-gray-500 space-x-4">
              <span>Created: {formatDate(todo.createdAt)}</span>
              {todo.deadline && (
                <span className="text-orange-500">
                  Deadline: {formatDate(todo.deadline)}
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => onDelete(todo.id)}
          className="px-3 py-1 text-red-500 hover:text-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [nextId, setNextId] = useState(1);

  // Add new todo
  const handleAddTodo = (title: string, deadline?: Date) => {
    const newTodo: Todo = {
      id: nextId,
      title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deadline,
    };
    setTodos([newTodo, ...todos]);
    setNextId(nextId + 1);
  };

  // Toggle todo completion
  const handleToggleTodo = (id: number, completed: boolean) => {
    setTodos(todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed,
          updatedAt: new Date(),
        };
      }
      return todo;
    }));
  };

  // Delete todo
  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <main className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo App</h1>
          <p className="text-gray-600">A simple and elegant todo application</p>
        </div>

        <AddTodo onAddTodo={handleAddTodo} />
        <TodoList
          todos={todos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
        />


      </main>
    </div>
  );
}

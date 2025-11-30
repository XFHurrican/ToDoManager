// Simple in-memory storage for todos
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Use global variables to ensure state persistence across requests
// This works because Node.js caches modules, so this file is only loaded once
let todos: Todo[] = [];
let nextId = 1;

export const getTodos = (): Todo[] => {
  return todos;
};

export const getTodoById = (id: number): Todo | undefined => {
  return todos.find(todo => todo.id === id);
};

export const addTodo = (title: string): Todo => {
  const newTodo: Todo = {
    id: nextId++,
    title,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  todos.push(newTodo);
  return newTodo;
};

export const updateTodo = (id: number, updates: Partial<Todo>): Todo | undefined => {
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex === -1) {
    return undefined;
  }

  const updatedTodo: Todo = {
    ...todos[todoIndex],
    ...updates,
    updatedAt: new Date(),
  };

  todos[todoIndex] = updatedTodo;
  return updatedTodo;
};

export const deleteTodo = (id: number): boolean => {
  const initialLength = todos.length;
  todos = todos.filter(todo => todo.id !== id);
  return todos.length < initialLength;
};
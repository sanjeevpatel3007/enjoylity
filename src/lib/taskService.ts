import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/task';

// In-memory storage for tasks
let tasks: Task[] = [];

export const taskService = {
  getAll: (status: string = 'all', search: string = '') => {
    let filteredTasks = [...tasks];

    // Filter by status
    if (status === 'active') {
      filteredTasks = filteredTasks.filter(task => !task.done);
    } else if (status === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.done);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }

    // Sort by creation date (newest first)
    filteredTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filteredTasks;
  },

  create: (taskData: CreateTaskRequest): Task => {
    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: taskData.title.trim(),
      description: taskData.description?.trim() || undefined,
      done: false,
      createdAt: new Date(),
    };

    tasks.push(newTask);
    return newTask;
  },

  update: (id: string, updates: UpdateTaskRequest): Task | null => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return null;
    }

    // Update task
    if (updates.title !== undefined) {
      tasks[taskIndex].title = updates.title.trim();
    }
    if (updates.description !== undefined) {
      tasks[taskIndex].description = updates.description?.trim() || undefined;
    }
    if (updates.done !== undefined) {
      tasks[taskIndex].done = updates.done;
    }

    return tasks[taskIndex];
  },

  delete: (id: string): boolean => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return false;
    }

    tasks.splice(taskIndex, 1);
    return true;
  },

  getById: (id: string): Task | null => {
    return tasks.find(task => task.id === id) || null;
  }
};

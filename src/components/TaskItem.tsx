'use client';

import React from 'react';
import { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, done: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleToggle = async () => {
    try {
      await onToggle(task.id, !task.done);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await onDelete(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 ${
      task.done 
        ? 'border-l-green-500 bg-green-50 dark:bg-green-900/20' 
        : 'border-l-blue-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={task.done}
              onChange={handleToggle}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              aria-label={`Mark task as ${task.done ? 'incomplete' : 'complete'}`}
            />
            <h3 className={`text-lg font-medium ${
              task.done 
                ? 'text-gray-500 line-through' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {task.title}
            </h3>
          </div>
          
          {task.description && (
            <p className={`mt-2 text-sm ${
              task.done 
                ? 'text-gray-400 line-through' 
                : 'text-gray-600 dark:text-gray-300'
            }`}>
              {task.description}
            </p>
          )}
          
          <p className="text-xs text-gray-500 mt-2">
            Created: {formatDate(task.createdAt)}
          </p>
        </div>
        
        <button
          onClick={handleDelete}
          className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Delete task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

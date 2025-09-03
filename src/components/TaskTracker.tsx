'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Task, TaskStatus, CreateTaskRequest } from '@/types/task';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import TaskList from './TaskList';

export default function TaskTracker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<TaskStatus>('all');
  const [search, setSearch] = useState('');

  // Load initial state from URL params
  useEffect(() => {
    const statusParam = searchParams.get('status') as TaskStatus;
    const searchParam = searchParams.get('search') || '';
    
    if (statusParam && ['all', 'active', 'completed'].includes(statusParam)) {
      setStatus(statusParam);
    }
    if (searchParam) {
      setSearch(searchParam);
    }
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status);
    if (search) params.set('search', search);
    
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(newUrl, { scroll: false });
  }, [status, search, router]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (status !== 'all') params.set('status', status);
      if (search) params.set('search', search);
      
      const response = await fetch(`/api/tasks?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [status, search]);

  // Load tasks when filters change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create task
  const handleCreateTask = async (taskData: CreateTaskRequest) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }

      // Refresh tasks
      await fetchTasks();
    } catch (error) {
      throw error;
    }
  };

  // Toggle task completion
  const handleToggleTask = async (id: string, done: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      // Optimistic update
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, done } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert optimistic update on error
      await fetchTasks();
    }
  };

  // Delete task
  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');

      // Optimistic update
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      // Revert optimistic update on error
      await fetchTasks();
    }
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    setStatus(newStatus);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Task Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Organize your tasks efficiently
        </p>
      </div>

      <TaskForm onSubmit={handleCreateTask} />
      <TaskFilters
        status={status}
        search={search}
        onStatusChange={handleStatusChange}
        onSearchChange={handleSearchChange}
      />
      <TaskList
        tasks={tasks}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        isLoading={isLoading}
      />
    </div>
  );
}

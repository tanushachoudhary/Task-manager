
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskCategory, TaskPriority } from '../types/task';
import { useToast } from '@/components/ui/use-toast';

// Default categories
export const defaultCategories: TaskCategory[] = [
  { id: 'personal', name: 'Personal', color: '#8B5CF6' },
  { id: 'work', name: 'Work', color: '#EC4899' },
  { id: 'shopping', name: 'Shopping', color: '#10B981' },
  { id: 'errands', name: 'Errands', color: '#F59E0B' },
];

type TaskContextType = {
  tasks: Task[];
  categories: TaskCategory[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  addCategory: (category: Omit<TaskCategory, 'id'>) => void;
  updateCategory: (category: TaskCategory) => void;
  deleteCategory: (categoryId: string) => void;
  reorderTasks: (tasks: Task[]) => void;
  getTasksByCategory: (categoryId: string) => Task[];
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>(defaultCategories);
  const { toast } = useToast();

  // Load tasks and categories from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedCategories = localStorage.getItem('categories');

    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Convert date strings back to Date objects
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }));
        setTasks(tasksWithDates);
      } catch (e) {
        console.error('Error parsing saved tasks', e);
      }
    }

    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (e) {
        console.error('Error parsing saved categories', e);
      }
    }
  }, []);

  // Save tasks and categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTasks((prev) => [...prev, task]);
    toast({ title: 'Task added', description: 'Your task has been added successfully.' });
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    toast({ title: 'Task updated', description: 'Your task has been updated successfully.' });
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast({ title: 'Task deleted', description: 'Your task has been deleted.' });
  };

  const completeTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );

    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const action = !task.completed ? 'completed' : 'uncompleted';
      toast({ title: `Task ${action}`, description: `Your task has been marked as ${action}.` });
    }
  };

  const addCategory = (newCategory: Omit<TaskCategory, 'id'>) => {
    const category: TaskCategory = {
      ...newCategory,
      id: crypto.randomUUID(),
    };
    setCategories((prev) => [...prev, category]);
    toast({ title: 'Category added', description: 'Your category has been added successfully.' });
  };

  const updateCategory = (updatedCategory: TaskCategory) => {
    setCategories((prev) =>
      prev.map((category) => (category.id === updatedCategory.id ? updatedCategory : category))
    );
    toast({ title: 'Category updated', description: 'Your category has been updated successfully.' });
  };

  const deleteCategory = (categoryId: string) => {
    // Check if there are tasks in this category before deleting
    const categoryTasks = tasks.filter((task) => task.categoryId === categoryId);
    if (categoryTasks.length > 0) {
      toast({
        title: 'Category not deleted',
        description: 'This category contains tasks. Please move or delete these tasks first.',
        variant: 'destructive',
      });
      return;
    }

    setCategories((prev) => prev.filter((category) => category.id !== categoryId));
    toast({ title: 'Category deleted', description: 'Your category has been deleted.' });
  };

  const reorderTasks = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
  };

  const getTasksByCategory = (categoryId: string) => {
    return tasks.filter((task) => task.categoryId === categoryId);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderTasks,
        getTasksByCategory,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

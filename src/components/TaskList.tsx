
import React, { useState } from 'react';
import { Task } from '../types/task';
import TaskItem from './TaskItem';
import { useTaskContext } from '../contexts/TaskContext';
import { cn } from '@/lib/utils';

interface TaskListProps {
  categoryId: string;
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ categoryId, tasks }) => {
  const { reorderTasks, getTasksByCategory } = useTaskContext();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const draggedTaskId = e.dataTransfer.getData('taskId');
    const dropTargetId = e.currentTarget.getAttribute('data-task-id');
    
    if (!draggedTaskId || !dropTargetId || draggedTaskId === dropTargetId) {
      return;
    }
    
    // Get all tasks for this category
    const currentTasks = getTasksByCategory(categoryId);
    
    // Find the indices of the dragged task and the drop target
    const draggedTaskIndex = currentTasks.findIndex(task => task.id === draggedTaskId);
    const dropTargetIndex = currentTasks.findIndex(task => task.id === dropTargetId);
    
    if (draggedTaskIndex === -1 || dropTargetIndex === -1) {
      return;
    }
    
    // Create a copy of the tasks array to reorder
    const reorderedTasks = Array.from(currentTasks);
    
    // Remove the dragged task
    const [draggedTask] = reorderedTasks.splice(draggedTaskIndex, 1);
    
    // Insert the dragged task at the new position
    reorderedTasks.splice(dropTargetIndex, 0, draggedTask);
    
    // Update the global tasks array
    const allTasks = [...getTasksByCategory(categoryId)];
    const updatedTasks = allTasks.filter(task => task.categoryId !== categoryId).concat(reorderedTasks);
    
    reorderTasks(updatedTasks);
  };

  return (
    <div className="mt-4">
      {tasks.length > 0 ? (
        <div>
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={cn("", { "pb-2": draggedTaskId === task.id })}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-task-id={task.id}
            >
              <TaskItem 
                task={task} 
                isDragging={draggedTaskId === task.id}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 border border-dashed rounded-lg border-gray-200 text-gray-500">
          No tasks in this category yet. Create your first one!
        </div>
      )}
    </div>
  );
};

export default TaskList;

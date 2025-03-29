
import React, { useState } from 'react';
import { Task, TaskPriority } from '../types/task';
import { useTaskContext } from '../contexts/TaskContext';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Pencil, 
  Trash2, 
  Calendar, 
  ChevronRight, 
  Flag 
} from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

const priorityIcons: Record<TaskPriority, React.ReactNode> = {
  low: <Flag className="h-4 w-4 text-green-600" />,
  medium: <Flag className="h-4 w-4 text-yellow-600" />,
  high: <Flag className="h-4 w-4 text-red-600" />,
};

interface TaskItemProps {
  task: Task;
  isDragging: boolean;
  handleDragStart: (e: React.DragEvent, taskId: string) => void;
  handleDragEnd: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, isDragging, handleDragStart, handleDragEnd }) => {
  const { completeTask, updateTask, deleteTask, categories } = useTaskContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [isExpanded, setIsExpanded] = useState(false);

  const category = categories.find((c) => c.id === task.categoryId);

  const handleStatusChange = () => {
    completeTask(task.id);
  };

  const handleEdit = () => {
    setEditedTask({ ...task });
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const handleSaveEdit = () => {
    updateTask(editedTask);
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <div
        className={cn("task-card flex flex-col", {
          'dragging': isDragging,
          'opacity-60': task.completed,
        })}
        draggable={true}
        onDragStart={(e) => handleDragStart(e, task.id)}
        onDragEnd={handleDragEnd}
        data-task-id={task.id}
      >
        <div className="flex items-start">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={handleStatusChange}
            className={cn("mt-1", task.completed ? "opacity-50" : "")}
          />
          <div className="ml-3 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h3 className={cn("font-medium text-sm sm:text-base", task.completed ? "line-through text-gray-500" : "")}>
                  {task.title}
                </h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {category && (
                    <Badge 
                      variant="outline" 
                      className="text-xs flex items-center gap-1" 
                      style={{ borderColor: category.color, color: category.color }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }}></span>
                      {category.name}
                    </Badge>
                  )}
                  <Badge variant="outline" className={cn("text-xs", priorityColors[task.priority])}>
                    {priorityIcons[task.priority]} 
                    <span className="ml-1">{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                  </Badge>
                  {task.dueDate && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center mt-2 sm:mt-0">
                <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8">
                  <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded ? "rotate-90" : "")} />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleEdit} className="h-8 w-8 text-gray-500 hover:text-purple-500">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleDelete} className="h-8 w-8 text-gray-500 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {isExpanded && task.description && (
              <div className="mt-3 text-sm text-gray-500 animate-fade-in">
                {task.description}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                placeholder="Task title"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                value={editedTask.description || ''}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                placeholder="Description (optional)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <Select
                  value={editedTask.categoryId}
                  onValueChange={(value) => setEditedTask({ ...editedTask, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center">
                          <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: category.color }}></span>
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                <Select
                  value={editedTask.priority}
                  onValueChange={(value: TaskPriority) => setEditedTask({ ...editedTask, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskItem;

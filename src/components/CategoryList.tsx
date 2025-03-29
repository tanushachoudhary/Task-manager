
import React, { useState } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { PlusCircle, ChevronRight, FolderPlus } from 'lucide-react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const CategoryList: React.FC = () => {
  const { categories, tasks, addCategory } = useTaskContext();
  const [selectedCategory, setSelectedCategory] = useState<string | null>('all');
  const [isOpen, setIsOpen] = useState(true);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#8B5CF6');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    addCategory({
      name: newCategoryName,
      color: newCategoryColor,
    });
    
    setNewCategoryName('');
    setNewCategoryColor('#8B5CF6');
    setCategoryDialogOpen(false);
  };

  const filterTasksByCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      return tasks.filter((task) => !task.completed);
    } else if (categoryId === 'completed') {
      return tasks.filter((task) => task.completed);
    } else {
      return tasks.filter((task) => task.categoryId === categoryId && !task.completed);
    }
  };

  const predefinedColors = [
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#10B981', // Green
    '#F59E0B', // Amber
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#6366F1', // Indigo
    '#0EA5E9', // Sky
  ];

  const getCategoryTaskCount = (categoryId: string) => {
    if (categoryId === 'all') {
      return tasks.filter((task) => !task.completed).length;
    } else if (categoryId === 'completed') {
      return tasks.filter((task) => task.completed).length;
    } else {
      return tasks.filter((task) => task.categoryId === categoryId && !task.completed).length;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
        <div className="flex space-x-2">
          <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <FolderPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Category</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create a new category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="categoryName" className="text-sm font-medium">Category Name</label>
                  <Input
                    id="categoryName"
                    placeholder="e.g., Projects, Health, Study"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category Color</label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewCategoryColor(color)}
                        className={`w-8 h-8 rounded-full ${
                          newCategoryColor === color ? 'ring-2 ring-offset-2 ring-purple-500' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddCategory}>Create Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <TaskForm />
        </div>
      </div>

      <div className="grid md:grid-cols-[250px_1fr] gap-6">
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Categories</h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-2">
              <div className="space-y-1">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                  className="w-full justify-start text-left"
                  onClick={() => setSelectedCategory('all')}
                >
                  <span>All Tasks</span>
                  <span className="ml-auto bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                    {getCategoryTaskCount('all')}
                  </span>
                </Button>
                
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    className="w-full justify-start text-left"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span 
                      className="w-2 h-2 rounded-full mr-2" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                    <span 
                      className="ml-auto bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs"
                    >
                      {getCategoryTaskCount(category.id)}
                    </span>
                  </Button>
                ))}
                
                <Button
                  variant={selectedCategory === 'completed' ? 'default' : 'ghost'}
                  className="w-full justify-start text-left"
                  onClick={() => setSelectedCategory('completed')}
                >
                  <span>Completed</span>
                  <span className="ml-auto bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                    {getCategoryTaskCount('completed')}
                  </span>
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {selectedCategory === 'all' 
                ? 'All Tasks' 
                : selectedCategory === 'completed' 
                  ? 'Completed Tasks' 
                  : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            
            {/* Filters would go here */}
          </div>

          {selectedCategory && (
            <TaskList 
              categoryId={selectedCategory} 
              tasks={filterTasksByCategory(selectedCategory)} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;

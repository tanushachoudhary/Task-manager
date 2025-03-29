
import React from 'react';
import { TaskProvider } from '../contexts/TaskContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import CategoryList from './CategoryList';
import ThemeToggle from './ThemeToggle';

const Dashboard: React.FC = () => {
  return (
    <ThemeProvider>
      <TaskProvider>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Tasks Dashboard</h1>
            <ThemeToggle />
          </div>
          <CategoryList />
        </div>
      </TaskProvider>
    </ThemeProvider>
  );
};

export default Dashboard;


import React from 'react';
import { TaskProvider } from '../contexts/TaskContext';
import CategoryList from './CategoryList';

const Dashboard: React.FC = () => {
  return (
    <TaskProvider>
      <div className="container mx-auto px-4 py-8">
        <CategoryList />
      </div>
    </TaskProvider>
  );
};

export default Dashboard;

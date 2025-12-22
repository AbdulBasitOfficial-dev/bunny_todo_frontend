import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './auth/Login';
import Signup from './auth/Signup';
import CategoryList from './category/CategoryList';
import TaskList from './task/TaskList';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/tasks/:categoryId" element={<TaskList />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);

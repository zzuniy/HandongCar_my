import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MainLayout from './Layouts/MainLayout';

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<MainLayout/>}> 
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

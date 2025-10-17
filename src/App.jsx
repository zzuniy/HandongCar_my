import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import detailPage from './pages/detail';
import createPage from './pages/create';
import updatePage from './pages/update';
import MainLayout from './Layouts/MainLayout';

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<MainLayout/>}> 
            <Route path="/" element={<Home />} />
            <Route path="/detail" element={<detailPage />} />
            <Route path="/create" element={<createPage />} />
            <Route path="/update" element={<updatePage />} />
            
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

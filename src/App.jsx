import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DetailPage from './pages/detail';
import CreatePage from './pages/create';
import UpdatePage from './pages/update';
import MainLayout from './Layouts/MainLayout';
import "./assets/ui.css";

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<MainLayout/>}> 
            <Route path="/" element={<Home />} />
            <Route path="/detail" element={<DetailPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/update/:id" element={<UpdatePage />} />
            
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

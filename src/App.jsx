import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DetailPage from './pages/detail';
import CreatePage from './pages/create';
import UpdatePage from './pages/update';
import ListPage from './pages/list';
import MainLayout from './Layouts/MainLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/update/:id" element={<UpdatePage />} />
          <Route path="/list" element={<ListPage />} />
      <Route path="/list/:id" element={<ListPage />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

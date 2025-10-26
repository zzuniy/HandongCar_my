import React from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DetailPage from './pages/detail';
import CreatePage from './pages/create';
import UpdatePage from './pages/update';
import ListPage from './pages/List';
import MainLayout from './Layouts/MainLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<DetailPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/update/:id" element={<UpdatePage />} />
          <Route path="/list" element={<ListPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

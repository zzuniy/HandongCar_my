import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';

const MainLayout = () => {
  return (
    <>
      <Header/>
      <main>
        <Outlet />
      </main>
      <Footer/>
    </>
  );
};

export default MainLayout;
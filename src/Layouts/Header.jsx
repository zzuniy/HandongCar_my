import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">🚗 Handong Carpool</Link>
      </div>

      <nav className="nav">
        <NavLink to="/" end className="nav-item">
          목록
        </NavLink>
        <NavLink to="/add" className="nav-item">
          추가
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;

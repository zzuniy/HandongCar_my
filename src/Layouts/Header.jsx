import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">

      <div className="logo">
        <Link to="/" className="logo-link">
          <div className="logo-icon-bg">
            <i className="fa-solid fa-car"></i>
          </div>
          <span className="logo-text">한동카</span>
        </Link>
      </div>

   
      <nav className="nav">
        <NavLink to="/" end className="nav-item">
          홈
        </NavLink>
        <NavLink to="/list" end className="nav-item">
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

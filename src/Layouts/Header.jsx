import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../assets/styles/Header.css";
import { FaCar } from "react-icons/fa";

function Header() {
  return (
    <header className="header">

      <div className="logo">
        <Link to="/" className="logo-link">
         <div className="logo-icon-bg">
            <FaCar size={24} color="#fff" />
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
        <NavLink to="/create" className="nav-item">
          추가
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;

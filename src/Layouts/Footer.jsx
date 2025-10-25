import React from "react";
import "./Footer.css";
import { FaGithub, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2 className="footer-logo">🚗 HandongCar</h2>
        <p className="footer-text">함께 달리는 카풀 플랫폼</p>
      </div>

      <div className="footer-bottom">
        <p>© 2025 HandongCar. All rights reserved.</p>
        <p>Open Source Studio_01 | 오연주 · 정다연 · 허주은</p>
      </div>
    </footer>
  );
}

export default Footer;

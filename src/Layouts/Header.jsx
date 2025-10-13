import React from "react";
import {Link, NavLink } from "react-router-dom";
import styled from "styled-components";

const Header = () => {
  return(
    <>
      <header>
        <div>
          <Link to='/'>Logo</Link>
        </div>
      </header>
    </>
  );
};

export default Header;
import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./style/navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { AuthControls } from "../AuthControls";
import { CartBtn } from "../buttons/CartBtn";

export const Navbar = () => {
  const navTitle = [
    { title: "Home", toPath: "/" },
    { title: "About", toPath: "/about" },
    { title: "Products", toPath: "/products" },
  ];
  const { user } = useSelector((state) => state.auth);

  return (
    <div id="nav-container">
      <ul className="nav-title-box">
        {/* Left Navigation */}
        <div className="nav-left">
          {navTitle.map((e, i) => {
            let { title, toPath } = e;
            return (
              <li key={i} className="nav-title-list">
                <NavLink
                  to={toPath}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  {" "}
                  {title}
                </NavLink>
              </li>
            );
          })}
        </div>

        {/* Right Controls */}

        <div className="nav-right">
          {user && <CartBtn />}

          <li className="nav-title-list auth-controls">
            <AuthControls user={user} />
          </li>
        </div>
      </ul>
    </div>
  );
};

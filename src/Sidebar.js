import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>TELEFON REHBERİ</h2>
      <Link color="white" to="/telephoneDirectory">
        Telefon Rehberi
      </Link>{" "}
      <br />
      <Link color="white" to="/SignOut">
        Çıkış Yap
      </Link>
    </div>
  );
};

export default Sidebar;

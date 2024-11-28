import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="navContainer">
      <div className="emptyDiv">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
      </div>
      <div className="nav">
        <h3
          onClick={() => {
            navigate("/dashboard");
          }}
          style={{ cursor: "pointer" }}
        >
          Dashboard
        </h3>
        <h3
          onClick={() => {
            navigate("/taskList");
          }}
          style={{ cursor: "pointer" }}
        >
          Task List
        </h3>
      </div>
    </div>
  );
};

export default Navbar;

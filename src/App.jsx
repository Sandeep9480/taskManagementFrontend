import React from "react";
import Navbar from "./components/Navbar";
import LoginPage from "./components/login/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardPage from "./components/dashboard/DashboardPage";
import TaskList from "./components/taskList/TaskList";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/taskList" element={<TaskList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Sidebar from "./components/Sidebar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Outlet, useOutlet } from "react-router-dom";

interface AppProps {
  isdarkMode: boolean;
}

function capitalizeFirstLetter(string: string) {
  const index = string.indexOf('/');
  if (index !== -1) {
    string = string.substring(0, index);
  }
  string = string.replace(/_/g, ' ');
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const App: React.FC<AppProps> = ({ isdarkMode }) => {
  const [darkMode, setDarkMode] = useState(isdarkMode);
  const location = useLocation();
  const currentPage = capitalizeFirstLetter(location.pathname.substring(1));
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const role = localStorage.getItem('role') || '';
  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible((prevIsSidebarVisible) => !prevIsSidebarVisible);
  };

  return (
    <div className={`flex ${darkMode ? "dark" : "white"} relative w-full`}>
      <div className={`h-[100vh] fixed md:relative ${isSidebarVisible ? 'block' : ' hidden md:block '} md:block z-30`}>
        <Sidebar darkMode={darkMode} role={role} />
      </div>
      <div className="flex-1 flex flex-col w-full">
        <Nav
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          toggleSidebar={toggleSidebar}
          currentPage={currentPage}
          isSidebarVisible={isSidebarVisible}
        />
        <div className={`bg-${darkMode ? "black" : "gray"} flex-1 w-full`}>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default App;
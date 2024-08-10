import React, { useState, useEffect } from "react";
import Nav from "./components/Nav";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Outlet } from "react-router-dom";
import Sidebar2 from "./components/Sidebar2";

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
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const currentPage = capitalizeFirstLetter(location.pathname.substring(1));
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const role = localStorage.getItem('role') || '';

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible((prevIsSidebarVisible) => !prevIsSidebarVisible);
  };
  console.log(isSidebarVisible);

  const [userInfoUpdated, setUserInfoUpdated] = useState(false);
  const updateUserInfo = () => {
    setUserInfoUpdated(!userInfoUpdated); // Toggle state to trigger Nav to update user info
  };

  const isMobileView = windowWidth < 768;
  const marginClass = isMobileView ? 'ml-0' : (isSidebarVisible ? 'ml-20' : 'ml-20');
  return (
    <div className={`flex ${darkMode ? "dark" : "white"} relative w-full h-screen`}>
      <div className={`h-full fixed ${isSidebarVisible ? 'block' : 'hidden md:block'} md:block z-30`}>
        <Sidebar2 darkMode={darkMode} role={role} />
      </div>
      
      <div className={`flex-1 flex flex-col w-full transition-all duration-300 ${marginClass}`}>
        <Nav
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          toggleSidebar={toggleSidebar}
          currentPage={currentPage}
          isSidebarVisible={isSidebarVisible}
          updateUserInfo={updateUserInfo}
        />
        <div className={`bg-${darkMode ? "black" : "gray"} flex-1 w-full`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;

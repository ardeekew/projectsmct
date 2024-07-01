// Nav.tsx

import React, { useState, useEffect } from "react";
import {
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
  BellIcon,
  ChevronUpIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import Avatar from "./assets/avatar.png";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axios from "axios";
import UpdateInformation from "./UpdateInformation";

interface NavProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  currentPage: string;
  isSidebarVisible: boolean;
  updateUserInfo: () => void; // Function to update user info
}

const Nav: React.FC<NavProps> = ({
  darkMode,
  toggleDarkMode,
  currentPage,
  toggleSidebar,
  isSidebarVisible,
  updateUserInfo,
}) => {
  const flexBetween = "flex items-center justify-between";
  const listProfile = "px-4 hover:bg-[#E0E0F9] cursor-pointer py-2";
  const listNotification =
    "px-4 hover:bg-[#E0E0F9] cursor-pointer  py-4 border-b flex items-center justify-between pr-10";
  const divNotification =
    "size-[28px] flex items-center justify-center bg-black rounded-full";
  const iconNotifcation = "size-[18px] text-white  cursor-pointer";
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNotif, setIsOpenNotif] = useState(false);
  const { updateUser } = useUser();
  const userId = localStorage.getItem("userId");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const handleClose = () => {
    setIsOpen(false);
  };
  const toggleProfileDropdown = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const fetchUserInfoFromDatabase = async () => {
      const id = localStorage.getItem("id");
      const headers = {};

      try {
        const response = await axios.get(`http://localhost:8000/api/view-user/${id}`, {
          headers,
        });
        setUserInfo(response.data);

        // Access the lastName from response.data.data
        setLastName(response.data.data.lastName);
        setFirstName(response.data.data.firstName);
      } catch (error) {
        console.error("Error fetching user information from the database: ", error);
      }
    };

    fetchUserInfoFromDatabase();
  }, [updateUserInfo]); // Fetch user info whenever updateUserInfo changes

  return (
    <div className={`nav-container ${darkMode ? "dark" : "white"}`}>
      {/* Toggle light and dark mode */}
      <nav className={`${flexBetween} bg-white dark:bg-blackD`}>
        <div
          className="h-[67px] flex items-center bg-white  dark:bg-blackD"
          onClick={toggleSidebar} // Toggle the sidebar when this div is clicked
        >
          <h1
            className={`lg:text-[32px] md:text-[28px] sm:text-[20px] font-bold text-primary ${
              darkMode ? "dark:text-white" : ""
            }  pl-4 ${isSidebarVisible ? "ml-20 lg:ml-0" : ""}`}
          >
            {currentPage}
          </h1>
        </div>
        <div className="flex items-center justify-between pr-12 ">
          <div className="pr-2 sm:pr-8">
            {darkMode ? (
              <SunIcon
                className="size-[27px] text-white cursor-pointer"
                onClick={toggleDarkMode}
              />
            ) : (
              <MoonIcon
                className="size-[27px] text-black cursor-pointer"
                onClick={toggleDarkMode}
              />
            )}
          </div>
          <div className={`${flexBetween} gap-2 relative `}>
            <img
              alt="logo"
              className="cursor-pointer hidden sm:block"
              src={Avatar}
              height={45}
              width={45}
              onClick={() => setIsOpen(!isOpen)}
            />
            {/* USER NAME */}
            <p
              className="pl-2 lg:text-[18px] text-[12px] dark:text-white cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              {firstName} {lastName}
            </p>
            {!isOpen ? (
              <ChevronDownIcon
                className="size-[25px] text-black dark:text-white cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              />
            ) : (
              <ChevronUpIcon
                className="size-[25px] text-black dark:text-white cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              />
            )}
            {/* Profile dropdown */}
            {isOpen && (
              <div
                className="w-full border-x-2 border-b-2 bg-white absolute top-11 overflow-x-hidden z-50"
                style={{ zIndex: 1000 }}
              >
                <ul>
                  <Link to="/profile" onClick={handleClose}>
                    <li className={`${listProfile}`}>My Profile</li>
                  </Link>
                  <Link to="/settings" onClick={handleClose}>
                    <li className={`${listProfile}`}>Settings</li>
                  </Link>
                  <Link to="/help" onClick={handleClose}>
                    <li className={`${listProfile}`}>Help</li>
                  </Link>
                  <Link to="/login" onClick={handleClose}>
                    <li className={`${listProfile}`}>Sign out</li>
                  </Link>
                </ul>
              </div>
            )}
          </div>
          <div className="pl-4 sm:pl-10 relative">
            <BellIcon
              className={`size-[30px]  cursor-pointer ${
                isOpenNotif ? "text-yellow" : "text-gray-400"
              } `}
              onClick={() => setIsOpenNotif(!isOpenNotif)}
            />
            {/* Notification */}
            {isOpenNotif && (
              <div className="w-96  -right-10   bg-white absolute top-11 border-2 border-black z-40 ">
                <ul>
                  <li className={`${listNotification}`}>
                    <div className={`${divNotification}`}>
                      <EnvelopeIcon className={`${iconNotifcation}`} />
                    </div>
                    <div>
                      <p className="text-primary">
                        New request from Head Office
                      </p>
                      <p className="text-gray-400 px-10">Apr 14, 2024 9:35am</p>
                    </div>
                  </li>
                  <li className={`${listNotification}`}>
                    <div className={`${divNotification}`}>
                      <EnvelopeIcon className={`${iconNotifcation}`} />
                    </div>
                    <div>
                      <div>
                        <p className="text-primary">
                          New request from SMCT Loay
                        </p>
                        <p className="text-gray-400 px-10">
                          Mar 14, 2024 1:35pm
                        </p>
                      </div>
                    </div>
                  </li>

                  <li className={`${listNotification}`}>
                    <div className={`${divNotification}`}>
                      <EnvelopeIcon className={`${iconNotifcation}`} />
                    </div>
                    <div>
                      <p className="text-primary">New request from DSM Ubay</p>
                      <p className="text-gray-400 px-10">Jul 2, 2024 10:45am</p>
                    </div>
                  </li>
                  <li className={`${listNotification}`}>
                    <div className={`${divNotification}`}>
                      <EnvelopeIcon className={`${iconNotifcation}`} />
                    </div>
                    <div>
                      <p className="text-primary">
                        New request from SMCT Alicia
                      </p>
                      <p className="text-gray-400 px-10">May 5, 2024 2:35am</p>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Nav;

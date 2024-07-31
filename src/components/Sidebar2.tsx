import React, { useState, useEffect } from "react";
import Logo from "./assets/logo.png";
import {
  ChartBarIcon,
  EnvelopeIcon,
  BeakerIcon,
  DocumentCheckIcon,
  DocumentPlusIcon,
  UserGroupIcon,
  BookOpenIcon,
  ArrowLeftCircleIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

type NavItem = {
  title: string;
  icon: React.ElementType;
  path: string;
};

interface SidebarProps {
  darkMode: boolean;
  role: string;
}

const Sidebar2: React.FC<SidebarProps> = ({ darkMode, role }) => {
  const [open, setOpen] = useState(window.innerWidth > 1024);

  const navItems: NavItem[] =
    role === "approver"
      ? [
          { title: "Dashboard", icon: ChartBarIcon, path: "/dashboard/approver" },
          { title: "View Request", icon: EnvelopeIcon, path: "/request/rq" },
          { title: "Create Request", icon: DocumentPlusIcon, path: "/request/sr" },
          { title: "Approve Request", icon: DocumentCheckIcon, path: "/request/approver" },
          { title: "Custom Request", icon: UserGroupIcon, path: "/request/custom" },
        ]
      : role === "Admin"
      ? [
          { title: "Dashboard", icon: ChartBarIcon, path: "/dashboard" },
          { title: "View Request", icon: EnvelopeIcon, path: "/request" },
          { title: "Create Request", icon: EnvelopeIcon, path: "/request/sr" },
          { title: "Custom Request", icon: EnvelopeIcon, path: "/request/custom" },
          { title: "User", icon: BeakerIcon, path: "/setup/User" },
          { title: "Branch", icon: BeakerIcon, path: "/setup/Branch" },
          { title: "Approver", icon: BeakerIcon, path: "/setup/Approver" },
          { title: "Area Manager", icon: BeakerIcon, path: "/setup/AreaManager" },
          { title: "Help", icon: BookOpenIcon, path: "/help" },
        ]
      : [
          { title: "Dashboard", icon: ChartBarIcon, path: "/dashboard" },
          { title: "View Request", icon: EnvelopeIcon, path: "/request" },
          { title: "Create Request", icon: EnvelopeIcon, path: "/request/sr" },
          { title: "Custom Request", icon: EnvelopeIcon, path: "/request/custom" },
          { title: "Help", icon: BookOpenIcon, path: "/help" },
        ];

  useEffect(() => {
    const handleResize = () => {
     
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const listStyle = "mx-2 group flex items-center text-[18px] text-gray-400 font-medium py-2 pr-3 px-2  cursor-pointer rounded-lg";
  const pStyle = "group-hover:text-primary font text-lg px-2 ml-5 rounded-lg"; 
  const pStyle1 = "group-hover:text-primary font text-lg px-2 rounded-lg"; 
  const iconStyle = "size-[32px] group-hover:text-primary";

  return (
    <div className={`${darkMode ? "dark" : "light"} dark:bg-blackD h-full`}>
      <div className={`bg-white dark:bg-blackD ${open ? "w-60" : "w-20"} h-full`}>
        <div className="px-2 py-3 h-[68px] flex justify-between items-center border-b-[0.5px] border-gray">
          <img
            src={Logo}
            height={34}
            width={75}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
          <h1
            className={`text-primary font-bold mr-7   ${open ? "visible" : "invisible"}`}
          >
            Request Form
          </h1>
          <ArrowLeftCircleIcon
            className={`size-[34px] text-black dark:text-white -right-2 ml-2 absolute cursor-pointer ${open ? "block" : "hidden"}`}
            onClick={() => setOpen(false)}
          />
        </div>
        <ul className="mt-[65px] flex-1 w-full">
          <p className="text-[12px] text-gray-400 px-3 w-fit">MENU</p>
          <div className="gap-2 w-full">
            {navItems.map((item) => (
              <Link to={item.path} key={item.title}>
                <li
                  className={`${listStyle} ${!open ? "" : "hover:bg-[#E7F1F9]"}`}
                >
                  <div
                    className={`p-2 ${!open ? "hover:bg-[#D2E6F7] rounded-lg" : ""}`}
                  >
                    <item.icon className={iconStyle} />
                  </div>
                  {open ? (
                  <div className={`flex-1 ${!open ? "hidden" : "block"}`}>
                    <p className={`${pStyle1} truncate p-1`}>{item.title}</p>
                  </div>
                 ) : (
                  <div className={`flex-1 `}>
                    <p className={`${pStyle} truncate p-1 invisible bg-[#D2E6F7] group-hover:visible px-2 rounded-lg`}>{item.title}</p>
                  </div>
                  )}
                </li>
              </Link>
            ))}
              <Link to="/login">
            <div className="border-t flex justify-center items-center ">
              <div className="flex h-5/6 p-2">
                <ArrowLeftStartOnRectangleIcon
                  className={`${iconStyle} dark:text-white`}
                />
              </div>
              <p
                className={`${pStyle} ${!open ? "hidden" : ""} dark:text-white`}
              >
                Logout
              </p>
            </div>
          </Link>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar2;

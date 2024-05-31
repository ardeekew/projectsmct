import React, { useState, useEffect } from "react";
import Logo from "./assets/logo.png";
import {
  ChartBarIcon,
  EnvelopeIcon,
  BeakerIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowLeftCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import Nav from "./Nav";
type Submenu = {
  title: string;
  path: string;
};
type NavItem = {
  title: string;
  submenu: boolean;
  icon: React.ElementType;
  path: string;
  submenuItems?: Submenu[];
};

interface SidebarProps {
  darkMode: boolean;
  role: string;
}

type Props = {};

const listStyle =
  "group flex ml-2 items-center text-[18px] text-gray-400 font-medium py-2 pr-10 px-2 gap-2  overflow-hidden cursor-pointer  rounded-lg";
const pStyle = "group-hover:text-primary  font text-[20px]";
const iconStyle = "size-[32px] group-hover:text-primary ";

const Sidebar: React.FC<SidebarProps> = ({ darkMode, role }) => {
  const [open, setOpen] = useState(window.innerWidth > 1024);
  const [submenuOpen, setSubMenuOpen] = useState<string | null>(null);

  const handleDropdownClick = (title: string) => {
    setSubMenuOpen(submenuOpen === title ? null : title);
  };

  const navItems: NavItem[] =
    role === "approver"
      ? [
          {
            title: "Dashboard",
            icon: ChartBarIcon,
            path: "/dashboardapprover",
            submenu: false,
          },
          {
            title: "Request",
            icon: EnvelopeIcon,
            path: "/requestapprover",
            submenu: true,
            submenuItems: [{ title: "View Request", path: "/requestapprover" }],
          },
          
          
        ]
      : [
          {
            title: "Dashboard",
            icon: ChartBarIcon,
            path: "/dashboard",
            submenu: false,
          },
          {
            title: "Request",
            icon: EnvelopeIcon,
            path: "/request",
            submenu: true,
            submenuItems: [
              { title: "View Request", path: "/request" },
              { title: "Create Request", path: "/request/sr" },
              { title: "Custom Request", path: "/request/custom" },
            ],
          },
          {
            title: "Setup",
            icon: BeakerIcon,
            path: "/setup/User",
            submenu: true,
            submenuItems: [
              { title: "User", path: "/setup/User" },

              { title: "Branch", path: "/setup/Branch" },
              { title: "Approver", path: "/setup/Approver" },
              { title: "Area Manager", path: "/setup/AreaManager" },
            ],
          },
          { title: "Help", icon: BookOpenIcon, path: "/help", submenu: false },
        ];

  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth > 1200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    setOpen(window.innerWidth > 768);
  };
  return (
    <div className={`${darkMode ? "dark" : "light"}dark:bg-blackD  `}>
      <div
        className={`bg-white dark:bg-blackD h-screen ${
          open ? "w-[240px]" : "w-20"
        } relative `}
      >
        <div className="px-2 py-3 h-[68px] flex justify-between items-center border-b-[0.5px] border-gray">
          <img
            src={Logo}
            height={34}
            width={75}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
          <h1
            className={`text-primary font-bold overflow-hidden mr-7 ${
              !open && "scale-0"
            } duration-500`}
          >
            Request Form
          </h1>
          <ArrowLeftCircleIcon
            className={`size-[34px] text-black dark:text-white -right-2 ml-2 absolute cursor-pointer ${
              !open && "hidden"
            }`}
            onClick={() => setOpen(false)}
          />
        </div>
        <div className="flex flex-col flex-grow overflow-hidden">
          <ul className="mt-[65px] flex-1 overflow-y-auto">
            <p className="text-[12px] text-gray-400 px-3 w-fit">MENU</p>

            {navItems.map((item) => (
              <Link to={item.path} key={item.title}>
                <li
                  className={`${listStyle}  ${
                    !open ? "" : "hover:bg-[#E0E0F9]"
                  }`}
                >
                  <div
                    className={`p-2 inline-block ${
                      !open ? "hover:bg-[#E0E0F9] rounded-lg" : ""
                    }`}
                  >
                    <item.icon className={iconStyle} />
                  </div>
                  <p className={`${pStyle} ${!open && "scale-0"}`}>
                    {item.title}
                  </p>
                  {item.submenu &&
                    open &&
                    (submenuOpen === item.title ? (
                      <ChevronUpIcon
                        className="size-[20px]"
                        onClick={() => handleDropdownClick(item.title)}
                      />
                    ) : (
                      <ChevronDownIcon
                        className="size-[20px]"
                        onClick={() => handleDropdownClick(item.title)}
                      />
                    ))}
                </li>
                {item.submenu && submenuOpen === item.title && open && (
                  <ul>
                    {item.submenuItems?.map((submenuItem, index) =>
                      open && submenuOpen === item.title ? (
                        <Link to={submenuItem.path} key={index}>
                          <li
                            className=" hover:bg-[#E0E0F9] group text-sm flex ml-10 items-center text-[18px] text-gray-400 font-medium py-2 pr-10 px-2 gap-2  overflow-hidden cursor-pointer  rounded-lg"
                          >
                            <div className="flex flex-row items-center gap-2">
                              <p className="group-hover:text-primary ">
                                {submenuItem.title}
                              </p>
                            </div>
                          </li>
                        </Link>
                      ) : null
                    )}
                  </ul>
                )}
              </Link>
            ))}
          </ul>
          <Link to="/login">
            <div className="border-t flex justify-center items-center ">
              <div className=" flex  h-5/6 p-2">
                <ArrowLeftStartOnRectangleIcon
                  className={`${iconStyle}dark:text-white`}
                />
              </div>
              <p className={`${pStyle} ${!open ? "hidden" : ""} dark:text-white`}>
                Logout
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

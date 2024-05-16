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
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import Nav from './Nav';
type Submenu = {
  title:string;
  path:string;
 
}
type NavItem = {
  title: string;
  submenu:boolean;
  icon: React.ElementType;
  path: string;
  submenuItems?:Submenu[];
};

interface SidebarProps {
  darkMode: boolean;
}

type Props = {};

const listStyle =
  "group flex ml-2 items-center text-[18px] text-gray-400 font-medium py-2 pr-10 px-2 gap-2  overflow-hidden cursor-pointer  rounded-lg";
const pStyle = "group-hover:text-primary  font text-[20px]";
const iconStyle = "size-[32px] group-hover:text-primary ";

const navItems: NavItem[] = [
  { title: "Dashboard", icon: ChartBarIcon, path: "/dashboard", submenu: false},
  { title: "Request", icon: EnvelopeIcon, path: "/request",  submenu: true, 
  submenuItems: [
    {title: "View Request", path: "/request/all"},
    {title: "Stock Requisition",  path: "/request/sr"},
    {title: "Purchase Order Requisition Slip",  path: "/request/pors"},
    {title: "Cash Disbursement Requisition Slip",  path: "/request/cbrs"},
    {title: "Application For Cash Advance",  path: "/request/afca"},
    {title: "Liquidation of Actual Expense",  path: "/request/loae"},
  ]},
  { title: "Setup", icon: BeakerIcon, path: "/setup", submenu: false},
];

const Sidebar: React.FC<SidebarProps> = ({ darkMode }) => {
  const [open, setOpen] = useState(window.innerWidth > 1024);
  const [submenuOpen, setSubMenuOpen] = useState(false);

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
    <div className={`${darkMode ? "dark" : "light"}dark:bg-blackD`}>
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
        <div className="flex">
          <ul className="mt-[65px] h-5/6">
            <p className="text-[12px] text-gray-400 px-3">MENU</p>
       
            {navItems.map((item) => (
                 <Link to={item.path}>
              <li
                key={item.title}
                className={`${listStyle}  ${!open ? "" : "hover:bg-[#E0E0F9]"}`}
              >
                <div
                  className={`p-2 inline-block ${
                    !open ? "hover:bg-[#E0E0F9] rounded-lg" : ""
                  }`}
                >
                  <item.icon className={iconStyle} />
                </div>
                <p className={`${pStyle} ${!open && "scale-0"}`}>{item.title}</p>
                {item.submenu && open && (
                      submenuOpen ? (
                        <ChevronUpIcon className="size-[20px]" onClick={() => setSubMenuOpen(false)}/>
                      ) : (
                        <ChevronDownIcon className="size-[20px]" onClick={() => setSubMenuOpen(true)}/>
                      )
                    )}
              </li>
              {item.submenu && submenuOpen && open &&(
                <ul>
                  {item.submenuItems?.map((submenuItem, index) => (
                    <li key={index} className=" hover:bg-[#E0E0F9] group text-sm flex ml-10 items-center text-[18px] text-gray-400 font-medium py-2 pr-10 px-2 gap-2  overflow-hidden cursor-pointer  rounded-lg">
                      <div className="flex flex-row items-center gap-2">
                       
                       <p className="group-hover:text-primary ">{submenuItem.title}</p>
                       </div>
                    </li>
                  ))}
                </ul>
              )}
           </Link>
            ))}
          </ul>
        </div>
        <div className="border-t flex w-full bottom-2 absolute justify-center items-center ">
          <div className=" flex  h-5/6 p-2">
            <ArrowLeftStartOnRectangleIcon className={`${iconStyle}`} />
          </div>
          <p className={`${pStyle} ${!open ? "hidden" : ""}`}>Logout</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

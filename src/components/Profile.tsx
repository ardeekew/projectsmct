import React from "react";
import Avatar2 from "./assets/avatar.png";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <div className="bg-graybg dark:bg-blackbg w-full h-screen pt-4 px-4 md:px-10 lg:px-30">
      <h1 className="text-primary mb-4 dark:text-primaryD text-2xl md:text-3xl lg:text-4xl font-bold">
        My Profile
      </h1>
      <div className="bg-white rounded-[12px] flex flex-col w-full px-4 md:px-8 lg:px-12 xl:px-16 pt-[50px] space-x-6">
        <div className="mb-5 rounded-[12px] flex flex-col md:flex-row items-start md:items-start">
          <div className="mb-4 md:mb-0">
            <img alt="logo" height={118} width={118} src={Avatar2} />
          </div>
          <div className="flex flex-col items-start justify-center text-left px-4">
            <h1 className="font-bold text-lg md:text-xl lg:text-2xl mt-10 text-left">
              Admin
            </h1>
            <p className="text-primary">Upload new picture</p>

            <h1 className="font-semibold text-lg md:text-xl lg:text-2xl my-5 mt-5">
              User Information
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <p className="text-gray-400">Email</p>
                <p className="font-medium">Test@gmail.com</p>
              </div>
              <div>
                <p className="text-gray-400">Branch</p>
                <p className="font-medium">Suzuki Auto Bohol</p>
              </div>
              <div>
                <p className="text-gray-400">Contact</p>
                <p className="font-medium">+639123456789</p>
              </div>
              <div>
                <p className="text-gray-400">Username</p>
                <p className="font-medium">Admin</p>
              </div>
            </div>
            <Link
              to="/Update_Profile"
              className="bg-black text-white w-full h-[48px] rounded-[12px] mt-4 flex items-center justify-center"
            >
              <button className="text-white">Update User Information</button>
            </Link>
          </div>
          <div className="mt-4 md:mt-0 md:ml-20">
            <h1 className="font-semibold text-lg md:text-xl lg:text-2xl my-5 mt-10">
              Change Password
            </h1>
            <p className="mt-2 text-gray-400">Enter your current password</p>
            <input
              type="text"
              className="bg-gray-300 rounded-[12px] h-8 mt-2 w-full"
            />
            <p className="mt-2 text-gray-400">Enter your new password</p>
            <input
              type="text"
              className="bg-gray-300 rounded-[12px] h-8 mt-2 w-full"
            />
            <p className="mt-2 text-gray-400">Confirm password</p>
            <input
              type="text"
              className="bg-gray-300 rounded-[12px] h-8 mt-2 w-full"
            />
            <button className="text-white bg-primary rounded-[12px] w-full h-[48px] mt-4 mb-12">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
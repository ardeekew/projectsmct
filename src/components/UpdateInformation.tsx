import React from "react";
import Avatar3 from "./assets/avatar.png";



const pinputStyle="font-medium border-2 border-black rounded-[12px] p-2";

const UpdateInformation = () => {
  return (
    <div className="bg-graybg dark:bg-blackbg w-full h-screen pt-4 px-4 md:px-10 lg:px-30">
      <h1 className="text-primary mb-4 dark:text-primaryD text-2xl md:text-[32px] font-bold">
        My Profile
      </h1>
      <div className="bg-white  rounded-[12px] flex  w-full  px-4 md:px-[88px] pt-[50px] space-x-6">
        <div className="mb-5 rounded-[12px] w-full lg:w-2/3  flex flex-col   ">
          <div className="mb-4  flex flex-row ">
            <img alt="logo" height={118} width={118} src={Avatar3} />
            <div className="flex flex-col ml-4">
            <h1 className="font-bold text-lg md:text-[20px] mt-10 text-left">
              Admin
            </h1>
            <p className="text-primary">Upload new picture</p>
            </div>
            </div>
          <div>

          </div>
          <div className="flex flex-col w-full  items-start justify-center text-left px-4 ml-0 md:ml-10">
           

            <h1 className="font-semibold text-lg md:text-[20px]  my-5 mt-14">
              User Information
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 space-x-0 lg:gap-4 w-full">
              <div className="w-full">
                <p className="text-gray-400 ">First Name</p>
                <p className={`${pinputStyle}`}>Kylie</p>
              </div>
              <div>
                <p className="text-gray-400">Last Name</p>
                <p className={`${pinputStyle}`}>Doe</p>
              </div>
              <div>
                <p className="text-gray-400">Email</p>
                <p className={`${pinputStyle}`}>test@gmail.com</p>
              </div>
              <div>
                <p className="text-gray-400">Branch</p>
                <p className={`${pinputStyle}`}>Suzuki Auto Bohol</p>
              </div>
              <div>
                <p className="text-gray-400">Contact</p>
                <p className={`${pinputStyle}`}>+639123456789</p>
              </div>
              <div>
                <p className="text-gray-400">Username</p>
                <p className={`${pinputStyle}`}>Admin</p>
              </div>
            </div>
            <button className="bg-black text-white w-full  h-[48px] rounded-[12px]  mt-4">
              Update User Information
            </button>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default UpdateInformation;

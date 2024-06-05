import React, { useState, useEffect } from "react";
import Avatar2 from "./assets/avatar.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import SquareLoader from "react-spinners/SquareLoader";
interface User{
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  branchCode: string;
  contact: string;
  signature: string;
  userName: string;
}
const Profile = ({isdarkMode}: {isdarkMode: boolean}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState(null);
 
    console.log(isdarkMode)
  useEffect(() => {
   
    const fetchUserInformation = async () => {
      try {
        const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing');
        return;
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };
console.log(token)
        const response = await axios.get("http://localhost:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
      
        if (response.data.status) {
          setUser(response.data.user);
          console.log(user?.firstName);
        } else {
          throw new Error(response.data.message || "Failed to fetch user information");
        }
      } catch (error : any) {
        setError(error.message || "An error occurred while fetching user information");
      }
    };

    fetchUserInformation();
  }, []);



  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <SquareLoader color="#ADD8E6" className="" />
      </div>
    );
  }

  return (
    <div className="bg-graybg dark:bg-blackbg w-full h-screen pt-4 px-4 md:px-10 lg:px-30">
     
      <div className="bg-white rounded-[12px] flex flex-col w-full px-4 md:px-8 lg:px-12 xl:px-16 pt-[50px] space-x-6">
        <div className="mb-5 rounded-[12px] md:space-x-6 flex flex-col md:flex-row  md:items-start justify-center items-center">
          <div className="mb-4 md:mb-0">
            <img alt="logo" height={118} width={118} src={Avatar2} />
          </div>
          <div className="flex flex-col items-start justify-center text-left px-4 w-full max-w-80">
            <h1 className="font-bold text-lg md:text-xl lg:text-2xl mt-10 text-left">
            {user.firstName} {user.lastName}
            </h1>
            <p className="text-primary">Upload new picture</p>

            <h1 className="font-semibold text-lg md:text-xl lg:text-2xl my-5 mt-5">
              User Information
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 w-full">
              <div>
                <p className="text-gray-400">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-400">Branch</p>
                <p className="font-medium">{user.branchCode}</p>
              </div>
              <div>
                <p className="text-gray-400">Contact</p>
                <p className="font-medium">{user.contact}</p>
              </div>
              <div>
                <p className="text-gray-400">Username</p>
                <p className="font-medium">{user.userName}</p>
              </div>
            </div>
            <Link
              to="/Update_Profile"
              className="bg-black text-white w-full h-[48px] rounded-[12px] mt-4 flex items-center justify-center"
            >
              <button className="text-white">Update User Information</button>
            </Link>
          </div>
          <div className="mt-4 md:mt-0 ">
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
          <div className="mt-4 md:mt-0 flex flex-col items-center w-1/2  justify-center">
            <h1 className="font-semibold text-lg md:text-xl lg:text-2xl my-5 mt-10 text-center">Signature</h1>
            <img src={user.signature} alt="signature" className=" border-2 w-2/3 " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

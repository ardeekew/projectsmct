import React, { useState, useEffect , useRef} from "react";
import Avatar2 from "./assets/avatar.png";
import { Link } from "react-router-dom";
import axios from "axios";
import SquareLoader from "react-spinners/SquareLoader";
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { set } from "react-hook-form";
import PropogateLoader from "react-spinners/PropagateLoader";


interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  branch_code: string;
  contact: string;
  signature: string;
  userName: string;
  profile_picture: string;
  position: string;
}

const Profile = ({ isdarkMode }: { isdarkMode: boolean }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        if (!token) {
          setError("User not authenticated");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };
        console.log("Fetching user information...");
        console.log("User ID:", id);
        const response = await axios.get(
          `http://localhost:8000/api/view-user/${id}`,
          {
            headers,
          }
        );
        console.log("Response:", response.data);
        console.log("User information:", user);
        if (response.data.status) {
          setUser(response.data.data);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch user information"
          );
        }
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
            "An error occurred while fetching user information"
        );
      }
    };

    fetchUserInformation();
  }, [token]);

  const handleChangePassword = async () => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    if (!token || !id) {
      console.error("User not authenticated. Please log in.");
      return;
    }
    try {
      setLoading(true);
      if (newPassword !== confirmNewPassword) {
        // Show an error message to the user indicating that the passwords don't match
        console.error("The new password fielsddd confirmation does not match.");
        return; // Prevent the request from being sent
      }

      // Proceed with sending the request to change the password
      const response = await axios.put(
        `http://localhost:8000/api/change-password/${id}`,
        {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle success response
      setSuccessModal(true);
      setLoading(false);
      console.log("Password changed successfully:", response.data);
      // Optionally, you can show a success message to the user
    } catch (error: any) {  
      setLoading(false);
      // Handle error response
      console.error(
        "Failed to change password:",
        error.response?.data?.message || error.message
      );
      // Optionally, you can show an error message to the user
    }
  };
const closeSuccessModal = () => {
  setSuccessModal(false);
  setNewPassword('');
  setCurrentPassword('');
  setConfirmNewPassword('');
  
}
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

  if (error === "User not authenticated") {
    // Render a component indicating that the user is not authenticated
    return <div>User not authenticated. Please log in.</div>;
  }
  const handleProfilePicUpload = async () => {
    if (!newProfilePic) {
      console.error("No profile picture selected.");
      return;
    }

    const formData = new FormData();
    formData.append('profile_picture', newProfilePic);

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8000/api/upload-profile-pic/${id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.status) {
        setUser(prevUser => prevUser ? { ...prevUser, signature: response.data.data.signature } : null);
      } else {
        throw new Error(response.data.message || "Failed to upload profile picture");
      }
    } catch (error: any) {
      console.error(
        "Failed to upload profile picture:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };
  const handleImageClick = () => {
    inputRef.current?.click();
  }
  const baseUrl = 'http://localhost:8000/storage/profile_pictures/';

  // Construct the URL for the profile picture
  const profilePictureUrl = user.profile_picture 
    ? `http://localhost:8000/storage/${user.profile_picture.replace(/\\/g, '/')}`
    : Avatar2; 

  console.log("currentPassword:", currentPassword);
  console.log("newPassword:", newPassword);
  console.log("confirmNewPassword:", confirmNewPassword);
  return (
    <div className="bg-graybg dark:bg-blackbg w-full h-screen pt-4 px-4 md:px-10 lg:px-30">
      <div className="bg-white rounded-[12px] flex flex-col w-full px-4 md:px-8 lg:px-10 xl:px-12 pt-[50px] space-x-6">

        <div className="mb-5 rounded-[12px] md:space-x-6 flex flex-col md:flex-row  md:items-start justify-center items-center">
         
          <div className="flex flex-col items-start justify-center text-left px-4  pl-20 w-1/2">
         <div className="flex">
         
          <img alt="logo" height={140} width={140}  src={profilePictureUrl} className="rounded-full"  />
          <div className="flex flex-col ml-2">
            <h1 className="font-bold text-lg md:text-xl lg:text-2xl mt-10 text-left">
              {user.firstName} {user.lastName}
            
            </h1>
            <p className="text-black italic font-semibold">{user.position}</p>
            </div>  
            </div>                                  
            <h1 className="font-semibold text-lg md:text-xl lg:text-2xl my-5 mt-5">
              User Information
            
            </h1>
            <div className="grid grid-cols-1  gap-4 lg:gap-6 w-full">
              <div className="flex flex-col">
                <p className="text-gray-400">Email</p>
                <p className="font-medium border p-2 rounded-md">
                  {user.email}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-gray-400">Branch</p>
                <p className="font-medium border p-2 rounded-md">
                  {user.branch_code}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-gray-400">Contact</p>
                <p className="font-medium border p-2 rounded-md">
                  {user.contact}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-gray-400">Username</p>
                <p className="font-medium border p-2 rounded-md">
                  {user.userName}
                </p>
              </div>
            </div>
            <Link
              to="/Update_Profile"
              className="bg-black text-white w-full h-[48px] rounded-[12px] mt-4 flex items-center justify-center"
            >
              <button className="text-white">Update User Information</button>
            </Link>
          </div>
          <div className="mt-4 md:mt-0 w-1/2">
            <div>
              <h1 className="font-semibold text-lg md:text-xl lg:text-2xl my-5 mt-10">
                Change Password
              </h1>
              <p className="mt-2 text-gray-400">Enter your current password</p>
              <div className="flex justify-center items-center relative w-full">
                <input
                  type={showCurrent ? "text" : "password"}
                  className="w-full  h-10  p-2 bg-gray-300 rounded-lg"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  value={currentPassword}
                />
                {showCurrent ? (
                  <EyeSlashIcon
                    className="size-[24px] absolute right-3 cursor-pointer "
                    onClick={() => setShowCurrent(!showCurrent)}
                  />
                ) : (
                  <EyeIcon
                    className="size-[24px] absolute right-3 cursor-pointer "
                    onClick={() => setShowCurrent(!showCurrent)}
                  />
                )}
              </div>
              <p className="mt-2 text-gray-400">Enter your new password</p>
              <div className="flex justify-center items-center relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full  h-10  p-2 bg-gray-300 rounded-lg"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {showPassword ? (
                  <EyeSlashIcon
                    className="size-[24px] absolute right-3 cursor-pointer "
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <EyeIcon
                    className="size-[24px] absolute right-3 cursor-pointer "
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </div>
              <p className="mt-2 text-gray-400">Confirm password</p>
              <div className="flex justify-center items-center relative w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full  h-10  p-2 bg-gray-300 rounded-lg"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                {showConfirmPassword ? (
                  <EyeSlashIcon
                    className="size-[24px] absolute right-3 cursor-pointer "
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                ) : (
                  <EyeIcon
                    className="size-[24px] absolute right-3 cursor-pointer "
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                )}
              </div>
            </div>

            <button
              className="text-white bg-primary justify-center items-center  flex rounded-[12px] w-full h-[50px] mt-4 mb-12"
              onClick={handleChangePassword}
            >
                {loading ? <PropogateLoader color="#FFFF"  /> : "Change Password"}
            </button>
       
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-center w-1/2  justify-center">
            <h1 className="font-semibold text-lg md:text-xl lg:text-2xl my-5 mt-10 text-center">
              Signature
            </h1>
            <img
              src={user.signature}
              alt="signature"
              className=" border-2 w-full "
            />
          </div>
        </div>
      </div>
      {successModal && (

      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 flex-col ">
    <div className="bg-white relative w-1/6 flex flex-col items-center justify-center rounded-md ">
    <FontAwesomeIcon icon={faCircleCheck} className='size-20 text-primary absolute -top-6  '/>
    <div>
    <h1 className='mt-20 text-[28px] font-bold text-center'>Success</h1>
    <p className='my-7  text-gray-400 font-semibold text-center'>User Edited!</p>
   
    </div>
    <div className='bg-graybg w-full rounded-b-lg flex justify-center items-center p-4'>
    <button className=' bg-primary p-2 w-1/2 rounded-[12px] text-white font-extrabold' onClick={closeSuccessModal}>OKAY</button>
      </div>
    </div>
    </div>)}
    </div>
  );
};

export default Profile;

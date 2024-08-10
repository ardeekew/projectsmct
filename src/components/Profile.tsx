import React, { useState, useEffect, useRef } from "react";
import Avatar2 from "./assets/avatar.png";
import { Link } from "react-router-dom";
import axios from "axios";
import SquareLoader from "react-spinners/SquareLoader";
import {
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import PropogateLoader from "react-spinners/PropagateLoader";
import { set } from "react-hook-form";

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
  const [branchList, setBranchList] = useState<{ id: number; branch_code: string }[]>([]);
  const [selectedBranchCode, setSelectedBranchCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        if (!token) {
          console.error("Token is missing");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(
          `http://122.53.61.91:6002/api/view-branch`,
          {
            headers,
          }
        );
        const branches = response.data.data;
        const branchOptions = branches.map(
          (branch: { id: number; branch_code: string }) => ({
            id: branch.id,
            branch_code: branch.branch_code,
            
          })
        );
        setBranchList(branchOptions);
        console.log(branchList);
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    };

    fetchBranchData();
  }, [token]);

   useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        if (!token || !branchList.length) {
          return; // Ensure branch list is available before fetching user data
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(
          `http://122.53.61.91:6002/api/view-user/${id}`,
          {
            headers,
          }
        );

        if (response.data.status) {
          const userData = response.data.data;
          setUser(userData);

          // Find the branch code for the user's branch ID
          console.log('Branch List:', branchList);
          const branch = branchList.find(b => b.id === Number(userData.branch_code));

          console.log('Branch:', branch);
      
          if (branch) {
            setSelectedBranchCode(branch.branch_code);
          }
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
  }, [token, id, branchList]);
  
  console.log('selected',selectedBranchCode);
  const handleChangePassword = async () => {
    setErrorMessage("");
    if (!token || !id) {
      console.error("User not authenticated. Please log in.");
      return;
    }
    try {
      setLoading(true);
      if (newPassword !== confirmNewPassword) {
        console.error("The new password fields confirmation does not match.");
        return;
      }

      const response = await axios.put(
        `http://122.53.61.91:6002/api/change-password/${id}`,
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

      setSuccessModal(true);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.error(
        "Failed to change password:",
        error.response?.data?.message || error.message
      );
      setErrorMessage(error.response?.data?.message || error.message);
    }
  };

  const closeSuccessModal = () => {
    setSuccessModal(false);
    setNewPassword("");
    setCurrentPassword("");
    setConfirmNewPassword("");
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <SquareLoader color="#ADD8E6" />
      </div>
    );
  }

  if (error === "User not authenticated") {
    return <div>User not authenticated. Please log in.</div>;
  }

  const handleProfilePicUpload = async () => {
    if (!newProfilePic) {
      console.error("No profile picture selected.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", newProfilePic);

    try {
      setLoading(true);
      const response = await axios.post(
        `http://122.53.61.91:6002/api/upload-profile-pic/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status) {
        setUser((prevUser) =>
          prevUser
            ? { ...prevUser, signature: response.data.data.signature }
            : null
        );
      } else {
        throw new Error(
          response.data.message || "Failed to upload profile picture"
        );
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
  };

  const baseUrl = "http://122.53.61.91:6002/storage/profile_pictures/";
  const profilePictureUrl = user.profile_picture
    ? `http://122.53.61.91:6002/storage/${user.profile_picture.replace(
        /\\/g,
        "/"
      )}`
    : Avatar2;

  return (
    <div className="bg-graybg dark:bg-blackbg w-full h-auto py-4 px-4 md:px-10 lg:px-30 ">
      <div className="bg-white rounded-[12px] flex flex-col w-full px-4 md:px-8 lg:px-10 xl:px-12 py-[50px]">
        <div className="rounded-[12px] flex flex-col lg:flex-row items-center justify-center">
          <div className="flex flex-col items-start text-left px-4 md:px-10 w-full">
            <div className="flex flex-col lg:flex-row items-center md:items-start">
              <img
                alt="profile"
                height={180}
                width={180}
                src={profilePictureUrl}
          
              />
              <div className="flex flex-col ml-2 mt-4">
                <h1 className="font-bold text-lg md:text-xl lg:text-2xl">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-black italic font-semibold">{user.position}</p>
              </div>
            </div>
            <h1 className="font-semibold text-lg md:text-xl lg:text-2xl my-5">
              User Information
            </h1>
            <div className="grid grid-cols-1 gap-4 lg:gap-6 w-full">
              <div className="flex flex-col">
                <p className="text-gray-400">Email</p>
                <p className="font-medium border p-2 rounded-md">{user.email}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-gray-400">Branch</p>
                <p className="font-medium border p-2 rounded-md">{selectedBranchCode}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-gray-400">Contact</p>
                <p className="font-medium border p-2 rounded-md">{user.contact}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-gray-400">Username</p>
                <p className="font-medium border p-2 rounded-md">{user.userName}</p>
              </div>
            </div>
            <Link
              to="/Update_Profile"
              className="bg-black text-white w-full h-[48px] rounded-[12px] mt-4 flex items-center justify-center"
            >
              <button className="text-white">Update User Information</button>
            </Link>
          </div>

          <div className="mt-4 md:mt-0 w-full md:px-10 ">
            <h1 className="font-semibold text-lg md:text-xl lg:text-2xl my-5">
              Change Password
            </h1>
            <p className="mt-2 text-gray-400">Enter your current password</p>
            <div className="flex justify-center items-center relative w-full">
              <input
                type={showCurrent ? "text" : "password"}
                className="w-full h-10 p-2 bg-gray-300 rounded-lg"
                onChange={(e) => setCurrentPassword(e.target.value)}
                value={currentPassword}
              />
              {showCurrent ? (
                <EyeSlashIcon
                  className="size-[24px] absolute right-3 cursor-pointer"
                  onClick={() => setShowCurrent(!showCurrent)}
                />
              ) : (
                <EyeIcon
                  className="size-[24px] absolute right-3 cursor-pointer"
                  onClick={() => setShowCurrent(!showCurrent)}
                />
              )}
            </div>
            <p className="mt-2 text-gray-400">Enter your new password</p>
            <div className="flex justify-center items-center relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full h-10 p-2 bg-gray-300 rounded-lg"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {showPassword ? (
                <EyeSlashIcon
                  className="size-[24px] absolute right-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <EyeIcon
                  className="size-[24px] absolute right-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
            <p className="mt-2 text-gray-400">Confirm password</p>
            <div className="flex justify-center items-center relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full h-10 p-2 bg-gray-300 rounded-lg"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              {showConfirmPassword ? (
                <EyeSlashIcon
                  className="size-[24px] absolute right-3 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              ) : (
                <EyeIcon
                  className="size-[24px] absolute right-3 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              )}
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <button
              className="text-white bg-primary flex justify-center items-center rounded-[12px] w-full h-[50px] mt-4"
              onClick={handleChangePassword}
            >
              {loading ? <PropogateLoader color="#FFFF" /> : "Change Password"}
            </button>
          </div>

          <div className="mt-4 md:mt-5 w-full md:w-1/2 flex flex-col items-center">
            <h1 className="font-semibold text-lg md:text-xl lg:text-2xl my-5 text-center">
              Signature
            </h1>
            {user.signature ? (
            <img
              src={user.signature}
              alt="signature"
              className="border-2 w-full h-20"
           
            />
            ) : (
              <p className="text-gray-400">No signature uploaded</p>
            )}
          </div>
        </div>
      </div>
      {successModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 flex-col">
          <div className="bg-white relative w-1/6 flex flex-col items-center justify-center rounded-md">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="size-20 text-primary absolute -top-6"
            />
            <div>
              <h1 className="mt-20 text-[28px] font-bold text-center">
                Success
              </h1>
              <p className="my-7 text-gray-400 font-semibold text-center">
                User Edited!
              </p>
            </div>
            <div className="bg-graybg w-full rounded-b-lg flex justify-center items-center p-4">
              <button
                className="bg-primary p-2 w-1/2 rounded-[12px] text-white font-extrabold"
                onClick={closeSuccessModal}
              >
                OKAY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

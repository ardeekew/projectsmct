import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Avatar3 from "./assets/avatar.png";
import axios from "axios";
import PropogateLoader from "react-spinners/PropagateLoader";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  branchCode: string;
  contact: string;
  signature: string;
  userName: string;
}

const schema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: z.string().email("Invalid email format"),
  branchCode: z.string().nonempty("Branch code is required"),
  contact: z.string().refine((value) => /^\d{11}$/.test(value), {
    message: "Contact number must be 11 digits",
  }),
  userName: z.string().nonempty("Username is required"),
});

const pinputStyle = "font-medium border-2 border-black rounded-[12px] p-2";

const UpdateInformation = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(schema),
  });
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing");
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/api/Update_Profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          setUser(response.data.user);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch user information"
          );
        }
      } catch (error: any) {
        setError(
          error.message || "An error occurred while fetching user information"
        );
      } finally {
        setLoading(false); // Update loading state when done fetching
      }
    };

    fetchUserInformation();
  }, []);

  const onSubmit: SubmitHandler<User> = async (data) => {
    // Handle submit logic here
  };
  return (
    <div className="bg-graybg dark:bg-blackbg w-full h-screen pt-4 px-4 md:px-10 lg:px-30">
      <div className="bg-white  rounded-[12px] flex  w-full  px-4 md:px-[88px] pt-[50px] space-x-6">
        <div className="mb-5 rounded-[12px] w-full lg:w-2/3  flex flex-col   ">
          <div className="mb-4  flex flex-row ">
            <img alt="logo" height={118} width={118} src={Avatar3} />
            <div className="flex flex-col ml-4">
              <h1 className="font-bold text-lg md:text-[20px] mt-10 text-left">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-primary">Upload new picture</p>
            </div>
          </div>
          <div></div>
          <div className="flex flex-col w-full  items-start justify-center text-left px-4 ml-0 md:ml-10">
            <h1 className="font-semibold text-lg md:text-[20px]  my-5 mt-8">
              User Information
            </h1>
            {user && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-2 space-x-0 lg:gap-4 w-full ">
                  <div className="w-full flex flex-col">
                    <p className="text-gray-400">First Name</p>
                    <Controller
                      name="firstName"
                      control={control}
                      defaultValue={user.firstName} 
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`${pinputStyle}`}
                        />
                      )}
                    />
                    {errors.firstName && (
                      <span className="text-red-500">
                        {errors.firstName.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full flex flex-col">
                    <p className="text-gray-400">Last Name</p>
                    <Controller
                      name="lastName"
                      control={control}
                      defaultValue={user.lastName} 
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`${pinputStyle}`}
                        />
                      )}
                    />
                    {errors.lastName && (
                      <span className="text-red-500">
                        {errors.lastName.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full flex flex-col">
                    <p className="text-gray-400">Email</p>
                    <Controller
                      name="email"
                      control={control}
                      defaultValue={user.email} 
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`${pinputStyle}`}
                        />
                      )}
                    />
                    {errors.email && (
                      <span className="text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full flex flex-col">
                    <p className="text-gray-400">Branch</p>
                    <Controller
                      name="branchCode"
                      control={control}
                      defaultValue={user.branchCode} 
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`${pinputStyle}`}
                        />
                      )}
                    />
                    {errors.branchCode && (
                      <span className="text-red-500">
                        {errors.branchCode.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full flex flex-col">
                    <p className="text-gray-400">Contact</p>
                    <Controller
                      name="contact"
                      control={control}
                      defaultValue={user.contact} 
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`${pinputStyle}`}
                        />
                      )}
                    />
                    {errors.contact && (
                      <span className="text-red-500">
                        {errors.contact.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full flex flex-col">
                    <p className="text-gray-400">Username</p>
                    <Controller
                      name="userName"
                      control={control}
                      defaultValue={user.userName} 
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`${pinputStyle}`}
                        />
                      )}
                    />
                    {errors.userName && (
                      <span className="text-red-500">
                        {errors.userName.message}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-black text-white w-full  h-[48px] rounded-[12px]  mt-4 mb-8"
                >
                  Update User Information
                </button>
              </form>
            )}
            {loading && (
              <div className="flex justify-center items-center w-full">
                <PropogateLoader color="#ADD8E6" className=" " />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateInformation;

import React, { useState, CSSProperties } from "react";
import { Link } from "react-router-dom";
import Slice from "./assets/Slice.png";
import building from "./assets/building.jpg";
import { useNavigate } from "react-router-dom";
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { SubmitHandler, useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import BounceLoader from "react-spinners/ClipLoader";

type UserCredentials = z.infer<typeof schema>;

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(20),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  let [color, setColor] = useState("bg-primary");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCredentials>({
    resolver: zodResolver(schema),
  });

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const submitData: SubmitHandler<UserCredentials> = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/api/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data.status) {
        localStorage.setItem("token", response.data.token);
        if (response.data.role == "User") {
          navigate("/dashboard");
        } else {
          navigate("/dashboardapprover");
        }
      } else {
        alert("Invalid email or password");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while trying to log in");
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full lg:max-w-[417px] lg:h-[56px] md:h-10  p-2 bg-gray-300 rounded-lg";
  return (
    <div className="flex flex-row">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cover bg-center relative">
        <img
          className="absolute inset-0 object-cover w-full h-screen lg:hidden z-0"
          src={building}
          alt="photo"
        />

        <div className="lg:max-w-[481px] md:max-w-sm max-w-xs w-full lg:mt-0  mt-20  bg-opacity-90 p-8 rounded-lg z-10 lg:m-0 m-10 ">
          <h1 className="text-primary font-bold lg:text-[32px] md:text-2xl  mb-6 text-left lg:mt-0 ">
            ACCOUNT LOGIN
          </h1>
          <form onSubmit={handleSubmit(submitData)}>
            <div className="mb-4">
              <h1 className="lg:text-lg text-base mb-2">Email</h1>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter Email"
                className={`${inputStyle}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs"> {errors.email.message}</p>
              )}
            </div>
            <div className="mb-4">
              <h1 className="lg:text-lg text-base mb-2">Password</h1>
              <div className=" flex justify-center items-center relative w-full ">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter password"
                  className={`${inputStyle}`}
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
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {" "}
                  {errors.password.message}
                </p>
              )}
              <div className="flex justify-end">
                <Link to="/forgotpassword">
                  <p className=" font-medium lg:text-base text-xs mt-[12px]  cursor-pointer">
                    Forgot Password
                  </p>
                </Link>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <button
                className="bg-primary text-white px-4 rounded-lg w-full lg:max-w-[417px] lg:h-[56px] h-10"
                type="submit"
                onClick={() => setLoading(!loading)}
              >
                {!loading && "Log In"}
              </button>
              {loading ? (
                <BounceLoader color="#FFFFFF" className="absolute" />
              ) : null}
            </div>
          </form>

          <Link to="/registration">
            <div className="flex flex-row justify-center items-center mt-[10px]">
              <p className="text-center italic lg:text-base text-sm">
                Don't have an account?{" "}
              </p>
              <p className="pl-2 italic font-bold text-primary underline  lg:text-base text-sm">
                Sign Up
              </p>
            </div>
          </Link>
        </div>
      </div>
      <div className="hidden lg:block w-1/2  items-center justify-center">
        <img className="object-cover h-screen w-full" src={Slice} alt="photo" />
      </div>
    </div>
  );
};

export default Login;

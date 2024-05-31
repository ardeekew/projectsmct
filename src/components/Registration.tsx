import React from "react";
import { Link } from "react-router-dom";
import Slice from "./assets/Slice.png";
import building from "./assets/building.jpg";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { error } from "console";
import axios from "axios";
import { useNavigate } from "react-router-dom";
type UserCredentials = z.infer<typeof schema>;

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(5).max(20),
    userName: z.string().min(5).max(20),
    firstName: z.string().min(2).max(30),
    lastName: z.string().min(2).max(30),
    contact: z.string().min(11),
    branchCode: z.string().nonempty(),
    confirmPassword: z.string().min(5).max(20),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const branchOptions = [
  "AKLA",
  "ALEN",
  "ALAH",
  "ALIC",
  "ANTI",
  "ANTIP",
  "AURD",
  "AURH",
  "AURO",
  "BALA",
  "BALAM",
  "BALD",
  "BANTA",
  "BAYB",
  "BINAN",
  "BOGO",
  "BOHK",
  "BOHL",
  "BONI",
  "BUUD",
  "BUUH",
  "BULU",
  "CALA",
  "CALAP",
  "CALAP2",
  "CALD",
  "CALH",
  "CALI",
  "CARC",
  "CARC2",
  "CARMC",
  "CARMC2",
  "CARMCDO",
  "CARMO",
  "CATAR",
  "CATM",
  "COMPO",
  "CAGL",
  "CAMD",
  "CAMH",
  "DAAN",
  "DASMA",
  "DAPI",
  "DATH",
  "DIGOS",
  "DIPD",
  "DIPD2",
  "DIPL",
  "DSMA",
  "DSMAO",
  "DSMCA",
  "DSMB",
  "DSMBL",
  "DSMBN",
  "DSMDB",
  "DSMD",
  "DSMD2",
  "DSMDN",
  "DSMC",
  "DSMCN",
  "DSMM",
  "DSMP",
  "DSMSB",
  "DSMSO",
  "DSMT",
  "DSMT2",
  "DSMTA",
  "DSMTG",
  "DSMDM",
  "ELSA",
  "FAMY",
  "GUSA",
  "GUIN",
  "GUIN2",
  "HO",
  "ILOI",
  "ILID",
  "ILIG",
  "IMED",
  "INIT",
  "INAB",
  "IPIH",
  "IPID",
  "JAGN",
  "JIME",
  "JIMEDSM",
  "KABA",
  "KABA2",
  "KATI",
  "LABA",
  "LABD",
  "LAHU",
  "LAPU",
  "LILD",
  "LIPA",
  "MADRI",
  "MAND",
  "MAND2",
  "MANL",
  "MANO",
  "MANP",
  "MANG",
  "MARA",
  "MARA2",
  "MARD",
  "MARH",
  "MATI",
  "MEDE",
  "MIPU",
  "MOLD",
  "MOLD2",
  "MOLS",
  "NAIC",
  "NUND2",
  "OROD",
  "OROH",
  "OROH2",
  "OZAD",
  "OZAH",
  "OZAL",
  "PARD",
  "PARD2",
  "PARD3",
  "PAGS",
  "PUTD",
  "REMI",
  "REMI2",
  "RIZA",
  "RIZD",
  "SALA",
  "SANM",
  "SANJ",
  "SANP",
  "SDAV",
  "SDIP",
  "SILA",
  "SIND",
  "SINDA",
  "SLAP",
  "SLIL",
  "SMCT",
  "SROS",
  "SUCD",
  "TACU",
  "TALI",
  "TANH",
  "TANZ",
  "TANZ2",
  "TORI",
  "TRINI",
  "TRINI2",
  "TUBI",
  "TUBOD",
  "TUBU",
  "UBAY",
  "UBAYMB",
  "VETH",
  "VILLA",
  "VILLA2",
  "VALEN",
  "YATI",
  "ZAML",
];

const fieldStyle = "flex flex-row gap-4";
const headerStyle = "lg:text-lg text-base mb-2";
const inputStyle = "w-full  lg:h-[56px] md:h-10  p-2 bg-gray-300 rounded-lg";

const Registration: React.FC = () => {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCredentials>({
    resolver: zodResolver(schema),
  });

  const submitData = async (data: UserCredentials) => {
    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        email: data.email,
        password: data.password,
        userName: data.userName,
        firstName: data.firstName,
        lastName: data.lastName,
        contact: data.contact,
        branchCode: data.branchCode,
        confirmPassword: data.password,
      });

      console.log("response", response.data);

      if (response.data.status) {
        localStorage.setItem("token", response.data.token);
        alert("Success");
        window.setTimeout(() => {
          navigate("/login"); // Navigate to login after successful registration
        }, 2000);
      } else {
        alert("Registration failed. Please check your details and try again.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("An error occurred during the registration process.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <img
          className="absolute inset-0 object-cover w-full h-screen lg:hidden z-0"
          src={building}
          alt="photo"
        />
        <div className="w-full  bg-white   lg:p-8 p-4  lg:mt-0  mt-20 rounded-lg z-10 lg:m-0 m-10">
          <h1 className="text-primary font-bold lg:text-[32px] md:text-2xl mb-6 text-left">
            ACCOUNT REGISTRATION
          </h1>
          <form onSubmit={handleSubmit(submitData)}>
            <div className={`${fieldStyle}`}>
              <div className="w-1/2 mb-4">
                <h1 className={`${headerStyle}`}>First Name</h1>
                <input
                  type="text"
                  {...register("firstName")}
                  placeholder="Enter first name"
                  className={`${inputStyle}`}
                />
                <div>
                  {errors.firstName && (
                    <span className="text-red-500 text-xs">
                      {" "}
                      {errors.firstName.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-1/2 mb-4">
                <h1 className={`${headerStyle}`}>Last Name</h1>
                <input
                  type="text"
                  {...register("lastName")}
                  placeholder="Enter last name"
                  className={`${inputStyle}`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs">
                    {" "}
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className={`${fieldStyle}`}>
              <div className="w-1/2 mb-4">
                <h1 className={`${headerStyle}`}>Username</h1>
                <input
                  type="text"
                  {...register("userName")}
                  placeholder="Enter username"
                  className={`${inputStyle}`}
                />
                <div>
                  {errors.userName && (
                    <span className="text-red-500 text-xs">
                      {" "}
                      {errors.userName.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-1/2 mb-4">
                <h1 className={`${headerStyle}`}>Email</h1>
                <input
                  type="text"
                  {...register("email")}
                  placeholder="Enter email"
                  className={`${inputStyle}`}
                />
                <div>
                  {errors.email && (
                    <span className="text-red-500 text-xs">
                      {" "}
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className={`${fieldStyle}`}>
              <div className="w-1/2 mb-4">
                <h1 className={`${headerStyle}`}>Password</h1>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Enter password"
                  className={`${inputStyle}`}
                />
                <div>
                  {errors.password && (
                    <span className="text-red-500 text-xs">
                      {" "}
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-1/2 mb-4">
                <h1 className={`${headerStyle}`}>Confirm Password</h1>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Confirm password"
                  className={`${inputStyle}`}
                />
                <div>
                  {errors.confirmPassword && (
                    <span className="text-red-500 text-xs">
                      {" "}
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className={`${fieldStyle}`}>
              <div className="w-1/2 mb-4">
                <h1 className={`${headerStyle}`}>Contact</h1>
                <input
                  type="text"
                  {...register("contact")}
                  placeholder="Enter contact number"
                  className={`${inputStyle}`}
                />
                <div>
                  {errors.contact && (
                    <span className="text-red-500 text-xs">
                      {" "}
                      {errors.contact.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-1/2 mb-4">
                <h1 className={`${headerStyle}`}>Branch Code</h1>
                <div className="relative">
                  <Controller
                    name="branchCode"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full  lg:h-[56px] md:h-10 p-2 bg-gray-300 rounded-lg"
                      >
                        <option value="" disabled>
                          Select branch
                        </option>
                        {branchOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  />{" "}
                  <div>
                    {errors.branchCode && (
                      <span className="text-red-500 text-xs">
                        {" "}
                        {errors.branchCode.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button
              className="bg-primary  text-white py-2 px-4 rounded-lg w-full  lg:h-[56px]  md:h-10 "
              type="submit"
            >
              Register
            </button>
          </form>
          <Link to="/login">
            <div className="flex flex-row justify-center mt-4">
              <p className="text-center italic">Already have an account? </p>
              <p className="pl-2 italic font-bold text-primary underline">
                Log In
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

export default Registration;

import React, { useState, PureComponent } from "react";
import Man from "./assets/manComputer.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faCheck,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { CheckIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";


type Props = {};

const boxWhite = "bg-white w-full  h-[190px] rounded-[15px] drop-shadow-lg relative";
const boxPink = "w-full h-[150px]  rounded-t-[12px] relative";
const outerLogo = "lg:w-[120px] lg:h-[125px] w-[80px] h-[90px]   right-0 mr-[56px] lg:mt-[26px] mt-[56px] absolute";
const innerBox =
  "lg:w-[82px] lg:h-[84px] w-[57px] h-[58px]  bg-white absolute right-0 mr-[29px] lg:mt-[37px] md:mt-[47px] mt-[47px] rounded-[12px] flex justify-center items-center";
const innerLogo = "lg:w-[48px] lg:h-[51px] w-[40px] h-[45px]   flex justify-center items-center";

const data: { [key: string]: string } = {
  Request: "Purchase Order Requisition Slip",
  Branch: "Suzuki Auto Bohol",
  Date: "April 10, 2024",
  Status: "Pending",
};


const Dashboard: React.FC<Props> = ({}) => {
  const [darkMode, setDarkMode] = useState(true);
  const { userId } = useUser();
  return (
    <div className="bg-graybg dark:bg-blackbg  h-full pt-[26px]  px-[35px] ">
      <div className="bg-primary w-full sm:w-full h-[210px] rounded-[12px] pl-[30px] flex flex-row justify-between items-center">
        <div>
       
          <p className="text-[15px] lg:text-[20px] ">Hi, Kylie 👋</p>
          <p className="text-[15px] lg:text-[20px] text-white font-semibold ">
            Welcome to Request
          </p>
          <p className="text-[15px] hidden sm:block  text-white mb-4 ">
            Request products and services
          </p>
          <div>
            <Link to="/request">
            <button className="bg-[#FF947D] text-[10px] w-full lg:h-[57px] h-[40px] rounded-[12px] font-semibold ">Raise a Request</button>
            </Link>
          </div>
        </div>
        <div className="ml-4 mr-[29px]">
          <img alt="man" src={Man} width={320} height={176} />
        </div>
      </div>

      <div className="w-full sm:w-full grid grid-cols-1 md:grid-cols-3 space-y-2 md:space-y-0 gap-8 mt-4">
        <div className={`${boxWhite} hover:-translate-y-1 hover:scale-110`}>
          <div className={`${boxPink} bg-pink`}>
            <FontAwesomeIcon
              icon={faPaperPlane}
              className={`${outerLogo} text-[#C22158]`}
            />
            <div className={`${innerBox}`}>
              <FontAwesomeIcon
                icon={faPaperPlane}
                className={`${innerLogo} text-pink`}
              />
            </div>
          
              <p className="text-[16px] font-semibold mt-[30px]   ml-[17px] absolute" >Request Sent</p>
              <p className="text-[40px] font-bold bottom-6 mx-5 absolute"> 3</p>
          </div>
        </div>
        <div className={`${boxWhite}hover:-translate-y-1 hover:scale-110`}>
          <div className={`${boxPink} bg-green`}>
            <FontAwesomeIcon
              icon={faCheck}
              className={`${outerLogo}  text-[#4D9651]`}
            />
            <div className={`${innerBox}`}>
              <FontAwesomeIcon
                icon={faCheck}
                className={`${innerLogo}  text-green`}
              />
            </div>
           
              <p  className="text-[16px] font-semibold mt-[30px]   ml-[17px] absolute">Approved Requests</p>
              <p className="text-[40px] font-bold bottom-6 mx-5 absolute"> 1</p>
          </div>
        </div>

        <div className={`${boxWhite}hover:-translate-y-1 hover:scale-110`}>
          <div className={`${boxPink} bg-yellow`}>
            <FontAwesomeIcon
              icon={faEnvelope}
              className={`${outerLogo}  text-[#D88A1B]`}
            />
            <div className={`${innerBox}`}>
              <FontAwesomeIcon
                icon={faEnvelope}
                className={`${innerLogo}  text-yellow`}
              />
            </div>
           
              <p  className="text-[16px] font-semibold mt-[30px]   mx-[17px] absolute" >Pending Requests</p>
              <p className="text-[40px] font-bold bottom-6 mx-5 absolute"> 3</p>
          </div>
        </div>
      </div>
     
      <div className="mt-[20px] mb-10 bg-white w-full h-[210px] drop-shadow-lg rounded-[12px] px-4 relative sm:w-full overflow-x-auto">
        <h1 className="py-[16px] px-[25px] font-bold text-[20px]  ">
          Recent request
        </h1>
        <div className="flex flex-row justify-evenly">
  {Object.entries(data).map(([title, value]) => (
    <div key={title} className="flex flex-col justify-between">
      <div className="font-bold">{title}:</div>
      <div>{value}</div>
    </div>
  ))}
</div>
<button className="w-[95px] h-[35px] bg-primary text-white sm:absolute right-0 bottom-4 mr-[25px]  rounded-[12px] mt-2">View All</button>
      </div>
     
    </div>
  );
};

export default Dashboard;

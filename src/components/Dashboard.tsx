import React, { useState, PureComponent, useEffect } from "react";
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
import axios from "axios";
import DataTable from "react-data-table-component";
import ClipLoader from "react-spinners/ClipLoader";

interface Request {
  id: number;
  user_id: number;
  request_id: string;
  form_type: string;
  form_data: FormData[];
  date: Date;
  branch: string;
  status: string;
  purpose: string;
  totalBoatFare: string;
  destination: string;
}
type Record = {
  id: number;
  user_id: number;
  request_id: string;
  form_type: string;
  form_data: FormData[];
  date: Date;
  branch: string;
  status: string;
  purpose: string;
  totalBoatFare: string;
  destination: string;
};
type FormData = {
  purpose: string;
  items: Item[];
  date: string;
  branch: string;
  grand_total: string;
  supplier: string;
  address: string;
  totalBoatFare: string;
  totalContingency: string;
  totalFare: string;
  totalHotel: string;
  totalperDiem: string;
  totalExpense: string;
  cashAdvance: string;
  short: string;
  name: string;
  signature: string;
};
type Item = {
  quantity: string;
  description: string;
  unitCost: string;
  totalAmount: string;
  remarks: string;
  date: string;
  branch: string;
  status: string;
  day: string;
};

type Props = {};

const boxWhite =
  "bg-white w-full  h-[190px] rounded-[15px] drop-shadow-lg relative";
const boxPink = "w-full h-[150px]  rounded-t-[12px] relative";
const outerLogo =
  "lg:w-[120px] lg:h-[125px] w-[80px] h-[90px]   right-0 mr-[56px] lg:mt-[26px] mt-[56px] absolute";
const innerBox =
  "lg:w-[82px] lg:h-[84px] w-[57px] h-[58px]  bg-white absolute right-0 mr-[29px] lg:mt-[37px] md:mt-[47px] mt-[47px] rounded-[12px] flex justify-center items-center";
const innerLogo =
  "lg:w-[48px] lg:h-[51px] w-[40px] h-[45px]   flex justify-center items-center";

const Dashboard: React.FC<Props> = ({}) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const tableCustomStyles = {
    headRow: {
      style: {
        color: "black",
        backgroundColor: "#FFFF",
      },
    },
    rows: {
      style: {
        color: "STRIPEDCOLOR",
        backgroundColor: "STRIPEDCOLOR",
      },
      stripedStyle: {
        color: "NORMALCOLOR",
        backgroundColor: "#E7F1F9",
      },
    },
  };
  const userId = localStorage.getItem("id");

  
  useEffect(() => {
    if (userId) {
      setLoading(true);
      console.log("User ID:", userId);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios
        .get(`http://localhost:8000/api/view-request`, {
          headers,
        })
        .then((response) => {
          setRequests(response.data);
          console.log("Requests:", response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching requests data:", error);
        });
    }
  }, [userId]);
  const sortedRequests = requests.sort((a, b) => b.id - a.id);

  // Take the first 5 requests
  const latestRequests = sortedRequests.slice(0, 5);

  const columns = [
    {
      name: "Request ID",
      selector: (row: Record) => row.id,
      width: "100px",
      sortable: true,
    },
    {
      name: "User ID",
      selector: (row: Record) => row.user_id,
      width: "80px",
    },
    {
      name: "Request Type",
      selector: (row: Record) => row.form_type,
      width: "300px",
    },
    {
      name: "Date",
      selector: (row: Record) =>
        new Date(row.form_data[0].date).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    },
    {
      name: "Branch",
      selector: (row: Record) => row.form_data[0].branch,
    },
    {
      name: "Status",
      selector: (row: Record) => row.status,
      sortable: true,
      cell: (row: Record) => (
        <div
          className={`${
            row.status.trim() === "Pending"
              ? "bg-yellow"
              : row.status.trim() === "Approved"
              ? "bg-green"
              : row.status.trim() === "Unapproved"
              ? "bg-pink"
              : ""
          } rounded-lg py-1 w-full md:w-full xl:w-3/4 2xl:w-2/4  text-center text-white`}
        >
          {row.status.trim()}
        </div>
      ),
    },
  ];
const firstName = localStorage.getItem("firstName");
  return (
    <div className="bg-graybg dark:bg-blackbg  h-full pt-[26px]  px-[35px] ">
      <div className="bg-primary w-full sm:w-full h-[210px] rounded-[12px] pl-[30px] flex flex-row justify-between items-center">
        <div>
          <p className="text-[15px] lg:text-[20px] ">Hi, {firstName} 👋</p>
          <p className="text-[15px] lg:text-[20px] text-white font-semibold ">
            Welcome to Request
          </p>
          <p className="text-[15px] hidden sm:block  text-white mb-4 ">
            Request products and services
          </p>
          <div>
            <Link to="/request">
              <button className="bg-[#FF947D] text-[10px] w-full lg:h-[57px] h-[40px] rounded-[12px] font-semibold ">
                Raise a Request
              </button>
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

            <p className="text-[16px] font-semibold mt-[30px]   ml-[17px] absolute">
              Request Sent
            </p>
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

            <p className="text-[16px] font-semibold mt-[30px]   ml-[17px] absolute">
              Approved Requests
            </p>
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

            <p className="text-[16px] font-semibold mt-[30px]   mx-[17px] absolute">
              Pending Requests
            </p>
            <p className="text-[40px] font-bold bottom-6 mx-5 absolute"> 3</p>
          </div>
        </div>
      </div>

      <div className="mt-[20px] mb-10 bg-white w-full h-72 drop-shadow-lg rounded-[12px] relative sm:w-full overflow-x-auto">
        <h1 className="py-[16px] px-[25px] font-bold text-[20px]">
          Recent requests
        </h1>
        {loading ? (
          <div className="flex justify-center items-center">
            <ClipLoader color="#36d7b7" />
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <DataTable
              columns={columns}
              defaultSortFieldId={1}
              data={latestRequests.map((item: Record) => ({
                ...item,
                date: new Date(item.date),
              }))}
              pagination
              striped
              customStyles={tableCustomStyles}
            />
          </div>
        )}

        {!loading && (
          <div className="sticky bottom-4 right-4 items-end justify-end flex">
            <Link to="/request">
              <button className="w-[95px] h-[35px] bg-primary text-white rounded-[12px] mt-2">
                View All
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

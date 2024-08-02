import React, { useState, useEffect } from "react";
import axios from "axios";
import Man from "./assets/manComputer.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faCheck,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  format,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { CheckIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {};

const boxWhite =
  "bg-white w-full h-[190px] rounded-[15px] drop-shadow-lg relative";
const boxPink = "w-full h-[150px] rounded-t-[12px] relative";
const outerLogo =
  "lg:w-[120px] lg:h-[125px] w-[80px] h-[90px] right-0 mr-[56px] lg:mt-[26px] mt-[56px] absolute";
const innerBox =
  "lg:w-[82px] lg:h-[84px] w-[57px] h-[58px] bg-white absolute right-0 mr-[29px] lg:mt-[37px] md:mt-[47px] mt-[47px] rounded-[12px] flex justify-center items-center";
const innerLogo =
  "lg:w-[48px] lg:h-[51px] w-[40px] h-[45px] flex justify-center items-center";

interface Item {
  quantity: string;
  description: string;
  unitCost: string;
  totalAmount: string;
  remarks: string | null;
}

interface FormData {
  branch: string;
  date: string;
  status: string;
  grand_total: string;
  purpose?: string;
  items: Item[];
  approvers?: string;
  supplier?: string;
  address?: string;
}

interface Request {
  id: number;
  user_id: number;
  form_type: string;
  form_data: FormData[];
  created_at: string;
  updated_at: string;
  approvers_id: number;
}

interface ApprovalProcess {
  id: number;
  user_id: number;
  request_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

const ApproverDashboard: React.FC<Props> = ({}) => {
  const [darkMode, setDarkMode] = useState(true);
  const [totalRequests, setTotalRequests] = useState(0);
  const [approvedRequests, setApprovedRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [unsuccessfulRequests, setUnsuccessfulRequests] = useState(0);
  const [areaChartData, setAreaChartData] = useState<
    { name: string; pv: any }[]
  >([]);
  const [barChartData, setBarChartData] = useState<
    { name: string; Request: number }[]
  >([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("thisMonth");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");
      if (!token || !userId) {
        console.error("Token or userId is missing");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `http://localhost:8000/api/request-forms/for-approval/${userId}`,
        {
          headers,
        }
      );
      console.log("data", response.data);
      const data = response.data;
      const requests: Request[] = data.request_forms;

      setTotalRequests(requests.length);

      let approvedCount = 0;
      let pendingCount = 0;
      let unsuccessfulCount = 0;

      requests.forEach((request) => {
        request.form_data.forEach((form) => {
          if (form.status === "approved" || form.status === "Approved") {
            approvedCount++;
          } else if (form.status === "Pending" || form.status === "pending") {
            pendingCount++;
          } else if (
            form.status === "Disapproved" ||
            form.status === "disapproved"
          ) {
            unsuccessfulCount++;
          }
        });
      });

      setApprovedRequests(approvedCount);
      setPendingRequests(pendingCount);
      setUnsuccessfulRequests(unsuccessfulCount);
      console.log(approvedRequests, pendingRequests, unsuccessfulRequests);

      processAreaChartData(requests);
      processBarChartData(requests);
    } catch (error) {
      console.error("Error fetching requests data:", error);
    }
  };

  const processAreaChartData = (requests: Request[]) => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;
  
    if (selectedFilter === "thisMonth") {
      startDate = startOfMonth(today);
      endDate = endOfMonth(today);
    } else if (selectedFilter === "thisYear") {
      startDate = startOfYear(today);
      endDate = endOfYear(today);
    } else {
      return;
    }
  
    const aggregatedData: { [key: string]: number } = {};
  
    requests.forEach((record) => {
      const recordDate = new Date(record.created_at);
      if (recordDate >= startDate && recordDate <= endDate) {
        const monthName = format(recordDate, "MMM");
        if (aggregatedData[monthName]) {
          aggregatedData[monthName] += 1;
        } else {
          aggregatedData[monthName] = 1;
        }
      }
    });
  
    const allMonths = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
  
    const areaChartData = allMonths.map((month) => ({
      name: month,
      pv: Math.floor(aggregatedData[month] || 0), // Ensure whole numbers
    }));
  
    setAreaChartData(areaChartData);
  };
  

  const processBarChartData = (requests: Request[]) => {
    const today = new Date();
    const currentWeekStartDate = startOfWeek(today);

    const aggregatedData: { [key: string]: number } = {};

    requests.forEach((record) => {
      const recordDate = new Date(record.created_at);
      if (recordDate >= currentWeekStartDate) {
        const dayName = format(recordDate, "EEE");
        if (aggregatedData[dayName]) {
          aggregatedData[dayName] += 1;
        } else {
          aggregatedData[dayName] = 1;
        }
      }
    });

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const barChartData = weekDays.map((day) => ({
      name: day,
      Request: Math.floor(aggregatedData[day] || 0),
    }));

    setBarChartData(barChartData);
    console.log("Bar chart data:", barChartData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-graybg dark:bg-blackbg h-full pt-[26px] px-[30px]">
      <div className="bg-primary w-full sm:w-full h-[210px] rounded-[12px] pl-[30px] flex flex-row justify-between items-center">
        <div>
          <p className="text-[15px] lg:text-[20px]">Hi, Kylie 👋</p>
          <p className="text-[15px] lg:text-[20px] text-white font-semibold">
            Welcome to Request
          </p>
          <p className="text-[15px] hidden sm:block text-white mb-4">
            Request products and services
          </p>
          <div>
            <Link to="/request">
              <button className="bg-[#FF947D] text-[10px] w-full lg:h-[57px] h-[40px] rounded-[12px] font-semibold">
                Approve Requests
              </button>
            </Link>
          </div>
        </div>
        <div className="ml-4 mr-[29px]">
          <img alt="man" src={Man} width={320} height={176} />
        </div>
      </div>

      <div className="w-full sm:w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 space-y-2 md:space-y-0 gap-8 mt-4">
        <div className={`${boxWhite} hover:-translate-y-1 hover:scale-110`}>
          <div className={`${boxPink} bg-primary`}>
            <ChartBarIcon className={`${outerLogo} text-[#298DDE]`} />
            <div className={`${innerBox}`}>
              <ChartBarIcon className={`${innerLogo} text-primary`} />
            </div>
            <p className="text-[16px] font-semibold mt-[30px] ml-[17px] absolute">
              Total Requests
            </p>
            <p className="text-[40px] font-bold bottom-6 mx-5 absolute">
              {totalRequests}
            </p>
          </div>
        </div>
        <div className={`${boxWhite} hover:-translate-y-1 hover:scale-110`}>
          <div className={`${boxPink} bg-green`}>
            <FontAwesomeIcon
              icon={faCheck}
              className={`${outerLogo} text-[#4D9651]`}
            />
            <div className={`${innerBox}`}>
              <FontAwesomeIcon
                icon={faCheck}
                className={`${innerLogo} text-green`}
              />
            </div>
            <p className="text-[16px] font-semibold mt-[30px] ml-[17px] absolute">
              Approved Requests
            </p>
            <p className="text-[40px] font-bold bottom-6 mx-5 absolute">
              {approvedRequests}
            </p>
          </div>
        </div>
        <div className={`${boxWhite} hover:-translate-y-1 hover:scale-110`}>
          <div className={`${boxPink} bg-yellow`}>
            <FontAwesomeIcon
              icon={faEnvelope}
              className={`${outerLogo} text-[#D88A1B]`}
            />
            <div className={`${innerBox}`}>
              <FontAwesomeIcon
                icon={faEnvelope}
                className={`${innerLogo} text-yellow`}
              />
            </div>
            <p className="text-[16px] font-semibold mt-[30px] ml-[17px] absolute">
              Pending Requests
            </p>
            <p className="text-[40px] font-bold bottom-6 mx-5 absolute">
              {pendingRequests}
            </p>
          </div>
        </div>
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
            <p className="text-[16px] font-semibold mt-[30px] ml-[17px] absolute">
              Unsuccessful Requests
            </p>
            <p className="text-[40px] font-bold bottom-6 mx-5 absolute">
              {unsuccessfulRequests}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-7 py-10 bg-white drop-shadow-lg w-full rounded-[12px] h-[327px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
  <AreaChart
    width={500}
    height={400}
    data={areaChartData}
    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
  >
    <CartesianGrid strokeDasharray="3 " />
    <XAxis dataKey="name" />
    <YAxis
      domain={[0, 'auto']} // Ensure the Y-axis starts from 0 and scales automatically
      ticks={[1, 2, 3, 4, 5, 6]} // Set specific ticks for whole numbers
      tickFormatter={(value) => Math.floor(value).toString()} // Ensure whole number display
    />
    <Tooltip />
    <Area
      type="monotone"
      dataKey="pv"
      stroke="#1E9AFF"
      fill="#389DF1"
    />
  </AreaChart>
</ResponsiveContainer>


        </div>
        <div className="flex-3 pb-10 pt-2 bg-white w-full drop-shadow-lg lg:w-2/4 rounded-[12px] h-[327px] mt-4">
          <h1 className="text-center font-bold text-lg">THIS WEEK</h1>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={barChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => Math.floor(value).toString()}
                allowDecimals={false}
              />
              <Tooltip />
              <Bar dataKey="Request" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ApproverDashboard;

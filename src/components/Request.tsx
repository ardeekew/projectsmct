import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ViewRequestModal from "./ViewRequestModal";
import { Link } from "react-router-dom";
type Props = {};
type RequestRecord = {
  user_id: number;
  request_id: string;
  requestType: string;
  date: Date;
  branch: string;
  items: Item[];
  purpose: string;
  status: string;
};

type Record = {
  user_id: number;
  request_id: string;
  requestType: string;
  date: Date;
  branch: string;
  status: string;
  items: Item[];
  purpose: string;
  
};

type Item = {
  quantity: string;
  description: string;
  unitCost: string;
  totalAmount: string;
  remarks: string;
};

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

const Request = (props: Props) => {
  const [selected, setSelected] = useState(0);
  const [data, setData] = useState([]);
  const [stockRequisitions, setStockRequisitions] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [additionalData1, setAdditionalData1] = useState<any>(null);
  const [additionalData2, setAdditionalData2] = useState<any>(null);
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    // Fetch data from the API using Axios
    if (userId) {
      console.log("Fetching data...");

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios
        .get(`http://localhost:8000/api/view-stock?user_id=${userId}`, {
          headers,
        })
        .then((response) => {
          setStockRequisitions(response.data);
          console.log("stock:", response.data);
          console.log(response.data);
          console.log(userId);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });

      axios
        .get(`http://localhost:8000/api/view-purchase?user_id=${userId}`, {
          headers,
        })
        .then((response) => {
          setPurchaseOrders(response.data);
          console.log("Purchase:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching stock requisitions data:", error);
        });
    }
  }, [userId]);
  const handleView = (record: Record) => {
    setSelectedRecord(record);
    console.log("record", record);
    setModalIsOpen(true);
  };

  const handleClick = (index: number) => {
    setSelected(index);
  };


  const filteredData = () => {
    switch (selected) {
      case 0: // All Requests
        return [...stockRequisitions, ...purchaseOrders];
      case 1: // Pending Requests
        return [...stockRequisitions, ...purchaseOrders].filter(
          (item: Record) => item.status === "Pending"
        );
      case 2: // Approved Requests
        return [...stockRequisitions, ...purchaseOrders].filter(
          (item: Record) => item.status === "Approved"
        );
      case 3: // Unsuccessful Requests
        return [...stockRequisitions, ...purchaseOrders].filter(
          (item: Record) => item.status === "Unapproved"
        );
      default:
        return [...stockRequisitions, ...purchaseOrders];
    }
  };

  const columns = [
    {
      name: "Request ID",
      selector: (row: Record) => row.request_id,
    },
    {
      name: "User ID",
      selector: (row: Record) => row.user_id,
    },
    {
      name: "Request Type",
      selector: (row: Record) => row.requestType,
    },
    {
      name: "Date",
      selector: (row: Record) => new Date(row.date).toDateString(),
    },
    {
      name: "Branch",
      selector: (row: Record) => row.branch,
    },
    {
      name: "Status",
      selector: (row: Record) => row.status,
      sortable: true,
      cell: (row: Record) => (
        <div
          className={`${
            row.status === "Pending"
              ? "bg-yellow"
              : row.status === "Approved"
              ? "bg-green"
              : "bg-pink"
          } rounded-lg  py-1 w-full xl:w-3/4 2xl:w-1/2 text-center text-white`}
        >
          {row.status}
        </div>
      ),
    },
    {
      name: "Modify",
      cell: (row: Record) => (
        <button
          className="bg-primary text-white  px-4 py-2 rounded-[12px]"
          onClick={() => handleView(row)}
        >
          View
        </button>
      ),
    },
  ];

  const items = [
    "All Requests",
    "Pending Requests",
    "Approved Requests",
    "Unsuccessful Requests",
  ];

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="bg-graybg dark:bg-blackbg w-full h-screen pt-4 px-10 md:px-10 lg:px-30">      
    <Link to="/request/sr">
      <button className="bg-primary text-white rounded-[12px] mb-2 w-[120px] sm:w-[151px] h-[34px] z-10">
        Send Request
      </button>
      </Link>
      <div className="w-full  h-auto  drop-shadow-lg rounded-lg  md:mr-4 relative ">
        <div className="bg-white   rounded-lg  w-full flex flex-col items-center overflow-x-auto">
          <div className="w-full border-b-2  md:px-30">
            <ul className=" px-2 md:px-30 flex justify-start items-center space-x-4 md:space-x-6 py-4 font-medium overflow-x-auto">
              {items.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleClick(index)}
                  className={`cursor-pointer hover:text-primary px-2 ${
                    selected === index ? "underline text-primary" : ""
                  } underline-offset-8 decoration-primary decoration-2`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full  overflow-x-auto ">
            <DataTable
              columns={columns}
              data={filteredData().map((item: Record) => ({
                ...item,
                date: new Date(item.date),
              }))}
              pagination
              striped
              customStyles={tableCustomStyles}
            />
          </div>
        </div>
      </div>
      
   
    </div>
  );
};

export default Request;

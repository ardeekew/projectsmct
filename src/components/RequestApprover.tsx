import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { Link } from "react-router-dom";
import ViewStockModal from "./Modals/ViewStockModal";
import ViewPurchaseModal from "./Modals/ViewPurchaseModal";
import ViewCashDisbursementModal from "./Modals/ViewCashDisbursementModal";
import ViewCashAdvanceModal from "./Modals/ViewCashAdvanceModal";
import ViewLiquidationModal from "./Modals/ViewLiquidationModal";
import ViewRequestModal from "./Modals/ViewRequestModal";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

type Props = {};

type Record = {
  id: number;
  created_at: Date;
  user_id: number;
  request_id: string;
  form_type: string;
  form_data: MyFormData[];
  date: Date;
  branch: string;
  status: string;
  purpose: string;
  totalBoatFare: string;
  destination: string;
  grand_total: string;
  grandTotal: string;
  approvers_id:number;
};
type MyFormData = {
  approvers_id: number;
  purpose: string;
  items: MyItem[];
  approvers: {
    noted_by: { firstName: string; lastName: string }[];
    approved_by: { firstName: string; lastName: string }[];
  };
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

type MyItem = {
  quantity: string;
  description: string;
  unitCost: string;
  totalAmount: string;
  remarks: string;
  date: string;
  cashDate: string;
  branch: string;
  status: string;
  day: string;
  itinerary: string; 
  activity: string;
  hotel: string;
  rate: string;
  amount: string;
  perDiem: string;
  liquidationDate: string;
  particulars: string;
  particularsAmount: string;
  destination: string;
  transportation: string;
  transportationAmount: string;
  hotelAmount: string;
  hotelAddress: string; 
  grandTotal: string;
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
  const [requests, setRequests] = useState<Record[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const userId = localStorage.getItem("id");
  
  useEffect(() => {
    if (userId) {
      console.log("Fetching data...");
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
        .get(`http://localhost:8000/api/view-requests`, {
          headers,
        })
        .then((response) => {
          setRequests(response.data);
          console.log("Requests:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching requests data:", error);
        });
    }
  }, [userId]);

  const handleView = (record: Record) => {
    setSelectedRecord(record);
    setModalIsOpen(true);
  };

  const handleClick = (index: number) => {
    setSelected(index);
  };

  const filteredData = () => {
    switch (selected) {
      case 0: // All Requests
        return requests;
      case 1: // Pending Requests
        return requests.filter(
          (item: Record) => item.status.trim() === "Pending"
        );
      case 2: // Approved Requests
        return requests.filter(
          (item: Record) => item.status.trim() === "Approved"
        );
      case 3: // Unsuccessful Requests
        return requests.filter(
          (item: Record) => item.status.trim() === "Unapproved"
        );
      default:
        return requests;
    }
  };

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
        new Date(row.created_at).toLocaleDateString(undefined, {
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
    {
      name: "Modify",
      width: "150px",
      cell: (row: Record) => (
        <button
          className="bg-primary text-white  px-3 py-1 rounded-[16px]"
          onClick={() => handleView(row)}
        >
          View
        </button>
      ),
    },
  ];
  const refreshData = () => {
    if (userId) {
      console.log("Refreshing data...");
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
          console.log("Requests refreshed:", response.data);
        })
        .catch((error) => {
          console.error("Error refreshing requests data:", error);
        });
    }
  };
  
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
    <div className="bg-graybg dark:bg-blackbg w-full h-lvh pt-4 px-10 md:px-10 lg:px-30">
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
              defaultSortFieldId={1}
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
      {modalIsOpen &&
        selectedRecord &&
        selectedRecord.form_type === "Stock Requisition Slip" && (
          <ViewStockModal
            closeModal={closeModal}
            record={{ ...selectedRecord, date: selectedRecord.date.toString() }}
              refreshData={refreshData}
            />
        )}
      {modalIsOpen &&
        selectedRecord &&
        selectedRecord.form_type === "Purchase Order Requisition Slip" && (
          <ViewPurchaseModal
            closeModal={closeModal}
            record={{ ...selectedRecord, date: selectedRecord.date.toString() }}
            refreshData={refreshData}
            />
        )}
      {modalIsOpen &&
        selectedRecord &&
        selectedRecord.form_type === "Cash Disbursement Requisition Slip" && (
          <ViewCashDisbursementModal
            closeModal={closeModal}
            record={{ ...selectedRecord, date: selectedRecord.date.toString() }}
            refreshData={refreshData}
            />
        )}
      {modalIsOpen &&
        selectedRecord &&
        selectedRecord.form_type === "Application For Cash Advance" && (
          <ViewCashAdvanceModal
            closeModal={closeModal}
            record={{ ...selectedRecord, date: selectedRecord.date.toString() }}
            refreshData={refreshData}
          />
        )}
      {modalIsOpen &&
        selectedRecord &&
        selectedRecord.form_type === "Liquidation of Actual Expense" && (
          <ViewLiquidationModal
            closeModal={closeModal}
            record={{ ...selectedRecord, date: selectedRecord.date.toString() }}
            refreshData={refreshData}
          />
        )}
      {modalIsOpen &&
        selectedRecord &&
        selectedRecord.form_type === "Refund Request" && (
          <ViewRequestModal
            closeModal={closeModal}
            record={{ ...selectedRecord, date: selectedRecord.date.toString() }}
            refreshData={refreshData}
          />
        )}
    </div>
  );
};

export default Request;

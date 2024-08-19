import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import PrintPurchase from "./PrintPurchase";
import { ClipLoader } from "react-spinners";
import { PencilIcon } from "@heroicons/react/24/solid";
import Avatar from "./assets/avatar.png";
import SMCTLogo from "./assets/SMCT.png";
import DSMLogo from "./assets/DSM.jpg";
import DAPLogo from "./assets/DAP.jpg";
import HDILogo from "./assets/HDI.jpg";
import ApproveSuccessModal from "./ApproveSuccessModal";
import PrintLiquidation from "./PrintLiquidation";
type Props = {
  closeModal: () => void;
  record: Record;
  refreshData: () => void;
};
interface Approver {
  id: number;
  firstname: string;
  lastname: string;
  firstName: string;
  lastName: string;
  name: string;
  comment: string;
  position: string;
  signature: string;
  status: string;
  branch: string;
}
type Record = {
  id: number;
  status: string;
  approvers_id: number;
  form_data: FormData[];
  supplier?: string;
  address?: string;
  branch: string;
  date: string;
  user_id: number;
  destination: string;
  attachment: string;
};

type FormData = {
  approvers_id: number;
  approvers: {
    noted_by: { firstName: string; lastName: string }[];
    approved_by: { firstName: string; lastName: string }[];
  };
  purpose: string;
  items: Item[];
  branch: string;
  date: string;
  grand_total: string;
  supplier: string;
  address: string;
  totalExpense: string;
  cashAdvance: string;
  short: string;
  name: string;
  signature: string;
};

type Item = {
  liquidationDate: string;
  destination: string;
  transportation: string;
  transportationAmount: string;
  hotel: string;
  hotelAddress: string;
  hotelAmount: string;
  perDiem: string;
  particulars: string;
  particularsAmount: string;
  grandTotal: string;
};
const tableStyle = "border-2 border-black p-2 w-full";
const inputStyle = "  border-2 border-black rounded-[12px] pl-[10px]";
const input2Style = "  border-2 border-black rounded-[12px] ";
const inputStyles =
  "  border-2 border-black rounded-[12px] pl-[10px] text-end pr-10 font-bold";
const tableCellStyle = `${inputStyle}  w-10 h-12`;
const tableInput = "w-full h-full bg-white px-2 py-1";
const itemDiv = "flex flex-col  w-3/4";
const ApproverLiquidation: React.FC<Props> = ({
  closeModal,
  record,
  refreshData,
}) => {
  const [editableRecord, setEditableRecord] = useState(record);
  const [newData, setNewData] = useState<Item[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [cashAdvance, setCashAdvance] = useState("");
  const [loading, setLoading] = useState(false);
  const [editedApprovers, setEditedApprovers] = useState<number>(
    record.approvers_id
  );
  const [approveLoading, setApprovedLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [comments, setComments] = useState("");
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [fetchingApprovers, setFetchingApprovers] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editedDate, setEditedDate] = useState("");
  const [newCashAdvance, setNewCashAdvance] = useState("");
  const [notedBy, setNotedBy] = useState<Approver[]>([]);
  const [approvedBy, setApprovedBy] = useState<Approver[]>([]);
  const [isFetchingApprovers, setisFetchingApprovers] = useState(false);
  const [customApprovers, setCustomApprovers] = useState<Approver[]>([]);
  const [user, setUser] = useState<any>({});
  const [printWindow, setPrintWindow] = useState<Window | null>(null);
  const [isFetchingUser, setisFetchingUser] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string[]>([]);
  const [modalStatus, setModalStatus] = useState<'approved' | 'disapproved'>('approved');
  let logo;
  if (user?.data?.branch === "Strong Motocentrum, Inc.") {
    logo = <img src={SMCTLogo} alt="SMCT Logo" />;
  } else if (user?.data?.branch === "Des Strong Motors, Inc.") {
    logo = <img src={DSMLogo} alt="DSM Logo" />;
  } else if (user?.data?.branch === "Des Appliance Plaza, Inc.") {
    logo = <img src={DAPLogo} alt="DAP Logo"/>;
  } else if (user?.data?.branch === "Honda Des, Inc.") {
    logo = <img src={HDILogo} alt="HDI Logo" />;
  } else {
    logo = null; // Handle the case where branch does not match any of the above
  }
  useEffect(() => {
    const currentUserId = localStorage.getItem("id");

    // Ensure currentUserId and userId are converted to numbers if they exist
    const userId = currentUserId ? parseInt(currentUserId) : 0;
   
    setEditableRecord(record);
    setNewCashAdvance(record.form_data[0].cashAdvance);
    fetchUser(record.user_id);
    if (currentUserId) {
      fetchCustomApprovers(record.id);
     
    }
    try {
      // If record.attachment is a JSON string, parse it
      if (typeof record.attachment === "string") {
        const parsedAttachment = JSON.parse(record.attachment);
        // Handle the parsed attachment
        const fileUrls = parsedAttachment.map(
          (filePath: string) =>
            `http://122.53.61.91:6002/storage/${filePath.replace(/\\/g, "/")}`
        );
        setAttachmentUrl(fileUrls);
      } else {
        // Handle case where record.attachment is already an object
        console.warn("Attachment is not a JSON string:", record.attachment);
        // Optionally handle this case if needed
      }
    } catch (error) {
      console.error("Error parsing attachment:", error);
    }
  }, [record]);
  const fetchUser = async (id: number) => {
    setisFetchingUser(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }

      const response = await axios.get(
        `http://122.53.61.91:6002/api/view-user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch approvers:", error);
    } finally {
      setisFetchingUser(false);
    }
  };
  
  const calculateTotalExpense = () => {
    return newData
      .reduce((total, item) => {
        return total + parseFloat(item.grandTotal || "0");
      }, 0)
      .toFixed(2);
  };

  const calculateShort = (totalExpense: number, cashAdvance: number) => {
    const short = cashAdvance - totalExpense;
    return short.toFixed(2);
  };
  const fetchCustomApprovers = async (id: number) => {
    setisFetchingApprovers(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }

      const response = await axios.get(
        `http://122.53.61.91:6002/api/request-forms/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { notedby, approvedby } = response.data;
      setNotedBy(notedby);
      setApprovedBy(approvedby);
      setApprovers(approvers);
     
    } catch (error) {
      console.error("Failed to fetch approvers:", error);
    } finally {
      setisFetchingApprovers(false);
    }
  };

  const handleDisapprove = async () => {
    const userId = localStorage.getItem("id") ?? "";
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Token is missing");
        return;
      }

      const requestData = {
        user_id: parseInt(userId),
        action: "disapprove",
        comment: comments,
      };

      const response = await axios.put(
        `http://122.53.61.91:6002/api/request-forms/${record.id}/process`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );


      setLoading(false);
      setModalStatus('disapproved'); // Set modal status to 'disapproved'
      setShowSuccessModal(true);
      refreshData();
    } catch (error: any) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update stock requisition.";
      console.error("Error disapproving request form:", errorMessage);
      setErrorMessage(errorMessage);
    }
  };
  const handleApprove = async () => {
    const userId = localStorage.getItem("id") ?? "";
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Token is missing");
      return;
    }

    const requestData = {
      user_id: parseInt(userId),
      action: "approve",
      comment: comments,
    };

    try {
      setApprovedLoading(true);
   

      const response = await axios.put(
        `http://122.53.61.91:6002/api/request-forms/${record.id}/process`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );


      setApprovedLoading(false);
      setModalStatus('approved'); 
      setShowSuccessModal(true);
      refreshData();
    } catch (error: any) {
      setApprovedLoading(false);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update stock requisition.";
      console.error("Error approving request form:", errorMessage);
      setErrorMessage(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

 

 


  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string
  ) => {
    const newDataCopy = [...newData];
    newDataCopy[index] = { ...newDataCopy[index], [field]: value };
    setErrorMessage("");

    // Calculate the new grandTotal for the row
    const hotelAmount = parseFloat(newDataCopy[index].hotelAmount) || 0;
    const perDiem = parseFloat(newDataCopy[index].perDiem) || 0;
    const particularsAmount =
      parseFloat(newDataCopy[index].particularsAmount) || 0;
    const grandTotal = hotelAmount + perDiem + particularsAmount;

    // Update the grandTotal in the newDataCopy
    newDataCopy[index] = {
      ...newDataCopy[index],
      grandTotal: grandTotal.toString(),
    };

    // Calculate the totalExpense by summing up all the grandTotal values
    const totalExpense = newDataCopy.reduce((total, item) => {
      return total + parseFloat(item.grandTotal);
    }, 0);

    // Update the state with the new data and totalExpense
    setNewData(newDataCopy);

    // Calculate the short amount
    const cashAdvance =
      parseFloat(editableRecord.form_data[0].cashAdvance) || 0;
    const short = totalExpense - cashAdvance;

    // Update the editableRecord with new totalExpense and short values
    setEditableRecord((prevState) => ({
      ...prevState,
      form_data: [
        {
          ...prevState.form_data[0],
          totalExpense: totalExpense.toString(),
          short: short.toFixed(2),
        },
      ],
      approvers_id: editedApprovers,
    }));
  };

  
  const handlePrint = () => {
    // Construct the data object to be passed
    const data = {
      id: record,
      approvedBy: approvedBy,
      notedBy: notedBy,
      user: user,
    };
    

  
    localStorage.setItem('printData', JSON.stringify(data));
  
    // Open a new window with PrintRefund component
    const newWindow = window.open(`/print-liquidation`, "_blank");

    // Optional: Focus the new window
    if (newWindow) {
      newWindow.focus();
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="p-4 relative w-full px-10 md:mx-0 z-10  md:w-1/2 lg:w-2/3 space-y-auto h-4/5 overflow-scroll bg-white border-black rounded-t-lg shadow-lg">
        <div className=" top-2 flex justify-end cursor-pointer sticky">
          <XMarkIcon className="h-6 w-6 text-black" onClick={closeModal} />
        </div>
        {!fetchingApprovers && !isFetchingApprovers && (
  <>
    <button
      className="bg-blue-600 p-1 px-2 rounded-md text-white"
      onClick={handlePrint}
    >
      Print
    </button>
    {printWindow && (
      <PrintLiquidation
        data={{
          id: record,
          approvedBy: approvedBy,
          notedBy: notedBy,
          user: user,
        }}
      />
    )}
  </>
)}
        <div className="flex flex-col justify-center items-center">
          <div className="justify-center w-1/2">{logo}</div>
          <h1 className="font-bold text-[18px] uppercase ">
          Liquidation of Actual Expense
          </h1>
          <div className=" ">{user?.data?.branch}</div>
        </div>
        <div className="justify-start items-start flex flex-col space-y-2 w-full">
         
          <p className="font-medium text-[14px]">Request ID:#{record.id}</p>
          <div className="flex w-full md:w-1/2 items-center">
            <p>Status:</p>
            <p
              className={`${
                record.status.trim() === "Pending"
                  ? "bg-yellow"
                  : record.status.trim() === "Approved"
                  ? "bg-green"
                  : record.status.trim() === "Disapproved"
                  ? "bg-pink"
                  : ""
              } rounded-lg  py-1 w-1/3
             font-medium text-[14px] text-center ml-2 text-white`}
            >
              {" "}
              {record.status}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 w-full mb-2">
            <div className="w-full">
              <h1>Branch</h1>
              <input
                type="text"
                className="border border-black rounded-md p-1 mt-2 w-full "
                value={record.form_data[0].branch}
                readOnly
              />
            </div>
            <div className="w-full">
              <h1>Date</h1>
              {isEditing ? (
                <input
                  type="date"
                  className="border border-black rounded-md p-1 mt-2 w-full"
                  value={
                    editedDate
                      ? new Date(editedDate).toISOString().split("T")[0]
                      : ""
                  } // Convert to YYYY-MM-DD format
                  onChange={(e) => setEditedDate(e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  className="border border-black rounded-md p-1 mt-2 w-full"
                  value={formatDate(editableRecord.form_data[0].date)}
                  readOnly
                />
              )}
            </div>
          </div>
          <div className="mt-6 w-full overflow-x-auto ">
            <div className="w-full border-collapse  ">
              <div className="table-container">
                <table className="border-collapse  w-full border-black border-2 ">
                  <thead className="">
                    <tr>
                      <th className="border-2 w-10 border-black bg-[#8EC7F7]">
                        Date
                      </th>
                      <th
                        colSpan={3}
                        className="border-2 border-black bg-[#8EC7F7]"
                      >
                        Transportation
                      </th>
                      <th
                        colSpan={3}
                        className="border-2 border-black bg-[#8EC7F7] h-14"
                      >
                        Hotel
                      </th>
                      <th
                        colSpan={3}
                        className="border-2 border-black bg-[#8EC7F7]"
                      >
                        PER DIEM OTHER RELATED EXPENSES
                      </th>
                      <th className="bg-[#8EC7F7]"></th>
                    </tr>
                    <tr>
                      <th className="w-1/12">Date</th>

                      <th className={`${tableStyle} w-2/12`}>Destination</th>
                      <th className={`${tableStyle} w-2/12`}>
                        Type of Transportation
                      </th>
                      <th className={`${tableStyle} w-10`}>Amount</th>
                      <th className={`${tableStyle} w-10`}>Hotel</th>
                      <th className={`${tableStyle} w-2/12`}>Place</th>
                      <th className={`${tableStyle}`}>Amount</th>
                      <th className={`${tableStyle}`}>Per Diem</th>
                      <th className={`${tableStyle}`}>Particulars</th>
                      <th className={`${tableStyle}`}>Amount</th>
                      <th className={`${tableStyle}`}>Grand Total</th>
                    </tr>
                  </thead>
                  <tbody className={`${tableCellStyle}`}>
                    {isEditing
                      ? newData.map((item, index) => (
                          <tr key={index}>
                            <td className={`${tableCellStyle} w-2/12`}>
                              <input
                                type="date"
                                value={item.liquidationDate}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "liquidationDate",
                                    e.target.value
                                  )
                                }
                                className="w-20"
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="text"
                                value={item.destination}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "destination",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="text"
                                value={item.transportation}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "transportation",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="text"
                                value={item.transportationAmount}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "transportationAmount",
                                    e.target.value
                                  )
                                }
                                className="w-10/12"
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="text"
                                value={item.hotel}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "hotel",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="text"
                                value={item.hotelAddress}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "hotelAddress",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="text"
                                value={item.hotelAmount}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "hotelAmount",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="text"
                                value={item.perDiem}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "perDiem",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="text"
                                value={item.particulars}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "particulars",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="text"
                                value={item.particularsAmount}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "particularsAmount",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="text"
                                value={item.grandTotal}
                                readOnly
                              />
                            </td>
                          </tr>
                        ))
                      : editableRecord.form_data[0].items.map((item, index) => (
                          <tr key={index}>
                            <td className={tableCellStyle}>
                              {formatDate(item.liquidationDate)}
                            </td>
                            <td className={tableCellStyle}>
                              {item.destination}
                            </td>
                            <td className={tableCellStyle}>
                              {item.transportation}
                            </td>
                            <td className={tableCellStyle}>
                              {item.transportationAmount}
                            </td>
                            <td className={tableCellStyle}>{item.hotel}</td>
                            <td className={tableCellStyle}>
                              {item.hotelAddress}
                            </td>
                            <td className={tableCellStyle}>
                              {item.hotelAmount}
                            </td>
                            <td className={tableCellStyle}>{item.perDiem}</td>
                            <td className={tableCellStyle}>
                              {item.particulars}
                            </td>
                            <td className={tableCellStyle}>
                              {item.particularsAmount}
                            </td>
                            <td className={tableCellStyle}>
                              {item.grandTotal}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 w-full md:gap-2">
            <div>
              <table className="border border-black  mt-10 w-full">
                <tr>
                  <td className={`${tableStyle}`}>
                    <p className="font-semibold pl-2 pr-20   ">TOTAL EXPENSE</p>
                  </td>
                  <td className={`${inputStyles} font-bold`}>
                    {isEditing
                      ? calculateTotalExpense()
                      : parseFloat(
                          editableRecord.form_data[0].totalExpense
                        ).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className={`${tableStyle}`}>
                    <p className="font-semibold pl-2 pr-20   ">Cash Advance</p>
                  </td>
                  <td className={`${tableStyle}`}>
                    {isEditing ? (
                      <input
                        type="number"
                        value={newCashAdvance}
                        onChange={(e) => setNewCashAdvance(e.target.value)}
                        className="w-full font-bold ml-2"
                        readOnly={!isEditing}
                      />
                    ) : (
                      parseFloat(
                        editableRecord.form_data[0].cashAdvance
                      ).toFixed(2)
                    )}
                  </td>
                </tr>
                <tr>
                  <td className={`${tableStyle}`}>
                    <p className="font-semibold pl-2 ">SHORT</p>
                  </td>
                  <td className={`${inputStyles} font-bold`}>
                    ₱
                    {isEditing
                      ? calculateShort(
                          parseFloat(editableRecord.form_data[0].totalExpense),
                          parseFloat(newCashAdvance)
                        )
                      : parseFloat(editableRecord.form_data[0].short).toFixed(
                          2
                        )}
                  </td>
                </tr>
              </table>
            </div>
            <div>
              <table className="border border-black  mt-10 w-full">
                <tr>
                  <td className={`${input2Style} `}>
                    <p className="font-semibold pl-2 pr-20   ">
                      NAME OF EMPLOYEE
                    </p>
                  </td>
                  <td className={`${tableStyle}`}>
                    {record.form_data[0].name}
                  </td>
                </tr>
                <tr>
                  <td className={`${input2Style} `}>
                    <p className="font-semibold pl-2    ">SIGNATURE</p>
                  </td>
                  <td className={`${tableStyle}`}>
                    <img src={record.form_data[0].signature} />
                  </td>
                </tr>
                <tr>
                  <td className={`${inputStyles} `}>
                    <p className="font-semibold pl-2 ">EMPLOYEE NO.</p>
                  </td>
                  <td className={`${tableStyle}`}>
                    {record.form_data[0].date}
                  </td>
                </tr>
              </table>
            </div>
          </div>
         
          <div className="w-full flex-col justify-center items-center mt-20">
            {isFetchingApprovers ? (
              <div className="flex items-center justify-center w-full h-40">
                <h1>Fetching..</h1>
              </div>
            ) : (
              <div className="flex flex-wrap mt-10">
                <div className="ml-5 mb-4">
                  <h3 className="font-bold mb-3">Requested By:</h3>
                  <div className="flex flex-row justify-start space-x-2">
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="relative inline-block uppercase font-medium text-center pt-6">
                        <img
                          className="absolute top-2"
                          src={user.data?.signature}
                          alt="avatar"
                          width={120}
                        />

                        <span className="relative z-10 px-2">
                          {user.data?.firstName} {user.data?.lastName}
                        </span>
                        <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black -mx-4"></span>
                      </p>
                      <p className="font-bold text-[12px] text-center">
                        {user.data?.position}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 ml-5">
                  <h3 className="font-bold mb-3">Noted By:</h3>
                  <ul className="flex flex-row space-x-6">
                    {notedBy.map((user, index) => (
                      <li
                        className="flex flex-row justify-start space-x-2"
                        key={index}
                      >
                        <div className="flex flex-col items-center justify-center text-center">
                          <p className="relative inline-block uppercase font-medium text-center pt-6">
                          {user.status.toLowerCase() === "approved" && (
                              <img
                                className="absolute top-2"
                                src={user.signature}
                                alt="avatar"
                                width={120}
                              />
                            )}
                            <span className="relative z-10 px-2">
                              {user.firstname} {user.lastname}
                            </span>
                            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black -mx-4"></span>
                          </p>
                          <p className="font-bold text-[12px] text-center">
                            {user.position}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4 ml-5">
                  <h3 className="font-bold mb-3">Approved By:</h3>
                  <ul className="flex flex-row space-x-6">
                    {approvedBy.map((user, index) => (
                      <li
                        className="flex flex-row justify-start space-x-2"
                        key={index}
                      >
                        <div className="flex flex-col items-center justify-center text-center">
                          <p className="relative inline-block uppercase font-medium text-center pt-6">
                          {user.status.toLowerCase() === "approved" && (
                              <img
                                className="absolute top-2"
                                src={user.signature}
                                alt="avatar"
                                width={120}
                              />
                            )}
                            <span className="relative z-10 px-2">
                              {user.firstname} {user.lastname}
                            </span>
                            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black -mx-4"></span>
                          </p>
                          <p className="font-bold text-[12px] text-center">
                            {user.position}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <div className="w-full">
            <h1 className="font-bold">Attachments:</h1>
            <div>
              {attachmentUrl.map((url, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    {url.split("/").pop()}
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full">
            <h2 className="text-lg font-bold mb-2">Comments</h2>
            <textarea
              className="border h-auto  border-black rounded-md p-1 mt-2 w-full "
              placeholder="Enter your comments here.."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
            <ul className="flex flex-col w-full mb-4 space-y-4">
              {notedBy
                .filter((user) => user.comment)
                .map((user, index) => (
                  <div className="flex flex-row w-full" key={index}>
                    <img
                      alt="logo"
                      className="cursor-pointer hidden sm:block"
                      src={Avatar}
                      height={35}
                      width={45}
                    />
                    <li className="flex flex-col justify-between pl-2">
                      <h3 className="font-bold text-lg">
                        {user.firstname} {user.lastname}
                      </h3>
                      <p>{user.comment}</p>
                    </li>
                  </div>
                ))}
            </ul>
            <ul className="flex flex-col w-full mb-4 space-y-4">
              {approvedBy
                .filter((user) => user.comment)
                .map((user, index) => (
                  <div className="flex flex-row w-full" key={index}>
                    <img
                      alt="logo"
                      className="cursor-pointer hidden sm:block"
                      src={Avatar}
                      height={35}
                      width={45}
                    />
                    <li className="flex flex-col justify-between pl-2">
                      <h3 className="font-bold text-lg">
                        {user.firstname} {user.lastname}
                      </h3>
                      <p>{user.comment}</p>
                    </li>
                  </div>
                ))}
            </ul>
          </div>
          {record.status === "Pending" && (
            <div className="w-full space-x-2 flex items-center justify-between">
              <button
                className="bg-primary text-white w-1/2 items-center h-10 rounded-xl p-2"
                onClick={handleApprove}
              >
                {approveLoading ? (
                  <BeatLoader color="white" size={10} />
                ) : (
                  "Approve"
                )}
              </button>
              <button
                className="bg-red-600 w-1/2 rounded-xl text-white p-2"
                onClick={handleDisapprove}
              >
                {loading ? (
                  <BeatLoader color="white" size={10} />
                ) : (
                  "Disapprove"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      {showSuccessModal && (
        <ApproveSuccessModal
          closeModal={() => setShowSuccessModal(false)}
          closeParentModal={closeModal} // Pass the closeModal function as closeParentModal prop
          status={modalStatus}
        />
      )}
    </div>
  );
};

export default ApproverLiquidation;

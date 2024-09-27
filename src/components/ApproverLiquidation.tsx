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
  request_code: string;
  employeeID: string;
  created_at: Date;
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
  noted_by: Approver[];
  approved_by: Approver[];
  avp_staff: Approver[];
  approved_attachment: string;
};

type FormData = {
  approvers_id: number;
  approvers: {
    noted_by: { firstName: string; lastName: string }[];
    approved_by: { firstName: string; lastName: string }[];
  };
  purpose: string;
  items: Item[];
  employeeID: string;
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
const tableStyle = "border-2 border-black p-2 text-xs ";
const inputStyle = "  border-2 border-black rounded-[12px] pl-[10px]";
const input2Style = "  border-2 border-black rounded-[12px] ";
const inputStyles =
  "  border-2 border-black rounded-[12px] pl-[10px] text-end pr-10 font-bold";
const tableCellStyle = `${inputStyle} text-center  `;
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
  const [commentMessage, setCommentMessage] = useState("");
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
  const [avpstaff, setAvpstaff] = useState<Approver[]>([]);
  const [isFetchingApprovers, setisFetchingApprovers] = useState(false);
  const [customApprovers, setCustomApprovers] = useState<Approver[]>([]);
  const [user, setUser] = useState<any>({});
  const [printWindow, setPrintWindow] = useState<Window | null>(null);
  const [isFetchingUser, setisFetchingUser] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string[]>([]);
  const [modalStatus, setModalStatus] = useState<"approved" | "disapproved">(
    "approved"
  );
  const [file, setFile] = useState<File[]>([]);
  const [position, setPosition] = useState("");
  const [attachment, setAttachment] = useState<any>([]);
  let logo;
  const [branchList, setBranchList] = useState<any[]>([]);
  const [branchMap, setBranchMap] = useState<Map<number, string>>(new Map());
  const hasDisapprovedInNotedBy = notedBy.some(
    (user) => user.status === "Disapproved"
  );
  const hasDisapprovedInApprovedBy = approvedBy.some(
    (user) => user.status === "Disapproved"
  );

  if (user?.data?.branch === "Strong Motocentrum, Inc.") {
    logo = <img src={SMCTLogo} alt="SMCT Logo" />;
  } else if (user?.data?.branch === "Des Strong Motors, Inc.") {
    logo = <img src={DSMLogo} alt="DSM Logo" />;
  } else if (user?.data?.branch === "Des Appliance Plaza, Inc.") {
    logo = <img src={DAPLogo} alt="DAP Logo" />;
  } else if (user?.data?.branch === "Honda Des, Inc.") {
    logo = <img src={HDILogo} alt="HDI Logo" />;
  } else {
    logo = null; // Handle the case where branch does not match any of the above
  }

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing");
          return;
        }

        const response = await axios.get(
          `http://122.53.61.91:6002/api/view-user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          setUser(response.data.data);

          setPosition(response.data.data.position);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch user information"
          );
        }
      } finally {
        setLoading(false); // Update loading state when done fetching
      }
    };

    fetchUserInformation();
  }, []);

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const response = await axios.get(
          `http://122.53.61.91:6002/api/view-branch`
        );
        const branches = response.data.data;

        // Create a mapping of id to branch_name
        const branchMapping = new Map<number, string>(
          branches.map((branch: { id: number; branch_code: string }) => [
            branch.id,
            branch.branch_code,
          ])
        );

        setBranchList(branches);
        setBranchMap(branchMapping);
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    };

    fetchBranchData();
  }, []);

  useEffect(() => {
    const currentUserId = localStorage.getItem("id");
    const employeeId = localStorage.getItem("employee_id");
    // Ensure currentUserId and userId are converted to numbers if they exist
    const userId = currentUserId ? parseInt(currentUserId) : 0;
    setNotedBy(record.noted_by);
    setApprovedBy(record.approved_by);
    setAvpstaff(record.avp_staff);
    setEditableRecord(record);
    setNewCashAdvance(record.form_data[0].cashAdvance);
    fetchUser(record.user_id);

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
      if (
        Array.isArray(record.approved_attachment) &&
        record.approved_attachment.length > 0
      ) {
        const approvedAttachmentString = record.approved_attachment[0]; // Access the first element
        const parsedApprovedAttachment = JSON.parse(approvedAttachmentString); // Parse the string to get the actual array
     

        if (
          Array.isArray(parsedApprovedAttachment) &&
          parsedApprovedAttachment.length > 0
        ) {
          // Access the first element of the array
          const formattedAttachment = parsedApprovedAttachment[0];
          setAttachment(formattedAttachment); // Set the state with the string        
        } else {
          console.warn(
            "Parsed approved attachment is not an array or is empty:",
            parsedApprovedAttachment
          );
        }
      } else {
        console.warn(
          "Approved attachment is not an array or is empty:",
          record.approved_attachment
        );
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convert FileList to array and set it
      setFile(Array.from(e.target.files));
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

  const handleDisapprove = async () => {
    const userId = localStorage.getItem("id") ?? "";
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Token is missing");
        return;
      }

      const requestData = new FormData();

      // Only append attachments if the file array is not empty
      if (file && file.length > 0) {
        file.forEach((file) => {
          requestData.append("attachment[]", file);
        });
      }

      requestData.append("user_id", parseInt(userId).toString());
      requestData.append("action", "disapprove");
      requestData.append("comment", comments);

      // Log the contents of requestData for debugging
   
      const response = await axios.post(
        `http://122.53.61.91:6002/api/request-forms/${record.id}/process`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoading(false);
      setModalStatus("disapproved"); // Set modal status to 'disapproved'
      setShowSuccessModal(true);
      refreshData();
    } catch (error: any) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update stock requisition.";
      console.error("Error disapproving request form:", errorMessage);
      setCommentMessage(errorMessage);
    }
  };
  const handleApprove = async () => {
    const userId = localStorage.getItem("id") ?? "";
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Token is missing");
      return;
    }

    const requestData = new FormData();

    // Only append attachments if the file array is not empty
    if (file && file.length > 0) {
      file.forEach((file) => {
        requestData.append("attachment[]", file);
      });
    }

    requestData.append("user_id", parseInt(userId).toString());
    requestData.append("action", "approve");
    requestData.append("comment", comments);
  
    try {
      setApprovedLoading(true);

      const response = await axios.post(
        `http://122.53.61.91:6002/api/request-forms/${record.id}/process`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApprovedLoading(false);
      setModalStatus("approved");
      setShowSuccessModal(true);
      refreshData();
    } catch (error: any) {
      setApprovedLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update stock requisition.";
      console.error("Error approving request form:", errorMessage);
      setCommentMessage(errorMessage);
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
  const formatDate2 = (dateString: Date) => {
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

    localStorage.setItem("printData", JSON.stringify(data));

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
          <XMarkIcon
            className="h-8 w-8 text-black  bg-white rounded-full p-1  "
            onClick={closeModal}
          />
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
          <div className="flex flex-col justify-center ">
            <p className="underline ">{user?.data?.branch}</p>
            <p className="text-center">Branch</p>
          </div>
        </div>
        <div className="justify-start items-start flex flex-col space-y-2 w-full">
          <div className="flex items-center justify-between w-full">
            <p className="font-medium text-[14px]">
              Request ID: #{record.request_code}
            </p>
            <div className="w-auto flex ">
              <p>Date: </p>
              <p className="font-bold pl-2">{formatDate2(record.created_at)}</p>
            </div>
          </div>
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
                  : "bg-pink"
              } rounded-lg  py-1 w-1/3
             font-medium text-[14px] text-center ml-2 text-white`}
            >
              {" "}
              {record.status}
            </p>
          </div>

          <div className="mt-6 w-full overflow-x-auto">
            <div className="w-full">
              <table className="border-collapse w-full border-black border-2 xl:table-fixed">
                <thead>
                  <tr>
                    <th className={`${tableStyle} w-16 bg-[#8EC7F7]`}>Date</th>
                    <th colSpan={3} className={`${tableStyle} bg-[#8EC7F7]`}>
                      Transportation
                    </th>
                    <th
                      colSpan={3}
                      className={`${tableStyle} bg-[#8EC7F7] h-14`}
                    >
                      Hotel
                    </th>
                    <th colSpan={3} className={`${tableStyle} bg-[#8EC7F7]`}>
                      PER DIEM OTHER RELATED EXPENSES
                    </th>
                    <th className={`${tableStyle} w-16 bg-[#8EC7F7]`}></th>
                  </tr>
                  <tr>
                    <th className={`${tableStyle} w-16 whitespace-normal`}>
                      Date
                    </th>
                    <th className={`${tableStyle} w-32 whitespace-normal`}>
                      Destination
                    </th>
                    <th
                      className={`${tableStyle} w-34 whitespace-normal  text-[9px]`}
                    >
                      Transportation
                    </th>
                    <th className={`${tableStyle} w-14 whitespace-normal`}>
                      Amount
                    </th>
                    <th className={`${tableStyle} w-32 whitespace-normal`}>
                      Hotel
                    </th>
                    <th className={`${tableStyle} w-32 whitespace-normal`}>
                      Place
                    </th>
                    <th className={`${tableStyle} w-24 whitespace-normal`}>
                      Amount
                    </th>
                    <th className={`${tableStyle} w-32 whitespace-normal`}>
                      Per Diem
                    </th>
                    <th className={`${tableStyle} w-32 whitespace-normal`}>
                      Particulars
                    </th>
                    <th className={`${tableStyle} w-24 whitespace-normal`}>
                      Amount
                    </th>
                    <th className={`${tableStyle} w-24 whitespace-normal`}>
                      Grand Total
                    </th>
                  </tr>
                </thead>
                <tbody className={`${tableCellStyle}`}>
                  {editableRecord.form_data[0].items.map((item, index) => (
                    <tr key={index}>
                      <td
                        className={`${tableCellStyle} w-16 whitespace-normal break-words`}
                      >
                        {formatDate(item.liquidationDate)}
                      </td>
                      <td
                        className={`${tableCellStyle} w-32 whitespace-normal break-words`}
                      >
                        {item.destination}
                      </td>
                      <td
                        className={`${tableCellStyle} w-32 whitespace-normal break-words`}
                      >
                        {item.transportation}
                      </td>
                      <td
                        className={`${tableCellStyle} w-24 whitespace-normal break-words`}
                      >
                        {item.transportationAmount}
                      </td>
                      <td
                        className={`${tableCellStyle} w-16 whitespace-normal break-words`}
                      >
                        {item.hotel}
                      </td>
                      <td
                        className={`${tableCellStyle} w-32 whitespace-normal break-words`}
                      >
                        {item.hotelAddress}
                      </td>
                      <td
                        className={`${tableCellStyle} w-24 whitespace-normal break-words`}
                      >
                        {item.hotelAmount}
                      </td>
                      <td
                        className={`${tableCellStyle} w-32 whitespace-normal break-words`}
                      >
                        {item.perDiem}
                      </td>
                      <td
                        className={`${tableCellStyle} w-32 whitespace-normal break-words`}
                      >
                        {item.particulars}
                      </td>
                      <td
                        className={`${tableCellStyle} w-24 whitespace-normal break-words`}
                      >
                        {item.particularsAmount}
                      </td>
                      <td
                        className={`${tableCellStyle} w-24 whitespace-normal break-words`}
                      >
                        {item.grandTotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  <td className={`${tableStyle} text-lg font-bold text-[16px]`}>
                    <p className="text-[16px] text-right pr-8">
                      {parseFloat(
                        editableRecord.form_data[0].cashAdvance
                      ).toFixed(2)}
                    </p>
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
                  <td className={`${tableStyle} `}>
                    <p className="text-[16px] font-bold">
                      {" "}
                      {record.form_data[0].name}{" "}
                    </p>
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
                    <p className="font-semibold text-left ">EMPLOYEE NO.</p>
                  </td>
                  <td className={`${tableStyle}`}>
                    <p className="text-lg">{record.form_data[0].employeeID}</p>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div className="w-full flex-col justify-center items-center">
            {isFetchingApprovers ? (
              <div className="flex items-center justify-center w-full h-40">
                <h1>Fetching..</h1>
              </div>
            ) : (
              <div className="flex flex-wrap">
                <div className="mb-4 ml-5">
                  <h3 className="font-bold mb-3">Requested By:</h3>
                  <ul className="flex flex-wrap gap-6">
                    <li className="flex flex-col items-center justify-center text-center relative w-auto">
                      <div className="relative flex flex-col items-center justify-center">
                        {/* Signature */}
                        {user.data?.signature && (
                          <div className="absolute -top-4">
                            <img
                              src={user.data?.signature}
                              alt="avatar"
                              width={120}
                              className="relative z-20 pointer-events-none"
                            />
                          </div>
                        )}
                        {/* Name */}
                        <p className="relative inline-block uppercase font-medium text-center mt-4 z-10">
                          <span className="relative z-10">
                            {user.data?.firstName} {user.data?.lastName}
                          </span>
                          <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black"></span>
                        </p>
                        {/* Position */}
                        <p className="font-bold text-[12px] text-center mt-1">
                          {user.data?.position}
                        </p>
                        {/* Status, if needed */}
                        {user.data?.status && (
                          <p
                            className={`font-bold text-[12px] text-center mt-1 ${
                              user.data?.status === "Approved"
                                ? "text-green"
                                : user.data?.status === "Pending"
                                ? "text-yellow"
                                : user.data?.status === "Rejected"
                                ? "text-red"
                                : ""
                            }`}
                          >
                            {user.data?.status}
                          </p>
                        )}
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="mb-4 ml-5">
                  <h3 className="font-bold mb-3">Noted By:</h3>
                  <ul className="flex flex-wrap gap-6">
                    {notedBy.map((user, index) => (
                      <li
                        className="flex flex-col items-center justify-center text-center relative"
                        key={index}
                      >
                        <div className="relative flex flex-col items-center justify-center text-center">
                          {/* Signature */}
                          {(user.status === "Approved" ||
                            (typeof user.status === "string" &&
                              user.status.split(" ")[0] === "Rejected")) && (
                            <div className="absolute -top-4">
                              <img
                                src={user.signature}
                                alt="avatar"
                                width={120}
                                className="relative z-20 pointer-events-none"
                              />
                            </div>
                          )}
                          {/* Name */}
                          <p className="relative inline-block uppercase font-medium text-center mt-4 z-10">
                            <span className="relative z-10">
                              {user.firstName} {user.lastName}
                            </span>
                            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black"></span>
                          </p>
                          {/* Position */}
                          <p className="font-bold text-[12px] text-center mt-1">
                            {user.position}
                          </p>
                          {/* Status */}
                          {hasDisapprovedInApprovedBy ||
                          hasDisapprovedInNotedBy ? (
                            user.status === "Disapproved" ? (
                              <p className="font-bold text-[12px] text-center text-red-500 mt-1">
                                {user.status}
                              </p>
                            ) : null
                          ) : (
                            <p
                              className={`font-bold text-[12px] text-center mt-1 ${
                                user.status === "Approved"
                                  ? "text-green"
                                  : user.status === "Pending"
                                  ? "text-yellow"
                                  : ""
                              }`}
                            >
                              {user.status}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4 ml-5">
                  <h3 className="font-bold mb-3">Approved By:</h3>
                  <ul className="flex flex-wrap gap-6">
                    {approvedBy.map((user, index) => (
                      <li
                        className="flex flex-col items-center justify-center text-center relative"
                        key={index}
                      >
                        <div className="relative flex flex-col items-center justify-center text-center">
                          {/* Signature */}
                          {(user.status === "Approved" ||
                            (typeof user.status === "string" &&
                              user.status.split(" ")[0] === "Rejected")) && (
                            <div className="absolute -top-4">
                              <img
                                src={user.signature}
                                alt="avatar"
                                width={120}
                                className="relative z-20 pointer-events-none"
                              />
                            </div>
                          )}
                          {/* Name */}
                          <p className="relative inline-block uppercase font-medium text-center mt-4 z-10">
                            <span className="relative z-10">
                              {user.firstName} {user.lastName}
                            </span>
                            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black"></span>
                          </p>
                          {/* Position */}
                          <p className="font-bold text-[12px] text-center mt-1">
                            {user.position}
                          </p>
                          {/* Status */}
                          {hasDisapprovedInApprovedBy ||
                          hasDisapprovedInNotedBy ? (
                            user.status === "Disapproved" ? (
                              <p className="font-bold text-[12px] text-center text-red-500 mt-1">
                                {user.status}
                              </p>
                            ) : null
                          ) : (
                            <p
                              className={`font-bold text-[12px] text-center mt-1 ${
                                user.status === "Approved"
                                  ? "text-green"
                                  : user.status === "Pending"
                                  ? "text-yellow"
                                  : ""
                              }`}
                            >
                              {user.status}
                            </p>
                          )}
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
              {attachmentUrl.length > 0 ? (
                attachmentUrl.map((url, index) => (
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
                ))
              ) : (
                <p className="text-gray-500">No attachments</p>
              )}
            </div>
          </div>
          <div className="w-full">
            <h2 className="text-lg font-bold mb-2">Comments:</h2>

            {record.status === "Pending" && (
              <div>
                <textarea
                  className="border bg-white h-auto border-black rounded-md p-1 mt-2 w-full"
                  placeholder="Enter your comments here.."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
            )}
            {commentMessage && <p className="text-red-500">{commentMessage}</p>}

            {/* Comments Section */}
            <ul className="flex flex-col w-full mb-4 space-y-4">
              {notedBy.filter((user) => user.comment).length > 0 ||
              approvedBy.filter((user) => user.comment).length > 0 ? (
                <>
                  {notedBy
                    .filter((user) => user.comment)
                    .map((user, index) => (
                      <div className="flex">
                        <div>
                          <img
                            alt="logo"
                            className="cursor-pointer hidden sm:block"
                            src={Avatar}
                            height={35}
                            width={45}
                          />
                        </div>
                        <div className="flex flex-row w-full" key={index}>
                          <li className="flex flex-col justify-between pl-2">
                            <h3 className="font-bold text-lg">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p>{user.comment}</p>
                          </li>
                        </div>
                      </div>
                    ))}

                  {approvedBy
                    .filter((user) => user.comment)
                    .map((user, index) => (
                      <div className="flex">
                        <div>
                          <img
                            alt="logo"
                            className="cursor-pointer hidden sm:block"
                            src={Avatar}
                            height={35}
                            width={45}
                          />
                        </div>
                        <div className="flex flex-row w-full" key={index}>
                          <li className="flex flex-col justify-between pl-2">
                            <h3 className="font-bold text-lg">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p>{user.comment}</p>
                          </li>
                        </div>
                      </div>
                    ))}
                  {avpstaff
                    .filter((user) => user.comment)
                    .map((user, index) => (
                      <div className="flex">
                        <div>
                          <img
                            alt="logo"
                            className="cursor-pointer hidden sm:block"
                            src={Avatar}
                            height={35}
                            width={45}
                          />
                        </div>
                        <div className="flex flex-row w-full" key={index}>
                          <li className="flex flex-col justify-between pl-2">
                            <h3 className="font-bold text-lg">
                              {user.firstName} {user.lastName} - AVP STAFF
                            </h3>
                            <p>{user.comment}</p>
                          </li>
                        </div>
                      </div>
                    ))}
                </>
              ) : (
                <p className="text-gray-500">No comments yet</p>
              )}
            </ul>
          </div>
          <div className="w-full max-w-md ">
            <p className="font-semibold">Approved Attachment:</p>

            {record.approved_attachment.length === 0 &&
            position === "Vice President" && record.status === "Pending" ? (
              <input
                id="file"
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full mt-2"
              />
            ) : record.approved_attachment.length > 0 && attachment  ? (
              <div className="mt-2">
                <img
                  src={`http://122.53.61.91:6002/storage/${attachment}`}
                  alt="Approved Attachment"
                  className="max-w-full h-auto rounded"
                />
              </div>
            ) : (
              <p className="text-gray-500">No approved attachment available.</p>
            )}
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

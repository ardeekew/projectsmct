import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import PrintRefund from "./PrintRefund";
import { set } from "react-hook-form";
import Avatar from "./assets/avatar.png";
import { useNavigate } from "react-router-dom";
import SMCTLogo from "./assets/SMCT.png";
import DSMLogo from "./assets/DSM.jpg";
import DAPLogo from "./assets/DAP.jpg";
import HDILogo from "./assets/HDI.jpg";
import ApproveSuccessModal from "./ApproveSuccessModal";
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
  branch: string;
  date: string;
  user_id: number;
  attachment: string;
};

type FormData = {
  approvers_id: number;
  approvers: {
    noted_by: {
      firstName: string;
      lastName: string;
      position: string;
      signature: string;
      status: string;
      branch: string;
    }[];
    approved_by: {
      firstName: string;
      lastName: string;
      position: string;
      signature: string;
      status: string;
      branch: string;
    }[];
  };
  purpose: string;
  items: Item[];
  branch: string;
  date: string;
  grand_total: string;
};

type Item = {
  quantity: string;
  description: string;
  unitCost: string;
  totalAmount: string;
  remarks: string;
};
const inputStyle = "border border-black text-[12px] font-bold p-2";
const tableCellStyle = `${inputStyle} w-20`;
const ApproverRefund: React.FC<Props> = ({
  closeModal,
  record,
  refreshData,
}) => {
  const [editableRecord, setEditableRecord] = useState(record);
  const [newData, setNewData] = useState<Item[]>([]);
  const [editedApprovers, setEditedApprovers] = useState<number>(
    record.approvers_id
  );
  const [isEditing, setIsEditing] = useState(false);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [fetchingApprovers, setFetchingApprovers] = useState(false);
  const [editedDate, setEditedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [isFetchingApprovers, setisFetchingApprovers] = useState(false);
  const [isFetchingUser, setisFetchingUser] = useState(false);
  const [notedBy, setNotedBy] = useState<Approver[]>([]);
  const [approvedBy, setApprovedBy] = useState<Approver[]>([]);
  const [customApprovers, setCustomApprovers] = useState<any>({});
  const [comments, setComments] = useState("");
  const [nameComments, setNameComments] = useState([]);
  const [user, setUser] = useState<any>({});
  const [approveLoading, setApprovedLoading] = useState(false);
  const [printWindow, setPrintWindow] = useState<Window | null>(null);
  const navigate = useNavigate();
  const [modalStatus, setModalStatus] = useState<'approved' | 'disapproved'>('approved');
  const [attachmentUrl, setAttachmentUrl] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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

    setNewData(record.form_data[0].items.map((item) => ({ ...item })));
    setEditableRecord(record);

    if (currentUserId) {
      fetchCustomApprovers(record.id);
      fetchUser(record.user_id);
    }
    try {
      // If record.attachment is a JSON string, parse it
      if (typeof record.attachment === "string") {
        const parsedAttachment = JSON.parse(record.attachment);
        // Handle the parsed attachment
        const fileUrls = parsedAttachment.map(
          (filePath: string) =>
            `http://localhost:8000/storage/${filePath.replace(/\\/g, "/")}`
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
        `http://localhost:8000/api/view-user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response", response.data.data);
      setUser(response.data);
      console.log("user", user);
    } catch (error) {
      console.error("Failed to fetch approvers:", error);
    } finally {
      setisFetchingUser(false);
    }
  };
  const fetchCustomApprovers = async (id: number) => {
    setisFetchingApprovers(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }

      const response = await axios.get(
        `http://localhost:8000/api/request-forms/${id}`,
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
      console.log("notedby", notedby);
      console.log("approvedby", approvedby);
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
        `http://localhost:8000/api/request-forms/${record.id}/process`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Stock requisition updated successfully:", response.data);
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
      console.log("Request Data:", requestData);
      console.log("API Endpoint:", `http://localhost:8000/api/request-forms/${record.id}/process`);

      const response = await axios.put(
        `http://localhost:8000/api/request-forms/${record.id}/process`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Stock requisition updated successfully:", response.data);
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
    // Update the field of the item at the specified index in newData
    const newDataCopy = [...newData];
    newDataCopy[index] = { ...newDataCopy[index], [field]: value };
    setErrorMessage("");
    // Calculate totalAmount if either quantity or unitCost changes
    if (field === "quantity" || field === "unitCost") {
      const quantity = parseFloat(newDataCopy[index].quantity);
      const unitCost = parseFloat(newDataCopy[index].unitCost);
      newDataCopy[index].totalAmount = (quantity * unitCost).toString();
    }

    // Calculate grandTotal
    let total = 0;
    for (const item of newDataCopy) {
      total += parseFloat(item.totalAmount);
    }
    const grandTotal = total.toString();

    // Update the state with the modified newDataCopy and grandTotal
    setNewData(newDataCopy);
    setEditableRecord((prevState) => ({
      ...prevState,
      form_data: [
        {
          ...prevState.form_data[0],
          grand_total: grandTotal,
          date: editedDate !== "" ? editedDate : prevState.form_data[0].date,
        },
      ],
      approvers_id: editedApprovers,
    }));
  };

  if (!record) return null;

  const handlePrint = () => {
    // Construct the data object to be passed
    const data = {
      id: record,
      approvedBy: approvedBy,
      notedBy: notedBy,
      user: user,
    };
    console.log("dataas", data);

    localStorage.setItem("printData", JSON.stringify(data));
    // Open a new window with PrintRefund component
    const newWindow = window.open(`/print-refund`, "_blank");

    // Optional: Focus the new window
    if (newWindow) {
      newWindow.focus();
    }
  };
  console.log(user.branch);
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="p-4 relative w-full mx-10 md:mx-0 z-10 md:w-1/2 space-y-auto h-3/4 overflow-scroll bg-white border-black rounded-t-lg shadow-lg">
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
      <PrintRefund
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
            Request for Refund
          </h1>
          <div className=" ">{user?.data?.branch}</div>
        </div>
        <div className="justify-start items-start flex flex-col space-y-4 w-full">
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

          <div className="flex flex-col md:flex-row justify-evenly w-full md:space-x-10">
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
          <div className="mt-4 w-full overflow-x-auto">
            <div className="w-full border-collapse ">
              <div className="table-container">
                <table className="border w-full space-x-auto ">
                  <thead className="border border-black h-14  bg-[#8EC7F7]">
                    <tr className="border ">
                      <th className={`${inputStyle}`}>QTY</th>
                      <th className={`${inputStyle}`}>DESCRIPTION</th>
                      <th className={`${inputStyle}`}>UNIT COST</th>
                      <th className={`${inputStyle}`}>TOTAL AMOUNT</th>
                      <th className={`${inputStyle}`}>USAGE/REMARKS</th>
                    </tr>
                  </thead>
                  <tbody className={`${tableCellStyle}`}>
                    {isEditing
                      ? newData.map((item, index) => (
                          <tr key={index}>
                            <td className={tableCellStyle}>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="number"
                                value={item.unitCost}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "unitCost",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="text"
                                value={item.totalAmount}
                                readOnly
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="text"
                                value={item.remarks}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "remarks",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))
                      : editableRecord.form_data[0].items.map((item, index) => (
                          <tr key={index}>
                            <td className={tableCellStyle}>{item.quantity}</td>
                            <td className={tableCellStyle}>
                              {item.description}
                            </td>
                            <td className={tableCellStyle}>{item.unitCost}</td>
                            <td className={tableCellStyle}>
                              {item.totalAmount}
                            </td>
                            <td className={tableCellStyle}>{item.remarks}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
          </div>
          <div className="w-full">
            <h1>Grand Total</h1>

            <input
              type="text"
              className="border border-black rounded-md p-1 mt-2 w-full font-bold "
              value={`₱ ${editableRecord.form_data[0].grand_total}`}
            />
          </div>

          <div className="w-full flex-col justify-center items-center">
            {isFetchingApprovers ? (
              <div className="flex items-center justify-center w-full h-40">
                <h1>Fetching..</h1>
              </div>
            ) : (
              <div className="flex flex-wrap">
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
              {url.split('/').pop()}
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

export default ApproverRefund;

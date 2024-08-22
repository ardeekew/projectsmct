import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import EditStockModalSuccess from "./EditStockModalSuccess";
import { set } from "react-hook-form";
import Avatar from "../assets/avatar.png";
import PrintRefund from "../PrintRefund";

type Props = {
  closeModal: () => void;
  record: Record;
  refreshData: () => void;
};
interface Approver {
  id: number;
  firstname: string;
  lastname: string;
  name: string;
  position: string;
  status: string;
  signature: string;
  comment: string;
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
    noted_by: { firstName: string; lastName: string }[];
    approved_by: { firstName: string; lastName: string }[];
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
const ViewRequestModal: React.FC<Props> = ({
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
  const [notedBy, setNotedBy] = useState<Approver[]>([]);
  const [approvedBy, setApprovedBy] = useState<Approver[]>([]);
  const [customApprovers, setCustomApprovers] = useState<any>({});
  const [comments, setComments] = useState([]);
  const [nameComments, setNameComments] = useState([]);
  const [user, setUser] = useState<any>({});
  const [isFetchingUser, setisFetchingUser] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string[]>([]);
  const [printWindow, setPrintWindow] = useState<Window | null>(null);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [originalAttachments, setOriginalAttachments] = useState<string[]>([]);
  const [removedAttachments, setRemovedAttachments] = useState<(string | number)[]>([]);
  const [branchList, setBranchList] = useState<any[]>([]);
  const [branchMap, setBranchMap] = useState<Map<number, string>>(new Map());
  const hasDisapprovedInNotedBy = notedBy.some(
    (user) => user.status === "Disapproved"
  );
  const hasDisapprovedInApprovedBy = approvedBy.some(
    (user) => user.status === "Disapproved"
  );

  
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
    const attachments = JSON.parse(record.attachment);
    // Ensure currentUserId and userId are converted to numbers if they exist
    const userId = currentUserId ? parseInt(currentUserId) : 0;

    setNewData(record.form_data[0].items.map((item) => ({ ...item })));
    setEditableRecord(record);

    if (currentUserId) {
      fetchUser(record.user_id);
      fetchCustomApprovers(record.id);
      fetchApprovers(userId); // Fetch approvers based on userId
    }
    try {
      if (typeof record.attachment === "string") {
        // Parse the JSON string if it contains the file path
        const parsedAttachment: string[] = JSON.parse(record.attachment);

        if (parsedAttachment.length > 0) {
          // Construct file URLs
          const fileUrls = parsedAttachment.map(
            (filePath) =>
              `http://122.53.61.91:6002/storage/${filePath.replace(/\\/g, "/")}`
          );
          setAttachmentUrl(fileUrls);
        }
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
  const handleEdit = () => {
    setEditedDate(editableRecord.form_data[0].date); // Initialize editedDate with the original date
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setAttachmentUrl(attachmentUrl);
    setNewAttachments([]); // Clear new attachments
    setRemovedAttachments([]); // Reset removed attachments
    // Reset newData to original values
    setNewData(record.form_data[0].items.map((item) => ({ ...item })));
    setEditedApprovers(record.approvers_id);
    setEditableRecord((prevState) => ({
      ...prevState,
      form_data: [
        {
          ...prevState.form_data[0],
          grand_total: record.form_data[0].grand_total, // Reset grand_total
        },
      ],
    }));
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
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewAttachments(Array.from(event.target.files));
    }
  };

  const handleRemoveAttachment = (index: number) => {
    // Get the path of the attachment to be removed
    const attachmentPath = attachmentUrl[index].split("storage/attachments/")[1];
    
    // Add the path to the removedAttachments state
    setRemovedAttachments((prevRemoved) => [...prevRemoved, attachmentPath]);

    // Remove the attachment from the current list
    setAttachmentUrl((prevUrls) => prevUrls.filter((_, i) => i !== index));
};
  const handleSaveChanges = async () => {
    // Simple validation
    if (
      !newData.every(
        (item) =>
          parseFloat(item.quantity) > 0 &&
          parseFloat(item.unitCost) > 0 &&
          item.description &&
          item.description.trim() !== ""
      )
    ) {
      setErrorMessage(
        "Quantity and unit cost must be greater than 0, and description cannot be empty."
      );
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Token is missing");
        return;
      }

      const formData = new FormData();
      formData.append("updated_at", new Date().toISOString());
      formData.append("approvers_id", JSON.stringify(editedApprovers));

      formData.append(
        "form_data",
        JSON.stringify([
          {
            branch: editableRecord.form_data[0].branch,
            date:
              editedDate !== "" ? editedDate : editableRecord.form_data[0].date,
            status: editableRecord.status,
            grand_total: editableRecord.form_data[0].grand_total,
            items: newData,
          },
        ])
      );

      // Append existing attachments
      attachmentUrl.forEach((url, index) => {
        const path = url.split("storage/attachments/")[1];
        formData.append(`attachment_url_${index}`, path);
      });

      // Append new attachments
      newAttachments.forEach((file) => {
        formData.append("new_attachments[]", file);
      });

       // Append removed attachments
    removedAttachments.forEach((path, index) => {
      formData.append("removed_attachments[]", String(path));
    });
    
      const response = await axios.post(
        `http://122.53.61.91:6002/api/update-request/${record.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

   
      setLoading(false);
      setIsEditing(false);
      setSavedSuccessfully(true);
      refreshData();
    } catch (error: any) {
      setLoading(false);
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to update Request refund."
      );
    }
  };
 
  if (!record) return null;
  const fetchApprovers = async (userId: number) => {
    setFetchingApprovers(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }

      const response = await axios.get(
        `http://122.53.61.91:6002/api/custom-approvers/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const approversData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setApprovers(approversData);
   
    } catch (error) {
      console.error("Failed to fetch approvers:", error);
    } finally {
      setFetchingApprovers(false);
    }
  };
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
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="p-4 relative w-full mx-10 md:mx-0 z-10 md:w-1/2 space-y-auto h-3/4 overflow-scroll bg-white border-black rounded-t-lg shadow-lg">
      <div className=" top-2 flex justify-end cursor-pointer sticky">
          <XMarkIcon className="h-8 w-8 text-black  bg-white rounded-full p-1  " onClick={closeModal} />
        </div>
        <div className="justify-start items-start flex flex-col space-y-4 w-full">
          {!fetchingApprovers && !isFetchingApprovers &&   (
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
          <h1 className="font-semibold text-[18px]">Refund Request</h1>
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
                className="border border-black rounded-md p-1 mt-2 w-full"
                value={
                  branchMap.get(parseInt(record.form_data[0].branch, 10)) ||
                  "Unknown"
                }
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
              readOnly
            />
          </div>
          <div className="w-full pr-12">
            <h1>Approvers</h1>
            {fetchingApprovers ? (
              <p>Loading approvers...</p>
            ) : (
              <select
                className="border w-1/2 mt-2 h-10 border-black rounded-lg"
                value={
                  isEditing ? editedApprovers : editableRecord.approvers_id
                }
                onChange={(e) => {
                  const selectedApproverId = parseInt(e.target.value);
                
                  setEditedApprovers(selectedApproverId);
                }}
                disabled={!isEditing}
              >
                <option value="" disabled>
                  Approver List
                </option>
                {approvers.flat().map((approver) => (
                  <option key={approver.id} value={approver.id}>
                    {approver.name}
                  </option>
                ))}
              </select>
            )}
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
                          {(user.status === "Approved" || user.status.split(" ")[0] === "Rejected" ) && (
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
                          {hasDisapprovedInApprovedBy ||
                          hasDisapprovedInNotedBy ? (
                            // Show "Disapproved" if it is present in either list
                            user.status === "Disapproved" ? (
                              <p className="font-bold text-[12px] text-center text-red-500">
                                {user.status}
                              </p>
                            ) : // Do not show any status if "Disapproved" is present
                            null
                          ) : (
                            // Show other statuses only if "Disapproved" is not present in either list
                            <p
                              className={`font-bold text-[12px] text-center ${
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
                  <ul className="flex flex-row space-x-6">
                    {approvedBy.map((user, index) => (
                      <li
                        className="flex flex-row justify-start space-x-2"
                        key={index}
                      >
                        <div className="flex flex-col items-center justify-center text-center">
                          <p className="relative inline-block uppercase font-medium text-center pt-6">
                             {(user.status === "Approved" || user.status.split(" ")[0] === "Rejected" ) && (
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
                          {hasDisapprovedInApprovedBy ||
                          hasDisapprovedInNotedBy ? (
                            // Show "Disapproved" if it is present in either list
                            user.status === "Disapproved" ? (
                              <p className="font-bold text-[12px] text-center text-red-500">
                                {user.status}
                              </p>
                            ) : // Do not show any status if "Disapproved" is present
                            null
                          ) : (
                            // Show other statuses only if "Disapproved" is not present in either list
                            <p
                              className={`font-bold text-[12px] text-center ${
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
              {attachmentUrl
                .filter((_, index) => !removedAttachments.includes(index))
                .map((url, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      {url.split("/").pop()}
                    </a>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
            </div>
            {isEditing && (
              <div>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="mt-2"
                />
              </div>
            )}
          </div>
          <div className="w-full">
            <h2 className="text-lg font-bold mb-2">Comments</h2>
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
          <div className="md:absolute  right-20 top-2 items-center">
            {isEditing ? (
              <div>
                <button
                  className="bg-primary text-white items-center h-10 rounded-xl p-2"
                  onClick={handleSaveChanges}
                >
                  {loading ? (
                    <BeatLoader color="white" size={10} />
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  className="bg-red-600 rounded-xl text-white ml-2 p-2"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            ) : (
              !fetchingApprovers &&
              !isFetchingApprovers && editableRecord.status === 'Pending' && (
                <button
                  className="bg-blue-500 ml-2 rounded-xl p-2 flex text-white"
                  onClick={handleEdit}
                >
                  <PencilIcon className="h-6 w-6 mr-2" />
                  Edit
                </button>
              )
            )}
          </div>
        </div>
      </div>
      {savedSuccessfully && (
        <EditStockModalSuccess
          closeSuccessModal={closeModal}
          refreshData={refreshData}
        />
      )}
    </div>
  );
};

export default ViewRequestModal;

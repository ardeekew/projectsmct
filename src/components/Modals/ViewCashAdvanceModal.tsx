import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { PencilIcon } from "@heroicons/react/24/solid";
import EditStockModalSuccess from "./EditStockModalSuccess";
import BeatLoader from "react-spinners/BeatLoader";
import Avatar from "../assets/avatar.png";
import PrintCash from "../PrintCash";
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
  attachment: string;
};

type FormData = {
  approvers_id: number;
  attachment: string;
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
  totalBoatFare: string;
  totalContingency: string;
  totalFare: string;
  totalHotel: string;
  totalperDiem: string;
  totalExpense: string;
  short: string;
};

// Define the Item type
type Item = {
  cashDate: string;

  quantity: string;
  description: string;
  unitCost: string;
  totalAmount: string;
  remarks: string;
  day: string;
  itinerary: string;
  activity: string;
  hotel: string;
  rate: string;
  amount: string;
  perDiem: string;
};

const inputStyle = "border border-black text-[12px] font-bold p-2 h-14";
const tableStyle = "border border-black p-2";
const tableCellStyle = `${inputStyle}  w-10`;
const ViewCashAdvanceModal: React.FC<Props> = ({
  closeModal,
  record,
  refreshData,
}) => {
  const [editableRecord, setEditableRecord] = useState(record);
  const [newData, setNewData] = useState<Item[]>([]);
  const [newTotalBoatFare, setNewTotalBoatFare] = useState("");
  const [newTotalHotel, setNewTotalHotel] = useState("");
  const [newTotalFare, setNewTotalFare] = useState("");
  const [newTotalContingency, setNewTotalContingency] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedDate, setEditedDate] = useState("");
  const [editedApprovers, setEditedApprovers] = useState<number>(
    record.approvers_id
  );
  const [loading, setLoading] = useState(false);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [fetchingApprovers, setFetchingApprovers] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notedBy, setNotedBy] = useState<Approver[]>([]);
  const [approvedBy, setApprovedBy] = useState<Approver[]>([]);
  const [customApprovers, setCustomApprovers] = useState<any>(null);
  const [isFetchingApprovers, setisFetchingApprovers] = useState(false);
  const [isFetchingUser, setisFetchingUser] = useState(false);
  const [user, setUser] = useState<any>({});
  const [attachmentUrl, setAttachmentUrl] = useState<string[]>([]);
  const [printWindow, setPrintWindow] = useState<Window | null>(null);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [originalAttachments, setOriginalAttachments] = useState<string[]>([]);
  const [removedAttachments, setRemovedAttachments] = useState<Array<string | number>>([]);

  useEffect(() => {
    const currentUserId = localStorage.getItem("id");
    const attachments = JSON.parse(record.attachment);
    const userId = currentUserId ? parseInt(currentUserId) : 0;

    setNewData(record.form_data[0].items.map((item) => ({ ...item })));
    setEditableRecord(record);
    setNewTotalBoatFare(record.form_data[0].totalBoatFare);
    setNewTotalHotel(record.form_data[0].totalHotel);
    setNewTotalFare(record.form_data[0].totalFare);
    setNewTotalContingency(record.form_data[0].totalContingency);
    setEditedApprovers(record.approvers_id);
    if (currentUserId) {
      fetchUser(record.user_id);
      fetchApprovers(userId);
      fetchCustomApprovers(record.id);
    }
    try {
      if (typeof record.attachment === "string") {
        // Parse the JSON string if it contains the file path
        const parsedAttachment: string[] = JSON.parse(record.attachment);

        if (parsedAttachment.length > 0) {
          // Construct file URLs
          const fileUrls = parsedAttachment.map(
            (filePath) =>
              `http://localhost:8000/storage/${filePath.replace(/\\/g, "/")}`
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
        `http://localhost:8000/api/view-user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response", response.data.data);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch approvers:", error);
    } finally {
      setisFetchingUser(false);
    }
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

  const calculateGrandTotal = () => {
    let total = 0;
    total += parseFloat(newTotalBoatFare);
    total += parseFloat(newTotalHotel);
    total += parseFloat(newTotalFare);
    total += parseFloat(newTotalContingency);
    total += newData.reduce(
      (totalPerDiem, item) => totalPerDiem + Number(item.perDiem),
      0
    );
    return total.toString();
  };
  const handleEdit = () => {
    setEditedDate(editableRecord.form_data[0].date);
    setNewTotalBoatFare(editableRecord.form_data[0].totalBoatFare);
    setNewTotalHotel(editableRecord.form_data[0].totalHotel);
    setNewTotalFare(editableRecord.form_data[0].totalFare);
    setNewTotalContingency(editableRecord.form_data[0].totalContingency);
    setIsEditing(true);
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewAttachments(Array.from(event.target.files));
    }
  };

  const handleRemoveAttachment = (index: number) => {
    // Get the path of the attachment to be removed
    const attachmentPath = attachmentUrl[index].split(
      "storage/attachments/"
    )[1];

    // Add the path to the removedAttachments state
    setRemovedAttachments((prevRemoved) => [...prevRemoved, attachmentPath]);

    // Remove the attachment from the current list
    setAttachmentUrl((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const getDayFromDate = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    return days[date.getDay()];
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

  if (!record) return null;

  const handleSaveChanges = async () => {
    // Simple validation
    if (
      !newData.every(
        (item) =>
          item.itinerary &&
          item.itinerary.trim() !== "" &&
          item.cashDate &&
          item.cashDate.trim() !== ""
      )
    ) {
      setErrorMessage("Itinerary and date cannot be empty.");
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
            grand_total: calculateGrandTotal(),
            items: newData,
            totalBoatFare: newTotalBoatFare,
            totalHotel: newTotalHotel,
            totalFare: newTotalFare,
            totalContingency: newTotalContingency,
          },
        ])
      );

      // Append existing attachments
      attachmentUrl.forEach((url, index) => {
        const path = url.split("storage/attachments/")[1];
        formData.append(`attachment_url_${index}`, path);
      });

      // Append new attachments
      newAttachments.forEach((file, index) => {
        formData.append("new_attachments[]", file);
      });

      // Append removed attachments
      removedAttachments.forEach((path, index) => {
        formData.append("removed_attachments[]", String(path));
      });

      const response = await axios.post(
        `http://localhost:8000/api/update-request/${record.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Cash advance updated successfully:", response.data);
      setLoading(false);
      setIsEditing(false);
      setSavedSuccessfully(true);
      refreshData();
    } catch (error: any) {
      setLoading(false);
      console.error("Validation error:", error.response?.data?.errors);
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to update Cash advance."
      );
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string
  ) => {
    const newDataCopy = [...newData];
    newDataCopy[index] = { ...newDataCopy[index], [field]: value };
    setErrorMessage("");

    // Calculate and update the 'Day' field if the 'Cash Date' changes
    if (field === "cashDate") {
      const date = new Date(value);
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const day = days[date.getDay()];
      newDataCopy[index].day = day;
    }

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

  console.log("editableRecord:", editableRecord);

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

      console.log("notedby", notedby);
      console.log("approvedby", approvedby);
    } catch (error) {
      console.error("Failed to fetch approvers:", error);
    } finally {
      setisFetchingApprovers(false);
    }
  };

  const fetchApprovers = async (userId: number) => {
    setFetchingApprovers(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }

      const response = await axios.get(
        `http://localhost:8000/api/custom-approvers/${userId}`,
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
      console.log("Approvers: FATYATATA::", approversData);
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
    const newWindow = window.open(`/print-cash`, "_blank");

    // Optional: Focus the new window
    if (newWindow) {
      newWindow.focus();
    }
  };
  console.log(isFetchingApprovers, fetchingApprovers, printWindow);
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="p-4 relative w-full mx-10 md:mx-0 z-10 md:w-1/2 lg:w-2/3 space-y-auto h-4/5 overflow-scroll bg-white border-black shadow-lg">
        <div className=" top-2 flex justify-end cursor-pointer sticky">
          <XMarkIcon className="h-6 w-6 text-black" onClick={closeModal} />
        </div>
        <div className="justify-start items-start flex flex-col space-y-4 w-full">
          {!fetchingApprovers && !isFetchingApprovers && editableRecord.status === 'Approved' && (
            <>
              <button
                className="bg-blue-600 p-1 px-2 rounded-md text-white"
                onClick={handlePrint}
              >
                Print
              </button>
              {printWindow && (
                <PrintCash
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

          <h1 className="font-semibold text-[18px]">
            Application for Cash Advance
          </h1>
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

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 w-full">
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
                  <thead className="border border-black h-1/3  bg-[#8EC7F7]">
                    <tr>
                      <th className={`${tableStyle}`}>Date</th>
                      <th className={`${tableStyle}`}>Day</th>
                      <th className={`${tableStyle}`}>Itinerary</th>
                      <th className={`${tableStyle}`}>Activity</th>
                      <th className={`${tableStyle}`}>Hotel</th>
                      <th className={`${tableStyle}`}>Rate</th>
                      <th className={`${tableStyle}`}>Amount</th>
                      <th className={`${tableStyle}`}>Per Diem</th>
                      <th className={`${tableStyle}`}>Remarks</th>
                    </tr>
                  </thead>
                  <tbody className={`${tableCellStyle}`}>
                    {isEditing
                      ? newData.map((item, index) => (
                          <tr key={index}>
                            <td className={tableCellStyle}>
                              <input
                                type="date"
                                value={item.cashDate}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "cashDate",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="text"
                                value={item.day}
                                onChange={(e) =>
                                  handleItemChange(index, "day", e.target.value)
                                }
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="text"
                                value={item.itinerary}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "itinerary",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="text"
                                value={item.activity}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "activity",
                                    e.target.value
                                  )
                                }
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
                                value={item.rate}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "rate",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className={tableCellStyle}>
                              <input
                                type="text"
                                value={item.amount}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "amount",
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
                            <td className={tableCellStyle}>
                              {formatDate(item.cashDate)}
                            </td>
                            <td className={tableCellStyle}>{item.day}</td>
                            <td className={tableCellStyle}>{item.itinerary}</td>
                            <td className={tableCellStyle}>{item.activity}</td>
                            <td className={tableCellStyle}>{item.hotel}</td>
                            <td className={tableCellStyle}>{item.rate}</td>
                            <td className={tableCellStyle}>{item.amount}</td>
                            <td className={tableCellStyle}>{item.perDiem}</td>
                            <td className={tableCellStyle}>{item.remarks}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <div className="inline-block w-full">
            <table className="border border-black">
              <thead>
                <tr>
                  <th colSpan={2} className="bg-[#8EC7F7]">
                    <p className="font-semibold text-[12px] p-2">
                      SUMMARY OF EXPENSES TO BE INCURRED (for C/A)
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`${tableStyle}`}>
                    <p className="font-semibold">BOAT FARE</p>
                  </td>
                  <td className={`${inputStyle}`}>
                    {isEditing ? (
                      <input
                        type="number"
                        value={newTotalBoatFare}
                        onChange={(e) => setNewTotalBoatFare(e.target.value)}
                        className="w-full bg-white"
                        readOnly={!isEditing}
                      />
                    ) : (
                      parseFloat(
                        editableRecord.form_data[0].totalBoatFare
                      ).toFixed(2)
                    )}
                  </td>
                </tr>
                <tr>
                  <td className={`${tableStyle}`}>
                    <p className="font-semibold">HOTEL</p>
                  </td>
                  <td className={`${inputStyle}`}>
                    {isEditing ? (
                      <input
                        type="number"
                        value={newTotalHotel}
                        onChange={(e) => setNewTotalHotel(e.target.value)}
                        className="w-full bg-white"
                        readOnly={!isEditing}
                      />
                    ) : (
                      parseFloat(
                        editableRecord.form_data[0].totalHotel
                      ).toFixed(2)
                    )}
                  </td>
                </tr>
                <tr>
                  <td className={`${tableStyle}`}>
                    <p className="font-semibold">PER DIEM</p>
                  </td>
                  <td className={`${inputStyle}`}>
                    {/* Display calculated total per diem */}
                    {newData.reduce(
                      (totalPerDiem, item) =>
                        totalPerDiem + Number(item.perDiem),
                      0
                    )}
                  </td>
                </tr>
                <tr>
                  <td className={`${tableStyle}`}>
                    <p className="font-semibold">FARE</p>
                  </td>
                  <td className={`${inputStyle}`}>
                    {isEditing ? (
                      <input
                        type="number"
                        value={newTotalFare}
                        onChange={(e) => setNewTotalFare(e.target.value)}
                        className="w-full bg-white"
                        readOnly={!isEditing}
                      />
                    ) : (
                      parseFloat(editableRecord.form_data[0].totalFare).toFixed(
                        2
                      )
                    )}
                  </td>
                </tr>
                <tr>
                  <td className={`${tableStyle}`}>
                    <p className="font-semibold">CONTINGENCY</p>
                  </td>
                  <td className={`${inputStyle}`}>
                    {isEditing ? (
                      <input
                        type="number"
                        value={newTotalContingency}
                        onChange={(e) => setNewTotalContingency(e.target.value)}
                        className="w-full"
                        readOnly={!isEditing}
                      />
                    ) : (
                      parseFloat(
                        editableRecord.form_data[0].totalContingency
                      ).toFixed(2)
                    )}
                  </td>
                </tr>
                <tr>
                  <td className={`${tableStyle} h-8`}></td>
                  <td className={`${tableStyle}`}></td>
                </tr>
                <tr>
                  <td className={`${tableStyle} h-14 font-bold`}>TOTAL</td>
                  <td className={`${tableStyle} text-center font-bold`}>
                    ₱{" "}
                    {isEditing
                      ? calculateGrandTotal()
                      : editableRecord.form_data[0].grand_total}
                  </td>
                </tr>
              </tbody>
            </table>
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
                  console.log("Selected Approver ID:", selectedApproverId);
                  setEditedApprovers(selectedApproverId);
                }}
                disabled={!isEditing}
              >
                <option value="" disabled>
                  Approver List
                </option>
                {approvers.map((approver) => (
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
          <div className="md:absolute right-11 top-2 items-center">
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
              !isFetchingApprovers &&
              editableRecord.status === "Pending" && (
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

export default ViewCashAdvanceModal;

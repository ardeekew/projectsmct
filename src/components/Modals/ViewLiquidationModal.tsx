import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import EditStockModalSuccess from "./EditStockModalSuccess";
import { ClipLoader } from "react-spinners";
import { PencilIcon } from "@heroicons/react/24/solid";
import Avatar from "../assets/avatar.png";
import PrintLiquidation from "../PrintLiquidation";
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
const ViewLiquidationModal: React.FC<Props> = ({
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
  const [isFetchingUser, setisFetchingUser] = useState(false);
  const [user, setUser] = useState<any>({});
  const [attachmentUrl, setAttachmentUrl] = useState<string[]>([]);
  const [printWindow, setPrintWindow] = useState<Window | null>(null);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [originalAttachments, setOriginalAttachments] = useState<string[]>([]);
  const [removedAttachments, setRemovedAttachments] = useState<
    (string | number)[]
  >([]);

  useEffect(() => {
    const currentUserId = localStorage.getItem("id");
    const attachments = JSON.parse(record.attachment);
    // Ensure currentUserId and userId are converted to numbers if they exist
    const userId = currentUserId ? parseInt(currentUserId) : 0;
    setNewData(record.form_data[0].items.map((item) => ({ ...item })));
    setEditableRecord(record);
    setNewCashAdvance(record.form_data[0].cashAdvance);

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
    setEditedApprovers(record.approvers_id);
    setAttachmentUrl(attachmentUrl);
    setNewAttachments([]); // Clear new attachments
    setRemovedAttachments([]); // Reset removed attachments
    // Reset newData to original values
    setNewData(record.form_data[0].items.map((item) => ({ ...item })));
    setEditableRecord((prevState) => ({
      ...prevState,
      form_data: [
        {
          ...prevState.form_data[0],
          grand_total: record.form_data[0].grand_total, // Reset grand_total
        },
      ],
    }));
    // Reset cashAdvance to its original value
    setNewCashAdvance(record.form_data[0].cashAdvance);
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
  const handleEdit = () => {
    setEditedDate(editableRecord.form_data[0].date);

    setIsEditing(true);
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

  console.log("record", record.form_data[0]);

  const handleSaveChanges = async () => {
    // Simple validation
    if (
      !newData.every(
        (item) =>
          item.destination &&
          item.destination.trim() !== "" &&
          item.liquidationDate &&
          item.liquidationDate.trim() !== ""
      )
    ) {
      setErrorMessage("Itinerary and date cannot be empty.");
      return;
    }

    // Check if cashAdvance is less than 1 or negative
    if (parseFloat(newCashAdvance) < 1 || isNaN(parseFloat(newCashAdvance))) {
      setErrorMessage(
        "Cash advance must be a positive number greater than or equal to 1."
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
            totalExpense: calculateTotalExpense(),
            cashAdvance: newCashAdvance,
            name: editableRecord.form_data[0].name,
            purpose: editableRecord.form_data[0].purpose,
            items: newData,
            short: calculateShort(
              parseFloat(calculateTotalExpense()),
              parseFloat(newCashAdvance)
            ).toString(),
            signature: editableRecord.form_data[0].signature,
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

      console.log("Stock requisition updated successfully:", response.data);
      setLoading(false);
      setIsEditing(false);
      setSavedSuccessfully(true);
      refreshData();
    } catch (error: any) {
      setLoading(false);
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to update stock requisition."
      );
    }
  };

  if (!record) return null;

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
      console.log("Approvers:", approvers);
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
    const newWindow = window.open(`/print-liquidation`, "_blank");

    // Optional: Focus the new window
    if (newWindow) {
      newWindow.focus();
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="p-4 relative w-full px-10 md:mx-0 z-10 md:w-1/2 lg:w-2/3 space-y-auto h-4/5 overflow-scroll bg-white border-black rounded-t-lg shadow-lg">
        <div className=" top-2 flex justify-end cursor-pointer sticky">
          <XMarkIcon className="h-6 w-6 text-black" onClick={closeModal} />
        </div>
        <div className="justify-start items-start flex flex-col space-y-2 w-full">
          {!fetchingApprovers && !isFetchingApprovers  && (
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
          <h1 className="font-semibold text-[18px]">
            Liquidation of Actual Expense
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
          <div className="md:absolute right-16 top-2 items-center">
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

export default ViewLiquidationModal;

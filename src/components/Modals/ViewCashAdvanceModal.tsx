import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { PencilIcon } from "@heroicons/react/24/solid";
import EditStockModalSuccess from "./EditStockModalSuccess";
import BeatLoader from "react-spinners/BeatLoader";
type Props = {
  closeModal: () => void;
  record: Record;
  refreshData: () => void;
};
interface Approver {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
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
  const [editedApprovers, setEditedApprovers] = useState<number>(record.approvers_id);
  const [loading, setLoading] = useState(false);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [fetchingApprovers, setFetchingApprovers] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const currentUserId = localStorage.getItem("id");

    const userId = currentUserId ? parseInt(currentUserId) : 0;

    setNewData(record.form_data[0].items.map((item) => ({ ...item })));
    setEditableRecord(record);
    setNewTotalBoatFare(record.form_data[0].totalBoatFare);
    setNewTotalHotel(record.form_data[0].totalHotel);
    setNewTotalFare(record.form_data[0].totalFare);
    setNewTotalContingency(record.form_data[0].totalContingency);
 
    if (currentUserId) {
      fetchApprovers(userId, parseInt(currentUserId)); // Fetch approvers based on currentUserId
    }
  }, [record]);

  const handleCancelEdit = () => {
    setIsEditing(false);
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

      const requestData = {
        updated_at: new Date().toISOString(),
        approvers_id: editedApprovers,
        form_data: [
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
        ],
      };

      // Update editableRecord with the new data
      setEditableRecord((prevState) => ({
        ...prevState,
        approvers_id: editedApprovers,
        form_data: [
          {
            ...prevState.form_data[0],
            items: newData,
            date: editedDate !== "" ? editedDate : prevState.form_data[0].date,
            totalBoatFare: newTotalBoatFare,
            totalHotel: newTotalHotel,
            totalFare: newTotalFare,
            totalContingency: newTotalContingency,
          },
        ],
      }));
      console.log("editableRecord:", editableRecord);
      const response = await axios.put(
        `http://localhost:8000/api/update-request/${record.id}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Stock requisition updated successfully:", response.data);
      setLoading(false);
      setIsEditing(false);
      setSavedSuccessfully(true);
      refreshData();
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to update stock requisition."
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
  const fetchApprovers = async (userId: number, currentUserId: number) => {
    setFetchingApprovers(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }

      const response = await axios.get<Approver[]>(
        `http://localhost:8000/api/custom-approvers/?user_id=${currentUserId}`, // Use currentUserId in the query parameter
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const approversData = response.data;
      setApprovers(approversData);
      console.log("data", approversData);
    } catch (error) {
      console.error("Failed to fetch approvers:", error);
    } finally {
      setFetchingApprovers(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="p-4 relative w-full mx-10 md:mx-0 z-10 md:w-1/2 lg:w-2/3 space-y-auto h-4/5 overflow-scroll bg-white border-black shadow-lg">
        <div className=" top-2 flex justify-end cursor-pointer sticky">
          <XMarkIcon className="h-6 w-6 text-black" onClick={closeModal} />
        </div>
        <div className="justify-start items-start flex flex-col space-y-4 w-full">
          <h1 className="font-semibold text-[18px]">
            Application for Cash Advance
          </h1>
          <p className="font-medium text-[14px]">Request ID:#{record.id}</p>
          <div className="flex w-full md:w-1/2 items-center">
            <p>Status:</p>
            <p
              className={`${
                record.status === "Pending"
                  ? "bg-yellow"
                  : record.status === "Approved"
                  ? "bg-green"
                  : "bg-pink"
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
                      parseFloat(editableRecord.form_data[0].totalBoatFare).toFixed(2)
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
                      parseFloat(editableRecord.form_data[0].totalHotel).toFixed(2) 
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
                      parseFloat(editableRecord.form_data[0].totalFare).toFixed(2)  
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
                      parseFloat(editableRecord.form_data[0].totalContingency).toFixed(2) 
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
                value={isEditing ? editedApprovers : editableRecord.approvers_id}
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
                {approvers.flat().map((approver) => (
                  <option key={approver.id} value={approver.id}>
                    {approver.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="w-full">
            <h1 className="flex">
              Comments<p className="text-red-600">*</p>
            </h1>
            <textarea
              className="border h-32 border-black rounded-md p-1 mt-2 w-full "
              placeholder="e.g."
              readOnly
            />
          </div>
          <div className="md:absolute right-11 top-2 items-center">
            {isEditing ? (
              <div>
                <button
                  className="bg-primary text-white  items-center h-10 rounded-xl p-2"
                  onClick={handleSaveChanges}
                >
                  {loading ? (
                    <BeatLoader color="white" size={10} />
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  className="bg-red-600  rounded-xl text-white ml-2 p-2"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="bg-blue-500 ml-2 rounded-xl p-2 flex text-white"
                onClick={handleEdit}
              >
                <PencilIcon className="h-6 w-6 mr-2" />
                Edit
              </button>
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

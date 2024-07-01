import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import EditStockModalSuccess from "./EditStockModalSuccess";
import { ClipLoader } from "react-spinners";
import { PencilIcon } from "@heroicons/react/24/solid";

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
  destination: string;
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
  const [editedApprovers, setEditedApprovers] = useState<number>(record.approvers_id);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [fetchingApprovers, setFetchingApprovers] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editedDate, setEditedDate] = useState("");
  const [newCashAdvance, setNewCashAdvance] = useState("");

  useEffect(() => {
    const currentUserId = localStorage.getItem("id");

    // Ensure currentUserId and userId are converted to numbers if they exist
    const userId = currentUserId ? parseInt(currentUserId) : 0;
    setNewData(record.form_data[0].items.map((item) => ({ ...item })));
    setEditableRecord(record);
    setNewCashAdvance(record.form_data[0].cashAdvance);

    if (currentUserId) {
      fetchApprovers(userId, parseInt(currentUserId)); // Fetch approvers based on currentUserId
    }
  }, [record]);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedApprovers(record.approvers_id);
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

      const requestData = {
        updated_at: new Date().toISOString(),
        approvers_id: editedApprovers,
        form_data: [
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
            name: editableRecord.form_data[0].name,
            signature: editableRecord.form_data[0].signature,
            totalExpense: calculateTotalExpense(),
            cashAdvance: newCashAdvance,
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
      <div className="p-4 relative w-full px-10 md:mx-0 z-10 md:w-1/2 lg:w-10/12 space-y-auto h-4/5 overflow-scroll bg-white border-black rounded-t-lg shadow-lg">
        <div className=" top-2 flex justify-end cursor-pointer sticky">
          <XMarkIcon className="h-6 w-6 text-black" onClick={closeModal} />
        </div>
        <div className="justify-start items-start flex flex-col space-y-2 w-full">
          <h1 className="font-semibold text-[18px]">
            Liquidation of Actual Expense
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
                    <img src={record.form_data[0].signature}  />
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
          <div className="md:absolute right-16 top-2 items-center">
            {isEditing ? (
              <div className="mr-4">
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
                className="bg-blue-500  rounded-xl p-2 flex text-white"
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

export default ViewLiquidationModal;

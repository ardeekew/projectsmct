import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import EditStockModalSuccess from "./EditStockModalSuccess";
import { read } from "fs";

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
  branch: string;
  date: string;
  user_id: number;
  grand_total: string;
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

const ViewStockModal: React.FC<Props> = ({
  closeModal,
  record,
  refreshData,
}) => {
  const [editableRecord, setEditableRecord] = useState(record);
  const [newData, setNewData] = useState<Item[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDate, setEditedDate] = useState("");
  const [editedApprovers, setEditedApprovers] = useState<number>(record.approvers_id);

  const [loading, setLoading] = useState(false);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [fetchingApprovers, setFetchingApprovers] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkedPurpose, setCheckedPurpose] = useState<string | null>(null);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  useEffect(() => {
    const currentUserId = localStorage.getItem("id");

    // Ensure currentUserId and userId are converted to numbers if they exist
    const userId = currentUserId ? parseInt(currentUserId) : 0;
    
    setNewData(record.form_data[0].items.map((item) => ({ ...item })));
    setEditableRecord(record);
    setCheckedPurpose(record.form_data[0].purpose); // Initialize checkedPurpose with the original purpose
  
    // Call fetchApprovers with both arguments
    if (currentUserId) {
      fetchApprovers(userId, parseInt(currentUserId)); // Fetch approvers based on currentUserId
    }
  }, [record]);

  const handleEdit = () => {
    setEditedDate(editableRecord.form_data[0].date); // Initialize editedDate with the original date
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCheckedPurpose(record.form_data[0].purpose);
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
  
      const requestData = {
        updated_at: new Date().toISOString(),
        approvers_id: editedApprovers,
        form_data: [
          {
            branch: editableRecord.form_data[0].branch,
            date:
              editedDate !== "" ? editedDate : editableRecord.form_data[0].date,
            status: editableRecord.status,
            grand_total: editableRecord.form_data[0].grand_total,
            purpose: checkedPurpose || editableRecord.form_data[0].purpose,
            items: newData,
          },
        ],
      };
  
      // Log approvers_id before updating state
      console.log("approvers_id before state update:", editedApprovers);
  
      // Update editableRecord with the new data
      setEditableRecord((prevState) => ({
        ...prevState,
        approvers_id: editedApprovers,
        form_data: [
          {
            ...prevState.form_data[0],
            items: newData,
            date: editedDate !== "" ? editedDate : prevState.form_data[0].date,
            purpose: checkedPurpose || prevState.form_data[0].purpose,
          },
        ],
      }));
  
      // Log approvers_id after updating state
      console.log("approvers_id after state update:", editedApprovers);
  
      const response = await axios.put(
        `http://localhost:8000/api/update-request/${record.id}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("requestData", requestData);
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
  
console.log('id', editedApprovers);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handlePurposeChange = (purpose: string) => {
    setCheckedPurpose(purpose);
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
          purpose: checkedPurpose || prevState.form_data[0].purpose,
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
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-4 relative w-full mx-10 md:mx-0 z-10 md:w-1/2 space-y-auto h-3/4 overflow-scroll bg-white border-black rounded-t-lg shadow-lg">
        <div className="top-2 flex justify-end cursor-pointer sticky">
          <XMarkIcon className="h-6 w-6 text-black" onClick={closeModal} />
        </div>
        <div className="justify-start items-start flex flex-col space-y-4 w-full">
          <h1 className="font-semibold text-[18px]">Stock Requisition Slip</h1>
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

          <p className="font-medium text-[14px]">Purpose:</p>
          <p>{record.form_data[0].purpose}</p>

          <div className="flex flex-col md:flex-row md:space-x-2">
            <label>
              Repo. Recon
              <input
                type="checkbox"
                checked={checkedPurpose === "Repo. Recon"}
                onChange={() => handlePurposeChange("Repo. Recon")}
                disabled={!isEditing}
                className="size-4"
              />
            </label>
            <label>
              Repair & Maintenance
              <input
                type="checkbox"
                checked={checkedPurpose === "Repair & Maintenance"}
                onChange={() => handlePurposeChange("Repair & Maintenance")}
                disabled={!isEditing}
                className="size-4"
              />
            </label>
            <label>
              Office/Service Used
              <input
                type="checkbox"
                checked={checkedPurpose === "Office/Service Used"}
                onChange={() => handlePurposeChange("Office/Service Used")}
                disabled={!isEditing}
                className="size-4"
              />
            </label>
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
          <div className="md:absolute  right-11 top-2 items-center">
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

export default ViewStockModal;

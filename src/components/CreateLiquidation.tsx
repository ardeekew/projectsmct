import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select/dist/declarations/src/Select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "@heroicons/react/24/solid";
import TextareaAutosize from "react-textarea-autosize";
import { set, useForm } from "react-hook-form";
import { z, ZodError } from "zod";
import axios from "axios";
import RequestSuccessModal from "./Modals/RequestSuccessModal";
import ClipLoader from "react-spinners/ClipLoader";
import { useUser } from '../context/UserContext';
type CustomApprover = {
  id: number;
  name: string;
  approvers: {
    noted_by: { name: string }[];
    approved_by: { name: string }[];
  };
};
type Props = {};
const requestType = [
  { title: "Stock Requisition", path: "/request/sr" },
  { title: "Purchase Order Requisition Slip", path: "/request/pors" },
  { title: "Cash Disbursement Requisition Slip", path: "/request/cdrs" },
  { title: "Application For Cash Advance", path: "/request/afca" },
  { title: "Liquidation of Actual Expense", path: "/request/loae" },
  { title: "Request for Refund", path: "/request/rfr" },
];
const brancheList = [
  "Branch A",
  "Branch B",
  "Branch C",
  "Branch D",
  "Branch E",
];
const schema = z.object({
  date: z.string(),
  purpose: z.string(),
  totalExpense: z.string(),
  cashAdvance: z.string(),
  approver_list_id: z.number(),
  approver: z.string(),
  short: z.string(),
  items: z.array(
    z.object({
      liquidationDate: z.string(),
      destination: z.string(),
      transportation: z.string().optional(),
      transportationAmount: z.string().optional(),
      hotel: z.string().optional(),
      hotelAddress: z.string().optional(),
      hotelAmount: z.string().optional(),
      perDiem: z.string().optional(),
      particaulars: z.string().optional(),
      particularsAmount: z.string().optional(),
      grandTotal: z.string().optional(),
    })
  ),
});
type FormData = z.infer<typeof schema>;
type TableDataItem = {
  liquidationDate: string;
  destination: string;
  transportation: string;
  transportationAmount: string;
  hotel: string;
  hotelAddress: string;
  hotelAmount: string;
  perDiem: string;
  particularsAmount: string;
  particulars: string;
  grandTotal: string;
};

const initialTableData: TableDataItem[] = Array.from({ length: 1 }, () => ({
  liquidationDate: "",
  destination: "",
  transportation: "",
  transportationAmount: "",
  hotel: "",
  hotelAddress: "",
  hotelAmount: "",
  perDiem: "",
  particularsAmount: "",
  particulars: "",

  grandTotal: "0",
}));

const tableStyle = "border border-black p-2";
const inputStyle = "w-full  border-2 border-black rounded-[12px] pl-[10px]";
const tableInput = "w-full h-full bg-white px-2 py-1";
const itemDiv = "flex flex-col  w-3/4";

const buttonStyle = "h-[45px] w-[150px] rounded-[12px] text-white";
const CreateLiquidation = (props: Props) => {
  const [startDate, setStartDate] = useState(new Date());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cashAdvance, setCashAdvance] = useState("0");
  const [formData, setFormData] = useState<any>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [signature, setSignature] = useState("");
  const [file, setFile] = useState<File[]>([]);
  const [customApprovers, setCustomApprovers] = useState<CustomApprover[]>([]);
  const [selectedApproverList, setSelectedApproverList] = useState<
    number | null
  >(null);
  const [employeeID, setEmployeeID] = useState<string | null>(null);
  const [selectedApprover, setSelectedApprover] = useState<{ name: string }[]>(
    []
  );
  const {
    formState: { errors: formErrors },
  } = useForm<FormData>();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convert FileList to array and set it
      setFile(Array.from(e.target.files));
    }
  };
  const [items, setItems] = useState<
    {
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
    }[]
  >([
    {
      liquidationDate: "",
      destination: "",
      transportation: "",
      transportationAmount: "",
      hotel: "",
      hotelAddress: "",
      hotelAmount: "",
      perDiem: "",
      particulars: "",
      particularsAmount: "",

      grandTotal: "0",
    },
  ]);
  const [tableData, setTableData] = useState<TableDataItem[]>(initialTableData);
   const { userId, firstName, lastName, email, role, branchCode, contact } = useUser();
  const [selectedRequestType, setSelectedRequestType] =
    useState("/request/loae");

  useEffect(() => {
    fetchCustomApprovers();
  }, []);

  const fetchCustomApprovers = async () => {
    try {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      if (!token || !id) {
        console.error("Token or user ID is missing");
        return;
      }

      const response = await axios.get(
        `http://122.53.61.91:6002/api/custom-approvers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(response.data.data)) {
        setCustomApprovers(response.data.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setCustomApprovers([]); // Ensure that customApprovers is always an array
      }

   
    } catch (error) {
      console.error("Error fetching custom approvers:", error);
      setCustomApprovers([]); // Ensure that customApprovers is always an array
    }
  };

  const handleChange = (
    index: number,
    field: keyof TableDataItem,
    value: string
  ) => {
    const newData = [...tableData];
    newData[index][field] = value;

    // Parse the amounts as floats
    const transportationAmount =
      parseFloat(newData[index].transportationAmount) || 0;
    const hotelAmount = parseFloat(newData[index].hotelAmount) || 0;
    const particularsAmount = parseFloat(newData[index].particularsAmount) || 0;
    const perDiem = parseFloat(newData[index].perDiem) || 0;
    // Calculate the grandTotal whenever any of the fields is inputted
    const grandTotal =
      transportationAmount + hotelAmount + particularsAmount + perDiem;
    newData[index].grandTotal = grandTotal.toFixed(2);

    setTableData(newData);

    // Clear the error when the field is changed
    setValidationErrors((prevErrors: Record<string, any>) => {
      const newErrors = { ...prevErrors };
      delete newErrors.items?.[index]?.[field];
      return newErrors;
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const handleAddRow = () => {
    setTableData([...tableData]);
  };

  const handleRemoveItem = () => {
    if (tableData.length > 1) {
      const updatedItems = [...tableData];
      updatedItems.pop();
      setTableData(updatedItems);
    }
  };
  const totalExpense = tableData.reduce(
    (total, item) => total + parseFloat(item.grandTotal),
    0
  );

  // Convert cashAdvance to a number before performing subtraction
  const short = (totalExpense - parseFloat(cashAdvance || "0")).toFixed(2);

  const handleAddItem = () => {
    setTableData([
      ...tableData,
      {
        liquidationDate: "",
        destination: "",
        transportation: "",
        transportationAmount: "",
        hotel: "",
        hotelAddress: "",
        hotelAmount: "",
        perDiem: "",
        particulars: "",
        particularsAmount: "",
        grandTotal: "0",
      },
    ]);
  };

  useEffect(() => {
    // Retrieve values from localStorage
    const storedFirstName = localStorage.getItem("firstName");
    const storedLastName = localStorage.getItem("lastName");
    const signature = localStorage.getItem("signature");
    const employee_id = localStorage.getItem("employee_id");
    // Combine first name and last name
    const fullName = `${storedFirstName} ${storedLastName}`.trim();

    // Update the state variable with the combined name
    setName(fullName);
    setEmployeeID(String(employee_id));
    setSignature(signature || "");
  }, []);

  const handleOpenConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  // Function to close the confirmation modal
  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };
 
  const onSubmit = async (data: FormData) => {
    try {
      if (!cashAdvance && errors.cashAdvance) {
        setFormSubmitted(true);
        return;
      }

      const selectedList = customApprovers.find(
        (approver) => approver.id === selectedApproverList
      );
      if (!selectedList) {
        console.error("Selected approver list not found");
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");
      const firstName = localStorage.getItem("firstName");
      const lastName = localStorage.getItem("lastName");
      setName(firstName + " " + lastName);
      const eSig = localStorage.getItem("signature");
      const branch_code = localStorage.getItem("branch_code");
  
      if (!token || !userId) {
        console.error("Token or userId not found");
        return;
      }

     
      setItems(tableData);
   
      const emptyItems: number[] = [];
      items.forEach((item, index) => {
        if (Object.values(item).some((value) => value === "")) {
          emptyItems.push(index);
        }
      });

    
      

      // Calculate total expense by summing up all grand totals
      const totalExpense = tableData
        .reduce((acc, item) => acc + parseFloat(item.grandTotal || "0"), 0)
        .toFixed(2);
      const short = (
        parseFloat(totalExpense) - parseFloat(cashAdvance)
      ).toFixed(2);

      const formData = new FormData();

      // Append each file to FormData
      file.forEach((file) => {
        formData.append("attachment[]", file); // Use "attachment[]" to handle multiple files
      });

      formData.append("form_type", "Liquidation of Actual Expense");
      formData.append("approvers_id", String(selectedApproverList));
      formData.append("user_id", userId);

      formData.append(
        "form_data",
        JSON.stringify([
          {
            date: data.date,
            branch: branch_code,
            purpose: data.purpose,
            totalExpense: totalExpense,
            short: short,
            cashAdvance: cashAdvance,
            name: name,
            signature: signature,
            items: tableData.map((item) => ({
              liquidationDate: item.liquidationDate,
              destination: item.destination,
              transportation: item.transportation,
              transportationAmount: item.transportationAmount,
              hotel: item.hotel,
              hotelAddress: item.hotelAddress,
              hotelAmount: item.hotelAmount,
              perDiem: item.perDiem,
              particulars: item.perDiem,
              particularsAmount: item.particularsAmount,
              grandTotal: item.grandTotal,
            })),
          },
        ])
      );

      // Display confirmation modal
      setShowConfirmationModal(true);

      // Set form data to be submitted after confirmation
      logFormData(formData);
      setFormData(formData);
    } catch (error) {
      console.error("An error occurred while submitting the request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSubmit = async () => {
    // Close the confirmation modal
    setShowConfirmationModal(false);
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      logFormData(formData);

      // Perform the actual form submission
      const response = await axios.post(
        "http://122.53.61.91:6002/api/create-request",
        formData, // Use the formData stored in state
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowSuccessModal(true);

      setFormSubmitted(true);
      setLoading(false);
    } catch (error) {
      console.error("An error occurred while submitting the request:", error);
    } finally {
      setLoading(false);
    }
  };

  const logFormData = (formData: any) => {
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  };

  const handleCancelSubmit = () => {
    // Close the confirmation modal
    setShowConfirmationModal(false);
    // Reset formData state
    setFormData(null);
  };

  const handleInputChange = (
    index: number,
    field: keyof (typeof items)[0],
    value: string
  ) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };
  const navigate = useNavigate();
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);

    navigate("/request");
  };

  const handleFormSubmit = () => {
    setFormSubmitted(true);
  };
  return (
    <div className="bg-graybg dark:bg-blackbg h-full pt-[15px] px-[30px] pb-[15px]">
      <h1 className="text-primary text-[32px] font-bold">Create Request</h1>

      <select
        className="w-2/5 lg:h-[56px] md:h-10 p-2 bg-gray-200 pl-[30px] border-2 border-black rounded-xl mb-2"
        value={selectedRequestType}
        onChange={(e) => {
          setSelectedRequestType(e.target.value);
          navigate(e.target.value);
        }}
      >
        <option value="" disabled>
          Type of request
        </option>
        {requestType.map((item) => (
          <option key={item.title} value={item.path}>
            {item.title}
          </option>
        ))}
      </select>
      <div className="bg-white w-full mb-5 rounded-[12px] flex flex-col">
        <div className="border-b flex justify-between flex-col px-[30px] md:flex-row ">
          <div>
            <h1 className=" text-[24px] text-left py-4 text-primary font-bold flex mr-2">
              <span className="mr-2 underline decoration-2 underline-offset-8">
                Liquidation
              </span>{" "}
              of Actual Expense
            </h1>
          </div>
          <div className="my-2  ">
            <label className="block font-semibold mb-2">Approver List:</label>
            <select
              {...register("approver_list_id", { required: true })}
              value={
                selectedApproverList !== null
                  ? selectedApproverList.toString()
                  : ""
              }
              onChange={(e) =>
                setSelectedApproverList(parseInt(e.target.value))
              }
              className="border-2 border-black  p-2 rounded-md w-full"
            >
              <option value="">Select Approver List</option>
              {customApprovers.map((approverList) => (
                <option
                  key={approverList.id}
                  value={approverList.id.toString()}
                >
                  {approverList.name}
                </option>
              ))}
            </select>
            {errors.approver_list_id && formSubmitted && (
              <p className="text-red-500">Please select an approver list.</p>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-[35px] mt-4 ">
            <div className="grid grid-cols-1 gap-2 w-1/2 md:grid-cols-2 md:flex md:justify-start md:space-x-8">
              <div className={`${itemDiv}`}>
                <p className="font-semibold text-start mr-40">Date:</p>
                <input
                  type="date"
                  {...register("date", { required: true })}
                  className={`${inputStyle} h-[44px] w-full`}
                />
                {errors.date && formSubmitted && (
                  <p className="text-red-500">Date is required</p>
                )}
              </div>
              <div className={`${itemDiv}`}>
                <p className="font-semibold">Purpose:</p>
                <textarea
                  className={`${inputStyle} h-[100px] w-full`}
                  {...register("purpose", { required: true })}
                />
                {errors.purpose && formSubmitted && (
                  <p className="text-red-500">Purpose is required</p>
                )}
              </div>
            </div>

            <div className=" mt-20 px-4 w-full ">
              <h1 className="text-[24px] font-semibold">
                Liquidation of Actual Expense
              </h1>
            </div>
            <div className="mt-4 w-full overflow-x-auto">
              <div className="w-full border-collapse border border-black ">
                <div className="table-container">
                  <table className="border-collapse border w-full border-black ">
                    <thead className="bg-[#8EC7F7]">
                      <tr>
                        <th>Date</th>
                        <th colSpan={3} className="border border-black">
                          Transportation
                        </th>
                        <th colSpan={3} className="border border-black">
                          Hotel
                        </th>
                        <th colSpan={3} className="border border-black">
                          PER DIEM OTHER RELATED EXPENSES
                        </th>
                        <th></th>
                      </tr>
                      <tr>
                        <th className={`${tableStyle}`}>Day</th>
                        <th className={`${tableStyle}`}>Destination</th>
                        <th className={`${tableStyle}`}>
                          Type of Transportation
                        </th>
                        <th className={`${tableStyle}`}>Amount</th>
                        <th className={`${tableStyle}`}>Hotel</th>
                        <th className={`${tableStyle}`}>Place</th>
                        <th className={`${tableStyle}`}>Amount</th>
                        <th className={`${tableStyle}`}>Per Diem</th>
                        <th className={`${tableStyle}`}>Particulars</th>
                        <th className={`${tableStyle}`}>Amount</th>
                        <th className={`${tableStyle}`}>Grand Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((item, index) => (
                        <tr key={index} className="border border-black">
                          <td className="p-1 border border-black">
                            <input
                              type="date"
                              value={item.liquidationDate}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "liquidationDate",
                                  e.target.value
                                )
                              }
                              className={`${tableInput}`}
                            />
                            {validationErrors[
                              `items.${index}.liquidationDate`
                            ] &&
                              formSubmitted && (
                                <p className="text-red-500">
                                  {
                                    validationErrors[
                                      `items.${index}.liquidationDate`
                                    ]
                                  }
                                </p>
                              )}
                            {!item.liquidationDate &&
                              formSubmitted &&
                              !validationErrors[
                                `item.${index}.liquidationDate`
                              ] && (
                                <p className="text-red-500">Date Required</p>
                              )}
                          </td>
                          <td className="p-1 border border-black">
                            <textarea
                              value={item.destination}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "destination",
                                  e.target.value
                                )
                              }
                              className={`${tableInput}`}
                            ></textarea>
                            {validationErrors[`items.${index}.destination`] &&
                              formSubmitted && (
                                <p className="text-red-500">
                                  {
                                    validationErrors[
                                      `items.${index}.destination`
                                    ]
                                  }
                                </p>
                              )}
                            {!item.destination &&
                              formSubmitted &&
                              !validationErrors[
                                `item.${index}.destination`
                              ] && (
                                <p className="text-red-500">
                                  Destination Required
                                </p>
                              )}
                          </td>
                          <td className="p-1 border border-black">
                            <input
                              type="text"
                              value={item.transportation}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "transportation",
                                  e.target.value
                                )
                              }
                              className={`${tableInput}`}
                            />
                          </td>
                          <td className="p-1 border border-black">
                            <input
                              type="number"
                              value={item.transportationAmount}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "transportationAmount",
                                  e.target.value
                                )
                              }
                              className={`${tableInput}`}
                            />
                          </td>
                          <td className="p-1 border border-black">
                            <textarea
                              value={item.hotel}
                              onChange={(e) =>
                                handleChange(index, "hotel", e.target.value)
                              }
                              className={`${tableInput}`}
                            ></textarea>
                          </td>
                          <td className="p-1 border border-black">
                            <textarea
                              value={item.hotelAddress}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "hotelAddress",
                                  e.target.value
                                )
                              }
                              className={`${tableInput}`}
                            />
                          </td>
                          <td className="p-1 border border-black">
                            <input
                              type="number"
                              value={item.hotelAmount}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "hotelAmount",
                                  e.target.value
                                )
                              }
                              className={`${tableInput}`}
                            />
                          </td>
                          <td className="p-1 border border-black">
                            <input
                              type="number"
                              value={item.perDiem}
                              onChange={(e) =>
                                handleChange(index, "perDiem", e.target.value)
                              }
                              className={`${tableInput}`}
                            />
                          </td>
                          <td className="p-1 border border-black">
                            <textarea
                              value={item.particulars}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "particulars",
                                  e.target.value
                                )
                              }
                              className={`${tableInput}resize-none h-[100px]  `}
                            />
                          </td>
                          <td className="p-1 border border-black">
                            <input
                              type="number"
                              value={item.particularsAmount}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "particularsAmount",
                                  e.target.value
                                )
                              }
                              className={`${tableInput}`}
                            />
                          </td>
                          <td className="p-1 border border-black text-center font-bold">
                            ₱{item.grandTotal}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-2 overflow-x-auto">
              <div>
                <table className="border border-black  mt-10 w-full">
                  <tr>
                    <td className={`${tableStyle}`}>
                      <p className="font-semibold pl-2 pr-20   ">
                        TOTAL EXPENSE
                      </p>
                    </td>
                    <td className={`${tableStyle}`}>
                      <p className="font-semibold  ">₱{totalExpense}</p>
                    </td>
                  </tr>
                  <tr>
                    <td className={`${tableStyle}`}>
                      <p className="font-semibold pl-2 pr-20   ">
                        CASH ADVANCE
                      </p>
                    </td>
                    <td className={`${tableStyle} `}>
                      ₱
                      <input
                        type="number"
                        {...register("cashAdvance", {
                          required: "Cash Advance is required",
                          validate: (value) =>
                            parseFloat(value) > 0 ||
                            "Cash Advance must be greater than 0",
                        })}
                        value={cashAdvance}
                        onChange={(e) => setCashAdvance(e.target.value)}
                        className="bg-white font-bold"
                      />
                      {errors.cashAdvance && (
                        <p className="text-red-500">
                          {errors.cashAdvance.message}
                        </p>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className={`${tableStyle}`}>
                      <p className="font-semibold pl-2 ">SHORT</p>
                    </td>
                    <td className={`${tableStyle}`}>
                      <p className="font-semibold  ">₱{short}</p>
                    </td>
                  </tr>
                </table>
              </div>
              <div>
                <table className="border border-black  mt-10 w-full">
                  <tr>
                    <td className={`${tableStyle}`}>
                      <p className="font-semibold pl-2 pr-20   ">
                        NAME OF EMPLOYEE
                      </p>
                    </td>
                    <td className={`${tableStyle}`}>
                      <p className="font-semibold  ">{name}</p>
                    </td>
                  </tr>
                  <tr>
                    <td className={`${tableStyle}`}>
                      <p className="font-semibold pl-2    ">SIGNATURE</p>
                    </td>
                    <td className={`${tableStyle}`}>
                      <img src={signature} alt="" />
                    </td>
                  </tr>
                  <tr>
                    <td className={`${tableStyle}`}>
                      <p className="font-semibold pl-2 ">EMPLOYEE NO.</p>
                    </td>
                    <td className={`${tableStyle}`}>
                      <p className="font-semibold  ">{employeeID}</p>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          
            <div className="w-full max-w-md  p-4">
                <p className="font-semibold">Attachments:</p>
                <input
                  id="file"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full mt-2"
                />
              </div>
            <div className="space-x-3 flex justify-end mt-20 pb-10">
              <button
              type="button"
                className={`bg-yellow ${buttonStyle}`}
                onClick={handleAddItem}
              >
                Add
              </button>
              <div>
                {tableData.length > 1 && (
                  <button
                    type="button"
                    className={`${buttonStyle} bg-pink`}
                    onClick={handleRemoveItem}
                  >
                    Remove Item
                  </button>
                )}
              </div>
              <button
                className={`bg-primary ${buttonStyle}`}
                type="submit"
                onClick={handleFormSubmit}
                disabled={loading}
              >
                {loading ? <ClipLoader color="#36d7b7" /> : "Send Request"}
              </button>
            </div>
          </div>
          {showConfirmationModal && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 rounded-md">
                <p>Are you sure you want to submit the request?</p>
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                    onClick={handleCloseConfirmationModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
                    onClick={handleConfirmSubmit}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
      {showSuccessModal && (
        <RequestSuccessModal onClose={handleCloseSuccessModal} />
      )}
    </div>
  );
};

export default CreateLiquidation;

import React, { useState, useEffect } from "react";
import Select from "react-select/dist/declarations/src/Select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "@heroicons/react/24/solid";
import TextareaAutosize from "react-textarea-autosize";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z, ZodError } from "zod";
import axios from "axios";
import RequestSuccessModal from "./Modals/RequestSuccessModal";
import ClipLoader from "react-spinners/ClipLoader";
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
const schema = z.object({
  date: z.string(),
  department: z.string(),
  cashAmount: z.string(),
  liquidationDate: z.string(),
  remarks: z.string(),
  totalBoatFare: z.string(),
  totalHotel: z.string(),
  totalPerDiem: z.string(),
  totalFare: z.string(),
  totalContingency: z.string(),
  totalAmount: z.string(),
  approver_list_id: z.number(),
  approver: z.string(),
  items: z.array(
    z.object({
      cashDate: z.string().nonempty("Cash date is required"),
      day: z.string().nonempty("Day is required"),
      itinerary: z.string().nonempty("Itinerary is required"),
      activity: z.string().optional(),
      hotel: z.string().optional(),
      rate: z.string().optional(),
      amount: z.string().optional(),
      perDiem: z.string().optional(),
      remarks: z.string().optional(),
    })
  ),
});

const brancheList = [
  "Branch A",
  "Branch B",
  "Branch C",
  "Branch D",
  "Branch E",
];
type FormData = z.infer<typeof schema>;
type TableDataItem = {
  cashDate: string;
  day: string;
  itinerary: string;
  activity: string;
  hotel: string;
  rate: string;
  amount: string;
  perDiem: string;
  remarks: string;
};

const initialTableData: TableDataItem[] = Array.from({ length: 1 }, () => ({
  cashDate: "",
  day: "",
  itinerary: "",
  activity: "",
  hotel: "",
  rate: "",
  amount: "",
  perDiem: "",
  remarks: "",
}));

const tableStyle = "border border-black p-2";
const inputStyle = "w-full  border-2 border-black rounded-[12px] pl-[10px]";
const tableInput = "w-full h-full bg-white px-2 py-1";
const itemDiv = "flex flex-col ";
const buttonStyle = "h-[45px] w-[150px] rounded-[12px] text-white";
const CreateApplicationCash = (props: Props) => {
  const [totalBoatFare, setTotalBoatFare] = useState(0);
  const [totalHotel, setTotalHotel] = useState(0);
  const [formData, setFormData] = useState<any>(null);
  const [totalFare, setTotalFare] = useState(0);
  const [totalContingency, setTotalContingency] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();
  const [customApprovers, setCustomApprovers] = useState<CustomApprover[]>([]);
  const [selectedApproverList, setSelectedApproverList] = useState<
    number | null
  >(null);
  const [selectedApprover, setSelectedApprover] = useState<{ name: string }[]>(
    []
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const {
    formState: { errors: formErrors },
  } = useForm<FormData>();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [items, setItems] = useState<
    {
      cashDate: string;
      day: string;
      itinerary: string;
      activity: string;
      hotel: string;
      rate: string;
      amount: string;
      perDiem: string;
      remarks: string;
    }[]
  >([
    {
      cashDate: "",
      day: "",
      itinerary: "",
      activity: "",
      hotel: "",
      rate: "",
      amount: "",
      perDiem: "",
      remarks: "",
    },
  ]);

  useEffect(() => {
    fetchCustomApprovers();
  }, []);

  const fetchCustomApprovers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }

      const response = await axios.get<CustomApprover[]>(
        "http://localhost:8000/api/custom-approvers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomApprovers(response.data);
      console.log("Custom Approvers:", response.data);
    } catch (error) {
      console.error("Error fetching custom approvers:", error);
    }
  };

  const handleOpenConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  // Function to close the confirmation modal
  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const totalPerDiem = items.reduce(
    (total, item) => total + parseFloat(String(item.perDiem) || "0"),
    0
  );

  const calculateTotal = () => {
    const total =
      totalBoatFare + totalHotel + totalPerDiem + totalFare + totalContingency;
    return total.toFixed(2);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const inputStyle =
    "w-full max-w-[300px] border-2 border-black rounded-[12px] pl-[10px]";
  const [tableData, setTableData] = useState<TableDataItem[]>(initialTableData);
  const [selectedRequestType, setSelectedRequestType] =
    useState("/request/afca");

  const handleChange = (
    index: number,
    field: keyof TableDataItem,
    value: string
  ) => {
    const newData = [...tableData];
    newData[index][field] = value;
    setItems(newData);

    // Clear the error when the field is changed
    setValidationErrors((prevErrors: Record<string, any>) => {
      const newErrors = { ...prevErrors };
      delete newErrors.items?.[index]?.[field];
      return newErrors;
    });
  };

  const handleAddRow = () => {
    setTableData([
      ...tableData,
      {
        cashDate: "",
        day: "",
        itinerary: "",
        activity: "",
        hotel: "",
        rate: "",
        amount: "",
        perDiem: "",
        remarks: "",
      },
    ]);
  };

  const handleRemoveRow = () => {
    if (tableData.length > 1) {
      const newData = [...tableData];
      newData.pop();
      setTableData(newData);
    }
  };

  const handleAddItem = () => {
    setTableData([
      ...tableData,
      {
        cashDate: "",
        day: "",
        itinerary: "",
        activity: "",
        hotel: "",
        rate: "",
        amount: "",
        perDiem: "",
        remarks: "",
      },
    ]);
  };

  const calculateTotalPerDiem = (items: TableDataItem[]) => {
    const totalPerDiem = items.reduce(
      (total, item) => total + parseFloat(item.perDiem || "0"),
      0
    );
    return totalPerDiem.toFixed(2);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");
      const branch_code = localStorage.getItem("branch_code");
      console.log("branch_code", branch_code);
      console.log("id", userId);
      if (!token || !userId) {
        console.error("Token or userId not found");
        return;
      }

      const selectedList = customApprovers.find(
        (approver) => approver.id === selectedApproverList
      );
      if (!selectedList) {
        console.error("Selected approver list not found");
        return;
      }

      console.log("data", data);
      console.log("items", items);

      const missingFields: number[] = [];
      items.forEach((item, index) => {
        if (!item.cashDate || !item.itinerary) {
          missingFields.push(index);
        }
      });

      if (missingFields.length > 0) {
        console.error(
          "CashDate and itinerary are required for each item",
          missingFields
        );
        missingFields.forEach((index) => {
          console.log("Empty cashDate or itinerary:", items[index]);
        });
        // Handle the error accordingly, display an error message to the user, etc.
        return;
      }

      // Calculate total per diem
      const totalPerDiem = items.reduce(
        (total, item) => total + parseFloat(item.perDiem || "0"),
        0
      );

      // Calculate total amount
      const total =
        parseFloat(data.totalBoatFare || "0") +
        parseFloat(data.totalHotel || "0") +
        parseFloat(data.totalPerDiem || "0") +
        parseFloat(data.totalFare || "0") +
        parseFloat(data.totalContingency || "0");

      console.log("Total Per Diem:", totalPerDiem);
      console.log("Total:", total);

      // Calculate grand total
      const grand_total = (total + totalPerDiem).toFixed(2);
      console.log("Grand total:", grand_total);

      // Validate if any item fields are empty
      const emptyItems: number[] = [];
      items.forEach((item, index) => {
        if (!item.cashDate || !item.itinerary) {
          emptyItems.push(index);
        }
      });

      if (emptyItems.length > 0) {
        console.error(
          "CashDate and itinerary are required for each item",
          emptyItems
        );
        emptyItems.forEach((index) => {
          console.log("Empty cashDate or itinerary:", items[index]);
        });
        // Handle the error accordingly, display an error message to the user, etc.
        return;
      }

      // Prepare request data
      const requestData = {
        form_type: "Application For Cash Advance",
        approvers_id: selectedApproverList,
        form_data: [
          {
            branch: branch_code,
            grand_total: grand_total,
            date: data.date,
            department: data.department,
            liquidationDate: data.liquidationDate,
            remarks: data.remarks,
            totalBoatFare: data.totalBoatFare,
            totalHotel: data.totalHotel,
            totalperDiem: totalPerDiem,
            totalFare: data.totalFare,
            totalContingency: data.totalContingency,
            items: items.map((item) => ({
              cashDate: item.cashDate,
              day: item.day,
              itinerary: item.itinerary,
              activity: item.activity,
              hotel: item.hotel,
              rate: item.rate,
              amount: item.amount,
              perDiem: item.perDiem,
              remarks: item.remarks,
            })),
          },
        ],
        user_id: userId,
      };

      console.log(requestData);

      // Display confirmation modal
      setShowConfirmationModal(true);

      // Set form data to be submitted after confirmation
      setFormData(requestData);
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

    if (!selectedApproverList) {
      alert("Please select an approver.");
      return; // Prevent form submission
    }

    try {
      setLoading(true);
      console.log(formData);

      // Perform the actual form submission
      const response = await axios.post(
        "http://localhost:8000/api/create-request",
        formData, // Use the formData stored in state
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowSuccessModal(true);
      console.log("Request submitted successfully:", response.data);
      setFormSubmitted(true);
      setLoading(false);
    } catch (error) {
      console.error("An error occurred while submitting the request:", error);
    }
  };

  const handleBoatFareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalBoatFare(parseFloat(e.target.value) || 0);
  };

  // Function to handle change in totalHotel input
  const handleHotelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalHotel(parseFloat(e.target.value) || 0);
  };

  // Function to handle change in totalFare input
  const handleFareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalFare(parseFloat(e.target.value) || 0);
  };

  // Function to handle change in totalContingency input
  const handleContingencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalContingency(parseFloat(e.target.value) || 0);
  };

  const handleCancelSubmit = () => {
    // Close the confirmation modal
    setShowConfirmationModal(false);
    // Reset formData state
    setFormData(null);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);

    navigate("/request");
  };

  const handleFormSubmit = () => {
    setFormSubmitted(true);
  };
  const handleTextareaHeight = (index: number, field: string) => {
    const textarea = document.getElementById(
      `${field}-${index}`
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = "auto"; // Reset to auto height first
      textarea.style.height = `${Math.max(textarea.scrollHeight, 100)}px`; // Set to scroll height or minimum 100px
    }
  };
  return (
    <div className="bg-graybg dark:bg-blackbg w-full h-full pt-[15px] inline-flex flex-col px-[30px] pb-[15px]">
      <h1 className="text-primary text-[32px] font-bold inline-block">
        Create Request
      </h1>
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
      <div className="bg-white w-full   mb-5 rounded-[12px] flex flex-col">
        <div className="border-b flex justify-between flex-col px-[30px] md:flex-row ">
          <div>
            <h1 className=" text-[24px] text-left py-4 text-primary font-bold flex mr-2">
              <span className="mr-2 underline decoration-2 underline-offset-8">
                Application
              </span>{" "}
              For Cash Advance
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
            <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-8 justify-between ">
              <div className={`${itemDiv}`}>
                <p className="font-semibold ">Date:</p>
                <input
                  type="date"
                  {...register("date", { required: true })}
                  className={`${inputStyle} h-[44px]`}
                />
                {errors.date && formSubmitted && (
                  <p className="text-red-500">Date is required</p>
                )}
              </div>
              <div className={`${itemDiv}`}>
                <p className="font-semibold">Department</p>
                <input
                  type="text"
                  {...register("department", { required: true })}
                  className={`${inputStyle} h-[44px]`}
                />
                {errors.department && formSubmitted && (
                  <p className="text-red-500">Department is required</p>
                )}
              </div>

              <div className={`${itemDiv}`}>
                <p className="font-semibold">Liquidation Date</p>
                <input
                  type="date"
                  {...register("liquidationDate", { required: true })}
                  className={`${inputStyle} h-[44px]`}
                />
                {errors.liquidationDate && formSubmitted && (
                  <p className="text-red-500">Date is required</p>
                )}
              </div>
              <div className={`${itemDiv}`}>
                <p>Usage/Remarks</p>
                <textarea
                  value={formData?.remarks || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  className={`${inputStyle} h-[100px]`}
                />
              </div>
            </div>

            <div className="mt-4 w-full overflow-x-auto">
              <div className="w-full border-collapse border border-black">
                <div className="table-container">
                  <table className="border-collapse border border-black ">
                    <thead className="bg-[#8EC7F7]">
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
                    <tbody>
                      {tableData.map((item, index) => (
                        <tr key={index} className="border border-black">
                          <td className="p-1 border border-black">
                            <input
                              type="date"
                              value={item.cashDate}
                              onChange={(e) => {
                                const value = e.target.value;
                                const day = [
                                  "Sun",
                                  "Mon",
                                  "Tue",
                                  "Wed",
                                  "Thu",
                                  "Fri",
                                  "Sat",
                                ][new Date(value).getDay()];
                                handleChange(index, "cashDate", value);
                                handleChange(index, "day", day);
                              }}
                              className={`${tableInput}`}
                            />
                            {validationErrors[`items.${index}.date`] &&
                              formSubmitted && (
                                <p className="text-red-500">
                                  {validationErrors[`items.${index}.date`]}
                                </p>
                              )}
                            {!item.cashDate &&
                              formSubmitted &&
                              !validationErrors[`item.${index}.date`] && (
                                <p className="text-red-500">Date Required</p>
                              )}
                          </td>
                          <td className="p-1 border border-black ">
                            <input
                              type="text"
                              value={item.day}
                              readOnly
                              className={`${tableInput}`}
                            />
                          </td>
                          <td className="p-1 border border-black">
                            <textarea
                              id={`itinerary-${index}`}
                              value={item.itinerary}
                              onChange={(e) =>
                                handleChange(index, "itinerary", e.target.value)
                              }
                              className={`${inputStyle}`}
                              style={{ minHeight: "50px", maxHeight: "400px" }}
                              onFocus={() =>
                                handleTextareaHeight(index, "itinerary")
                              } 
                              onBlur={() =>
                                handleTextareaHeight(index, "itinerary")
                              } 
                              onInput={() =>
                                handleTextareaHeight(index, "itinerary")
                              } 
                            />
                            {validationErrors[`items.${index}.itinerary`] &&
                              formSubmitted && (
                                <p className="text-red-500">
                                  {validationErrors[`items.${index}.itinerary`]}
                                </p>
                              )}
                            {!item.itinerary &&
                              formSubmitted &&
                              !validationErrors[`items.${index}.itinerary`] && (
                                <p className="text-red-500">
                                  Itinerary Required
                                </p>
                              )}
                          </td>
                          <td className="p-1 border border-black">
                          <textarea
                      id={`activity-${index}`}
                      value={item.activity}
                      onChange={(e) =>
                        handleChange(index, "activity", e.target.value)
                      }
                      className={`${inputStyle}`}
                      style={{ minHeight: "50px", maxHeight: "400px" }} // Minimum height 100px, maximum height 400px (optional)
                      onFocus={() => handleTextareaHeight(index, "activity")} // Adjust height on focus
                      onBlur={() => handleTextareaHeight(index, "activity")} // Adjust height on blur
                      onInput={() => handleTextareaHeight(index, "activity")} // Adjust height on input change
                    />
                          </td>
                          <td className="p-1 border border-black">
                            <input
                              type="text"
                              value={item.hotel}
                              onChange={(e) =>
                                handleChange(index, "hotel", e.target.value)
                              }
                              className={`${tableInput}`}
                            />
                          </td>
                          <td className="p-1 border border-black">
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) =>
                                handleChange(index, "rate", e.target.value)
                              }
                              className={`${tableInput}`}
                            />
                          </td>
                          <td className="p-1 border border-black">
                            <input
                              type="number"
                              value={item.amount}
                              onChange={(e) =>
                                handleChange(index, "amount", e.target.value)
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
                              id={`remarks-${index}`}
                              value={item.remarks}
                              onChange={(e) =>
                                handleChange(index, "remarks", e.target.value)
                              }
                              className={`${inputStyle}`}
                              style={{ minHeight: "50px", maxHeight: "400px" }} // Minimum height 100px, maximum height 400px (optional)
                              onFocus={() =>
                                handleTextareaHeight(index, "remarks")
                              } // Adjust height on focus
                              onBlur={() =>
                                handleTextareaHeight(index, "remarks")
                              } // Adjust height on blur
                              onInput={() =>
                                handleTextareaHeight(index, "remarks")
                              } // Adjust height on input change
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="inline-block w-full">
              <table className="border border-black  mt-10">
                <tr>
                  <th colSpan={2} className="bg-[#8EC7F7] ">
                    <p className="font-semibold text-[12px] p-2">
                      SUMMARY OF EXPENSES TO BE INCURRED (for C/A)
                    </p>
                  </th>
                </tr>
                <tr>
                  <td className={`${tableStyle}`}>
                    <p className="font-semibold  ">BOAT FARE</p>
                  </td>
                  <td className={`${tableStyle}`}>
                    <input
                      type="number"
                      {...register("totalBoatFare", { required: true })}
                      className="bg-white font-bold text-center"
                      value={totalBoatFare.toFixed(2)}
                      onChange={handleBoatFareChange}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </td>
                </tr>
                <tr>
                  <td className={`${tableStyle}`}>
                    <p className="font-semibold">HOTEL</p>
                  </td>
                  <td className={`${tableStyle}`}>
                    <input
                      type="number"
                      {...register("totalHotel", { required: true })}
                      className="bg-white font-bold text-center"
                      value={totalHotel.toFixed(2)}
                      onChange={handleHotelChange}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </td>
                </tr>
                <tr>
                  <td className={`${tableStyle}`}>
                    <p className="font-semibold">PER DIEM</p>
                  </td>
                  <td className={`${tableStyle} text-center`}>
                    <p className="font-bold">{totalPerDiem.toFixed(2)}</p>
                  </td>
                </tr>

                <tr>
                  <td className={`${tableStyle}`}>
                    <p className="font-semibold  ">FARE</p>
                  </td>
                  <td className={`${tableStyle}`}>
                    <input
                      type="number"
                      {...register("totalFare", { required: true })}
                      className="bg-white font-bold text-center"
                      value={totalFare.toFixed(2)}
                      onChange={handleFareChange}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </td>
                </tr>
                <tr>
                  <td className={`${tableStyle}`}>
                    <p className="font-semibold  ">CONTINGENCY</p>
                  </td>
                  <td className={`${tableStyle}`}>
                    <input
                      type="number"
                      {...register("totalContingency", { required: true })}
                      className="bg-white font-bold text-center"
                      value={totalContingency.toFixed(2)}
                      onChange={handleContingencyChange}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </td>
                </tr>
                <tr>
                  <td className={`${tableStyle} h-8`}></td>
                  <td className={`${tableStyle}`}></td>
                </tr>
                <tr>
                  <td className={`${tableStyle} h-14 font-bold`}>TOTAL</td>
                  <td className={`${tableStyle} text-center `}>
                    <p className="bg-white font-bold "> ₱{calculateTotal()} </p>
                  </td>
                </tr>
              </table>
            </div>
            <div className="space-x-3 flex justify-end mt-20 pb-10">
              <button
                className={`bg-yellow ${buttonStyle}`}
                onClick={handleAddItem}
              >
                Add
              </button>
              <button
                className={`${buttonStyle} bg-pink`}
                onClick={handleRemoveRow}
              >
                Cancel
              </button>
              <button
                className={`bg-primary ${buttonStyle}`}
                type="submit"
                onClick={handleFormSubmit}
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

export default CreateApplicationCash;

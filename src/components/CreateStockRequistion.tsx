import React, { useState } from "react";
import Select from "react-select/dist/declarations/src/Select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "@heroicons/react/24/solid";
import path from "path";
import { Link, useNavigate } from "react-router-dom";
import { title } from "process";
import { useForm, Controller } from "react-hook-form";
import { z, ZodError } from "zod";
import axios from "axios";



const schema = z.object({
  purpose: z.string(),
  date: z.string(),
  branch: z.string(),
  items: z.array(
    z.object({
      quantity: z.string(),
      description: z.string(),
      unitCost: z.string(),
      totalAmount: z.string(),
      remarks: z.string(),
    })
  ),
});

type FormData = z.infer<typeof schema>;

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

const inputStyle = "w-full   border-2 border-black rounded-[12px] pl-[10px]";
const itemDiv = "flex flex-col ";
const buttonStyle = "h-[45px] w-[150px] rounded-[12px] text-white";
const CreateStockRequistion = (props: Props) => {
  const [startDate, setStartDate] = useState(new Date());
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();

  const [items, setItems] = useState<
    {
      quantity: string;
      description: string;
      unitCost: string;
      totalAmount: string;
      remarks: string;
    }[]
  >([
    {
      quantity: "",
      description: "",
      unitCost: "",
      totalAmount: "",
      remarks: "",
    },
  ]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
  
      if (!token || !userId) {
        console.error("Token or userId not found");
        return;
      }
  
      const requestData = {
        ...data,
        items: items.map((item) => ({
          quantity: item.quantity,
          description: item.description,
          unitCost: item.unitCost,
          totalAmount: item.totalAmount,
          remarks: item.remarks,
        })),
        user_id: userId, 
      };
  
      const response = await axios.post(
        "http://localhost:8000/api/view-request",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Request submitted successfully:", response.data);
      setFormSubmitted(true);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Validation errors:", error.errors);
      } else {
        console.error(
          "An error occurred while submitting the request:",
          error
        );
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleFormSubmit = () => {
    setFormSubmitted(true);
  };

  const handleRemoveItem = () => {
    if (items.length > 1) {
      const updatedItems = [...items];
      updatedItems.pop();
      setItems(updatedItems);
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        quantity: "",
        description: "",
        unitCost: "",
        totalAmount: "",
        remarks: "",
      },
    ]);
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

  return (
    <div className="bg-graybg dark:bg-blackbg h-full pt-[15px] px-[30px] pb-[15px]">
      <h1 className="text-primary dark:text-primaryD text-[32px] font-bold">
        Create Request
      </h1>

      <select
        className="w-2/5  lg:h-[56px] md:h-10 p-2 bg-gray-200 pl-[30px] border-2 border-black rounded-xl mb-2"
        onChange={(e) => navigate(e.target.value)}
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

      <div className="bg-white w-full  mb-5 rounded-[12px] flex flex-col">
        <div className="border-b text-left">
          <h1 className="pl-[30px] text-[24px] text-left py-4 text-primary font-bold flex mr-2">
            <span className="mr-2 underline decoration-2 underline-offset-8">
              Stock
            </span>{" "}
            Requisition
          </h1>
        </div>
        <div className="px-[35px] mt-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col sm:flex-row justify-between">
              <div className="">
                <p className="font-bold">Purpose:</p>
                <div className="flex flex-col md:flex-row md:space-x-2 ">
                  <div>
                    <label className="">
                      Repair & Maintenance
                      <input
                        type="radio"
                        id="repair_maintenance"
                      
                        value="Repair & Maintenance"
                        className="size-4 ml-1"
                        {...register("purpose", { required: true })}
                      />
                    </label>
                  </div>
                  <div>
                    <label className="">
                      Repo. Recon
                      <input
                        type="radio"
                        id="repo_recon"
                        
                        value="Repo. Recon"
                        className="size-4 ml-1"
                        {...register("purpose", { required: true })}
                      />
                    </label>
                  </div>
                  <div>
                    <label className="">
                      Office/Service Used
                      <input
                        type="radio"
                        id="office_service_used"
             
                        value="Office/Service Used"
                        className="size-4 ml-1"
                        {...register("purpose", { required: true })}
                      />
                    </label>
                  </div>
                </div>
                {errors.purpose && formSubmitted && (
    <p className="text-red-500">Purpose is required</p>
  )}
              </div>
              
                <div className="flex flex-col   ">
                  <p className="font-bold mr-64">Date:</p>
                  <div className=" h-[44px] ">
                    <input
                      type="date"
                      {...register("date", { required: true })}
                      className=" w-full rounded-[12px] wfu border-2 border-black h-[44px]"
                    />
                  </div>
                  {errors.date && <p className="text-red-500 mr-44">Date is required</p>}
                </div>
             
            </div>
            <div className="flex flex-col w-full max-w-[300px]  mt-5 mb-4">
              <label className="font-semibold ">Branch:</label>
              <select 
                {...register("branch", { required: true })}
              className="border-2  border-black rounded-[12px] h-[44px]"
              defaultValue={""}>
                <option value="" disabled>
                  Branch
                </option>
                {brancheList.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.branch && formSubmitted && (
        <p className="text-red-500">Branch is required</p>
      )}
            </div>
            {items.map((item, index) => (
              <div key={index} className="flex flex-col mt-5 mb-4">
                <label className="font-semibold">ITEM {index + 1}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-5">
                  <div className={`${itemDiv}`}>
                    <label className="font-semibold">Quantity:</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleInputChange(index, "quantity", e.target.value)
                      }
                      className={`${inputStyle} h-[44px]`}
                    />
                    {validationErrors[`items.${index}.quantity`] &&
                      formSubmitted && (
                        <p className="text-red-500">
                          {validationErrors[`items.${index}.quantity`]}
                        </p>
                      )}
                    {!item.quantity &&
                      formSubmitted &&
                      !validationErrors[`items.${index}.quantity`] && (
                        <p className="text-red-500">Quantity Required</p>
                      )}
                  </div>
                  <div className={`${itemDiv}`}>
                    <label className="font-semibold">Description:</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleInputChange(index, "description", e.target.value)
                      }
                      className={`${inputStyle} h-[100px]`}
                    />
                    {validationErrors[`items.${index}.description`] &&
                      formSubmitted && (
                        <p className="text-red-500">
                          {validationErrors[`items.${index}.description`]}
                        </p>
                      )}
                    {!item.description &&
                      formSubmitted &&
                      !validationErrors[`items.${index}.description`] && (
                        <p className="text-red-500">Description Required</p>
                      )}
                  </div>
                  <div className={`${itemDiv}`}>
                    <label className="font-semibold">Unit Cost:</label>
                    <input
                      type="number"
                      value={item.unitCost}
                      onChange={(e) =>
                        handleInputChange(index, "unitCost", e.target.value)
                      }
                      placeholder="₱"
                      className={`${inputStyle} h-[44px]`}
                    />
                      {validationErrors[`items.${index}.unitCost`] &&
                      formSubmitted && (
                        <p className="text-red-500">
                          {validationErrors[`items.${index}.unitCost`]}
                        </p>
                      )}
                    {!item.unitCost &&
                      formSubmitted &&
                      !validationErrors[`items.${index}.unitCost`] && (
                        <p className="text-red-500">Unit Cost Required</p>
                      )}
                  </div>
                  <div className={`${itemDiv}`}>
                    <label className="font-semibold">Total Amount:</label>
                    <input
                      type="number"
                      value={item.totalAmount}
                      onChange={(e) =>
                        handleInputChange(index, "totalAmount", e.target.value)
                      }
                      placeholder="₱"
                      className={`${inputStyle} h-[44px]`}
                    />
                   {validationErrors[`items.${index}.totalAmount`] &&
                      formSubmitted && (
                        <p className="text-red-500">
                          {validationErrors[`items.${index}.totalAmount`]}
                        </p>
                      )}
                    {!item.totalAmount &&
                      formSubmitted &&
                      !validationErrors[`items.${index}.totalAmount`] && (
                        <p className="text-red-500">Total Amount Required</p>
                      )}
                  </div>
                  <div className={`${itemDiv}`}>
                    <label className="font-semibold">Usage/Remarks</label>
                    <textarea
                      value={item.remarks}
                      onChange={(e) =>
                        handleInputChange(index, "remarks", e.target.value)
                      }
                      className={`${inputStyle} h-[100px]`}
                    />
                   {validationErrors[`items.${index}.remarks`] &&
                      formSubmitted && (
                        <p className="text-red-500">
                          {validationErrors[`items.${index}.remarks`]}
                        </p>
                      )}
                    {!item.remarks &&
                      formSubmitted &&
                      !validationErrors[`items.${index}.remarks`] && (
                        <p className="text-red-500">Remarks Required</p>
                      )}
                  </div>
                </div>
              </div>
            ))}

            <div className="space-x-3 flex justify-end mt-20 pb-10">
              <button
                className={`bg-yellow ${buttonStyle}`}
                onClick={handleAddItem}
              >
                Add
              </button>
              <button
                className={`${buttonStyle} bg-pink`}
                onClick={handleRemoveItem}
              >
                Cancel
              </button>
              <button
                className={`bg-primary ${buttonStyle}`}
                type="submit"
                onClick={() => {
                  setFormSubmitted(true);
                }}
              >
                Send Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStockRequistion;

import React, { useState } from "react";
import Select from "react-select/dist/declarations/src/Select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z, ZodError } from "zod";
import axios from "axios";

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
  branch: z.string(),
  supplier: z.string(),
  address: z.string(),
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

const brancheList = [
  "Branch A",
  "Branch B",
  "Branch C",
  "Branch D",
  "Branch E",
];

const inputStyle = "w-full   border-2 border-black rounded-[12px] ";
const itemDiv = "flex flex-col  ";
const buttonStyle = "h-[45px] w-[150px] rounded-[12px] text-white";

const CreatePurchaseOrder = (props: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedRequestType, setSelectedRequestType] =
    useState("/request/pors");
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

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

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
        "http://localhost:8000/api/purchase-order-requests",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Purchase order submitted successfully:", response.data);
      setFormSubmitted(true);
    } catch (error) {
      console.error("An error occurred while submitting the purchase order:", error);
    } finally {
      setLoading(false);
    }
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
        <div className="border-b ">
          <h1 className="pl-[30px] overflow-hidden  text-[18px] md:text-[24px] text-left py-4 text-primary dark:text-primaryD font-bold flex mr-2">
            <span className="mr-2 underline decoration-2 underline-offset-8">
              Purchase
            </span>{" "}
            Order Requisition Slip
          </h1>
         
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-[35px] mt-4 ">
          <p className="font-semibold text-start">Date:</p>
          <div className="flex justify-start mb-4 w-1/4">
            <input
              type="date"
              {...register("date", { required: true })}
              className="w-full rounded-[12px] border-2 border-black h-[44px]"
            />
            {errors.date && <p className="text-red-500">Date is required</p>}
          </div>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-2 sm:mt-0 flex-row items-center justify-start space-y-2 sm:space-y-0 sm:gap-4 lg:gap-0 lg:space-x-4">
              <div className={`${itemDiv}`}>
                <label className="font-semibold">Branch:</label>
                <select
                  {...register("branch", { required: true })}
                  className="border-2 w-full   border-black rounded-[12px] h-[44px] pr-10"
                >
                  <option value="" disabled>
                    Branch
                  </option>
                  {brancheList.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.branch && <p className="text-red-500">Branch is required</p>}
              </div>
              <div className={`${itemDiv}`}>
                <p className="font-semibold">Supplier</p>
                <input
                  type="text"
                  {...register("supplier", { required: true })}
                  className={`${inputStyle} h-[44px]`}
                />
                {errors.supplier && <p className="text-red-500">Supplier is required</p>}
              </div>
              <div className={`${itemDiv}`}>
                <p className="font-semibold">Address</p>
                <input
                  type="text"
                  {...register("address", { required: true })}
                  className={`${inputStyle} h-[44px]`}
                />
                {errors.address && <p className="text-red-500">Address is required</p>}
              </div>
            </div>
          </div>
          {items.map((item, index) => (
            <div key={index} className=" mt-5 mb-4">
              <label className="font-semibold">ITEM {index + 1}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className={`${itemDiv}`}>
                  <p>Quantity</p>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleInputChange(index, "quantity", e.target.value)
                    }
                    className={`${inputStyle} h-[44px]`}
                  />
                </div>
                <div className={`${itemDiv}`}>
                  <p>Description</p>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleInputChange(index, "description", e.target.value)
                    }
                    className={`${inputStyle} h-[100px]`}
                  />
                </div>
                <div className={`${itemDiv}`}>
                  <p>Unit Cost</p>
                  <input
                    type="number"
                    value={item.unitCost}
                    onChange={(e) =>
                      handleInputChange(index, "unitCost", e.target.value)
                    }
                    placeholder="₱"
                    className={`${inputStyle} h-[44px]`}
                  />
                </div>
                <div className={`${itemDiv}`}>
                  <p>Total Amount</p>
                  <input
                    type="number"
                    value={item.totalAmount}
                    onChange={(e) =>
                      handleInputChange(index, "totalAmount", e.target.value)
                    }
                    placeholder="₱"
                    className={`${inputStyle} h-[44px]`}
                  />
                </div>
                <div className={`${itemDiv}`}>
                  <p>Usage/Remarks</p>
                  <textarea
                    value={item.remarks}
                    onChange={(e) =>
                      handleInputChange(index, "remarks", e.target.value)
                    }
                    className={`${inputStyle} h-[100px]`}
                  />
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
            <button className={`bg-primary ${buttonStyle}`} type="submit">
              Send Request
            </button>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;

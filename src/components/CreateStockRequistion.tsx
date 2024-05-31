import React, { useState } from "react";
import Select from "react-select/dist/declarations/src/Select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "@heroicons/react/24/solid";
import path from "path";
import { Link, useNavigate } from "react-router-dom";
import { title } from "process";

type Props = {};
const requestType = [
  {title:"Stock Requisition", path:"/request/sr"},
 { title: "Purchase Order Requisition Slip", path:"/request/pors"},
 { title: "Cash Disbursement Requisition Slip", path:"/request/cdrs"},
 {title: "Application For Cash Advance", path:"/request/afca"},
 {title: "Liquidation of Actual Expense", path:"/request/loae"},
 {title: "Request for Refund", path:"/request/rfr"},
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
  const navigate=useNavigate();
  const [items, setItems] = useState<{ quantity: string; description: string; unitCost: string; totalAmount: string; remarks: string; }[]>([{ quantity: "", description: "", unitCost: "", totalAmount: "", remarks: "" }]);
  
  const handleRemoveItem = () => {
    if (items.length > 1) {
      const updatedItems = [...items];
      updatedItems.pop();
      setItems(updatedItems);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { quantity: "", description: "", unitCost: "", totalAmount: "", remarks: "" }]);
  };

  const handleInputChange = (index: number, field: keyof typeof items[0], value: string) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  return (
    <div className="bg-graybg dark:bg-blackbg h-full pt-[15px] px-[30px] pb-[15px]">
      <h1 className="text-primary dark:text-primaryD text-[32px] font-bold">Create Request</h1>
         
      <select 
      className="w-2/5  lg:h-[56px] md:h-10 p-2 bg-gray-200 pl-[30px] border-2 border-black rounded-xl mb-2"
      onChange={(e) => navigate (e.target.value)}
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
  <span className="mr-2 underline decoration-2 underline-offset-8">Stock</span> Requisition
</h1>
        </div>
        <div className="px-[35px] mt-4">
          <div className="w-1/2 sm:w-full grid grid-row-3 sm:grid-cols-2 md:flex justify-between">
          <div className="">
          <p className="font-bold">Purpose:</p>
          <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-4">
            <div >
              <label className="">
                Repair & Maintenance
                <input
                  type="radio"
                  id="repair_maintenance"
                  name="serviceOption"
                  value="Repair & Maintenance"
                  className="size-4 ml-1"
                />
              </label>
              </div>
              <div>
              <label className="">
                Repo. Recon
                <input
                  type="radio"
                  id="repo_recon"
                  name="serviceOption"
                  value="Repo. Recon"
                  className="size-4 ml-1"
                />
              </label>
              </div>
              <div>
              <label className="">
                Office/Service Used
                <input
                  type="radio"
                  id="office_service_used"
                  name="serviceOption"
                  value="Office/Service Used"
                  className="size-4 ml-1"
                />
              </label>
              </div>
            </div>
            </div>
            <div>
            <p className="font-bold">Date:</p>
            <div className="flex flex-col mt-2 md:mt-0 w-full items-end">
           
                <div className=" h-[44px] ">
              <input
              type="date"
                className=" w-full rounded-[12px] wfu border-2 border-black h-[44px]"
               >
                  </input>
              </div>
            </div>
            </div>
          </div>
          <div className="flex flex-col w-full max-w-[300px]  mt-5 mb-4">
            <label className="font-semibold ">Branch:</label>
            <select className="border-2  border-black rounded-[12px] h-[44px]">
              <option value="" disabled>
                Branch
              </option>
              {brancheList.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {items.map((item, index) => (
        <div key={index} className="flex flex-col mt-5 mb-4">
          <label className="font-semibold">ITEM {index + 1}</label>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-5">
            <div className={`${itemDiv}`}>
              <p>Quantity</p>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                className={`${inputStyle} h-[44px]`}
              />
            </div>
            <div className={`${itemDiv}`}>
              <p>Description</p>
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleInputChange(index, "description", e.target.value)}
                className={`${inputStyle} h-[100px]`}
              />
            </div>
            <div className={`${itemDiv}`}>
              <p>Unit Cost</p>
              <input
                type="number"
                value={item.unitCost}
                onChange={(e) => handleInputChange(index, "unitCost", e.target.value)}
                placeholder="₱"
                className={`${inputStyle} h-[44px]`}
              />
            </div>
            <div className={`${itemDiv}`}>
              <p>Total Amount</p>
              <input
                type="number"
                value={item.totalAmount}
                onChange={(e) => handleInputChange(index, "totalAmount", e.target.value)}
                placeholder="₱"
                className={`${inputStyle} h-[44px]`}
              />
            </div>
            <div className={`${itemDiv}`}>
            <p>Usage/Remarks</p>
            <textarea
                value={item.remarks}
                onChange={(e) => handleInputChange(index, "remarks", e.target.value)}
                className={`${inputStyle} h-[100px]`}
            />
            </div>
          </div>
        </div>
      ))}
          <div className="space-x-3 flex justify-end mt-20 pb-10">
            <button className={`bg-yellow ${buttonStyle}`} onClick={handleAddItem}>Add</button>
            <button className={`${buttonStyle} bg-pink`} onClick={handleRemoveItem}>Cancel</button>
            <button className={`bg-primary ${buttonStyle}`}>Send Request</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStockRequistion;
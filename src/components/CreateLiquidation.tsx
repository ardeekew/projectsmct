import React, { useState } from "react";
import Select from "react-select/dist/declarations/src/Select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "@heroicons/react/24/solid";
import TextareaAutosize from "react-textarea-autosize";

type Props = {};
const requestType = [
  { title: "Stock Requisition", path: "/request/sr" },
  { title: "Purchase Order Requisition Slip", path: "/request/pors" },
  { title: "Cash Disbursement Requisition Slip", path: "/request/cdrs" },
  { title: "Application For Cash Advance", path: "/request/afca" },
  { title: "Liquidation of Actual Expense", path: "/request/loae" },
];
const brancheList = [
  "Branch A",
  "Branch B",
  "Branch C",
  "Branch D",
  "Branch E",
];
type TableDataItem = {
  date: string;
  destination: string;
  transportation: string;
  transportationAmount: string;
  hotel: string;
  place: string;
  placeAmount: string;
  perDiem: string;
  particulars: string;
  particularsAmount: string;
  grandTotal: string;
};

const initialTableData: TableDataItem[] = Array.from({ length: 5 }, () => ({
  date: "",
  destination: "",
  transportation: "",
  transportationAmount: "",
  hotel: "",
  place: "",
  placeAmount: "",
  perDiem: "",
  particulars: "",
  particularsAmount: "",
  grandTotal: "",
}));

const tableStyle = "border border-black p-2";
const inputStyle = "w-full   border-2 border-black rounded-[12px] pl-[10px]";
const tableInput = "w-full h-full bg-white px-2 py-1";
const itemDiv = "flex flex-col ";
const buttonStyle = "h-[45px] w-[150px] rounded-[12px] text-white";
const CreateLiquidation = (props: Props) => {
  const [startDate, setStartDate] = useState(new Date());
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
  const [tableData, setTableData] = useState<TableDataItem[]>(initialTableData);
  const [selectedRequestType, setSelectedRequestType] =
    useState("/request/loae");

  const handleChange = (
    index: number,
    field: keyof TableDataItem,
    value: string
  ) => {
    const newData = [...tableData];
    newData[index][field] = value;
    setTableData(newData);
  };

  const handleAddRow = () => {
    setTableData([
      ...tableData,
      {
        date: "",
        destination: "",
        transportation: "",
        transportationAmount: "",
        hotel: "",
        place: "",
        placeAmount: "",
        perDiem: "",
        particulars: "",
        particularsAmount: "",
        grandTotal: "",
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
        date: "",
        destination: "",
        transportation: "",
        transportationAmount: "",
        hotel: "",
        place: "",
        placeAmount: "",
        perDiem: "",
        particulars: "",
        particularsAmount: "",
        grandTotal: "",
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
        className="max-w-2/5 lg:h-[56px] md:h-10 p-2 bg-gray-200 pl-[30px] border-2 border-black rounded-xl mb-2"
        value={selectedRequestType}
        onChange={(e) => {
          setSelectedRequestType(e.target.value);
          window.location.href = e.target.value;
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
        <div className="border-b">
          <h1 className="pl-[30px] text-[24px] text-left py-4 text-primary font-bold flex mr-2">
            <h1 className="mr-2 underline decoration-2 underline-offset-8">
              Liquidation
            </h1>
            of Actual Expense
          </h1>
        </div>
        <div className="px-[35px] mt-4 ">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:flex md:justify-start md:space-x-8">
            <div className="">
              <p className="font-semibold text-start mr-40">Date:</p>
              <input type="date" className={`${inputStyle} h-[44px]`} />
            </div>
            <div className={`${itemDiv}`}>
              <p className="font-semibold">Purpose:</p>
              <textarea className={`${inputStyle} h-20`}></textarea>
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
                    <th className={`${tableStyle}`}>Type of Transportation</th>
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
                  {tableData.map((rowData, index) => (
                    <tr key={index} className="border border-black">
                      <td className="p-1 border border-black">
                        <input
                          type="date"
                          value={rowData.date}
                          onChange={(e) =>
                            handleChange(index, "date", e.target.value)
                          }
                          className={`${tableInput}`}
                        />
                      </td>
                      <td className="p-1 border border-black">
                        <textarea
                          value={rowData.destination}
                          onChange={(e) =>
                            handleChange(index, "destination", e.target.value)
                          }
                          className={`${tableInput}`}
                        ></textarea>
                      </td>
                      <td className="p-1 border border-black">
                        <input
                          type="text"
                          value={rowData.transportation}
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
                          value={rowData.transportationAmount}
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
                          value={rowData.hotel}
                          onChange={(e) =>
                            handleChange(index, "hotel", e.target.value)
                          }
                          className={`${tableInput}`}
                        ></textarea>
                      </td>
                      <td className="p-1 border border-black">
                        <input
                          type="text"
                          value={rowData.place}
                          onChange={(e) =>
                            handleChange(index, "place", e.target.value)
                          }
                          className={`${tableInput}`}
                        />
                      </td>
                      <td className="p-1 border border-black">
                        <input
                          type="number"
                          value={rowData.placeAmount}
                          onChange={(e) =>
                            handleChange(index, "placeAmount", e.target.value)
                          }
                          className={`${tableInput}`}
                        />
                      </td>
                      <td className="p-1 border border-black">
                        <input
                          type="number"
                          value={rowData.perDiem}
                          onChange={(e) =>
                            handleChange(index, "perDiem", e.target.value)
                          }
                          className={`${tableInput}`}
                        />
                      </td>
                      <td className="p-1 border border-black">
                        <input
                          type="number"
                          value={rowData.particulars}
                          onChange={(e) =>
                            handleChange(index, "particulars", e.target.value)
                          }
                          className={`${tableInput}resize-none h-[100px]  `}
                        />
                      </td>
                      <td className="p-1 border border-black">
                        <input
                          type="number"
                          value={rowData.particularsAmount}
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
                      <td className="p-1 border border-black">
                        <input
                          type="number"
                          value={rowData.grandTotal}
                          readOnly
                          className={`${tableInput}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          </div>
         
          <div>
            <table className="border border-black  mt-10 w-full">
              <tr>
                <td className={`${tableStyle}`}>
                  <p className="font-semibold pl-2 pr-20   ">TOTAL EXPENSE</p>
                </td>
                <td className={`${tableStyle}`}>
                  <p className="font-semibold  ">1,785.00</p>
                </td>
              </tr>
              <tr>
                <td className={`${tableStyle}`}>
                  <p className="font-semibold pl-2    ">CASH ADVANCE</p>
                </td>
                <td className={`${tableStyle}`}>
                  <p className="font-semibold  ">$50</p>
                </td>
              </tr>
              <tr>
                <td className={`${tableStyle}`}>
                  <p className="font-semibold pl-2 ">SHORT</p>
                </td>
                <td className={`${tableStyle}`}>
                  <p className="font-semibold  ">$50</p>
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
            <button className={`bg-primary ${buttonStyle}`}>
              Send Request
            </button>
          </div>
          </div>
      </div>
    </div>
  );
};

export default CreateLiquidation;

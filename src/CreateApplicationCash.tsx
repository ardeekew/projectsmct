import React, { useState } from "react";
import Select from "react-select/dist/declarations/src/Select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "@heroicons/react/24/solid";
import TextareaAutosize from 'react-textarea-autosize';


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
  day: string;
  itinerary: string;
  activity: string;
  hotel: string;
  rate: string;
  amount: string;
  perDiem: string;
  remarks: string;
};

const initialTableData: TableDataItem[] = Array.from({ length: 5 }, () => ({
  date: "",
  day: "",
  itinerary: "",
  activity: "",
  hotel: "",
  rate: "",
  amount: "",
  perDiem: "",
  remarks: "",
}));


const tableStyle="border border-black p-2";
const inputStyle = "w-full  border-2 border-black rounded-[12px] pl-[10px]";
const tableInput = "w-full h-full bg-white px-2 py-1";
const itemDiv = "flex flex-col ";
const buttonStyle = "h-[45px] w-[150px] rounded-[12px] text-white";
const CreateApplicationCash = (props: Props) => {
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
    useState("/request/afca");

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
        date: "",
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
    <div className="bg-graybg dark:bg-blackbg w-full h-full pt-[15px] inline-flex flex-col px-[30px] pb-[15px]">
      <h1 className="text-primary text-[32px] font-bold inline-block">Create Request</h1>
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
      <div className="bg-white w-full   mb-5 rounded-[12px] flex flex-col">
        <div className="border-b">
          <h1 className="pl-[30px] text-[24px] text-left py-4 text-primary font-bold flex mr-2">
            <h1 className="mr-2 underline decoration-2 underline-offset-8">
              Application
            </h1>
            For Cash Advance
          </h1>
        </div>
        <div className="px-[35px] mt-4 ">
          <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-8 justify-between ">
            <div className={`${itemDiv}`}>
              <p className="font-semibold ">Date:</p>
              <input type="date" className={`${inputStyle} h-[44px]`} />
            </div>
            <div className={`${itemDiv}`}>
              <p className="font-semibold">Department</p>
              <input type="text" className={`${inputStyle} h-[44px]`} />
            </div>
            <div className={`${itemDiv}`}>
              <p className="font-semibold">Amount</p>
              <input type="text" className={`${inputStyle} h-[44px]`} />
            </div>
            <div className={`${itemDiv}`}>
              <p className="font-semibold">Liquidation Date</p>
              <input type="date" className={`${inputStyle} h-[44px]`} />
            </div>
          </div>
          <div>
            <div className="lg:flex flex-row mt-5 sm:inline-flex w-full">
              <div className={`${itemDiv}`}>
                <p>Usage/Remarks</p>
                <textarea className={`${inputStyle} h-[100px]`} />
              </div>
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
                    {tableData.map((rowData, index) => (
                      <tr key={index} className="border border-black">
                        <td className="p-1 border border-black">
                          <input
                            type="date"
                            value={rowData.date}
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
                              handleChange(index, "date", value);
                              handleChange(index, "day", day);
                            }}
                            className={`${tableInput}`}
                          />
                        </td>
                        <td className="p-1 border border-black ">
                          <input
                            type="text"
                            value={rowData.day}
                            readOnly
                            className={`${tableInput}`}
                          />
                        </td>
                        <td className="p-1 border border-black">
                          <textarea
                            value={rowData.itinerary}
                            onChange={(e) =>
                              handleChange(index, "itinerary", e.target.value)
                            }
                            className={`${tableInput}`}
                          >
                            {" "}
                          </textarea>
                        </td>
                        <td className="p-1 border border-black">
                          <textarea
                            className={`${tableInput}`}
                            value={rowData.activity}
                            onChange={(e) =>
                              handleChange(index, "activity", e.target.value)
                            }
                          ></textarea>
                        </td>
                        <td className="p-1 border border-black">
                          <input
                            type="text"
                            value={rowData.hotel}
                            onChange={(e) =>
                              handleChange(index, "hotel", e.target.value)
                            }
                            className={`${tableInput}`}
                          />
                        </td>
                        <td className="p-1 border border-black">
                          <input
                            type="number"
                            value={rowData.rate}
                            onChange={(e) =>
                              handleChange(index, "rate", e.target.value)
                            }
                            className={`${tableInput}`}
                          />
                        </td>
                        <td className="p-1 border border-black">
                          <input
                            type="number"
                            value={rowData.amount}
                            onChange={(e) =>
                              handleChange(index, "amount", e.target.value)
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
                          <textarea
                            value={rowData.remarks}
                            onChange={(e) =>
                              handleChange(index, "remarks", e.target.value)
                            }
                            className={`${tableInput}resize-none h-[100px]  `}
                          ></textarea>
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
                  <p className="font-semibold text-[12px] p-2">SUMMARY OF EXPENSES TO BE INCURRED (for C/A)</p>
                </th>
              </tr>
              <tr className="bg-[#8EC7F7]">
                <th className={`${tableStyle}`}><p className="font-semibold  ">CATEGORY</p></th>
                <th className={`${tableStyle}`}><p className="font-semibold  ">CATEGORY</p></th>
              </tr>
              <tr>
                <td className={`${tableStyle}`}><p className="font-semibold  ">BOAT FARE</p></td>

              </tr>
              <tr>
                <td className={`${tableStyle}`}><p className="font-semibold  ">HOTEL</p></td>
                <td className={`${tableStyle}`}><p className="font-semibold  ">$50</p></td>
              </tr>
              <tr>
                <td className={`${tableStyle}`}><p className="font-semibold  ">PER DIEM</p></td>
                <td className={`${tableStyle}`}><p className="font-semibold  ">$50</p></td>
              </tr>
              <tr>
                <td className={`${tableStyle}`}><p className="font-semibold  ">FARE</p></td>
                <td className={`${tableStyle}`}><p className="font-semibold  ">$50</p></td>
              </tr>
              <tr>
                <td className={`${tableStyle}`}><p className="font-semibold  ">CONTINGENCY</p></td>
                <td className={`${tableStyle}`}><p className="font-semibold  ">$50</p></td>
              </tr>
              <tr>
                <td className={`${tableStyle} h-8`}></td>
                <td className={`${tableStyle}`}><p className="font-semibold  ">$50</p></td>
              </tr>
              <tr>
                <td className={`${tableStyle} h-14 font-bold`}>TOTAL</td>
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

export default CreateApplicationCash;

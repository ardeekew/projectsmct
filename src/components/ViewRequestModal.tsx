import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  closeModal: () => void;
  record: RequestRecord | null;
};

type RequestRecord = {
  user_id: number;
  request_id: string;
  requestType: string;
  date: Date;
  branch: string;
  status: string;
  purpose: string;
  items:  Item[] | string;
  supplier: string;
  address: string;
};
type Item = {
  quantity: string;
  description: string;
  unitCost: string;
  totalAmount: string;
  remarks: string;
  supplier: string;
  address: string;
};
const inputStyle = "border border-black text-[12px] font-bold p-2";

const ViewRequestModal: React.FC<Props> = ({ closeModal, record }) => {
  if (!record) return null;
  const parsedItems: Item[] = typeof record.items === "string" ? JSON.parse(record.items) : record.items;
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="p-4 relative w-full mx-10 md:mx-0 z-10 md:w-1/2 space-y-auto h-3/4 overflow-scroll bg-white border-black rounded-t-lg shadow-lg">
        <div className="absolute top-4 right-4 cursor-pointer">
          <XMarkIcon className="h-6 w-6 text-black" onClick={closeModal} />
        </div>
        <div className="justify-start items-start flex flex-col space-y-4 w-full">
          <h1 className="font-semibold text-[18px]">{record.requestType}</h1>
          <p className="font-medium text-[14px]">
            Request ID:#{record.request_id}
          </p>
          <div className="flex w-1/2 items-center">
          <p>Status:</p>
          <p  className={`${
           record.status === "Pending"
              ? "bg-yellow"
              : record.status === "Approved"
              ? "bg-green"
              : "bg-pink"
          } rounded-lg  py-1 w-1/3
             font-medium text-[14px] text-center ml-2 text-white`}
        > {record.status}</p>
        </div>
        {record.requestType === "Stock Requisition" ? (
  <>
    <p className="font-medium text-[14px]">Purpose:</p>
    <div className="flex flex-col md:flex-row md:space-x-2">
      <p>Repo. Recon</p>
      <input
        type="checkbox"
        className="size-5"
        checked={record.purpose === "Repo. Recon"}
        readOnly
      />
      <p>Repair & Maintenance</p>
      <input
        type="checkbox"
        className="size-5"
        checked={record.purpose === "Repair & Maintenance"}
        readOnly
      />
      <p>Office/Service Used</p>
      <input
        type="checkbox"
        className="size-5"
        checked={record.purpose === "Office/Service Used"}
        readOnly
      />
    </div>
  </>
) : (
  <>
    <div className="flex flex-col md:flex-row md:space-x-2">
    <h1>Supplier</h1>
      <input
        type="text"
        placeholder="Input Field 1"
        className="border border-black p-2"
        value={record.supplier}
      />
         <h1>Address</h1>
      <input
        type="text"
        placeholder="Input Field 2"
        className="border border-black p-2"
        value={record.address}
      />
    </div>
  </>
)}
          <div className="flex flex-col md:flex-row justify-evenly w-full md:space-x-10">
            <div className="w-full">
              <h1>Branch</h1>
              <input
                type="text"
                className="border border-black rounded-md p-1 mt-2 w-full "
                value={record.branch}
                readOnly
              />
            </div>
            <div className="w-full">
              <h1>Date</h1>
              <input
                type="date"
                className="border border-black rounded-md p-1 mt-2 w-full "
                value={new Date(record.date).toISOString().split("T")[0]}
                readOnly
              />
            </div>
          </div>
          <div className="mt-4 w-full overflow-x-auto">
            <div className="w-full border-collapse border border-black ">
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
                  <tbody className={`${inputStyle}`}>
                  {parsedItems.map((item: Item, index: number) => (
                      <tr key={index} className="border">
                        <td className={`${inputStyle}`}>{item.quantity}</td>
                        <td className={`${inputStyle}`}>{item.description}</td>
                        <td className={`${inputStyle}`}>{item.unitCost}</td>
                        <td className={`${inputStyle}`}>{item.totalAmount}</td>
                        <td className={`${inputStyle}`}>{item.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="w-full">
            <h1>Grand Total</h1>
            <input
              type="text"
              className="border border-black rounded-md p-1 mt-2 w-full "
            />
          </div>
          <div className="w-full">
            <h1>Comments*</h1>
            <textarea
              className="border h-32 border-black rounded-md p-1 mt-2 w-full "
              placeholder="e.g."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRequestModal;

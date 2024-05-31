import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const AddCustomModal = ({
  modalIsOpen,
  closeModal,
  openCompleteModal,
  entityType,
}: {
  modalIsOpen: boolean;
  closeModal: any;
  openCompleteModal: any;
  entityType: string;
}) => {
  if (!modalIsOpen) {
    return null;
  }
  const names = ["Bethanne",
  "Regina",
  "Delilah",
  "Biddy",
  "Miran",
  "Verney",
  "Weber",
  "Chaunce",
  "Leodora",
  "Merrill"
];
  const Approvernames = [
    "Marigold",
    "Seraphina",
    "Cordelia",
    "Gideon",
    "Thaddeus",
    "Calliope",
    "Octavia",
    "Percival",
    "Emilia",
    "Bartholomew"
  ];
  const pStyle = "font-medium w-full";
  const inputStyle = "border border-black rounded-md p-1 w-full";
  return (
    modalIsOpen && (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 flex-col ">
        <div className=" p-4  w-1/3 md:w-2/5 relative bg-primary flex justify-center mx-20  border-b rounded-t-[12px]">
          <h2 className="text-center  text-xl md:text-[32px] font-bold text-white">
            Add {entityType}
          </h2>
          <XMarkIcon
            className="size-6 text-black absolute right-3 cursor-pointer"
            onClick={closeModal}
          />
        </div>
        <div className="bg-white w-1/3 md:w-2/5 x-20 rounded-b-[12px] shadow-lg  overflow-y-auto  h-2/3">
          <div className="grid lg:grid-cols-2 justify-items-center  place-content-center mt-10 mx-10 gap-2">
            <div>
              <p className={`${pStyle}`}>Name</p>
              <input type="text" className={`${inputStyle}`} />
            </div>
           
          </div>
        
          <div className="border-b mt-8 "></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 sm:mx-0 md:mx-2">
            <div>
            <h1 className="ml-2 text-[20px] font-medium  text-sm md:text-md">Noted By</h1>
          {names.map((name, index) => (
        <div key={index} className="mx-2 flex items-center">
          <input type="checkbox" className="size-5" id={`name-${index}`} />
          <label htmlFor={`name-${index}`} className="">{name}</label>
        </div>
      ))}
      </div>
      <div>
        <h1 className="text-[20px] font-medium text-sm md:text-md">Approved By</h1>
      {Approvernames.map((name, index) => (
        <div key={index} className="mx-2 flex items-center">
          <input type="checkbox"  className="size-5" id={`name-${index}`} />
          <label htmlFor={`name-${index}`} className="">{name}</label>
        </div>
      ))}
      </div>
      </div>
          <div className="flex flex-col md:flex-row w-full  mt-2 justify-items-center lg:justify-end items-center space-x-0 md:space-x-2 md:mt-20 md:mr-10 mb-10">
            <button
              className="bg-[#9C9C9C] p-2 w-1/2 lg:w-1/4 rounded-[12px] text-white font-medium"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="bg-primary p-2 w-1/2 lg:w-1/4 mt-2 md:mt-0 rounded-[12px] text-white font-medium"
              onClick={openCompleteModal}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    )
  );
};
export default AddCustomModal;

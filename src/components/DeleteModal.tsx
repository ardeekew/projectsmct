import React from 'react';
import { XMarkIcon, ExclamationCircleIcon} from '@heroicons/react/24/outline'; 

const DeleteModal = ({ deleteModal, closeDeleteModal, openDeleteSuccessModal, entityType }: { deleteModal: boolean, closeDeleteModal: any, openDeleteSuccessModal: any, entityType:string }) => {
      if (!deleteModal) {
    return null;
  }


    const pStyle="font-medium";
const inputStyle="border border-black rounded-md p-1";
return (
    deleteModal && (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 flex-col ">
    <div className=" p-4  w-1/2 md:w-1/3 bg-white flex flex-col justify-center   rounded-[12px] shadow-lg">
      <div className='flex justify-between  w-full'>
        <div className='flex items-center'>
        <ExclamationCircleIcon className='size-14 rounded-lg bg-[#FFCFCF] text-[#E74E4E]  left-3 cursor-pointer'/>
      <p className='text-[18px] font-semibold ml-2 '>Delete {entityType}</p>
      </div>
      <div>
      <XMarkIcon className='size-8 text-black  right-3 cursor-pointer' onClick={closeDeleteModal}/>
      </div>
    </div>
  
    <p className='mt-6 text-gray-500 px-2'>Are you sure you want to delete this {entityType}? This action cannot be undone and will delete all the information.</p>
    <div className='space-x-2 justify-center md:justify-end flex'>
        <button className='border border-gray-400 w-full md:w-auto py-2 md:px-4 rounded-lg' onClick={closeDeleteModal}>Cancel</button>
        <button className='border bg-[#E74E4E]  text-white w-full md:w-auto py-2 md:px-4 rounded-lg' onClick={openDeleteSuccessModal}>Delete</button>
    </div>
    </div>
  </div>
    )
);
};
    export default DeleteModal;
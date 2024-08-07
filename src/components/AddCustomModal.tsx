import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const AddCustomModal = ({
  modalIsOpen,
  closeModal,
  openCompleteModal,
  entityType,
  refreshData,
}: {
  modalIsOpen: boolean;
  closeModal: () => void;
  openCompleteModal: () => void;
  entityType: string;
  refreshData: () => void;
}) => {
  const [notedBy, setNotedBy] = useState<number[]>([]); 
  const [approvedBy, setApprovedBy] = useState<number[]>([]);
  const [name, setName] = useState<string>("");
 
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [approvers, setApprovers] = useState<any[]>([]); // Adjust as per your approver structure

  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/view-approvers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
    
        console.log("API Response:", response);
    
        if (response.data && Array.isArray(response.data.data)) {
          setApprovers(response.data.data); // Set approvers directly from API
        } else {
          console.error("Unexpected response format from API:", response.data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching approvers:", error);
        setLoading(false);
      }
    };

    if (modalIsOpen) {
      fetchApprovers();
    }
  }, [modalIsOpen]);
console.log("Approvers:", approvedBy);
console.log("Noted By:", notedBy);
  const toggleNotedBy = (personId: number) => {
    const isPresent = notedBy.includes(personId);
    if (isPresent) {
      setNotedBy((prevNotedBy) => prevNotedBy.filter((id) => id !== personId));
    } else {
      setNotedBy((prevNotedBy) => [...prevNotedBy, personId]);
    }
  };

  const toggleApprovedBy = (personId: number) => {
    const isPresent = approvedBy.includes(personId);
    if (isPresent) {
      setApprovedBy((prevApprovedBy) => prevApprovedBy.filter((id) => id !== personId));
    } else {
      setApprovedBy((prevApprovedBy) => [...prevApprovedBy, personId]);
    }
  };

  const handleCancel = () => {
    setNotedBy([]);
    setApprovedBy([]);
    setName("");
    closeModal();
  };

  const handleAddCustomRequest = async () => {
    const userId = localStorage.getItem("id");
    // Validate inputs
    if (!name.trim()) {
        setErrorMessage("Name is required.");
        return;
    }

    if (notedBy.length === 0 || approvedBy.length === 0) {
        setErrorMessage("You must select at least one noted by and one approved by.");
        return;
    }

    const requestData = {
     user_id: userId,
        name: name.trim(),
        noted_by: notedBy,
        approved_by: approvedBy,
    };
    console.log("Request Data:", requestData);
    try {
        setLoading(true);

        const response = await axios.post(
            "http://localhost:8000/api/approvers",
            requestData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json', // Ensure content type is set
                },
            }
        );

        console.log("Request Data:", requestData);
        console.log("Response:", response.data);

        // Clear form and state
        setNotedBy([]);
        setApprovedBy([]);
        setName("");
        setErrorMessage(""); 
        setLoading(false);
        
        // Optionally, trigger a refresh or notify user
        refreshData();
        openCompleteModal(); // Assuming this function handles modal opening
    } catch (error) {
        console.error("Error:", error);
        setErrorMessage("Failed to add custom request. Please try again."); // Generic error message
        setLoading(false); // Ensure loading spinner is stopped
    }
};

  const pStyle = "font-medium w-full";
  const inputStyle = "border border-black rounded-md p-1 w-full";

  return (
    <div>
      {modalIsOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 flex-col">
          <div className="p-4 w-10/12 sm:w-1/3 relative bg-primary flex justify-center mx-20 border-b rounded-t-[12px]">
            <h2 className="text-center text-xl md:text-[32px] font-bold text-white">
              Add {entityType}
            </h2>
            <XMarkIcon
              className="size-6 text-black absolute right-3 cursor-pointer"
              onClick={closeModal}
            />
          </div>
          <div className="bg-white w-10/12 sm:w-1/3 x-20 rounded-b-[12px] shadow-lg overflow-y-auto h-2/3">
            <div className="grid lg:grid-cols-2 justify-items-center place-content-center mt-4 mx-10 gap-2">
              <div>
                <p className={`${pStyle}`}>Name</p>
                <input
                  type="text"
                  className={`${inputStyle}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              </div>
            </div>

            <div className="border-b mt-2"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 sm:mx-0 md:mx-2">
              <div>
                <h1 className="ml-2 text-[20px] font-medium  text-sm md:text-md">
                  Noted By
                </h1>
                {approvers.map((person, index) => (
                  <div key={index} className="mx-2 my-2 flex items-center">
                    <input
                      type="checkbox"
                      className="size-5 mr-2"
                      id={`noted_by_${index}`}
                      checked={notedBy.includes(person.user_id)}
                      onChange={() => toggleNotedBy(person.user_id)}
                    />
                    <label htmlFor={`noted_by_${index}`}>
                      {person.firstname} {person.lastname}
                    </label>
                  </div>
                ))}
              </div>
              <div>
                <h1 className="ml-2  text-[20px] font-medium text-sm md:text-md">
                  Approved By
                </h1>
                {approvers.map((person, index) => (
                  <div key={index} className=" ml-2 flex my-2 items-center">
                    <input
                      type="checkbox"
                      className="size-5 mr-2"
                      id={`approved_by_${index}`}
                      checked={approvedBy.includes(person.user_id)}
                      onChange={() => toggleApprovedBy(person.user_id)}
                    />
                    <label htmlFor={`approved_by_${index}`}>
                      {person.firstname} {person.lastname}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col md:flex-row w-full  mt-2 justify-items-center lg:justify-end items-center space-x-0 md:space-x-2 md:mt-20 md:mr-10 mb-10 pr-2">
              <button
                className="bg-[#9C9C9C] p-2 w-1/2 lg:w-1/4 rounded-[12px] h-14 text-white font-medium"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-primary p-2 w-1/2 lg:w-1/4 mt-2 md:mt-0 rounded-[12px] h-14 text-white font-medium"
                onClick={handleAddCustomRequest}
              >
                {loading ? <ClipLoader color="#36d7b7" /> : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCustomModal;

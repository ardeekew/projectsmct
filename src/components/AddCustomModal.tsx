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
  const [notedBy, setNotedBy] = useState<{ firstName: string; lastName: string }[]>([]);
  const [approvedBy, setApprovedBy] = useState<{ firstName: string; lastName: string }[]>([]);
  const [name, setName] = useState<string>("");
  const userId = localStorage.getItem("id");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [approvers, setApprovers] = useState<{ firstName: string; lastName: string }[]>([]);

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
    
        // Handle specific cases based on response data structure
        if (response.data && Array.isArray(response.data.data)) {
          const mappedApprovers = response.data.data.map((approver: any) => ({
            id: approver.id,
            firstName: approver.firstname,
            lastName: approver.lastname,
            email: approver.email,
            position: approver.position,
            // Add other fields as needed
          }));
          setApprovers(mappedApprovers);
        } else if (response.data && typeof response.data === 'object') {
          // Handle single object response
          const mappedApprover = [{
            id: response.data.id,
            firstName: response.data.firstname,
            lastName: response.data.lastname,
            email: response.data.email,
            position: response.data.position,
            // Add other fields as needed
          }];
          setApprovers(mappedApprover);
        } else {
          console.error("Unexpected response format from API:", response.data);
          // Handle this case appropriately, e.g., set an error state or display a message to the user
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching approvers:", error);
        setLoading(false);
        // Handle error state or display an error message to the user
      }
    };
    
    
    

    if (modalIsOpen) {
      fetchApprovers();
    }
  }, [modalIsOpen]);

  const toggleNotedBy = (person: { firstName: string; lastName: string }) => {
    const isPresent = notedBy.some(
      (n) => n.firstName === person.firstName && n.lastName === person.lastName
    );
    if (isPresent) {
      setNotedBy((prevNotedBy) =>
        prevNotedBy.filter(
          (n) => !(n.firstName === person.firstName && n.lastName === person.lastName)
        )
      );
    } else {
      setNotedBy((prevNotedBy) => [...prevNotedBy, person]);
    }
  };

  const toggleApprovedBy = (person: { firstName: string; lastName: string }) => {
    const isPresent = approvedBy.some(
      (n) => n.firstName === person.firstName && n.lastName === person.lastName
    );
    if (isPresent) {
      setApprovedBy((prevApprovedBy) =>
        prevApprovedBy.filter(
          (n) => !(n.firstName === person.firstName && n.lastName === person.lastName)
        )
      );
    } else {
      setApprovedBy((prevApprovedBy) => [...prevApprovedBy, person]);
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
        approvers: [
            {
                noted_by: notedBy,
                approved_by: approvedBy
            }
        ]
    };

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
                      checked={notedBy.some(
                        (n) =>
                          n.firstName === person.firstName &&
                          n.lastName === person.lastName
                      )}
                      onChange={() => toggleNotedBy(person)}
                    />
                    <label htmlFor={`noted_by_${index}`}>
                      {person.firstName} {person.lastName}
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
                      checked={approvedBy.some(
                        (n) =>
                          n.firstName === person.firstName &&
                          n.lastName === person.lastName
                      )}
                      onChange={() => toggleApprovedBy(person)}
                    />
                    <label htmlFor={`approved_by_${index}`}>
                      {person.firstName} {person.lastName}
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

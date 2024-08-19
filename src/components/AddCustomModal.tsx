import React, { useState, useEffect } from "react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [approvers, setApprovers] = useState<any[]>([]); // Adjust as per your approver structure

  useEffect(() => {
    const userId = localStorage.getItem("id");
    const fetchApprovers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://122.53.61.91:6002/api/view-approvers/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const allApprovers = [
          ...(response.data.HOApprovers || []),
          ...(response.data.areaManagerApprover || []),
          ...(response.data.sameBranchApprovers || []),
        ];
        const currentUserId = Number(userId);
        const currentUsers = allApprovers.filter(
          (approver) => approver.id !== currentUserId
        );

        const uniqueIds = new Set(currentUsers.map((approver) => approver.id));
        const uniqueApprovers = allApprovers.filter(
          (approver) =>
            uniqueIds.has(approver.id) && uniqueIds.delete(approver.id)
        );

        // Update state with the combined approvers data
        setApprovers(uniqueApprovers);

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

  const filteredApprovers = approvers.filter(approver =>
    Object.values(approver).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleNotedBy = (personId: number) => {
    // Check if the person is already in the approvedBy list
    const isApproved = approvedBy.includes(personId);

    // Proceed only if the person is not in the approvedBy list
    if (!isApproved) {
      const isPresent = notedBy.includes(personId);
      if (isPresent) {
        setNotedBy((prevNotedBy) =>
          prevNotedBy.filter((id) => id !== personId)
        );
      } else {
        setNotedBy((prevNotedBy) => [...prevNotedBy, personId]);
      }
    }
  };

  const toggleApprovedBy = (personId: number) => {
    // Check if the person is already in the notedBy list
    const isNoted = notedBy.includes(personId);

    // Proceed only if the person is not in the notedBy list
    if (!isNoted) {
      const isPresent = approvedBy.includes(personId);
      if (isPresent) {
        setApprovedBy((prevApprovedBy) =>
          prevApprovedBy.filter((id) => id !== personId)
        );
      } else {
        setApprovedBy((prevApprovedBy) => [...prevApprovedBy, personId]);
      }
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
      setErrorMessage(
        "You must select at least one noted by and one approved by."
      );
      return;
    }

    const requestData = {
      user_id: userId,
      name: name.trim(),
      noted_by: notedBy,
      approved_by: approvedBy,
    };

    try {
      setLoading(true);

      const response = await axios.post(
        "http://122.53.61.91:6002/api/approvers",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json", // Ensure content type is set
          },
        }
      );

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
          <div className="bg-white w-10/12 sm:w-1/3 mx-20 rounded-b-[12px] shadow-lg  h-2/3 relative">
            <div className="grid lg:grid-cols-2 justify-items-left place-content-center mt-4 mx-4 gap-2">
              <div>
                <p className={`${pStyle}`}>Custom Approver Name</p>
                <input
                  type="text"
                  className={`${inputStyle}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              </div>
              <div></div>
            </div>

            <div className="border-b mt-2"></div>
            <div className="sm:mx-0 md:mx-4 my-2 relative flex  items-center">
      
              <div className="relative flex-grow">
                <input
                  type="text"
                  className="w-full border border-black rounded-md pl-10 pr-3 py-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search approvers"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-black absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 sm:mx-0 md:mx-2">
              <div>
                <h1 className="ml-2 text-[20px] font-medium  text-sm md:text-md">
                  Noted By
                </h1>
              {filteredApprovers.map((person, index) => {
                  const isNoted = notedBy.includes(person.id);
                  const isApproved = approvedBy.includes(person.id);
                  const isDisabled = isNoted || isApproved; // Disable if in either list
                  const highlightClass =
                    isNoted && isApproved ? "highlight" : "";

                  return (
                    <div key={index} className="mx-2 my-2 flex items-center">
                      <input
                        type="checkbox"
                        className={`size-5 mr-2 ${
                          isDisabled ? "cursor-not-allowed" : ""
                        }`}
                        id={`noted_by_${index}`}
                        checked={isNoted}
                        onChange={() => {
                          if (!isApproved) {
                            toggleNotedBy(person.id);
                          }
                        }}
                        disabled={isApproved} // Disable checkbox if already approved
                      />
                      <label
                        htmlFor={`noted_by_${index}`}
                        className={highlightClass} // Apply highlight class
                      >
                        {person.firstName} {person.lastName}
                      </label>
                    </div>
                  );
                })}
              </div>
              <div>
                <h1 className="ml-2  text-[20px] font-medium text-sm md:text-md">
                  Approved By
                </h1>
                {filteredApprovers.map((person, index) => {
                  const isNoted = notedBy.includes(person.id);
                  const isApproved = approvedBy.includes(person.id);
                  const isDisabled = isNoted || isApproved; // Disable if in either list
                  const highlightClass =
                    isNoted && isApproved ? "highlight" : "";

                  return (
                    <div key={index} className="ml-2 flex my-2 items-center">
                      <input
                        type="checkbox"
                        className={`size-5 mr-2 ${
                          isDisabled ? "cursor-not-allowed" : ""
                        }`}
                        id={`approved_by_${index}`}
                        checked={isApproved}
                        onChange={() => {
                          if (!isNoted) {
                            toggleApprovedBy(person.id);
                          }
                        }}
                        disabled={isNoted} // Disable checkbox if already noted
                      />
                      <label
                        htmlFor={`approved_by_${index}`}
                        className={highlightClass} // Apply highlight class
                      >
                        {person.firstName} {person.lastName}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="absolute bottom-4 right-4 flex space-x-2 w-1/2">
              <button
                className="bg-[#9C9C9C] p-2 rounded-[12px] h-14 text-white font-medium"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-primary p-2 w-full mt-2 md:mt-0 rounded-[12px] h-14 text-white font-medium"
                onClick={handleAddCustomRequest}
              >
                {loading ? <ClipLoader color="#36d7b7" /> : "Add Custom"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCustomModal;

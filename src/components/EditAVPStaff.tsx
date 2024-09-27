import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

interface Branch {
  id: number;
  branch: string;
  branch_code: string;
  branch_id: number;
}

interface UserObject {
  firstName: string;
  lastName: string;
}

interface StaffObject {
  firstName: string;
  lastName: string;
}

interface Record {
  id: number;
  user: UserObject;
  staff: StaffObject;
  branches: number[];
}

const EditAVPStaff = ({
  editModal,
  editModalClose,
  openSuccessModal,
  entityType,
  selectedUser,
  refreshData,
  areaManagerId,
  modalIsOpen,
  closeModal,
  openCompleteModal,
  closeSuccessModal,
}: {
  editModal: boolean;
  openCompleteModal: any;
  closeModal: any;
  modalIsOpen: boolean;
  areaManagerId: number;
  editModalClose: any;
  openSuccessModal: any;
  entityType: string;
  selectedUser: any;
  closeSuccessModal: any;
  refreshData: any;
}) => {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [initialSelectedBranches, setInitialSelectedBranches] = useState<
    number[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [areaManagerData, setAreaManagerData] = useState<Record | null>(null);
  const [branchList, setBranchList] = useState<Record[]>([]);

  useEffect(() => {
    const fetchAreaManagerData = async () => {
     
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token is missing");
        }
  
        const headers = {
          Authorization: `Bearer ${token}`,
        };
  
        if (!selectedUser || !selectedUser.id) {
       
          return;
        }
  
        // Fetch area manager data
        const response = await axios.get(
          `http://122.53.61.91:6002/api/get-avpstaff-branch/${selectedUser.id}`,
          { headers }
        );
  
        if (response.data && response.data.data) {
          const branchData = response.data.data;
          setBranchList(branchData);
      
          // Assuming branchList contains an array of branches
       setSelectedBranches(branchData.branches)
  
          setError("");
        } else {
          throw new Error("No data found in the response");
        }
      } catch (error) {
        console.error("Error fetching area manager data:", error);
        setError("Failed to fetch area manager data");
      }
    };
  
    if (selectedUser && selectedUser.id) {
      fetchAreaManagerData();
    }
  }, [selectedUser]); 


  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token is missing");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(
          `http://122.53.61.91:6002/api/view-branch`,
          {
            headers,
          }
        );

        setBranches(response.data.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
        setError("Failed to fetch branches");
        setBranches([]);
      }
    };

    if (selectedUser) {
      fetchBranches();
    } else {
      setBranches([]);
    }
  }, [selectedUser]);

  const handleCheckboxChange = (id: number) => {
    if (selectedBranches.includes(id)) {
      setSelectedBranches(
        selectedBranches.filter((branchId) => branchId !== id)
      );
    } else {
      setSelectedBranches([...selectedBranches, id]);
    }
  };

  if (!editModal) {
    return null;
  }
 
  const handleConfirmSelection = async () => {
    if (selectedBranches.length > 0) {
      setIsLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token is missing");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Example of PUT request to update area manager with selectedBranches
        const putData = {
          user_id: selectedUser.user.id,
          branch_id: selectedBranches, 
          staff_id: selectedUser.staff.id
        };

        const response = await axios.put(
          `http://122.53.61.91:6002/api/update-avpstaff-branch/${selectedUser.id}`,
          putData,
          {
            headers,
          }
        );

        // Assuming successful, close modal or show success message
        openSuccessModal();
        editModalClose();
        refreshData();
        setIsLoading(false); // Refresh parent data if needed
      } catch (error) {
        console.error("Error updating area manager:", error);
        setIsLoading(false);
        setError("Failed to update area manager. Please try again."); // Show error message
      }
    } else {
      setError("Please select at least one branch."); // Show error message
    }
    setError("");
  };

  const handleCancel = () => {
    setSelectedBranches(initialSelectedBranches); // Reset to the initial selected branches
    editModalClose();
  };

  const handleRemoveBranch = (branchIdToRemove: number) => {
    setSelectedBranches(
      selectedBranches.filter((id) => id !== branchIdToRemove)
    );
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 flex-col">
      <div className="p-4 w-10/12 sm:w-1/3 relative bg-primary flex justify-center mx-20 border-b rounded-t-[12px]">
        <h2 className="text-center text-xl md:text-[32px] font-bold h-full text-white">
          Edit AVP
        </h2>
        <XMarkIcon
          className="size-6 text-black absolute right-3 cursor-pointer"
          onClick={handleCancel}
        />
      </div>
      <div className="bg-white w-10/12 sm:w-1/3 x-20 overflow-y-auto h-1/2 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <ClipLoader size={35} color={"#123abc"} loading={loading} />
          </div>
        ) : (
          <div className="bg-white flex-col w-10/12 sm:w-full  rounded-b-[12px] shadow-lg p-2 bottom-4 right-4 flex space-x-2">
            <h3 className="text-lg font-bold p-4">
              Branches for {selectedUser.user.firstName}{" "}
              {selectedUser.user.lastName}:
            </h3>
            <input
              type="text"
              placeholder="Search branches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 mb-2  border border-gray-300 rounded-md "
            />
            <div className="px-4 h-auto">
              {branches.length === 0 ? (
                <ClipLoader size={35} color={"#123abc"} loading={loading} />
              ) : (
                branches
                  .filter((branch) => {
                    const branchName = branch.branch.toLowerCase();
                    const branchCode = branch.branch_code.toLowerCase();
                    const query = searchQuery.toLowerCase();
                    return (
                      branchName.includes(query) || branchCode.includes(query)
                    );
                  })
                  .map((branch) => (
                    <div
                      key={branch.id}
                      className="flex items-center justify-between mb-2  bg-blue-100"
                    >
                      <div className="flex w-full items-center justify-between  p-4">
                        <div>
                          <p>{branch.branch}</p>
                          <p>{branch.branch_code}</p>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            checked={selectedBranches.includes(branch.id)}
                            onChange={() => handleCheckboxChange(branch.id)}
                            className="size-5 text-blue-500 cursor-pointer mx-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </div>
      <div className="bg-white w-10/12 sm:w-1/3 shadow-lg p-2 bottom-4 right-4 flex flex-wrap gap-2 max-h-48 overflow-y-auto">
        {selectedBranches.map((branchId) => {
          const branch = branches.find((b) => b.id === branchId);
          return (
            <div
              key={branchId}
              className="bg-gray-300 p-3 rounded-sm mb-2 relative"
            >
              <XMarkIcon
                className="size-4 text-gray-500 absolute top-0 right-0  cursor-pointer"
                onClick={() => handleRemoveBranch(branchId)}
              />

              <div>
                <p>{branch?.branch}</p>
                <p>{branch?.branch_code}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-white w-10/12 sm:w-1/3 rounded-b-[12px] shadow-lg p-2 bottom-4 right-4 flex space-x-2">
        <button
          onClick={handleConfirmSelection}
          className="bg-primary text-white h-12 font-bold py-2 px-4 rounded cursor-pointer"
        >
          {isLoading ? <ClipLoader color="#36d7b7" /> : "Update Area Manager"}
        </button>
        <button
          onClick={handleCancel}
          className="bg-red-500 text-white font-bold h-12 py-2 px-4 rounded cursor-pointer"
        >
          Cancel
        </button>
      </div>
      {error && (
        <div className="bg-red-500 text-white p-2 rounded mt-2">{error}</div>
      )}
    </div>
  );
};

export default EditAVPStaff;

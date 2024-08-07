import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import SuccessModal from "./SuccessModal";
import CompleteModal from "./CompleteModal";
import DeleteSuccessModal from "./DeleteSucessModal";
import DeleteModal from "./DeleteModal";
import { set } from "react-hook-form";

import AddApproverModal from "./AddApproverModal";
import axios from "axios";
import AddAreaManagerModal from "./AddAreaManagerModal";
import EditAreaManager from "./EditAreaManager";
import { ClipLoader } from "react-spinners";

type Props = {};

interface Record {
  id: number;
  user_id: number;
  branch_id: number[];
  branches: {
    message: string;
    data: {
      id: number;
      branch_code: string;
      branch: string;
      created_at: string;
      updated_at: string;
    }[];
  }[];
  user: UserObject;
}



const tableCustomStyles = {
  headRow: {
    style: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "black",
      backgroundColor: "#FFFF",
    },
  },
  rows: {
    style: {
      color: "STRIPEDCOLOR",
      backgroundColor: "STRIPEDCOLOR",
    },
    stripedStyle: {
      color: "NORMALCOLOR",
      backgroundColor: "#E7F1F9",
    },
  },
};

const deleteUser = async () => {
  
};
interface AreaManager {
  id: number;
  user_id: number;
  branch_id: number[];
  branches: {
    message: string;
    data: {
      id: number;
      branch_code: string;
      branch: string;
      created_at: string;
      updated_at: string;
    }[];
  }[];
  user: UserObject;
}

 

interface UserObject {
  message: string;
  data: User;
  status: boolean;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  contact: string;
  branch_code: string;
  userName: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  signature: string;
  created_at: string;
  updated_at: string;
  position: string;
  branch: string;
  employee_id: string;
}
const SetupAreaManager = (props: Props) => {

  const [darkMode, setDarkMode] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeletedSuccessModal, setShowDeletedSuccessModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteSuccessModal, setDeleteSuccessModal] = useState(false);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Record | null>(null);
  const [areaManagerList, setAreaManagerList] = useState<Record[]>([]);

  const [isLoading, setisLoading] = useState(false);
  const userId = localStorage.getItem("id");
  const [areaManager, setAreaManager] = useState<{ branches: any[]; user: any; id: number; user_id: number; branch_id: number[]; } | null>(null);
  const userData = areaManagerList.length > 0 ? areaManagerList[0]?.user?.data ?? null : null;

  useEffect(() => {
    const fetchApproverData = async () => {
      try {
        if (!userId) {
          console.error("User ID is missing");
          return;
        }

        console.log("Fetching approvers data...");
        console.log("User ID:", userId);

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Fetch area managers
        const response = await axios.get<{ data: AreaManager[] }>(
          `http://localhost:8000/api/view-area-managers`,
          {
            headers,
          }
        );
        console.log("Response:", response.data);
        const areaManagerList: AreaManager[] = response.data.data;

        // Prepare array to hold promises for fetching user info
        const areaManagersWithData: any[] = [];

        for (const areaManager of areaManagerList) {
          // Fetch user info based on user_id (which is id in users table)
          const userResponse = await axios.get<Record>(
            `http://localhost:8000/api/view-user/${areaManager.user_id}`,
            {
              headers,
            }
          );
          console.log("User Info Response:", userResponse.data);
          const userInfo: Record = userResponse.data; // Assuming your API returns user info

          // Fetch branches for each branch_id
          const branchPromises = areaManager.branch_id.map(async (branchId) => {
            const branchResponse = await axios.get(
              `http://localhost:8000/api/view-branch/${branchId}`,
              {
                headers,
              }
            );
            return branchResponse.data; // Assuming your API returns branch data
          });

          // Resolve all branch info promises
          const branchInfos = await Promise.all(branchPromises);

          // Combine area manager data with branch info and user info
          const areaManagerWithData = {
            ...areaManager,
            branches: branchInfos,
            user: userInfo, // Adding user info to area manager data
          };

          areaManagersWithData.push(areaManagerWithData);
        }

      
        // Further processing or state update with areaManagersWithData
        setAreaManagerList(areaManagersWithData);
        console.log("Area managers ", areaManagersWithData);

      } catch (error) {
        console.error("Error fetching approvers data:", error);
      }
    };
    console.log(userData?.firstName);
    fetchApproverData();
  }, [userId]);

 
  
  
  const refreshData = async () => {
    try {
      if (!userId) {
        console.error("User ID is missing");
        return;
      }

      console.log("Fetching approvers data...");
      console.log("User ID:", userId);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Fetch area managers
      const response = await axios.get<{ data: AreaManager[] }>(
        `http://localhost:8000/api/view-area-managers`,
        {
          headers,
        }
      );
      console.log("Response:", response.data);
      const areaManagerList: AreaManager[] = response.data.data;

      // Prepare array to hold promises for fetching user info
      const areaManagersWithData: any[] = [];

      for (const areaManager of areaManagerList) {
        // Fetch user info based on user_id (which is id in users table)
        const userResponse = await axios.get<Record>(
          `http://localhost:8000/api/view-user/${areaManager.user_id}`,
          {
            headers,
          }
        );
        console.log("User Info Response:", userResponse.data);
        const userInfo: Record = userResponse.data; // Assuming your API returns user info

        // Fetch branches for each branch_id
        const branchPromises = areaManager.branch_id.map(async (branchId) => {
          const branchResponse = await axios.get(
            `http://localhost:8000/api/view-branch/${branchId}`,
            {
              headers,
            }
          );
          return branchResponse.data; // Assuming your API returns branch data
        });

        // Resolve all branch info promises
        const branchInfos = await Promise.all(branchPromises);

        // Combine area manager data with branch info and user info
        const areaManagerWithData = {
          ...areaManager,
          branches: branchInfos,
          user: userInfo, // Adding user info to area manager data
        };

        areaManagersWithData.push(areaManagerWithData);
      }

    
      // Further processing or state update with areaManagersWithData
      setAreaManagerList(areaManagersWithData);
      console.log("Area managers ", areaManagersWithData);

    } catch (error) {
      console.error("Error fetching approvers data:", error);
    }

    
  };
  const viewModalShow = (row: Record) => {
    setSelectedUser(row);
    setViewModalIsOpen(true);
    console.log("opened view modal");
  };

  const viewModalClose = () => {
    setSelectedUser(null);
    setViewModalIsOpen(false);
  };

  const deleteModalShow = (row: Record) => {
    setSelectedUser(row);
    setDeleteModal(true);
    console.log("opened delete modalasd", row.user_id);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  const editModalShow = (row: Record) => {
    setEditModal(true);
    setSelectedUser(row);
  };

  const editModalClose = () => {
    setEditModal(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
    console.log("opened modal");  
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const openCompleteModal = () => {
    setShowCompleteModal(true);
    setModalIsOpen(false);
  };

  const closeCompleteModal = () => {
    setShowCompleteModal(false);
  };
  const openSuccessModal = () => {
    console.log("opened success modal");
    setShowSuccessModal(true);
    setEditModal(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };
  const openDeleteSuccessModal = () => {
    setShowDeletedSuccessModal(true);
    setDeleteModal(false);
  };

  const closeDeleteSuccessModal = () => {
    setShowDeletedSuccessModal(false);
  };
  const getAssignedBranches = (row: Record) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2  space-y-2  sm:gap-2 sm:space-y-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
        {row.branches.map((branchInfo, index) => (
          <div className="bg-primary p-2 rounded-[12px] w-14 text-center " key={index}>
            <ul className=" text-white">{branchInfo.data[0].branch_code}</ul>
          </div>
        ))}
      </div>
    );
  };


 const deleteUser = async () => {
  try {
    setisLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token is missing");
        return;
    }

    const headers = {
        Authorization: `Bearer ${token}`,
    };
console.log('selectedUser', selectedUser?.id);
    // Send PUT request to update user's role
    const response = await axios.delete(
        `http://localhost:8000/api/delete-area-manager/${selectedUser?.id}`,
      
        { headers }
    );

    setisLoading(false);
    openDeleteSuccessModal();
    refreshData();
    console.log("Role updated successfully:", response.data);
    // Optionally handle success message or UI updates after successful update
} catch (error) {
    setisLoading(false);
    console.error("Error updating role:", error);
    // Handle error state or show error message to the user
    // Example: show error message in a toast or modal
    // showErrorToast("Failed to update role. Please try again later.");
}

}
const columns = [
  {
    name: "ID",
    selector: (row: Record) => row.id,
    width: "60px",
  },
  {
    name: "Name",
    selector: (row: Record) => {
      const user = row.user;
      const firstName = user?.data?.firstName ?? '';
      const lastName = user?.data?.lastName ?? '';
      return `${firstName} ${lastName}`;
    },
  },
  {
    name: "Assigned Branches",
    cell: (row: Record) => getAssignedBranches(row),
  },
  {
    name: "Modify",
    cell: (row: Record) => (
      <div className="flex space-x-2">
       <PencilSquareIcon
            className="text-primary size-8 cursor-pointer"
            onClick={() => editModalShow(row)}
          />
        <TrashIcon
          className="text-[#A30D11] size-8 cursor-pointer"
          onClick={() => deleteModalShow(row)}
        />
      </div>
    ),
  },
];


  const pStyle = "font-medium";
  const inputStyle = "border border-black rounded-md p-1";
  return (
    <div className="bg-graybg dark:bg-blackbg h-full w-full pt-4 px-4 sm:px-10 md:px-10 lg:px-30 xl:px-30">
      <div className=" h-auto drop-shadow-lg rounded-lg md:mr-4 w-full ">
        <div className="bg-white rounded-lg w-full flex flex-col overflow-x-auto">
          <h1 className="pl-4 sm:pl-[30px] text-[24px] text-left py-4 text-primary font-bold mr-2 underline decoration-2 underline-offset-8">
            Area Manager
          </h1>
          <div className="flex items-end justify-between mx-2 bg-white">
            <div>
              <input type="text" placeholder="Search" className={inputStyle} />
            </div>
            <div>
              <button className="bg-primary text-white rounded-[12px] p-1"
                onClick={openModal}>
                + Create New
              </button>
            </div>
          </div>
          {isLoading ? (
        <div className="flex justify-center items-center">
          <ClipLoader color="#36d7b7" />
        </div>
      ) : areaManagerList.length === 0 ? (
        <p className="text-center text-gray-600">No area managers yet</p>
      ) : (
        <DataTable
          columns={columns}
          data={areaManagerList}
          pagination
          striped
          progressPending={isLoading}
          progressComponent={<p>Loading...</p>}
          noDataComponent={<p><ClipLoader color="#36d7b7" /></p>}
          customStyles={{
            headRow: {
              style: {
                fontSize: "18px",
                fontWeight: "bold",
                color: "black",
                backgroundColor: "#FFFF",
              },
            },
            rows: {
              style: {
                color: "black", // Adjust as per your design
                backgroundColor: "#E7F1F9", // Adjust as per your design
              },
              stripedStyle: {
                color: "black", // Adjust as per your design
                backgroundColor: "#FFFFFF", // Adjust as per your design
              },
            },
          }}
        
        />
      )}
        </div>
      </div>
      <AddAreaManagerModal
        refreshData={refreshData}
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        openCompleteModal={openCompleteModal}
        entityType="Area Manager"
      />
      <DeleteModal
        refreshData={refreshData}
        onDelete={deleteUser}
        deleteModal={deleteModal}
        closeDeleteModal={closeDeleteModal}
        openDeleteSuccessModal={openDeleteSuccessModal}
        entityType="Area Manager"
      />
      <DeleteSuccessModal
        showDeleteSuccessModal={showDeletedSuccessModal}
        closeDeleteSuccessModal={closeDeleteSuccessModal}
        openDeleteSuccessModal={openDeleteSuccessModal}
        entityType="Area Manager"
      />
      <CompleteModal
        showCompleteModal={showCompleteModal}
        closeCompleteModal={closeCompleteModal}
        openCompleteModal={openCompleteModal}
        entityType="Area Manager"
      />
      <EditAreaManager
      closeSuccessModal={closeSuccessModal}
        refreshData={refreshData}
        editModal={editModal}
        editModalClose={editModalClose}
        openSuccessModal={openSuccessModal}
        entityType="Area Manager"
        selectedUser={selectedUser || null}
        openCompleteModal={null}
        closeModal={null}
        modalIsOpen={false}
        areaManagerId={0}
      />
      <SuccessModal
        showSuccessModal={showSuccessModal}
        closeSuccessModal={closeSuccessModal}
        openSuccessModal={openSuccessModal}
        entityType="Area Manager"
      />
    </div>
  );
};

export default SetupAreaManager;


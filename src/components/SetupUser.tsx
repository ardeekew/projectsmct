import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import SuccessModal from "./SuccessModal";
import CompleteModal from "./CompleteModal";
import DeleteSuccessModal from "./DeleteSucessModal";
import DeleteModal from "./DeleteModal";
import ViewUserModal from "./ViewUserModal";
import axios from "axios";

type Props = {};

type Record = {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  branch_code: string;
  email: string;
  role: string;
  contact: string;
  username: string;
  branch: string;
  position: string;
};

const SetupUser = (props: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeletedSuccessModal, setShowDeletedSuccessModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Record | null>(null);
  const [userList, setUserList] = useState<Record[]>([]);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) {
          console.error("User ID is missing");
          return;
        }

        console.log("Fetching data...");
        console.log("User ID:", userId);

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(
          `http://localhost:8000/api/view-users`,
          {
            headers,
          }
        );
        console.log("Response:", response.data);
        // Transform data to match columns selector
        const transformedData = response.data.data.map(
          (item: Record, index: number) => ({
            id: item.id,
            firstname: item.firstname,
            lastname: item.lastname,
            username: item.username,
            branch_code: item.branch_code,
            email: item.email,
            role: item.role,
            contact: item.contact,
            branch: item.branch,
            position: item.position,
          })
        );

        setUserList(transformedData);
        console.log("Users:", transformedData);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const deleteUser = async () => {
    try {
      if (!userId || !selectedUser) {
        console.error("User ID or selected user is missing");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.delete(
        `http://localhost:8000/api/delete-user/${selectedUser.id}`,
        {
          headers,
        }
      );

      if (response.data.status) {
        console.log("User deleted successfully");
        closeDeleteModal();
        openDeleteSuccessModal();
        refreshData();
      } else {
        console.error("Failed to delete user:", response.data.message);
        // Handle error scenario, show error message or alert
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      // Handle error scenario, show error message or alert
    }
  };

  const deleteModalShow = (row: Record) => {
    setSelectedUser(row);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  const editModalShow = (row: Record) => {
    setSelectedUser(row);
    console.log("Selected User1231:", selectedUser);
    setEditModal(true);
  };

  const editModalClose = () => {
    setEditModal(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
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

  const viewModalShow = (row: Record) => {
    setSelectedUser(row);
    setViewModalIsOpen(true);
  };

  const viewModalClose = () => {
    setSelectedUser(null);
    setViewModalIsOpen(false);
  };
  const refreshData = async () => {
    try {
      if (!userId) {
        console.error("User ID is missing");
        return;
      }

      console.log("Fetching data...");
      console.log("User ID:", userId);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`http://localhost:8000/api/view-users`, {
        headers,
      });
      console.log("Response:", response.data);
      // Transform data to match columns selector
      const transformedData = response.data.data.map(
        (item: Record, index: number) => ({
          id: item.id,
          firstname: item.firstname,
          lastname: item.lastname,
          username: item.username,
          branch_code: item.branch_code,
          email: item.email,
          role: item.role,
          contact: item.contact,
          branch: item.branch,
          position: item.position,
        })
      );

      setUserList(transformedData);
      console.log("Users:", transformedData);
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
  };
  const columns = [
    {
      name: "ID",
      selector: (row: Record) => row.id,
      width: "60px",
    },
    {
      name: "Name",
      selector: (row: Record) => `${row.firstname} ${row.lastname}`,
    },

    {
      name: "Branch code",
      selector: (row: Record) => row.branch_code,
    },
    {
      name: "Email",
      selector: (row: Record) => row.email,
    },
    {
      name: "Role",
      selector: (row: Record) => row.role,
    },
    {
      name: "Modify",
      cell: (row: Record) => (
        <div className="flex space-x-2 items-center">
          <PencilSquareIcon
            className="text-primary size-12 cursor-pointer"
            onClick={() => editModalShow(row)}
          />
          <TrashIcon
            className="text-[#A30D11] size-12 cursor-pointer"
            onClick={() => deleteModalShow(row)}
          />
          <button
            className="bg-primary size-8  text-white w-full rounded-[12px]"
            onClick={() => viewModalShow(row)}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-graybg dark:bg-blackbg h-full w-full pt-4 px-4 sm:px-10 md:px-10 lg:px-30 xl:px-30">
      <div className=" h-auto drop-shadow-lg rounded-lg md:mr-4 w-full ">
        <div className="bg-white rounded-lg w-full flex flex-col overflow-x-auto">
          <h1 className="pl-4 sm:pl-[30px] text-[24px] text-left py-4 text-primary font-bold mr-2 underline decoration-2 underline-offset-8">
            User
          </h1>
          <div className="flex items-end justify-end mx-2 bg-white">
            <div>
              <button
                className="bg-primary text-white rounded-[12px] p-2"
                onClick={openModal}
              >
                + Add User
              </button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={userList}
            pagination
            striped
            
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
        </div>
      </div>
      <AddUserModal
        refreshData={refreshData}
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        openCompleteModal={openCompleteModal}
        entityType="User"
      />
      <DeleteModal
        refreshData={refreshData}
        onDelete={deleteUser}
        deleteModal={deleteModal}
        closeDeleteModal={closeDeleteModal}
        openDeleteSuccessModal={openDeleteSuccessModal}
        entityType="User"
      />
      <DeleteSuccessModal
        showDeleteSuccessModal={showDeletedSuccessModal}
        closeDeleteSuccessModal={closeDeleteSuccessModal}
        openDeleteSuccessModal={openDeleteSuccessModal}
        entityType="User"
      />
      <CompleteModal
        showCompleteModal={showCompleteModal}
        closeCompleteModal={closeCompleteModal}
        openCompleteModal={openCompleteModal}
        entityType="User"
      />
      <EditUserModal
        refreshData={refreshData}
        editModal={editModal}
        editModalClose={editModalClose}
        openSuccessModal={openSuccessModal}
        entityType="User"
        selectedUser={selectedUser}
      />
      <SuccessModal
        showSuccessModal={showSuccessModal}
        closeSuccessModal={closeSuccessModal}
        openSuccessModal={openSuccessModal}
        entityType="User"
      />
      <ViewUserModal
        modalIsOpen={viewModalIsOpen}
        closeModal={viewModalClose}
        user={selectedUser}
      />
    </div>
  );
};

export default SetupUser;

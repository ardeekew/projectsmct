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
import ViewApproverModal from "./ViewApproverModal";
import AddCustomModal from "./AddCustomModal";
import axios from "axios";

type Props = {};

type Record = {
  id: number;
  name: string;
  approvers: {
    noted_by: { firstName: string; lastName: string }[];
    approved_by: { firstName: string; lastName: string }[];
  };
};

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
interface ViewApproverModalProps {
  modalIsOpen: boolean;
  closeModal: () => void;
  user: Record | null;
}

const pStyle = "font-medium";
const inputStyle = "border border-black rounded-md p-1";
const CustomRequest = (props: Props) => {
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
  const [requests, setRequests] = useState<Record[]>([]);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    fetchRequests();
  }, [userId]); // useEffect will re-run whenever userId changes

  const fetchRequests = () => {
    if (userId) {
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

        axios
            .get(`http://localhost:8000/api/custom-approvers?user_id=${userId}`, {
                headers,
            })
            .then((response) => {
                console.log("Response:", response.data); // Log the entire response object
                const formattedRequests = response.data.map((item: any) => {
                    let notedBy = [];
                    let approvedBy = [];

                    try {
                        // Parse the stringified JSON in approvers field
                        const approversArray = JSON.parse(item.approvers);

                        // Extract noted_by array if it exists and is an array
                        if (approversArray[0]?.noted_by && Array.isArray(approversArray[0].noted_by)) {
                            notedBy = approversArray[0].noted_by.map((notedByItem:any) => ({
                                id: notedByItem.id,
                                firstName: notedByItem.firstName,
                                lastName: notedByItem.lastName,
                                email: notedByItem.email,
                                position: notedByItem.position,
                            }));
                            console.log("NOTED BY:", notedBy);
                        }

                        // Extract approved_by array if it exists and is an array
                        if (approversArray[0]?.approved_by && Array.isArray(approversArray[0].approved_by)) {
                            approvedBy = approversArray[0].approved_by.map((approvedByItem: any) => ({
                                id: approvedByItem.id,
                                firstName: approvedByItem.firstName,
                                lastName: approvedByItem.lastName,
                                email: approvedByItem.email,
                                position: approvedByItem.position,
                            }));
                            console.log("Approved BY:", approvedBy);
                        }
                    } catch (error) {
                        console.error("Error parsing approvers JSON:", error);
                    }

                    return {
                        id: item.id,
                        name: item.name,
                        approvers: {
                            noted_by: notedBy,
                            approved_by: approvedBy,
                        },
                        created_at: item.created_at,
                        updated_at: item.updated_at,
                    };
                });

                console.table("formatted:", formattedRequests); // Log formatted requests
                // Assuming setRequests is a state setter function
                setRequests(formattedRequests);
            })
            .catch((error) => {
                console.error("Error fetching requests data:", error);
            });
    }
};

  const deleteUser = async () => {};
  const refreshData = () => {
    if (userId) {
      console.log("Refreshing data...");
      console.log("User ID:", userId);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios
        .get(`http://localhost:8000/api/custom-approvers`, {
          headers,
        })
        .then((response) => {
          setRequests(response.data);
          console.log("Requests refreshed:", response.data);
        })
        .catch((error) => {
          console.error("Error refreshing requests data:", error);
        });
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

  const deleteModalShow = () => {
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  const editModalShow = () => {
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

  const columns = [
    {
      name: "ID",
      selector: (row: Record) => row.id,
      width: "20%",
    },
    {
      name: "Name",
      selector: (row: Record) => row.name,
      width: "20%",
    },
    {
      name: "Approvers",
      cell: (row: Record) => (
        <div className="grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2">
          {row.approvers.noted_by.map((notedBy, index) => (
            <div
              key={index}
              className="flex flex-col text-center  rounded-lg space-y-2 gap-x-4"
            >
              <p className="bg-primary w-full py-2 rounded-xl text-white">{`${notedBy.firstName}`}</p>
            </div>
          ))}
          {row.approvers.approved_by.map((approvedBy, index) => (
            <div key={index} className="flex flex-col text-center space-y-2 ">
              <p className="bg-pink py-2 w-full rounded-xl text-white">{`${approvedBy.firstName}`}</p>
            </div>
          ))}
        </div>
      ),
      width: "45%",
    },
    {
      name: "Modify",
      cell: (row: Record) => (
        <div className="flex space-x-2 ">
          <PencilSquareIcon
            className="text-primary size-10 cursor-pointer "
            onClick={editModalShow}
          />
          <TrashIcon
            className="text-[#A30D11] size-10 cursor-pointer"
            onClick={deleteModalShow}
          />
          <button
            className="bg-primary text-white w-full px-4 rounded-[12px]"
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
            Approver
          </h1>
          <div className="flex items-end justify-end mx-2 bg-white">
            <div>
              <button
                className="bg-primary text-white rounded-[12px] px-3 h-10 mb-2"
                onClick={openModal}
              >
                + Create New
              </button>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={requests}
            pagination
            striped
            customStyles={tableCustomStyles}
          />
        </div>
      </div>
      <AddCustomModal
        refreshData={fetchRequests}
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        openCompleteModal={openCompleteModal}
        entityType="Custom"
      />
      <DeleteModal
        refreshData={refreshData}
        onDelete={deleteUser}
        deleteModal={deleteModal}
        closeDeleteModal={closeDeleteModal}
        openDeleteSuccessModal={openDeleteSuccessModal}
        entityType="Custom"
      />
      <DeleteSuccessModal
        showDeleteSuccessModal={showDeletedSuccessModal}
        closeDeleteSuccessModal={closeDeleteSuccessModal}
        openDeleteSuccessModal={openDeleteSuccessModal}
        entityType="Custom"
      />
      <CompleteModal
        showCompleteModal={showCompleteModal}
        closeCompleteModal={closeCompleteModal}
        openCompleteModal={openCompleteModal}
        entityType="Custom"
      />
      <EditUserModal
        refreshData={refreshData}
        editModal={editModal}
        editModalClose={editModalClose}
        openSuccessModal={openSuccessModal}
        entityType="Custom"
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default CustomRequest;

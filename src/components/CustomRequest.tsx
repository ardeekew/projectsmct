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
import { format } from "path";
import { ClipLoader } from "react-spinners";
type Props = {};

type Record = {
  id: number;
  name: string;
  noted_by: number[];
  approved_by: number[];
  noted_by_details?: any[]; // Update with appropriate type if known
  approved_by_details?: Approved_by[]; // Update with appropriate type if known
  firstName: string;
  lastName: string;
  firstname: string;
  lastname: string;
};
type Approved_by = {
firstname: string;
name: string;
id: number;
lastname: string;
data: Record;
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
  const [formattedRequests, setFormattedRequests] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
/*   useEffect(() => {
    fetchRequests();
  }, [userId]);  */// useEffect will re-run whenever userId changes

  useEffect(() => {
    const fetchRequests = () => {
      if (userId) {
        setLoading(true);
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
          .get(`http://localhost:8000/api/custom-approvers/${userId}`, {
            headers,
          })
          .then(async (response) => {
            console.log("Response:", response.data);
            const responseData = response.data;
            if (!Array.isArray(responseData.data)) {
              console.error("Expected data to be an array:", responseData);
              return;
            }
  
            const customApprovers: any[] = responseData.data;
  
            const formattedRequests: Record[] = [];
  
            for (let item of customApprovers) {
              let notedByDetails: any[] = [];
              let approvedByDetails: any[] = [];
  
              // Parse noted_by and approved_by arrays
              let notedByArray = JSON.parse(item.noted_by);
              let approvedByArray = JSON.parse(item.approved_by);
  
              // Fetch details for noted_by
              for (let notedById of notedByArray) {
           
                await axios
                  .get(`http://localhost:8000/api/approvers/${notedById}`, {
                    headers,
                  })
                  .then((response) => {
                    notedByDetails.push(response.data);
                  })
                  .catch((error) => {
                    console.error(`Error fetching approver ${notedById} details:`, error);
                  });
              }
  
              // Fetch details for approved_by
              for (let approvedById of approvedByArray) {
                await axios
                  .get(`http://localhost:8000/api/approvers/${approvedById}`, {
                    headers,
                  })
                  .then((response) => {
                    approvedByDetails.push(response.data);
                  })
                  .catch((error) => {
                    console.error(`Error fetching approver ${approvedById} details:`, error);
                  });
              }
              console.log("mehehe")
              formattedRequests.push({
                id: item.id,
                name: item.name,
                firstName: "", // Add the missing properties
                lastName: "",
                firstname: "",
                lastname: "",
                noted_by: notedByArray,
                approved_by: approvedByArray,
                noted_by_details: notedByDetails,
                approved_by_details: approvedByDetails,
              });
            }
            setLoading(false);
            console.log("Formatted Requests:", formattedRequests);
            setRequests(formattedRequests);
          })
          .catch((error) => {
            setLoading(false);
            console.error("Error fetching requests data:", error);
          });
      }
    };
  
    fetchRequests();
  }, [userId]);
  

  const deleteUser = async () => {};
  const refreshData = () => {
    if (userId) {
      setLoading(true);
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
        .get(`http://localhost:8000/api/custom-approvers/${userId}`, {
          headers,
        })
        .then(async (response) => {
          console.log("Response:", response.data);
          const responseData = response.data;
          if (!Array.isArray(responseData.data)) {
            console.error("Expected data to be an array:", responseData);
            return;
          }

          const customApprovers: any[] = responseData.data;

          const formattedRequests: Record[] = [];

          for (let item of customApprovers) {
            let notedByDetails: any[] = [];
            let approvedByDetails: any[] = [];

            // Parse noted_by and approved_by arrays
            let notedByArray = JSON.parse(item.noted_by);
            let approvedByArray = JSON.parse(item.approved_by);

            // Fetch details for noted_by
            for (let notedById of notedByArray) {
         
              await axios
                .get(`http://localhost:8000/api/approvers/${notedById}`, {
                  headers,
                })
                .then((response) => {
                  notedByDetails.push(response.data);
                })
                .catch((error) => {
                  console.error(`Error fetching approver ${notedById} details:`, error);
                });
            }

            // Fetch details for approved_by
            for (let approvedById of approvedByArray) {
              await axios
                .get(`http://localhost:8000/api/approvers/${approvedById}`, {
                  headers,
                })
                .then((response) => {
                  approvedByDetails.push(response.data);
                })
                .catch((error) => {
                  console.error(`Error fetching approver ${approvedById} details:`, error);
                });
            }
            console.log("mehehe")
            formattedRequests.push({
              id: item.id,
              name: item.name,
              firstName: "", // Add the missing properties
              lastName: "",
              firstname: "",
              lastname: "",
              noted_by: notedByArray,
              approved_by: approvedByArray,
              noted_by_details: notedByDetails,
              approved_by_details: approvedByDetails,
            });
          }
          setLoading(false);
          console.log("Formatted Requests:", formattedRequests);
          setRequests(formattedRequests);
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching requests data:", error);
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
      width: "10%",
    },
   
    {
      name: "Name",
      selector: (row: Record) => row.name,
      width: "25%",
    },
    {
      name:"Noted By",
      cell: (row: Record) => (
        <div className="w-full">
          {row.noted_by_details && row.noted_by_details.length > 0 ? (
            <div className="grid md:grid-cols-3">
              {row.noted_by_details.map((approver) => (
               <div
               className="w-full md:w-3/4 text-center px-2  bg-pink rounded-[12px] py-2 text-white flex justify-center items-center  my-1"
               key={approver.data.id}
             >
                  {`${approver.data.firstname} ${approver.data.lastname}`}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center mb-2">No Approved By</div>
          )}
          
         
        </div>
      ),
    },
    {
      name: "Approved By",
      cell: (row: Record) => (
        <div className="w-full">
          {row.approved_by_details && row.approved_by_details.length > 0 ? (
            <div className="grid md:grid-cols-3">
              {row.approved_by_details.map((approver) => (
                <div
                  className="w-full md:w-3/4 text-center px-2  bg-primary rounded-[12px] py-2 text-white flex justify-center items-center  my-1"
                  key={approver.data.id}
                >
                  {`${approver.data.firstname} ${approver.data.lastname}`}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center mb-2">No Approved By</div>
          )}
          
         
        </div>
      ),
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
      width: "14%",
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
          {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={requests}
          pagination
          striped
          customStyles={tableCustomStyles}
        />
      )}
        </div>
      </div>
      <AddCustomModal
        refreshData={refreshData}
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

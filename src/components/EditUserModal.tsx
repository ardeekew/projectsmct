import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import EyeSlashIcon from "@heroicons/react/24/solid/EyeSlashIcon";
import { EyeIcon } from "@heroicons/react/24/solid";

const EditUserModal = ({
  editModal,
  editModalClose,
  openSuccessModal,
  entityType,
  selectedUser,
  refreshData,
}: {
  editModal: boolean;
  editModalClose: any;
  openSuccessModal: any;
  entityType: string;
  selectedUser: any;
  refreshData: any;
}) => {
  const [editedBranch, setEditedBranch] = useState<string>("");
  const [editedBranchCode, setEditedBranchCode] = useState<string>("");
  const [firstname, setFirstName] = useState<string>("");
  const [lastname, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [editedRole, setEditedRole] = useState<string>("");
  const [editedPosition, setEditedPosition] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  useEffect(() => {
    if (selectedUser) {
      setFirstName(selectedUser.firstname);
      setLastName(selectedUser.lastname);
      setEmail(selectedUser.email);
      setUsername(selectedUser.username);
      setContact(selectedUser.contact);
      setEditedBranch(selectedUser.branch);
      setEditedRole(selectedUser.role);
      setEditedBranchCode(selectedUser.branch_code);
      setEditedPosition(selectedUser.position);
    }
  }, [selectedUser]);

  const handleCancel = () => {
    // Reset state to selectedUser data
    if (selectedUser) {
      setFirstName(selectedUser.firstname);
      setLastName(selectedUser.lastname);
      setEmail(selectedUser.email);
      setUsername(selectedUser.username);
      setContact(selectedUser.contact);
      setEditedBranch(selectedUser.branch);
      setEditedBranchCode(selectedUser.branch_code);
      setEditedRole(selectedUser.role);
      setEditedPosition(selectedUser.position);
    }
    editModalClose();
  };

  const handleUpdate = async () => {
    if (
        firstname.trim() === "" ||
        lastname.trim() === "" ||
        email.trim() === "" ||
        username.trim() === "" ||
        contact.trim() === "" ||
        editedBranch.trim() === "" ||
        editedBranchCode.trim() === "" ||
        editedRole.trim() === "" ||
        editedPosition.trim() === ""
    ) {
        setErrorMessage("Please fill out all required fields.");
        return;
    }

    // Check if password is entered and matches confirmPassword
    if (password.trim() !== confirmPassword.trim()) {
        setErrorMessage("Passwords do not match.");
        return;
    }

    try {
        setLoading(true);
        const token = localStorage.getItem("token");
        // Define type for updatedData
        interface UpdatedData {
            id: any;
            firstName: string;
            lastName: string;
            email: string;
            userName: string;
            contact: string;
            branch: string;
            branch_code: string;
            role: string;
            position: string;
            password?: string; // Make password optional
        }
        // Create updatedData object
        const updatedData: UpdatedData = {
            id: selectedUser.id,
            firstName: firstname,
            lastName: lastname,
            email: email,
            userName: username,
            contact: contact,
            branch: editedBranch,
            branch_code: editedBranchCode,
            role: editedRole,
            position: editedPosition,
        };

        // Include password fields only if a new password is provided
        if (password.trim() !== "") {
            updatedData.password = password.trim();
        }

        const response = await axios.put(
            `http://localhost:8000/api/update-profile/${selectedUser.id}`,
            updatedData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Response from server:", response.data);
        refreshData();
        setLoading(false);
        openSuccessModal();
        setErrorMessage(""); // Clear error message on success
    } catch (error) {
        setErrorMessage("Failed to update user. Please try again.");
        console.error("Error updating user:", error);
    }
    setLoading(false);
};



  if (!editModal) {
    return null;
  }

  const fieldsConfig: { [key: string]: string[] } = {
    User: [
      "Firstname",
      "Lastname",
      "Email",
      "Username",
      "Contact",
      "Position",
      "Role",
      "Branch Code",
    ],
    Branch: ["Branch Name", "Branch Code"],
    Manager: ["Manager Name", "Manager ID", "Branch Code"],
  };

  const fields = fieldsConfig[entityType] || [];
  const pStyle = "font-medium w-full";
  const inputStyle = "border border-black rounded-md p-1 w-full";
  const roleOptions = [
    { label: "", value: "" },
    { label: "Accounting Clerk", value: "Accounting Clerk" },
    { label: "Accounting Manager", value: "Accounting Manager" },
    { label: "Accounting Staff", value: "Accounting Staff" },
    { label: "Accounting Supervisor", value: "Accounting Supervisor" },
    { label: "Admin", value: "Admin" },
    { label: "Area Manager", value: "Area Manager" },
    { label: "Assistant Manager", value: "Assistant Manager" },
    { label: "Assistant Web Developer", value: "Assistant Web Developer" },
    { label: "Audit Manager", value: "Audit Manager" },
    { label: "Audit Staff", value: "Audit Staff" },
    { label: "Audit Supervisor", value: "Audit Supervisor" },
    { label: "AVP - Finance", value: "AVP - Finance" },
    { label: "AVP - Sales and Marketing", value: "AVP - Sales and Marketing" },
    { label: "Branch Supervisor/Manager", value: "Branch Supervisor/Manager" },
    { label: "Cashier", value: "Cashier" },
    { label: "CEO", value: "CEO" },
    { label: "HR Manager", value: "HR Manager" },
    { label: "HR Staff", value: "HR Staff" },
    { label: "IT Staff", value: "IT Staff" },
    { label: "IT/Automation Manager", value: "IT/Automation Manager" },
    { label: "Juinor Web Developer", value: "Juinor Web Developer" },
    { label: "Managing Director", value: "Managing Director" },
    { label: "Payroll Manager", value: "Payroll Manager" },
    { label: "Payroll Staff", value: "Payroll Staff" },
    { label: "Sales Representative", value: "Sales Representative" },
    { label: "Senior Web Developer", value: "Senior Web Developer" },
    { label: "Vice - President", value: "Vice - President" },
    { label: "User", value: "User" },
  ];

  const branchOptions = [
    "Des Strong Appliance, Inc.",
    "Des Strong Motors, Inc.",
    "Strong Motocentrum, Inc.",
    "Honda Des, Inc.",
    "Head Office",
  ];
  const positionOptions = [
    { label: "", value: "" },
    { label: "Approver", value: "approver" },
    { label: "User", value: "User" },
    { label: "Area Manager", value: "Area Manager" },
    { label: "Admin", value: "Admin" },
  ];
const setPassowrder = (value:any) => {
  setPassword(value);
  if (confirmPassword !== '' && value !== confirmPassword) {
    setErrorMessage("Passwords do not match.");
  } else {
    setErrorMessage("");
  }
};

const setConfirmPasasdasword = (value:any) => {
  setConfirmPassword(value);
  if (password !== value) {
    setErrorMessage("Passwords do not match.");
  } else {
    setErrorMessage("");
  }
};
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 flex-col">
      <div className="p-4 w-10/12 md:w-2/5 relative bg-primary flex justify-center mx-20 border-b rounded-t-[12px]">
        <h2 className="text-center text-xl md:text-[32px] font-bold text-white">
          Edit {entityType}
        </h2>
        <XMarkIcon
          className="size-6 text-black absolute right-3 cursor-pointer"
          onClick={handleCancel}
        />
      </div>
      <div className="bg-white h-2/3 w-10/12 md:w-2/5 x-20 rounded-b-[12px] shadow-lg overflow-y-auto sm:h-2/3">
        <div className="mx-10 mt-10 grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Render input fields dynamically */}
          {fields.map((field, index) => (
            <div key={index}>
              <p className={`${pStyle}`}>{field}</p>
              {field === "Role" ? (
                <select
                  className={`${inputStyle}`}
                  value={editedRole}
                  onChange={(e) => setEditedRole(e.target.value)}
                >
                  {positionOptions.map((option, index) => (
                    <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                  ))}
                </select>
              ) : field === "Branch Code" ? (
                <input
                  type="text"
                  className={`${inputStyle}`}
                  value={editedBranchCode}
                  onChange={(e) => setEditedBranchCode(e.target.value)}
                />
              ) : (
                <>
                  {field === "Position" ? (
                    <select
                      className={`${inputStyle}`}
                      value={editedPosition}
                      onChange={(e) => setEditedPosition(e.target.value)}
                    >
                      {roleOptions.map((option, index) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field === "Branch Name" ? (
                    <select
                      className={`${inputStyle}`}
                      value={editedBranch}
                      onChange={(e) => setEditedBranch(e.target.value)}
                    >
                      {branchOptions.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) 
                : (
                    <input
                      type="text"
                      className={`${inputStyle}`}
                      value={
                        field === "Firstname"
                          ? firstname
                          : field === "Lastname"
                          ? lastname
                          : field === "Email"
                          ? email
                          : field === "Username"
                          ? username
                          : field === "Contact"
                          ? contact
                          : ""
                      }
                      onChange={(e) =>
                        field === "Firstname"
                          ? setFirstName(e.target.value)
                          : field === "Lastname"
                          ? setLastName(e.target.value)
                          : field === "Email"
                          ? setEmail(e.target.value)
                          : field === "Username"
                          ? setUsername(e.target.value)
                          : field === "Contact"
                          ? setContact(e.target.value)
                          : null
                      }
                    />
                  )}
                </>
              )}
            </div>
          ))}
          {/* Password fields */}
          {entityType === "User" && (
  <>
    <div>
      <p className={`${pStyle}`}>Enter Password</p>
      <div className="flex justify-center items-center relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className={`${inputStyle}`}
        />
        {showPassword ? (
          <EyeSlashIcon
            className="size-[24px] absolute right-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <EyeIcon
            className="size-[24px] absolute right-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
    </div>
    <div>
      <p className={`${pStyle}`}>Confirm Password</p>
      <div className="flex justify-center items-center relative w-full">
        <input
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          className={`${inputStyle}`}
        />
        {showConfirmPassword ? (
          <EyeSlashIcon
            className="size-[24px] absolute right-3 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        ) : (
          <EyeIcon
            className="size-[24px] absolute right-3 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        )}
      </div>
    </div>
  </>
)}
        </div>  
        <div className="mx-10 mt-4">
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        </div>
        <div className="flex justify-center mx-10 mt-6 lg:justify-end items-center space-x-2 md:mt-20 md:mr-10 mb-10">
          <button
            className="bg-[#9C9C9C] p-2 w-full h-14 lg:w-1/4 rounded-[12px] text-white font-medium"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="bg-primary p-2 w-full h-14 lg:w-1/4 rounded-[12px] text-white font-medium"
            onClick={handleUpdate}
          >
            {loading ? <ClipLoader color="#36d7b7" /> : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;

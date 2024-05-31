import React, { useState } from "react";
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
import ViewBranchModal from "./ViewBranchModal";

export type User = {
  id: number;
  branch: string;
  branch_address: string;
};

type Props = {};

type Record = {
  id: number;
  no: number;
  Branch: string;
  Branch_Address: string;
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
interface ViewBranchModalProps {
  modalIsOpen: boolean;
  closeModal: () => void;
  user: Record | null;
}

const pStyle = "font-medium";
const inputStyle = "border border-black rounded-md p-1";
const SetupBranch = (props: Props) => {
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
  const data = [
    {
      id: 1,
      no: "6404805863",
      Branch: "5th Floor",
      Branch_Address: "0269 Weeping Birch Avenue",
    },
    {
      id: 2,
      no: "1347805311",
      Branch: "PO Box 6704",
      Branch_Address: "51 Pond Avenue",
    },
    {
      id: 3,
      no: "6036703619",
      Branch: "17th Floor",
      Branch_Address: "72 Hanover Plaza",
    },
    {
      id: 4,
      no: "6448743146",
      Branch: "Suite 23",
      Branch_Address: "46 Esker Alley",
    },
    {
      id: 5,
      no: "1584481862",
      Branch: "Suite 17",
      Branch_Address: "271 Pawling Drive",
    },
    {
      id: 6,
      no: "6020876845",
      Branch: "Suite 59",
      Branch_Address: "073 Bultman Road",
    },
    {
      id: 7,
      no: "7202824345",
      Branch: "Apt 1997",
      Branch_Address: "1611 Morningstar Trail",
    },
    {
      id: 8,
      no: "2589722249",
      Branch: "13th Floor",
      Branch_Address: "37 School Junction",
    },
    {
      id: 9,
      no: "9136265853",
      Branch: "18th Floor",
      Branch_Address: "51749 Drewry Drive",
    },
    {
      id: 10,
      no: "8192482375",
      Branch: "PO Box 56991",
      Branch_Address: "077 Anderson Terrace",
    },
    {
      id: 11,
      no: "5357183104",
      Branch: "PO Box 79395",
      Branch_Address: "4559 Oak Center",
    },
    {
      id: 12,
      no: "2142277942",
      Branch: "Apt 1879",
      Branch_Address: "32 Merrick Alley",
    },
    {
      id: 13,
      no: "0478596898",
      Branch: "Room 1333",
      Branch_Address: "2 Buhler Junction",
    },
    {
      id: 14,
      no: "8972439916",
      Branch: "Apt 1156",
      Branch_Address: "7560 Express Trail",
    },
    {
      id: 15,
      no: "5320442904",
      Branch: "PO Box 65268",
      Branch_Address: "504 Fremont Pass",
    },
    {
      id: 16,
      no: "6531224746",
      Branch: "Suite 65",
      Branch_Address: "27 Sunbrook Street",
    },
    {
      id: 17,
      no: "4172976468",
      Branch: "PO Box 81887",
      Branch_Address: "7 Sugar Center",
    },
    {
      id: 18,
      no: "9229570583",
      Branch: "PO Box 83309",
      Branch_Address: "1008 Oakridge Way",
    },
    {
      id: 19,
      no: "8929245285",
      Branch: "PO Box 48061",
      Branch_Address: "65255 Milwaukee Junction",
    },
    {
      id: 20,
      no: "5582219439",
      Branch: "Apt 1865",
      Branch_Address: "6 Esch Way",
    },
    {
      id: 21,
      no: "9966201424",
      Branch: "Room 744",
      Branch_Address: "1 Sage Point",
    },
    {
      id: 22,
      no: "0605496412",
      Branch: "Apt 639",
      Branch_Address: "1564 Hagan Junction",
    },
    {
      id: 23,
      no: "0155993119",
      Branch: "Room 736",
      Branch_Address: "069 Atwood Point",
    },
    {
      id: 24,
      no: "6652428709",
      Branch: "PO Box 97374",
      Branch_Address: "7 Briar Crest Park",
    },
    {
      id: 25,
      no: "8345388779",
      Branch: "Suite 48",
      Branch_Address: "92 Randy Alley",
    },
    {
      id: 26,
      no: "5078654097",
      Branch: "Apt 505",
      Branch_Address: "2668 Londonderry Alley",
    },
    {
      id: 27,
      no: "7171449998",
      Branch: "Suite 38",
      Branch_Address: "23 Pankratz Terrace",
    },
    {
      id: 28,
      no: "8519082726",
      Branch: "Apt 1669",
      Branch_Address: "8247 Goodland Pass",
    },
    {
      id: 29,
      no: "3954647230",
      Branch: "Room 1909",
      Branch_Address: "75 Sloan Drive",
    },
    {
      id: 30,
      no: "9982077732",
      Branch: "Apt 1060",
      Branch_Address: "9466 Gerald Lane",
    },
    {
      id: 31,
      no: "6272376804",
      Branch: "Apt 1751",
      Branch_Address: "13 Hoepker Trail",
    },
    {
      id: 32,
      no: "8433127470",
      Branch: "20th Floor",
      Branch_Address: "676 Troy Center",
    },
    {
      id: 33,
      no: "2253543675",
      Branch: "Suite 39",
      Branch_Address: "942 1st Pass",
    },
    {
      id: 34,
      no: "4891891645",
      Branch: "3rd Floor",
      Branch_Address: "3277 Darwin Junction",
    },
    {
      id: 35,
      no: "3347504577",
      Branch: "Apt 217",
      Branch_Address: "19 Pawling Parkway",
    },
    {
      id: 36,
      no: "9121316813",
      Branch: "Apt 539",
      Branch_Address: "24218 Hansons Point",
    },
    {
      id: 37,
      no: "6809451854",
      Branch: "Apt 1155",
      Branch_Address: "184 Vermont Point",
    },
    {
      id: 38,
      no: "9164081737",
      Branch: "3rd Floor",
      Branch_Address: "92 Maple Wood Way",
    },
    {
      id: 39,
      no: "2459498888",
      Branch: "PO Box 75150",
      Branch_Address: "79 Myrtle Hill",
    },
    {
      id: 40,
      no: "5914473799",
      Branch: "Room 716",
      Branch_Address: "50 Muir Crossing",
    },
    {
      id: 41,
      no: "0397757212",
      Branch: "Apt 1246",
      Branch_Address: "4 Eastwood Pass",
    },
    {
      id: 42,
      no: "7462748673",
      Branch: "Room 1308",
      Branch_Address: "18 Marquette Way",
    },
    {
      id: 43,
      no: "6765497188",
      Branch: "1st Floor",
      Branch_Address: "1925 Mesta Plaza",
    },
    {
      id: 44,
      no: "7157971313",
      Branch: "Apt 665",
      Branch_Address: "6 Old Shore Crossing",
    },
    {
      id: 45,
      no: "5263662874",
      Branch: "2nd Floor",
      Branch_Address: "40807 Mcguire Center",
    },
    {
      id: 46,
      no: "2169456570",
      Branch: "5th Floor",
      Branch_Address: "4386 Golden Leaf Alley",
    },
    {
      id: 47,
      no: "7533464133",
      Branch: "Room 728",
      Branch_Address: "05580 Clarendon Parkway",
    },
    {
      id: 48,
      no: "8652200432",
      Branch: "PO Box 82509",
      Branch_Address: "9 Loeprich Road",
    },
    {
      id: 49,
      no: "3124273443",
      Branch: "Suite 24",
      Branch_Address: "137 Sage Point",
    },
    {
      id: 50,
      no: "4469466018",
      Branch: "10th Floor",
      Branch_Address: "7 Briar Crest Center",
    },
    {
      id: 51,
      no: "4442960879",
      Branch: "Apt 380",
      Branch_Address: "26826 Golden Leaf Street",
    },
    {
      id: 52,
      no: "5686249717",
      Branch: "Room 205",
      Branch_Address: "0288 Montana Street",
    },
    {
      id: 53,
      no: "1080122575",
      Branch: "2nd Floor",
      Branch_Address: "35 Dunning Trail",
    },
    {
      id: 54,
      no: "0262223392",
      Branch: "Suite 70",
      Branch_Address: "9 Aberg Alley",
    },
    {
      id: 55,
      no: "5336715034",
      Branch: "PO Box 91028",
      Branch_Address: "5281 Jana Court",
    },
    {
      id: 56,
      no: "6472513449",
      Branch: "Room 1898",
      Branch_Address: "0 Aberg Pass",
    },
    {
      id: 57,
      no: "2087987157",
      Branch: "Room 735",
      Branch_Address: "639 Commercial Lane",
    },
    {
      id: 58,
      no: "3832048197",
      Branch: "Suite 68",
      Branch_Address: "76534 American Ash Park",
    },
    {
      id: 59,
      no: "2510628429",
      Branch: "8th Floor",
      Branch_Address: "4754 Hovde Place",
    },
    {
      id: 60,
      no: "2747761371",
      Branch: "20th Floor",
      Branch_Address: "1 Wayridge Trail",
    },
    {
      id: 61,
      no: "6476174576",
      Branch: "Suite 96",
      Branch_Address: "67047 Esch Circle",
    },
    {
      id: 62,
      no: "5897836396",
      Branch: "Suite 98",
      Branch_Address: "345 Wayridge Park",
    },
    {
      id: 63,
      no: "0004187555",
      Branch: "PO Box 72668",
      Branch_Address: "6328 Golden Leaf Junction",
    },
    {
      id: 64,
      no: "0928987752",
      Branch: "Suite 100",
      Branch_Address: "145 Walton Lane",
    },
    {
      id: 65,
      no: "3773383622",
      Branch: "Room 761",
      Branch_Address: "7 Longview Lane",
    },
    {
      id: 66,
      no: "2312278162",
      Branch: "Room 611",
      Branch_Address: "897 Arizona Avenue",
    },
    {
      id: 67,
      no: "4309280714",
      Branch: "Room 1927",
      Branch_Address: "4 Northfield Point",
    },
    {
      id: 68,
      no: "3866183550",
      Branch: "Suite 47",
      Branch_Address: "2284 Caliangt Way",
    },
    {
      id: 69,
      no: "9213375549",
      Branch: "PO Box 74076",
      Branch_Address: "7939 Lighthouse Bay Way",
    },
    {
      id: 70,
      no: "3747132812",
      Branch: "Room 1108",
      Branch_Address: "49266 Burning Wood Trail",
    },
    {
      id: 71,
      no: "4776721317",
      Branch: "PO Box 2619",
      Branch_Address: "46657 Fulton Junction",
    },
    {
      id: 72,
      no: "0651146925",
      Branch: "Suite 51",
      Branch_Address: "58 Spaight Drive",
    },
    {
      id: 73,
      no: "3159833615",
      Branch: "Suite 53",
      Branch_Address: "7078 Mallard Road",
    },
    {
      id: 74,
      no: "0828987890",
      Branch: "Room 420",
      Branch_Address: "0 Texas Place",
    },
    {
      id: 75,
      no: "0538716061",
      Branch: "Room 1148",
      Branch_Address: "44175 Doe Crossing Circle",
    },
    {
      id: 76,
      no: "2572492008",
      Branch: "7th Floor",
      Branch_Address: "504 Fallview Center",
    },
    {
      id: 77,
      no: "7977965801",
      Branch: "Suite 54",
      Branch_Address: "5 Lunder Place",
    },
    {
      id: 78,
      no: "8295260561",
      Branch: "7th Floor",
      Branch_Address: "2 Westport Way",
    },
    {
      id: 79,
      no: "3167247134",
      Branch: "14th Floor",
      Branch_Address: "9 South Alley",
    },
    {
      id: 80,
      no: "3471176438",
      Branch: "PO Box 7498",
      Branch_Address: "1571 Westerfield Hill",
    },
    {
      id: 81,
      no: "9901170176",
      Branch: "Apt 770",
      Branch_Address: "68377 Shopko Crossing",
    },
    {
      id: 82,
      no: "0182217876",
      Branch: "PO Box 69040",
      Branch_Address: "39616 Derek Parkway",
    },
    {
      id: 83,
      no: "6125998169",
      Branch: "14th Floor",
      Branch_Address: "87397 Rigney Crossing",
    },
    {
      id: 84,
      no: "3474149431",
      Branch: "Room 850",
      Branch_Address: "55316 Continental Point",
    },
    {
      id: 85,
      no: "5778531583",
      Branch: "Suite 18",
      Branch_Address: "61 Granby Trail",
    },
    {
      id: 86,
      no: "4930244536",
      Branch: "Suite 77",
      Branch_Address: "12332 Bunting Pass",
    },
    {
      id: 87,
      no: "5143987253",
      Branch: "Room 206",
      Branch_Address: "2 Beilfuss Circle",
    },
    {
      id: 88,
      no: "9307446636",
      Branch: "Room 1020",
      Branch_Address: "92 Pennsylvania Crossing",
    },
    {
      id: 89,
      no: "2677021226",
      Branch: "PO Box 23271",
      Branch_Address: "9628 Lien Junction",
    },
    {
      id: 90,
      no: "8960874213",
      Branch: "PO Box 81176",
      Branch_Address: "6958 Roxbury Drive",
    },
    {
      id: 91,
      no: "5430639710",
      Branch: "Suite 66",
      Branch_Address: "35926 Myrtle Crossing",
    },
    {
      id: 92,
      no: "8127536512",
      Branch: "Suite 50",
      Branch_Address: "5491 Hoepker Court",
    },
    {
      id: 93,
      no: "5327623890",
      Branch: "Apt 1273",
      Branch_Address: "94 Ohio Court",
    },
    {
      id: 94,
      no: "7518844028",
      Branch: "PO Box 20225",
      Branch_Address: "6961 Blue Bill Park Place",
    },
    {
      id: 95,
      no: "4034506431",
      Branch: "Room 417",
      Branch_Address: "76491 Maple Lane",
    },
    {
      id: 96,
      no: "2024760635",
      Branch: "8th Floor",
      Branch_Address: "66627 Loomis Way",
    },
    {
      id: 97,
      no: "2839111764",
      Branch: "Room 26",
      Branch_Address: "1599 Heffernan Trail",
    },
    {
      id: 98,
      no: "4180564394",
      Branch: "Suite 69",
      Branch_Address: "07269 Cherokee Drive",
    },
    {
      id: 99,
      no: "4704058948",
      Branch: "Apt 842",
      Branch_Address: "77 Rigney Point",
    },
    {
      id: 100,
      no: "5276925682",
      Branch: "PO Box 6934",
      Branch_Address: "7372 Spaight Pass",
    },
  ];

  const columns = [
    {
      name: "ID",
      selector: (row: Record) => row.id,
      width: "60px",
    },
    {
      name: "No",
      selector: (row: Record) => row.no,
    },
    {
      name: "Branch ",
      selector: (row: Record) => row.Branch,
    },
    {
      name: "Branch Address",
      selector: (row: Record) => row.Branch_Address,
    },
    {
      name: "Modify",
      cell: (row: Record) => (
        <div className="flex space-x-2">
          <PencilSquareIcon
            className="text-primary size-8 cursor-pointer "
            onClick={editModalShow}
          />
          <TrashIcon
            className="text-[#A30D11] size-8 cursor-pointer"
            onClick={deleteModalShow}
          />
          
        </div>
      ),
    },
  ];

  return (
    <div className="bg-graybg dark:bg-blackbg h-full w-full pt-4 px-4 sm:px-10 md:px-10 lg:px-30 xl:px-30">
      <div className=" h-auto drop-shadow-lg rounded-lg md:mr-4 w-full ">
        <div className="bg-white rounded-lg w-full flex flex-col overflow-x-auto">
          <h1 className="pl-4 sm:pl-[30px] text-[24px] text-left py-4 text-primary font-bold mr-2 underline decoration-2 underline-offset-8">
            Branch
          </h1>
          <div className="flex items-end justify-between mx-2 bg-white">
            <div>
              <input type="text" placeholder="Search" className={inputStyle} />
            </div>
            <div>
              <button
                className="bg-primary text-white rounded-[12px] p-1"
                onClick={openModal}
              >
                + Add Branch
              </button>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={data.map((item) => ({ ...item, no: parseInt(item.no) }))}
            pagination
            striped
            customStyles={tableCustomStyles}
          />
        </div>
      </div>
      <AddUserModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        openCompleteModal={openCompleteModal}
        entityType="Branch"
      />
      <DeleteModal
        deleteModal={deleteModal}
        closeDeleteModal={closeDeleteModal}
        openDeleteSuccessModal={openDeleteSuccessModal}
        entityType="Branch"
      />
      <DeleteSuccessModal
        showDeleteSuccessModal={showDeletedSuccessModal}
        closeDeleteSuccessModal={closeDeleteSuccessModal}
        openDeleteSuccessModal={openDeleteSuccessModal}
        entityType="Branch"
      />
      <CompleteModal
        showCompleteModal={showCompleteModal}
        closeCompleteModal={closeCompleteModal}
        openCompleteModal={openCompleteModal}
        entityType="Branch"
      />
      <EditUserModal
        editModal={editModal}
        editModalClose={editModalClose}
        openSuccessModal={openSuccessModal}
        entityType="Branch"
      />
      <ViewBranchModal
        modalIsOpen={viewModalIsOpen}
        closeModal={viewModalClose}
        user={selectedUser}
      />
    </div>
  );
};

export default SetupBranch;

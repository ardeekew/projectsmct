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
import ViewApproverModal from "./ViewApproverModal";


type Props = {};

type Record = {
  id: number;
  no: number;
  assigned_branches: string;
  name: string;
  approvers: string;
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
const SetupApprover = (props: Props) => {
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
      no: "1247494152",
      assigned_branches: "Room 854",
      name: "Morissa",
      approvers: "Cripps",
    },
    {
      id: 2,
      no: "6530431381",
      assigned_branches: "Apt 864",
      name: "Yale",
      approvers: "Coraini",
    },
    {
      id: 3,
      no: "4540479148",
      assigned_branches: "Suite 4",
      name: "Erena",
      approvers: "Dalliston",
    },
    {
      id: 4,
      no: "2692593332",
      assigned_branches: "Suite 32",
      name: "Fee",
      approvers: "Dollard",
    },
    {
      id: 5,
      no: "0559513313",
      assigned_branches: "Apt 545",
      name: "Adolph",
      approvers: "Dorie",
    },
    {
      id: 6,
      no: "0235423157",
      assigned_branches: "Apt 1531",
      name: "Purcell",
      approvers: "Dulany",
    },
    {
      id: 7,
      no: "3742927051",
      assigned_branches: "PO Box 3829",
      name: "Torrin",
      approvers: "Gettins",
    },
    {
      id: 8,
      no: "3732494713",
      assigned_branches: "12th Floor",
      name: "Brandyn",
      approvers: "Scattergood",
    },
    {
      id: 9,
      no: "5600830505",
      assigned_branches: "Room 1950",
      name: "Faina",
      approvers: "Peete",
    },
    {
      id: 10,
      no: "8923087165",
      assigned_branches: "Suite 34",
      name: "Constanta",
      approvers: "Donkersley",
    },
    {
      id: 11,
      no: "9821763758",
      assigned_branches: "11th Floor",
      name: "Lynne",
      approvers: "Solano",
    },
    {
      id: 12,
      no: "1492984973",
      assigned_branches: "Apt 723",
      name: "Sanford",
      approvers: "Kiljan",
    },
    {
      id: 13,
      no: "1427264872",
      assigned_branches: "Room 36",
      name: "Bobine",
      approvers: "Pritchard",
    },
    {
      id: 14,
      no: "0666338507",
      assigned_branches: "PO Box 40100",
      name: "Spense",
      approvers: "Rosenblad",
    },
    {
      id: 15,
      no: "5697246633",
      assigned_branches: "Apt 289",
      name: "Kenton",
      approvers: "Binton",
    },
    {
      id: 16,
      no: "5550009110",
      assigned_branches: "3rd Floor",
      name: "Mercedes",
      approvers: "Abelovitz",
    },
    {
      id: 17,
      no: "9577391435",
      assigned_branches: "Room 1857",
      name: "Cob",
      approvers: "Attride",
    },
    {
      id: 18,
      no: "1213027667",
      assigned_branches: "Suite 72",
      name: "Errol",
      approvers: "Monckton",
    },
    {
      id: 19,
      no: "2135749818",
      assigned_branches: "Suite 10",
      name: "Beryle",
      approvers: "Roalfe",
    },
    {
      id: 20,
      no: "3546397835",
      assigned_branches: "Suite 10",
      name: "Charlotte",
      approvers: "MacHoste",
    },
    {
      id: 21,
      no: "3878290799",
      assigned_branches: "Suite 93",
      name: "Tallie",
      approvers: "Lerigo",
    },
    {
      id: 22,
      no: "0544688147",
      assigned_branches: "Apt 214",
      name: "Natalya",
      approvers: "Staton",
    },
    {
      id: 23,
      no: "4616056382",
      assigned_branches: "Room 485",
      name: "Roanna",
      approvers: "Laughnan",
    },
    {
      id: 24,
      no: "0681946180",
      assigned_branches: "Suite 88",
      name: "Natalee",
      approvers: "Renfrew",
    },
    {
      id: 25,
      no: "0504643622",
      assigned_branches: "Suite 71",
      name: "Shandra",
      approvers: "Fanner",
    },
    {
      id: 26,
      no: "6921140512",
      assigned_branches: "8th Floor",
      name: "Skell",
      approvers: "Prier",
    },
    {
      id: 27,
      no: "9470218329",
      assigned_branches: "Apt 332",
      name: "Onfroi",
      approvers: "Oliveras",
    },
    {
      id: 28,
      no: "6085169337",
      assigned_branches: "PO Box 84313",
      name: "Stavros",
      approvers: "Matiashvili",
    },
    {
      id: 29,
      no: "3363280254",
      assigned_branches: "Room 1497",
      name: "Caye",
      approvers: "Pindar",
    },
    {
      id: 30,
      no: "8047935763",
      assigned_branches: "Room 1490",
      name: "Gerti",
      approvers: "Dreschler",
    },
    {
      id: 31,
      no: "2719942154",
      assigned_branches: "Room 1302",
      name: "Grover",
      approvers: "Teissier",
    },
    {
      id: 32,
      no: "7105734922",
      assigned_branches: "15th Floor",
      name: "Shelbi",
      approvers: "Fritter",
    },
    {
      id: 33,
      no: "0673046664",
      assigned_branches: "Apt 635",
      name: "Dennet",
      approvers: "Bolzmann",
    },
    {
      id: 34,
      no: "4685236416",
      assigned_branches: "Suite 37",
      name: "Ava",
      approvers: "Keward",
    },
    {
      id: 35,
      no: "3668121524",
      assigned_branches: "Apt 256",
      name: "Natalie",
      approvers: "Chinn",
    },
    {
      id: 36,
      no: "0947858733",
      assigned_branches: "Room 197",
      name: "Elsie",
      approvers: "Grandison",
    },
    {
      id: 37,
      no: "6157568038",
      assigned_branches: "Suite 67",
      name: "Jerald",
      approvers: "Cuniam",
    },
    {
      id: 38,
      no: "0930266390",
      assigned_branches: "2nd Floor",
      name: "Dalila",
      approvers: "Bartle",
    },
    {
      id: 39,
      no: "6577857555",
      assigned_branches: "Suite 15",
      name: "Emelyne",
      approvers: "Strond",
    },
    {
      id: 40,
      no: "1614951624",
      assigned_branches: "20th Floor",
      name: "Averil",
      approvers: "Grigolli",
    },
    {
      id: 41,
      no: "7243057063",
      assigned_branches: "Room 1140",
      name: "Essy",
      approvers: "Oxx",
    },
    {
      id: 42,
      no: "4276199964",
      assigned_branches: "5th Floor",
      name: "Gae",
      approvers: "Brouwer",
    },
    {
      id: 43,
      no: "0347947034",
      assigned_branches: "Room 619",
      name: "Moshe",
      approvers: "Doncom",
    },
    {
      id: 44,
      no: "0507075048",
      assigned_branches: "11th Floor",
      name: "Hyacintha",
      approvers: "Grinikhinov",
    },
    {
      id: 45,
      no: "2840155907",
      assigned_branches: "Suite 6",
      name: "Pepillo",
      approvers: "Sawyers",
    },
    {
      id: 46,
      no: "6556729248",
      assigned_branches: "Room 576",
      name: "Uriah",
      approvers: "Rames",
    },
    {
      id: 47,
      no: "7707328167",
      assigned_branches: "11th Floor",
      name: "Floris",
      approvers: "Askie",
    },
    {
      id: 48,
      no: "2919435396",
      assigned_branches: "Apt 1138",
      name: "Dorian",
      approvers: "Croutear",
    },
    {
      id: 49,
      no: "5047741281",
      assigned_branches: "Apt 1522",
      name: "Kamila",
      approvers: "Oats",
    },
    {
      id: 50,
      no: "1098571894",
      assigned_branches: "Room 309",
      name: "Katheryn",
      approvers: "Dearn",
    },
    {
      id: 51,
      no: "5666972375",
      assigned_branches: "2nd Floor",
      name: "Ev",
      approvers: "Fewings",
    },
    {
      id: 52,
      no: "5330515319",
      assigned_branches: "Suite 65",
      name: "Millisent",
      approvers: "Drew-Clifton",
    },
    {
      id: 53,
      no: "7630266987",
      assigned_branches: "Apt 248",
      name: "Laina",
      approvers: "Hattoe",
    },
    {
      id: 54,
      no: "6445841252",
      assigned_branches: "2nd Floor",
      name: "Barby",
      approvers: "Deacon",
    },
    {
      id: 55,
      no: "4016029503",
      assigned_branches: "Room 1556",
      name: "Brenda",
      approvers: "Rolf",
    },
    {
      id: 56,
      no: "5139691760",
      assigned_branches: "Room 80",
      name: "Carmelia",
      approvers: "Voase",
    },
    {
      id: 57,
      no: "1956442065",
      assigned_branches: "18th Floor",
      name: "Archibold",
      approvers: "Hanton",
    },
    {
      id: 58,
      no: "3084798052",
      assigned_branches: "PO Box 9213",
      name: "Philippine",
      approvers: "Cobby",
    },
    {
      id: 59,
      no: "9695834450",
      assigned_branches: "Suite 32",
      name: "Tuck",
      approvers: "Atyeo",
    },
    {
      id: 60,
      no: "8380089596",
      assigned_branches: "Suite 27",
      name: "Kinna",
      approvers: "Dale",
    },
    {
      id: 61,
      no: "7991768635",
      assigned_branches: "Suite 77",
      name: "Rancell",
      approvers: "Ferrick",
    },
    {
      id: 62,
      no: "2443598683",
      assigned_branches: "PO Box 89646",
      name: "Ralf",
      approvers: "Diffley",
    },
    {
      id: 63,
      no: "2248068204",
      assigned_branches: "Apt 1154",
      name: "Mitzi",
      approvers: "Conboy",
    },
    {
      id: 64,
      no: "4125701660",
      assigned_branches: "PO Box 77138",
      name: "Deloris",
      approvers: "Durdan",
    },
    {
      id: 65,
      no: "9477278033",
      assigned_branches: "Room 530",
      name: "Darnall",
      approvers: "Van der Kruys",
    },
    {
      id: 66,
      no: "3526439281",
      assigned_branches: "Suite 14",
      name: "Freeland",
      approvers: "Stygall",
    },
    {
      id: 67,
      no: "1770648054",
      assigned_branches: "Apt 655",
      name: "Basilio",
      approvers: "Lutty",
    },
    {
      id: 68,
      no: "3862812049",
      assigned_branches: "Apt 1006",
      name: "Man",
      approvers: "Riddett",
    },
    {
      id: 69,
      no: "1223196259",
      assigned_branches: "8th Floor",
      name: "Vincenz",
      approvers: "Ilyinski",
    },
    {
      id: 70,
      no: "0659068257",
      assigned_branches: "PO Box 88218",
      name: "Natasha",
      approvers: "Kleinholz",
    },
    {
      id: 71,
      no: "9999297870",
      assigned_branches: "13th Floor",
      name: "Clemente",
      approvers: "England",
    },
    {
      id: 72,
      no: "0945295111",
      assigned_branches: "Suite 13",
      name: "Nariko",
      approvers: "Kunisch",
    },
    {
      id: 73,
      no: "5525896443",
      assigned_branches: "Suite 38",
      name: "Emanuele",
      approvers: "Mytton",
    },
    {
      id: 74,
      no: "0620860839",
      assigned_branches: "PO Box 41977",
      name: "Isac",
      approvers: "Pockett",
    },
    {
      id: 75,
      no: "1332847730",
      assigned_branches: "Room 528",
      name: "Delphinia",
      approvers: "Sinkin",
    },
    {
      id: 76,
      no: "5708359811",
      assigned_branches: "Room 1777",
      name: "Dory",
      approvers: "Olech",
    },
    {
      id: 77,
      no: "3519879395",
      assigned_branches: "Suite 75",
      name: "Gray",
      approvers: "Pedican",
    },
    {
      id: 78,
      no: "6072113974",
      assigned_branches: "10th Floor",
      name: "Stefa",
      approvers: "Blaydon",
    },
    {
      id: 79,
      no: "4561848908",
      assigned_branches: "PO Box 97634",
      name: "Merralee",
      approvers: "Kubik",
    },
    {
      id: 80,
      no: "0635491117",
      assigned_branches: "PO Box 73290",
      name: "Davina",
      approvers: "Sline",
    },
    {
      id: 81,
      no: "3293443222",
      assigned_branches: "3rd Floor",
      name: "Lorraine",
      approvers: "Wherrett",
    },
    {
      id: 82,
      no: "8910333553",
      assigned_branches: "Suite 4",
      name: "Martyn",
      approvers: "Cacacie",
    },
    {
      id: 83,
      no: "8021545151",
      assigned_branches: "Room 188",
      name: "Granger",
      approvers: "Oakly",
    },
    {
      id: 84,
      no: "7567180987",
      assigned_branches: "18th Floor",
      name: "Olivero",
      approvers: "Overnell",
    },
    {
      id: 85,
      no: "8299604176",
      assigned_branches: "6th Floor",
      name: "Kristos",
      approvers: "Zanitti",
    },
    {
      id: 86,
      no: "8817123781",
      assigned_branches: "Apt 489",
      name: "Daune",
      approvers: "Morit",
    },
    {
      id: 87,
      no: "2776383576",
      assigned_branches: "Apt 933",
      name: "Carlos",
      approvers: "De Zuani",
    },
    {
      id: 88,
      no: "3697832638",
      assigned_branches: "16th Floor",
      name: "Joshia",
      approvers: "Denford",
    },
    {
      id: 89,
      no: "2145873201",
      assigned_branches: "PO Box 79612",
      name: "Layton",
      approvers: "Middup",
    },
    {
      id: 90,
      no: "8076543908",
      assigned_branches: "Suite 83",
      name: "Megen",
      approvers: "O'Doherty",
    },
    {
      id: 91,
      no: "6909821408",
      assigned_branches: "8th Floor",
      name: "Blondy",
      approvers: "Elkin",
    },
    {
      id: 92,
      no: "7649575810",
      assigned_branches: "Room 1320",
      name: "Carmela",
      approvers: "Gooderridge",
    },
    {
      id: 93,
      no: "4336092052",
      assigned_branches: "Room 1159",
      name: "Fredek",
      approvers: "Orvis",
    },
    {
      id: 94,
      no: "8103372293",
      assigned_branches: "Room 1759",
      name: "Gayle",
      approvers: "Mattack",
    },
    {
      id: 95,
      no: "6935153158",
      assigned_branches: "14th Floor",
      name: "Erminia",
      approvers: "Hagyard",
    },
    {
      id: 96,
      no: "8950926601",
      assigned_branches: "Suite 5",
      name: "Judie",
      approvers: "Sarsons",
    },
    {
      id: 97,
      no: "7101210058",
      assigned_branches: "Room 1958",
      name: "Rance",
      approvers: "Skocroft",
    },
    {
      id: 98,
      no: "0365370045",
      assigned_branches: "Room 200",
      name: "Frederique",
      approvers: "Hunton",
    },
    {
      id: 99,
      no: "3275112880",
      assigned_branches: "Room 1139",
      name: "Hershel",
      approvers: "Demogeot",
    },
    {
      id: 100,
      no: "8298439872",
      assigned_branches: "PO Box 89722",
      name: "Randell",
      approvers: "Josselsohn",
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
      name: "Assigned Branches ",
      selector: (row: Record) => row.assigned_branches,
    },
    {
      name: "Name",
      selector: (row: Record) => row.name,
    },
    {
      name: "Approvers",
      selector: (row: Record) => row.approvers,
      cell: (row: Record) => (
        <div className="bg-primary rounded-[12px] text-white py-1 px-2">
          {row.approvers}
        </div>
      ),
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
          <button
            className="bg-primary text-white  px-4 rounded-[12px]"
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
          <div className="flex items-end justify-between mx-2 bg-white">
            <div>
              <input type="text" placeholder="Search" className={inputStyle} />
            </div>
            <div>
              <button
                className="bg-primary text-white rounded-[12px] p-1"
                onClick={openModal}
              >
                + Create New
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
      <ViewApproverModal
        modalIsOpen={viewModalIsOpen}
        closeModal={viewModalClose}
        user={selectedUser || null}
      />
    </div>
  );
};

export default SetupApprover;

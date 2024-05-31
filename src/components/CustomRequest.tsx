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
import AddCustomModal from "./AddCustomModal";


type Props = {};

type Record = {
  id: number;
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
  const data = [{
    "id": 1,
    "name": "Bentley Clark",
    "approvers": "Bentley"
  }, {
    "id": 2,
    "name": "Gareth Tyrie",
    "approvers": "Gareth"
  }, {
    "id": 3,
    "name": "Slade Rawood",
    "approvers": "Slade"
  }, {
    "id": 4,
    "name": "Lida Carbonell",
    "approvers": "Lida"
  }, {
    "id": 5,
    "name": "Gail Sidon",
    "approvers": "Gail"
  }, {
    "id": 6,
    "name": "Nelle De La Coste",
    "approvers": "Nelle"
  }, {
    "id": 7,
    "name": "Neale Gillet",
    "approvers": "Neale"
  }, {
    "id": 8,
    "name": "Randie Creavan",
    "approvers": "Randie"
  }, {
    "id": 9,
    "name": "Claudelle Volks",
    "approvers": "Claudelle"
  }, {
    "id": 10,
    "name": "Avictor Gori",
    "approvers": "Avictor"
  }, {
    "id": 11,
    "name": "Paulina Arlow",
    "approvers": "Paulina"
  }, {
    "id": 12,
    "name": "Jaimie Tanzig",
    "approvers": "Jaimie"
  }, {
    "id": 13,
    "name": "Giraldo Rydings",
    "approvers": "Giraldo"
  }, {
    "id": 14,
    "name": "Harland Logsdail",
    "approvers": "Harland"
  }, {
    "id": 15,
    "name": "Serene Pfiffer",
    "approvers": "Serene"
  }, {
    "id": 16,
    "name": "Quintana Arnow",
    "approvers": "Quintana"
  }, {
    "id": 17,
    "name": "Evangelina Traut",
    "approvers": "Evangelina"
  }, {
    "id": 18,
    "name": "Burke Hoodlass",
    "approvers": "Burke"
  }, {
    "id": 19,
    "name": "Iolanthe Pinckstone",
    "approvers": "Iolanthe"
  }, {
    "id": 20,
    "name": "Justus Haselwood",
    "approvers": "Justus"
  }, {
    "id": 21,
    "name": "Royce Cubbini",
    "approvers": "Royce"
  }, {
    "id": 22,
    "name": "Eran Gayle",
    "approvers": "Eran"
  }, {
    "id": 23,
    "name": "Wenda O'Keeffe",
    "approvers": "Wenda"
  }, {
    "id": 24,
    "name": "Heda Maestro",
    "approvers": "Heda"
  }, {
    "id": 25,
    "name": "Sid Gerrett",
    "approvers": "Sid"
  }, {
    "id": 26,
    "name": "Hubert Crampin",
    "approvers": "Hubert"
  }, {
    "id": 27,
    "name": "Galven Maynard",
    "approvers": "Galven"
  }, {
    "id": 28,
    "name": "Benedick D'Cruze",
    "approvers": "Benedick"
  }, {
    "id": 29,
    "name": "Jefferson Goldster",
    "approvers": "Jefferson"
  }, {
    "id": 30,
    "name": "Wyn Louedey",
    "approvers": "Wyn"
  }, {
    "id": 31,
    "name": "Maggi Caso",
    "approvers": "Maggi"
  }, {
    "id": 32,
    "name": "Roseanna Erickssen",
    "approvers": "Roseanna"
  }, {
    "id": 33,
    "name": "Aldric Mawditt",
    "approvers": "Aldric"
  }, {
    "id": 34,
    "name": "Kennith Lissaman",
    "approvers": "Kennith"
  }, {
    "id": 35,
    "name": "Esmaria Balston",
    "approvers": "Esmaria"
  }, {
    "id": 36,
    "name": "Tris Toderbrugge",
    "approvers": "Tris"
  }, {
    "id": 37,
    "name": "Torie Sallarie",
    "approvers": "Torie"
  }, {
    "id": 38,
    "name": "Obadiah Purse",
    "approvers": "Obadiah"
  }, {
    "id": 39,
    "name": "Jacki Trighton",
    "approvers": "Jacki"
  }, {
    "id": 40,
    "name": "Raddy Moatt",
    "approvers": "Raddy"
  }, {
    "id": 41,
    "name": "Adena Scullin",
    "approvers": "Adena"
  }, {
    "id": 42,
    "name": "Kendal Staniland",
    "approvers": "Kendal"
  }, {
    "id": 43,
    "name": "Brigida Vonderdell",
    "approvers": "Brigida"
  }, {
    "id": 44,
    "name": "Retha Zanni",
    "approvers": "Retha"
  }, {
    "id": 45,
    "name": "Bary MacDavitt",
    "approvers": "Bary"
  }, {
    "id": 46,
    "name": "Elissa Aron",
    "approvers": "Elissa"
  }, {
    "id": 47,
    "name": "Othilie Andree",
    "approvers": "Othilie"
  }, {
    "id": 48,
    "name": "Tobe Beardsworth",
    "approvers": "Tobe"
  }, {
    "id": 49,
    "name": "Chrystal Buxsy",
    "approvers": "Chrystal"
  }, {
    "id": 50,
    "name": "Ramon Nilges",
    "approvers": "Ramon"
  }, {
    "id": 51,
    "name": "Mada Walbridge",
    "approvers": "Mada"
  }, {
    "id": 52,
    "name": "Lebbie Onraet",
    "approvers": "Lebbie"
  }, {
    "id": 53,
    "name": "Bernardine Lune",
    "approvers": "Bernardine"
  }, {
    "id": 54,
    "name": "Pollyanna Cassell",
    "approvers": "Pollyanna"
  }, {
    "id": 55,
    "name": "Piotr Blowfelde",
    "approvers": "Piotr"
  }, {
    "id": 56,
    "name": "Garey O'Carran",
    "approvers": "Garey"
  }, {
    "id": 57,
    "name": "Cecil Minghi",
    "approvers": "Cecil"
  }, {
    "id": 58,
    "name": "Crista Pllu",
    "approvers": "Crista"
  }, {
    "id": 59,
    "name": "Iorgo O' Hanvey",
    "approvers": "Iorgo"
  }, {
    "id": 60,
    "name": "Lissa Benardette",
    "approvers": "Lissa"
  }, {
    "id": 61,
    "name": "Alfy Folbig",
    "approvers": "Alfy"
  }, {
    "id": 62,
    "name": "Devi Rapin",
    "approvers": "Devi"
  }, {
    "id": 63,
    "name": "Eleonora Stiegar",
    "approvers": "Eleonora"
  }, {
    "id": 64,
    "name": "Gordon Hannaway",
    "approvers": "Gordon"
  }, {
    "id": 65,
    "name": "Karlyn Wibberley",
    "approvers": "Karlyn"
  }, {
    "id": 66,
    "name": "Richmond Moreinis",
    "approvers": "Richmond"
  }, {
    "id": 67,
    "name": "Farlie Shurmore",
    "approvers": "Farlie"
  }, {
    "id": 68,
    "name": "Odelle Lucy",
    "approvers": "Odelle"
  }, {
    "id": 69,
    "name": "Rosabella Heliet",
    "approvers": "Rosabella"
  }, {
    "id": 70,
    "name": "Katinka Dorward",
    "approvers": "Katinka"
  }, {
    "id": 71,
    "name": "Stevena Grassick",
    "approvers": "Stevena"
  }, {
    "id": 72,
    "name": "Marge Basnall",
    "approvers": "Marge"
  }, {
    "id": 73,
    "name": "Kiah Devitt",
    "approvers": "Kiah"
  }, {
    "id": 74,
    "name": "Richard Gopsall",
    "approvers": "Richard"
  }, {
    "id": 75,
    "name": "Bogart Buckberry",
    "approvers": "Bogart"
  }, {
    "id": 76,
    "name": "Joli Sebyer",
    "approvers": "Joli"
  }, {
    "id": 77,
    "name": "Alfreda Hyams",
    "approvers": "Alfreda"
  }, {
    "id": 78,
    "name": "Leshia Roust",
    "approvers": "Leshia"
  }, {
    "id": 79,
    "name": "Dmitri Loftie",
    "approvers": "Dmitri"
  }, {
    "id": 80,
    "name": "Benji Prestedge",
    "approvers": "Benji"
  }, {
    "id": 81,
    "name": "Rochelle Brimfield",
    "approvers": "Rochelle"
  }, {
    "id": 82,
    "name": "Wilt Sartin",
    "approvers": "Wilt"
  }, {
    "id": 83,
    "name": "Gelya Hedlestone",
    "approvers": "Gelya"
  }, {
    "id": 84,
    "name": "Beatrix Lyal",
    "approvers": "Beatrix"
  }, {
    "id": 85,
    "name": "Allegra Dovinson",
    "approvers": "Allegra"
  }, {
    "id": 86,
    "name": "Christiano Rohmer",
    "approvers": "Christiano"
  }, {
    "id": 87,
    "name": "Buddy Kowalski",
    "approvers": "Buddy"
  }, {
    "id": 88,
    "name": "Grata Rigby",
    "approvers": "Grata"
  }, {
    "id": 89,
    "name": "Elli Tondeur",
    "approvers": "Elli"
  }, {
    "id": 90,
    "name": "Adelaida Wagen",
    "approvers": "Adelaida"
  }, {
    "id": 91,
    "name": "Arin Starcks",
    "approvers": "Arin"
  }, {
    "id": 92,
    "name": "Donia Bunford",
    "approvers": "Donia"
  }, {
    "id": 93,
    "name": "Eleen Balfour",
    "approvers": "Eleen"
  }, {
    "id": 94,
    "name": "Grady Dawes",
    "approvers": "Grady"
  }, {
    "id": 95,
    "name": "Winona Marris",
    "approvers": "Winona"
  }, {
    "id": 96,
    "name": "Leanna Agneau",
    "approvers": "Leanna"
  }, {
    "id": 97,
    "name": "Axe Dighton",
    "approvers": "Axe"
  }, {
    "id": 98,
    "name": "Tilda Baroux",
    "approvers": "Tilda"
  }, {
    "id": 99,
    "name": "Lilias Brader",
    "approvers": "Lilias"
  }, {
    "id": 100,
    "name": "Cordy Davidowich",
    "approvers": "Cordy"
  }]

  const columns = [
    {
      name: "ID",
      selector: (row: Record) => row.id,
      width: "20%",
    },
    {
      name: "Name",
      selector: (row: Record) => row.name,
      width: "30%",
    },
    {
      name: "Approvers",
      selector: (row: Record) => row.approvers,
      width: "35%",
      cell: (row: Record) => (
        <div className="bg-primary rounded-[12px]  text-white py-1 px-2">
          {row.approvers}
        </div>
      ),
    },
    {
      name: "Modify",
      cell: (row: Record) => (
        <div className="flex space-x-2 ">
          <PencilSquareIcon
            className="text-primary size-8 cursor-pointer "
            onClick={editModalShow}
          />
          <TrashIcon
            className="text-[#A30D11] size-8 cursor-pointer"
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
            data={data.map((item) => ({ ...item, id: Number(item.id) }))}
            pagination
            striped
            customStyles={tableCustomStyles}
        />
        </div>
      </div>
      <AddCustomModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        openCompleteModal={openCompleteModal}
        entityType="Custom"
      />
      <DeleteModal
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
        editModal={editModal}
        editModalClose={editModalClose}
        openSuccessModal={openSuccessModal}
        entityType="Custom"
      />
    
    </div>
  );
};

export default CustomRequest;

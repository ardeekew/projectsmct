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
import ViewUserModal from "./ViewUserModal";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  branch: string;
  status: string;
};

type Props = {};

type Record = {
  id: number;
  name: string;
  branch_code: string;
  email: string;
  role: string;
  contact: string;
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
interface ViewUserModalProps {
  modalIsOpen: boolean;
  closeModal: () => void;
  user: Record | null;
}

const pStyle = "font-medium";
const inputStyle = "border border-black rounded-md p-1";
const SetupUser = (props: Props) => {
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
      name: "Brittani Janiak",
      branch_code: "HOA",
      email: "bjaniak0@shareasale.com",
      role: "Project Manager",
      contact: "388-666-6841",
    },
    {
      id: 2,
      name: "Vyky Eccleshall",
      branch_code: "CKY",
      email: "veccleshall1@msu.edu",
      role: "Estimator",
      contact: "681-399-4305",
    },
    {
      id: 3,
      name: "Adrian Stathor",
      branch_code: "DRA",
      email: "astathor2@ft.com",
      role: "Supervisor",
      contact: "331-523-6631",
    },
    {
      id: 4,
      name: "Bette-ann Mothersdale",
      branch_code: "END",
      email: "bmothersdale3@ftc.gov",
      role: "Electrician",
      contact: "106-554-9542",
    },
    {
      id: 5,
      name: "Esme Taffee",
      branch_code: "LSA",
      email: "etaffee4@weibo.com",
      role: "Surveyor",
      contact: "824-953-7263",
    },
    {
      id: 6,
      name: "Stanislaw D'eye",
      branch_code: "DES",
      email: "sdeye5@google.ca",
      role: "Architect",
      contact: "839-951-1246",
    },
    {
      id: 7,
      name: "Violet Espie",
      branch_code: "TWH",
      email: "vespie6@cocolog-nifty.com",
      role: "Construction Worker",
      contact: "479-360-9257",
    },
    {
      id: 8,
      name: "Arlen Klimko",
      branch_code: "KBX",
      email: "aklimko7@dailymotion.com",
      role: "Construction Manager",
      contact: "451-314-9168",
    },
    {
      id: 9,
      name: "Orel Cropp",
      branch_code: "UYL",
      email: "ocropp8@exblog.jp",
      role: "Architect",
      contact: "250-821-8113",
    },
    {
      id: 10,
      name: "Alli MacFadden",
      branch_code: "SJU",
      email: "amacfadden9@washingtonpost.com",
      role: "Subcontractor",
      contact: "872-611-2052",
    },
    {
      id: 11,
      name: "Cosmo Gillitt",
      branch_code: "GMZ",
      email: "cgillitta@upenn.edu",
      role: "Construction Worker",
      contact: "483-284-8629",
    },
    {
      id: 12,
      name: "Betty Bullent",
      branch_code: "ADE",
      email: "bbullentb@163.com",
      role: "Project Manager",
      contact: "856-233-8494",
    },
    {
      id: 13,
      name: "Reine MacCracken",
      branch_code: "RCS",
      email: "rmaccrackenc@wix.com",
      role: "Estimator",
      contact: "795-500-1501",
    },
    {
      id: 14,
      name: "Charisse Burnand",
      branch_code: "TSR",
      email: "cburnandd@hubpages.com",
      role: "Supervisor",
      contact: "444-408-4326",
    },
    {
      id: 15,
      name: "Cathyleen Ivons",
      branch_code: "XRH",
      email: "civonse@fc2.com",
      role: "Surveyor",
      contact: "389-806-6938",
    },
    {
      id: 16,
      name: "Neron McLeod",
      branch_code: "IRZ",
      email: "nmcleodf@photobucket.com",
      role: "Subcontractor",
      contact: "473-926-4261",
    },
    {
      id: 17,
      name: "Yasmeen Bispo",
      branch_code: "PXL",
      email: "ybispog@zdnet.com",
      role: "Project Manager",
      contact: "313-781-2319",
    },
    {
      id: 18,
      name: "Lion Meah",
      branch_code: "TTL",
      email: "lmeahh@oracle.com",
      role: "Engineer",
      contact: "431-791-3645",
    },
    {
      id: 19,
      name: "Nikoletta Lyes",
      branch_code: "NCY",
      email: "nlyesi@china.com.cn",
      role: "Supervisor",
      contact: "909-907-2832",
    },
    {
      id: 20,
      name: "Asia Janos",
      branch_code: "VTG",
      email: "ajanosj@myspace.com",
      role: "Subcontractor",
      contact: "210-951-7054",
    },
    {
      id: 21,
      name: "Nydia Curwood",
      branch_code: "NUD",
      email: "ncurwoodk@craigslist.org",
      role: "Estimator",
      contact: "918-111-6697",
    },
    {
      id: 22,
      name: "Cchaddie Sealeaf",
      branch_code: "BXP",
      email: "csealeafl@sina.com.cn",
      role: "Surveyor",
      contact: "398-744-4423",
    },
    {
      id: 23,
      name: "Germayne Patrie",
      branch_code: "CYR",
      email: "gpatriem@yellowpages.com",
      role: "Supervisor",
      contact: "101-315-6492",
    },
    {
      id: 24,
      name: "Nichols Lushey",
      branch_code: "ATJ",
      email: "nlusheyn@blinklist.com",
      role: "Project Manager",
      contact: "811-230-7342",
    },
    {
      id: 25,
      name: "Asa Druery",
      branch_code: "LCP",
      email: "adrueryo@businessweek.com",
      role: "Surveyor",
      contact: "321-348-2550",
    },
    {
      id: 26,
      name: "Layla Woollhead",
      branch_code: "FIN",
      email: "lwoollheadp@cbsnews.com",
      role: "Surveyor",
      contact: "817-995-3838",
    },
    {
      id: 27,
      name: "Dniren Raisbeck",
      branch_code: "BEU",
      email: "draisbeckq@cnbc.com",
      role: "Project Manager",
      contact: "797-980-2142",
    },
    {
      id: 28,
      name: "Tomlin Mattys",
      branch_code: "SMT",
      email: "tmattysr@yale.edu",
      role: "Construction Foreman",
      contact: "687-656-8691",
    },
    {
      id: 29,
      name: "Rodina Bastide",
      branch_code: "TKV",
      email: "rbastides@gizmodo.com",
      role: "Estimator",
      contact: "695-170-9218",
    },
    {
      id: 30,
      name: "Jobey Hardwidge",
      branch_code: "EIY",
      email: "jhardwidget@photobucket.com",
      role: "Construction Expeditor",
      contact: "271-234-6037",
    },
    {
      id: 31,
      name: "Tabbatha Czyz",
      branch_code: "RKW",
      email: "tczyzu@csmonitor.com",
      role: "Engineer",
      contact: "967-330-9697",
    },
    {
      id: 32,
      name: "Babbette Corragan",
      branch_code: "NLE",
      email: "bcorraganv@hao123.com",
      role: "Construction Manager",
      contact: "410-320-6498",
    },
    {
      id: 33,
      name: "Lowell McRae",
      branch_code: "APQ",
      email: "lmcraew@flickr.com",
      role: "Subcontractor",
      contact: "613-267-9244",
    },
    {
      id: 34,
      name: "Valentia Horsefield",
      branch_code: "DOX",
      email: "vhorsefieldx@google.cn",
      role: "Supervisor",
      contact: "181-479-8669",
    },
    {
      id: 35,
      name: "Mahalia Bettenay",
      branch_code: "USR",
      email: "mbettenayy@feedburner.com",
      role: "Construction Worker",
      contact: "116-491-8691",
    },
    {
      id: 36,
      name: "Morton Desborough",
      branch_code: "ORM",
      email: "mdesboroughz@discuz.net",
      role: "Architect",
      contact: "381-979-0348",
    },
    {
      id: 37,
      name: "Cory Durnall",
      branch_code: "DUF",
      email: "cdurnall10@cyberchimps.com",
      role: "Architect",
      contact: "155-107-0393",
    },
    {
      id: 38,
      name: "Alejandro Casey",
      branch_code: "NTQ",
      email: "acasey11@photobucket.com",
      role: "Construction Worker",
      contact: "483-878-4507",
    },
    {
      id: 39,
      name: "Karlotte Farres",
      branch_code: "DBV",
      email: "kfarres12@theatlantic.com",
      role: "Project Manager",
      contact: "660-787-3077",
    },
    {
      id: 40,
      name: "Trescha Goldstein",
      branch_code: "RSN",
      email: "tgoldstein13@twitpic.com",
      role: "Estimator",
      contact: "508-562-2862",
    },
    {
      id: 41,
      name: "Greggory Zannini",
      branch_code: "KAZ",
      email: "gzannini14@exblog.jp",
      role: "Architect",
      contact: "489-739-0124",
    },
    {
      id: 42,
      name: "Eilis Romney",
      branch_code: "TSS",
      email: "eromney15@live.com",
      role: "Project Manager",
      contact: "834-689-9618",
    },
    {
      id: 43,
      name: "Tammie Belverstone",
      branch_code: "DKV",
      email: "tbelverstone16@cargocollective.com",
      role: "Surveyor",
      contact: "816-719-0041",
    },
    {
      id: 44,
      name: "Gallard Veare",
      branch_code: "ABS",
      email: "gveare17@rediff.com",
      role: "Construction Worker",
      contact: "212-984-4146",
    },
    {
      id: 45,
      name: "Joleen Godehard.sf",
      branch_code: "YGN",
      email: "jgodehardsf18@cloudflare.com",
      role: "Construction Expeditor",
      contact: "310-373-3261",
    },
    {
      id: 46,
      name: "Estevan Anstie",
      branch_code: "PGA",
      email: "eanstie19@com.com",
      role: "Subcontractor",
      contact: "650-708-9776",
    },
    {
      id: 47,
      name: "Raye Heustice",
      branch_code: "SAW",
      email: "rheustice1a@jugem.jp",
      role: "Subcontractor",
      contact: "758-413-0123",
    },
    {
      id: 48,
      name: "Liz Crock",
      branch_code: "CIO",
      email: "lcrock1b@noaa.gov",
      role: "Construction Expeditor",
      contact: "227-830-3468",
    },
    {
      id: 49,
      name: "Margeaux Vagges",
      branch_code: "GMZ",
      email: "mvagges1c@imageshack.us",
      role: "Estimator",
      contact: "980-124-6465",
    },
    {
      id: 50,
      name: "Cleo Ingree",
      branch_code: "BBP",
      email: "cingree1d@ow.ly",
      role: "Surveyor",
      contact: "813-160-1401",
    },
    {
      id: 51,
      name: "Evelyn Belcher",
      branch_code: "ERA",
      email: "ebelcher1e@mtv.com",
      role: "Construction Manager",
      contact: "144-323-4316",
    },
    {
      id: 52,
      name: "Judi Glantz",
      branch_code: "BCW",
      email: "jglantz1f@wordpress.org",
      role: "Architect",
      contact: "860-898-5632",
    },
    {
      id: 53,
      name: "Creigh Paulich",
      branch_code: "RLP",
      email: "cpaulich1g@deviantart.com",
      role: "Surveyor",
      contact: "647-468-3504",
    },
    {
      id: 54,
      name: "Maryjane Barling",
      branch_code: "ISU",
      email: "mbarling1h@cbsnews.com",
      role: "Surveyor",
      contact: "515-146-1655",
    },
    {
      id: 55,
      name: "Florenza Kenyam",
      branch_code: "AMV",
      email: "fkenyam1i@xing.com",
      role: "Architect",
      contact: "249-619-3712",
    },
    {
      id: 56,
      name: "Welsh Haxley",
      branch_code: "REP",
      email: "whaxley1j@yolasite.com",
      role: "Construction Expeditor",
      contact: "512-923-9844",
    },
    {
      id: 57,
      name: "Riki Catchpole",
      branch_code: "FXY",
      email: "rcatchpole1k@yolasite.com",
      role: "Construction Worker",
      contact: "605-269-6806",
    },
    {
      id: 58,
      name: "Regina Gerardin",
      branch_code: "VRA",
      email: "rgerardin1l@techcrunch.com",
      role: "Electrician",
      contact: "465-711-5876",
    },
    {
      id: 59,
      name: "Leonora MacDiarmid",
      branch_code: "BKD",
      email: "lmacdiarmid1m@instagram.com",
      role: "Estimator",
      contact: "686-473-7483",
    },
    {
      id: 60,
      name: "Logan Sooley",
      branch_code: "HIG",
      email: "lsooley1n@ameblo.jp",
      role: "Subcontractor",
      contact: "819-830-4006",
    },
    {
      id: 61,
      name: "Lil Singyard",
      branch_code: "SXX",
      email: "lsingyard1o@nps.gov",
      role: "Supervisor",
      contact: "624-469-1496",
    },
    {
      id: 62,
      name: "Bambie Garrard",
      branch_code: "TNF",
      email: "bgarrard1p@nationalgeographic.com",
      role: "Surveyor",
      contact: "536-288-3089",
    },
    {
      id: 63,
      name: "Suzanna Happert",
      branch_code: "OKJ",
      email: "shappert1q@ifeng.com",
      role: "Project Manager",
      contact: "759-968-4509",
    },
    {
      id: 64,
      name: "Delphinia Rawlins",
      branch_code: "SRJ",
      email: "drawlins1r@washingtonpost.com",
      role: "Estimator",
      contact: "485-901-8411",
    },
    {
      id: 65,
      name: "Marve Iston",
      branch_code: "RGS",
      email: "miston1s@free.fr",
      role: "Estimator",
      contact: "984-680-3871",
    },
    {
      id: 66,
      name: "Riobard Sawbridge",
      branch_code: "CCF",
      email: "rsawbridge1t@soup.io",
      role: "Surveyor",
      contact: "825-512-2778",
    },
    {
      id: 67,
      name: "Vernon Lowton",
      branch_code: "SZW",
      email: "vlowton1u@uol.com.br",
      role: "Project Manager",
      contact: "940-381-4823",
    },
    {
      id: 68,
      name: "Hendrick Knagges",
      branch_code: "BMI",
      email: "hknagges1v@indiegogo.com",
      role: "Engineer",
      contact: "723-906-7624",
    },
    {
      id: 69,
      name: "Dreddy Howes",
      branch_code: "PDC",
      email: "dhowes1w@opera.com",
      role: "Subcontractor",
      contact: "111-140-3554",
    },
    {
      id: 70,
      name: "Cassandre Tomlin",
      branch_code: "DAY",
      email: "ctomlin1x@is.gd",
      role: "Electrician",
      contact: "373-489-8998",
    },
    {
      id: 71,
      name: "Zane Crispin",
      branch_code: "UAS",
      email: "zcrispin1y@arizona.edu",
      role: "Engineer",
      contact: "408-239-6803",
    },
    {
      id: 72,
      name: "Rickie Hurrion",
      branch_code: "MGM",
      email: "rhurrion1z@dedecms.com",
      role: "Estimator",
      contact: "202-290-6325",
    },
    {
      id: 73,
      name: "Brocky de Aguirre",
      branch_code: "YQF",
      email: "bde20@ucoz.ru",
      role: "Architect",
      contact: "193-242-7897",
    },
    {
      id: 74,
      name: "Pete Karpf",
      branch_code: "PSR",
      email: "pkarpf21@artisteer.com",
      role: "Estimator",
      contact: "387-604-7663",
    },
    {
      id: 75,
      name: "Lea Waterson",
      branch_code: "MAA",
      email: "lwaterson22@merriam-webster.com",
      role: "Estimator",
      contact: "416-660-8056",
    },
    {
      id: 76,
      name: "Melamie Lawty",
      branch_code: "TGN",
      email: "mlawty23@nydailynews.com",
      role: "Construction Expeditor",
      contact: "415-786-2638",
    },
    {
      id: 77,
      name: "Ilysa Lyons",
      branch_code: "AOP",
      email: "ilyons24@myspace.com",
      role: "Construction Foreman",
      contact: "870-130-1204",
    },
    {
      id: 78,
      name: "Clevie Garken",
      branch_code: "OSZ",
      email: "cgarken25@vkontakte.ru",
      role: "Supervisor",
      contact: "658-370-7992",
    },
    {
      id: 79,
      name: "Gian Diano",
      branch_code: "CAO",
      email: "gdiano26@bloglovin.com",
      role: "Construction Foreman",
      contact: "979-583-8674",
    },
    {
      id: 80,
      name: "Esta Abbiss",
      branch_code: "SZF",
      email: "eabbiss27@cloudflare.com",
      role: "Subcontractor",
      contact: "818-408-7980",
    },
    {
      id: 81,
      name: "Gina Jewar",
      branch_code: "CZU",
      email: "gjewar28@utexas.edu",
      role: "Construction Manager",
      contact: "645-817-7168",
    },
    {
      id: 82,
      name: "Meir Cardinal",
      branch_code: "KBN",
      email: "mcardinal29@mit.edu",
      role: "Supervisor",
      contact: "276-528-4911",
    },
    {
      id: 83,
      name: "Corella Troucher",
      branch_code: "THB",
      email: "ctroucher2a@symantec.com",
      role: "Construction Manager",
      contact: "471-337-7153",
    },
    {
      id: 84,
      name: "Samaria Gavin",
      branch_code: "RTB",
      email: "sgavin2b@oaic.gov.au",
      role: "Architect",
      contact: "548-718-4136",
    },
    {
      id: 85,
      name: "Rina Downie",
      branch_code: "PLR",
      email: "rdownie2c@squidoo.com",
      role: "Estimator",
      contact: "229-517-9363",
    },
    {
      id: 86,
      name: "Merv Gerholz",
      branch_code: "BZN",
      email: "mgerholz2d@miitbeian.gov.cn",
      role: "Construction Foreman",
      contact: "341-930-1334",
    },
    {
      id: 87,
      name: "Camella Spyvye",
      branch_code: "VRU",
      email: "cspyvye2e@state.gov",
      role: "Architect",
      contact: "402-590-2860",
    },
    {
      id: 88,
      name: "Cassie Lergan",
      branch_code: "LME",
      email: "clergan2f@sphinn.com",
      role: "Architect",
      contact: "723-824-8030",
    },
    {
      id: 89,
      name: "Harwell Haquin",
      branch_code: "RAJ",
      email: "hhaquin2g@google.pl",
      role: "Estimator",
      contact: "443-946-6599",
    },
    {
      id: 90,
      name: "Morganica Landsborough",
      branch_code: "AVI",
      email: "mlandsborough2h@zimbio.com",
      role: "Supervisor",
      contact: "622-657-2747",
    },
    {
      id: 91,
      name: "Deonne Aistrop",
      branch_code: "LRJ",
      email: "daistrop2i@newyorker.com",
      role: "Construction Expeditor",
      contact: "202-423-6957",
    },
    {
      id: 92,
      name: "Des Dobeson",
      branch_code: "ESM",
      email: "ddobeson2j@e-recht24.de",
      role: "Architect",
      contact: "754-230-9438",
    },
    {
      id: 93,
      name: "Desmund Chapelhow",
      branch_code: "AIK",
      email: "dchapelhow2k@histats.com",
      role: "Construction Manager",
      contact: "563-295-7912",
    },
    {
      id: 94,
      name: "Stephenie Kneath",
      branch_code: "ITU",
      email: "skneath2l@go.com",
      role: "Construction Expeditor",
      contact: "681-686-7681",
    },
    {
      id: 95,
      name: "Mike Sherborn",
      branch_code: "GLA",
      email: "msherborn2m@goo.ne.jp",
      role: "Construction Worker",
      contact: "808-890-5215",
    },
    {
      id: 96,
      name: "Jennine Doul",
      branch_code: "CXH",
      email: "jdoul2n@loc.gov",
      role: "Estimator",
      contact: "628-253-2819",
    },
    {
      id: 97,
      name: "Fenelia Else",
      branch_code: "ERZ",
      email: "felse2o@friendfeed.com",
      role: "Estimator",
      contact: "447-229-5899",
    },
    {
      id: 98,
      name: "Mahalia Yetman",
      branch_code: "BYU",
      email: "myetman2p@home.pl",
      role: "Electrician",
      contact: "482-990-9696",
    },
    {
      id: 99,
      name: "Elga Matton",
      branch_code: "ZUH",
      email: "ematton2q@xrea.com",
      role: "Construction Foreman",
      contact: "542-517-3799",
    },
    {
      id: 100,
      name: "Massimo Corss",
      branch_code: "ZMG",
      email: "mcorss2r@wordpress.com",
      role: "Construction Expeditor",
      contact: "689-391-8743",
    },
  ];

  const viewModalShow = (row: Record) => {
    setSelectedUser(row);
    setViewModalIsOpen(true);
  };

  const viewModalClose = () => {
    setSelectedUser(null);
    setViewModalIsOpen(false);
  };

  const columns = [
    {
      name: "ID",
      selector: (row: Record) => row.id,
      width: "60px",
    },
    {
      name: "Name",
      selector: (row: Record) => row.name,
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
      name: "Contact",
      selector: (row: Record) => row.contact,
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
            className="bg-primary text-white  w-full rounded-[12px]"
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
          <div className="flex items-end justify-between mx-2 bg-white">
            <div>
              <input type="text" placeholder="Search" className={inputStyle} />
            </div>
            <div>
              <button
                className="bg-primary text-white rounded-[12px] p-1"
                onClick={openModal}
              >
                + Add User
              </button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={data}
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
        entityType="User"
      />
      <DeleteModal
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
        editModal={editModal}
        editModalClose={editModalClose}
        openSuccessModal={openSuccessModal}
        entityType="User"
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

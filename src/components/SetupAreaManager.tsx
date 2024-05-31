import React from "react";
import DataTable from "react-data-table-component";
type Props = {};

type Record = {
  id: number;
  no: string;
  name: string;
  assigned_branch: string;
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
const data = [
  {
    id: 1,
    no: "2536237095",
    name: "Paulo Pendered",
    assigned_branch: "6 Barby Parkway",
  },
  {
    id: 2,
    no: "9944706345",
    name: "Andrey Pack",
    assigned_branch: "09 Buena Vista Drive",
  },
  {
    id: 3,
    no: "8134968511",
    name: "Amber Gerhts",
    assigned_branch: "29 Jana Plaza",
  },
  {
    id: 4,
    no: "5007946796",
    name: "Georgie Berthome",
    assigned_branch: "31 Haas Crossing",
  },
  {
    id: 5,
    no: "1881498107",
    name: "Harlan Hannis",
    assigned_branch: "813 Hermina Hill",
  },
  {
    id: 6,
    no: "4783616612",
    name: "Jackqueline Francois",
    assigned_branch: "802 Lukken Point",
  },
  {
    id: 7,
    no: "2729997881",
    name: "Germaine Hartup",
    assigned_branch: "71 Myrtle Circle",
  },
  {
    id: 8,
    no: "1366785134",
    name: "Mischa Tickner",
    assigned_branch: "43 Veith Way",
  },
  {
    id: 9,
    no: "9365945186",
    name: "Faydra Cudmore",
    assigned_branch: "82 Russell Center",
  },
  {
    id: 10,
    no: "6844328559",
    name: "Alla Crann",
    assigned_branch: "7 Golden Leaf Place",
  },
  {
    id: 11,
    no: "2449612726",
    name: "Claudia Prayer",
    assigned_branch: "44590 Calypso Junction",
  },
  {
    id: 12,
    no: "9287515247",
    name: "Clevey McCombe",
    assigned_branch: "93 Southridge Drive",
  },
  {
    id: 13,
    no: "9604066773",
    name: "Pet Mitkin",
    assigned_branch: "00903 Dovetail Alley",
  },
  {
    id: 14,
    no: "9472015441",
    name: "Blake Bedinham",
    assigned_branch: "57851 Kings Hill",
  },
  {
    id: 15,
    no: "4617718974",
    name: "Anderea Fair",
    assigned_branch: "51 Randy Center",
  },
  {
    id: 16,
    no: "4368293207",
    name: "Mignonne Cullnean",
    assigned_branch: "06 Reinke Way",
  },
  {
    id: 17,
    no: "6355383956",
    name: "Barbey McGougan",
    assigned_branch: "0 Bartillon Parkway",
  },
  {
    id: 18,
    no: "1191112314",
    name: "Owen Markie",
    assigned_branch: "847 Caliangt Circle",
  },
  {
    id: 19,
    no: "3131112441",
    name: "Toby Phipps",
    assigned_branch: "5 Lerdahl Place",
  },
  {
    id: 20,
    no: "7080983886",
    name: "Evanne Braz",
    assigned_branch: "86 Barby Plaza",
  },
  {
    id: 21,
    no: "5251012349",
    name: "Aldo Studders",
    assigned_branch: "2 Darwin Avenue",
  },
  {
    id: 22,
    no: "1265180962",
    name: "Channa Mersey",
    assigned_branch: "8 Fuller Way",
  },
  {
    id: 23,
    no: "2309891061",
    name: "Dore Dace",
    assigned_branch: "78 Helena Circle",
  },
  {
    id: 24,
    no: "9170504407",
    name: "Didi Olrenshaw",
    assigned_branch: "62 Logan Circle",
  },
  {
    id: 25,
    no: "0055223885",
    name: "Alexandra Gladdolph",
    assigned_branch: "490 Holmberg Avenue",
  },
  {
    id: 26,
    no: "4489635834",
    name: "Orelie Wenman",
    assigned_branch: "5 Maryland Center",
  },
  {
    id: 27,
    no: "6842299039",
    name: "Tadd Duigan",
    assigned_branch: "77052 Glendale Street",
  },
  {
    id: 28,
    no: "8279872205",
    name: "Toddie Champkins",
    assigned_branch: "18 Butternut Pass",
  },
  {
    id: 29,
    no: "3213579092",
    name: "Amelita Bonsey",
    assigned_branch: "3 Clove Avenue",
  },
  {
    id: 30,
    no: "5938670802",
    name: "Jack Lindholm",
    assigned_branch: "6 Jana Park",
  },
  {
    id: 31,
    no: "0425406237",
    name: "Sandra Jacquemy",
    assigned_branch: "5275 Moose Place",
  },
  {
    id: 32,
    no: "1618400711",
    name: "Arther Ghion",
    assigned_branch: "91 Hoepker Circle",
  },
  {
    id: 33,
    no: "8170205190",
    name: "Jolene Orris",
    assigned_branch: "7 Porter Street",
  },
  {
    id: 34,
    no: "2411331746",
    name: "Kimbra Hicklingbottom",
    assigned_branch: "67 Almo Point",
  },
  {
    id: 35,
    no: "5875381361",
    name: "Hewe Bunton",
    assigned_branch: "5 Sachs Pass",
  },
  {
    id: 36,
    no: "2122435143",
    name: "Frannie Hrus",
    assigned_branch: "3295 Spenser Crossing",
  },
  {
    id: 37,
    no: "3909135307",
    name: "Brandy Halford",
    assigned_branch: "05859 5th Street",
  },
  {
    id: 38,
    no: "9099759568",
    name: "Geoff Slay",
    assigned_branch: "30305 Bartelt Terrace",
  },
  {
    id: 39,
    no: "4680649372",
    name: "Sallyann Levesley",
    assigned_branch: "86512 Rieder Place",
  },
  {
    id: 40,
    no: "0550961178",
    name: "Val Garfirth",
    assigned_branch: "5 Knutson Parkway",
  },
  {
    id: 41,
    no: "6146538949",
    name: "Alidia Thursby",
    assigned_branch: "36454 Gerald Trail",
  },
  {
    id: 42,
    no: "7039699621",
    name: "Vere Prebble",
    assigned_branch: "36 Sullivan Junction",
  },
  {
    id: 43,
    no: "9001639011",
    name: "Sadie Coad",
    assigned_branch: "0 Schiller Pass",
  },
  {
    id: 44,
    no: "6845177384",
    name: "Laryssa Kings",
    assigned_branch: "442 Spenser Plaza",
  },
  {
    id: 45,
    no: "0322266718",
    name: "Fairlie Jorioz",
    assigned_branch: "1 Esker Circle",
  },
  {
    id: 46,
    no: "7755964493",
    name: "Tilly Rumming",
    assigned_branch: "642 Lerdahl Lane",
  },
  {
    id: 47,
    no: "1109978545",
    name: "Hillery Harrowing",
    assigned_branch: "0 Di Loreto Terrace",
  },
  {
    id: 48,
    no: "0244437904",
    name: "Dorine Slyvester",
    assigned_branch: "381 Gulseth Circle",
  },
  {
    id: 49,
    no: "1491861819",
    name: "Ricky Tregale",
    assigned_branch: "8 Dwight Alley",
  },
  {
    id: 50,
    no: "9621836409",
    name: "Lynelle Antoniou",
    assigned_branch: "3632 Autumn Leaf Crossing",
  },
  {
    id: 51,
    no: "7547523277",
    name: "Kacey Daveren",
    assigned_branch: "26 Novick Court",
  },
  {
    id: 52,
    no: "3740903759",
    name: "Denni Lowndsbrough",
    assigned_branch: "1781 Dovetail Circle",
  },
  {
    id: 53,
    no: "5147875034",
    name: "Colly Incogna",
    assigned_branch: "3648 Corscot Court",
  },
  {
    id: 54,
    no: "4365729314",
    name: "Norina Llywarch",
    assigned_branch: "7 Stoughton Street",
  },
  {
    id: 55,
    no: "1356719694",
    name: "Essie Ugolini",
    assigned_branch: "719 Parkside Way",
  },
  {
    id: 56,
    no: "2905231041",
    name: "Romeo Krates",
    assigned_branch: "726 Burrows Trail",
  },
  {
    id: 57,
    no: "4031426852",
    name: "Margarethe Fabb",
    assigned_branch: "960 Northfield Plaza",
  },
  {
    id: 58,
    no: "0661675343",
    name: "Gaelan Swabey",
    assigned_branch: "56 Oakridge Way",
  },
  {
    id: 59,
    no: "2930914548",
    name: "Reece Pirie",
    assigned_branch: "56 Elka Parkway",
  },
  {
    id: 60,
    no: "9776742734",
    name: "Carlee Boissier",
    assigned_branch: "132 Bay Road",
  },
  {
    id: 61,
    no: "1380809916",
    name: "Solly Feria",
    assigned_branch: "84945 Golf Course Plaza",
  },
  {
    id: 62,
    no: "7935138273",
    name: "Bethanne Lamdin",
    assigned_branch: "1259 Brown Pass",
  },
  {
    id: 63,
    no: "0738165107",
    name: "Sergei Skellon",
    assigned_branch: "327 Hudson Crossing",
  },
  {
    id: 64,
    no: "1352292246",
    name: "Riannon Dwyr",
    assigned_branch: "0 Forster Plaza",
  },
  {
    id: 65,
    no: "5637593809",
    name: "Eba Yesenev",
    assigned_branch: "4 Vernon Plaza",
  },
  {
    id: 66,
    no: "3524888917",
    name: "Elston Tomanek",
    assigned_branch: "6 Park Meadow Junction",
  },
  {
    id: 67,
    no: "8972123609",
    name: "Kirsti Caunt",
    assigned_branch: "17429 Shopko Junction",
  },
  {
    id: 68,
    no: "8083711772",
    name: "Mason Bonfield",
    assigned_branch: "40 Thackeray Drive",
  },
  {
    id: 69,
    no: "8063238648",
    name: "Karlee Gowry",
    assigned_branch: "8740 Bartelt Street",
  },
  {
    id: 70,
    no: "5079638036",
    name: "Elisha Mayzes",
    assigned_branch: "22083 Alpine Hill",
  },
  {
    id: 71,
    no: "8353410338",
    name: "Carlina Pheasant",
    assigned_branch: "81 Lighthouse Bay Avenue",
  },
  {
    id: 72,
    no: "2410361900",
    name: "Teresina Rowland",
    assigned_branch: "59067 Miller Trail",
  },
  {
    id: 73,
    no: "1975718232",
    name: "Matias Drage",
    assigned_branch: "6112 Ryan Drive",
  },
  {
    id: 74,
    no: "5061627253",
    name: "Phylys Szymanowski",
    assigned_branch: "11 North Terrace",
  },
  {
    id: 75,
    no: "7763696540",
    name: "Nathanial Waliszewski",
    assigned_branch: "3 Sutherland Crossing",
  },
  {
    id: 76,
    no: "3999963204",
    name: "Eugen Deacock",
    assigned_branch: "68 Orin Plaza",
  },
  {
    id: 77,
    no: "0301643547",
    name: "Renard Phillott",
    assigned_branch: "7 Cascade Center",
  },
  {
    id: 78,
    no: "5567939760",
    name: "Hadrian Bixley",
    assigned_branch: "8800 Commercial Avenue",
  },
  {
    id: 79,
    no: "5916405790",
    name: "Mandie Martland",
    assigned_branch: "580 Debra Crossing",
  },
  {
    id: 80,
    no: "8954772609",
    name: "Charley Rodrigues",
    assigned_branch: "79571 Nevada Plaza",
  },
  {
    id: 81,
    no: "6540486804",
    name: "Shayna Cristofalo",
    assigned_branch: "57828 Gateway Park",
  },
  {
    id: 82,
    no: "8094672005",
    name: "Vittorio Adie",
    assigned_branch: "85 Dunning Street",
  },
  {
    id: 83,
    no: "7156663984",
    name: "Bernie Clemencet",
    assigned_branch: "7628 Leroy Court",
  },
  {
    id: 84,
    no: "0427052947",
    name: "Gardener Treacher",
    assigned_branch: "08 Summerview Street",
  },
  {
    id: 85,
    no: "6180389659",
    name: "Harlin Maciejewski",
    assigned_branch: "55 Glendale Terrace",
  },
  {
    id: 86,
    no: "2689123681",
    name: "Laure Rosthorn",
    assigned_branch: "00 Elmside Crossing",
  },
  {
    id: 87,
    no: "3883599166",
    name: "Sterling Sussans",
    assigned_branch: "3954 Lien Court",
  },
  {
    id: 88,
    no: "2953180710",
    name: "Francklin M'Chirrie",
    assigned_branch: "0054 Kinsman Alley",
  },
  {
    id: 89,
    no: "4946091637",
    name: "Merry Maxwaile",
    assigned_branch: "0 Green Parkway",
  },
  {
    id: 90,
    no: "4411224518",
    name: "Jorie Mulford",
    assigned_branch: "2 Pawling Center",
  },
  {
    id: 91,
    no: "0859008355",
    name: "Alon Dunnion",
    assigned_branch: "17729 Lighthouse Bay Trail",
  },
  {
    id: 92,
    no: "0239056116",
    name: "Kori Haslock",
    assigned_branch: "82902 Cambridge Road",
  },
  {
    id: 93,
    no: "8583883386",
    name: "Daffie Davidesco",
    assigned_branch: "2 Tennyson Terrace",
  },
  {
    id: 94,
    no: "6456645255",
    name: "Kahlil Spenceley",
    assigned_branch: "52 Crownhardt Way",
  },
  {
    id: 95,
    no: "5732426736",
    name: "Patton Boulger",
    assigned_branch: "75652 Lukken Plaza",
  },
  {
    id: 96,
    no: "2425337342",
    name: "Parnell Adamovicz",
    assigned_branch: "15863 Huxley Circle",
  },
  {
    id: 97,
    no: "7723439989",
    name: "Rubie Boult",
    assigned_branch: "14 Moulton Pass",
  },
  {
    id: 98,
    no: "5360202971",
    name: "Dotty Awcock",
    assigned_branch: "06762 Banding Junction",
  },
  {
    id: 99,
    no: "2345251247",
    name: "Viviyan Achrameev",
    assigned_branch: "09 Golf Street",
  },
  {
    id: 100,
    no: "9884179875",
    name: "Almira Leverett",
    assigned_branch: "79481 Ludington Parkway",
  },
];

const SetupAreaManager = (props: Props) => {
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
      name: "Name",
      selector: (row: Record) => row.name,
    },
    {
      name: "Assigned Branches ",
      selector: (row: Record) => row.assigned_branch,
    },
    {
      name: "Modify",
      cell: (row: Record) => (
        <button className="bg-primary text-white  px-4 p-1 rounded-[12px]">
          View
        </button>
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
              <button className="bg-primary text-white rounded-[12px] p-1">
                + Create New
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
    </div>
  );
};

export default SetupAreaManager;

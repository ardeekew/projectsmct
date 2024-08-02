import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SMCTLogo from "./assets/SMCT.png";
import DSMLogo from "./assets/DSM.jpg";
import DAPLogo from "./assets/DAP.jpg";
import HDILogo from "./assets/HDI.jpg";

type PrintRefundProps = {
  data?: any;
};

const PrintLiquidation: React.FC<PrintRefundProps> = ({ data }) => {
  const location = useLocation();
  const [printData, setPrintData] = useState<any>(null); // State to hold print data
  const queryParams = new URLSearchParams(location.search);
  const serializedData = queryParams.get("data");

  let logo;
  if (printData?.user?.data?.branch === "Strong Motocentrum, Inc.") {
    logo = <img src={SMCTLogo} alt="SMCT Logo" />;
  } else if (printData?.user?.data?.branch === "Des Strong Motors, Inc.") {
    logo = <img src={DSMLogo} alt="DSM Logo" />;
  } else if (printData?.user?.data?.branch === "Des Appliance Plaza, Inc.") {
    logo = <img src={DAPLogo} alt="DAP Logo" />;
  } else if (printData?.user?.data?.branch === "Honda Des, Inc.") {
    logo = <img src={HDILogo} alt="HDI Logo" />;
  } else {
    logo = null; // Handle the case where branch does not match any of the above
  }

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return ""; // Return empty string if dateString is undefined or null

    // Convert dateString to Date object
    const date = new Date(dateString);

    // Check if date is a valid Date object
    if (!(date instanceof Date && !isNaN(date.getTime()))) {
      return ""; // Return empty string if date is not a valid Date object
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    // Retrieve the data from localStorage
    const storedData = localStorage.getItem('printData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setPrintData(parsedData); // Set the printData state
      console.log(parsedData);
    }
  
    localStorage.removeItem('printData');
  }, []);

  const tableStyle = "border border-black  py-4";
  useEffect(() => {
    if (printData !== null) {
      window.print();
      localStorage.removeItem('printData'); // Clean up after printing
    }
  }, [printData]);
  return (
    <div className="print-container  ">
    <style>
  {`
    @media print {
      .print-container {
        padding: 10px;
        margin: 0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        table-layout: fixed; /* Ensures table width is constrained */
      }

      th, td {
        padding: 6px; /* Reduced padding to fit content better */
        border: 1px solid black;
        vertical-align: top;
        font-size: 10px; /* Adjust font size to fit content */
      }

      .summary-table {
        width: 100%;
      }

      .flex-wrap {
        flex-wrap: wrap;
      }

      .justify-between {
        justify-content: space-between;
      }

      .font-bold {
        font-weight: bold;
      }

      .underline {
        text-decoration: underline;
      }

      .text-center {
        text-align: center;
      }

      .uppercase {
        text-transform: uppercase;
      }

      .two-column {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }

      /* Adjust padding and margins */
      .print-container {
        padding: 10px;
        margin: 0;
      }

      /* Ensure the table fits within the container */
      table {
        width: 100%;
        max-width: 100%;
        border-collapse: collapse;
      }

      /* Adjust padding for table cells */
      th, td {
        padding: 4px; /* Reduced padding */
        font-size: 10px; /* Smaller font size */
      }
    }
  `}
</style>
      <div className="border-2 border-black px-4">
      <div className="flex flex-col justify-center items-center">
      <div className="justify-center w-1/2 mt-10">{logo}</div>
          <h1 className="font-bold text-lg uppercase">liquidation of actual expense</h1>
          <div className="flex flex-col items-center font-bold mt-2">
            <h1 className="font-medium text-[16px] uppercase underline">
              {printData?.user.data.branch || ''}
            </h1>
            <h1 className="text-lg">BRANCH</h1>
          </div>
        </div>
        <div className="table-container">
        <table className="border-collapse w-full border-black border mt-10 px-5">
          <thead>
            <tr>
              <th className="border w-10 border-black bg-[#8EC7F7]">Date</th>
              <th colSpan={3} className="border border-black bg-[#8EC7F7]">
                Transportation
              </th>
              <th colSpan={3} className="border border-black bg-[#8EC7F7] h-14">
                Hotel
              </th>
              <th colSpan={3} className="border border-black bg-[#8EC7F7]">
                PER DIEM OTHER RELATED EXPENSES
              </th>
              <th className="bg-[#8EC7F7]"></th>
            </tr>
            <tr>
              <th className="border w-1/12 border-black">Date</th>
              <th className="border w-2/12 border-black">Destination</th>
              <th className="border w-2/12 border-black">
                Type of Transportation
              </th>
              <th className="border w-10 border-black">Amount</th>
              <th className="border w-10 border-black">Hotel</th>
              <th className="border w-2/12 border-black">Place</th>
              <th className="border w-10 border-black">Amount</th>
              <th className="border w-10 border-black">Per Diem</th>
              <th className="border w-10 border-black">Particulars</th>
              <th className="border w-10 border-black">Amount</th>
              <th className="border w-10 border-black">Grand Total</th>
            </tr>
          </thead>
          <tbody>
            {printData?.id.form_data.map((formData: any, index: number) => (
              <React.Fragment key={index}>
                {formData.items.map((item: any, itemIndex: number) => (
                  <tr key={itemIndex}>
                    <td className={`${tableStyle}`}>{formatDate(item.liquidationDate)}</td>
                    <td className={`${tableStyle}`}>{item.destination}</td>
                    <td className={`${tableStyle}`}>{item.transportation}</td>
                    <td className={`${tableStyle}`}>{item.transportationAmount}</td>
                    <td className={`${tableStyle}`}>{item.hotel}</td>
                    <td className={`${tableStyle}`}>{item.hotelAddress}</td>
                    <td className={`${tableStyle}`}>{item.hotelAmount}</td>
                    <td className={`${tableStyle}`}>{item.perDiem}</td>
                    <td className={`${tableStyle}`}>{item.particulars}</td>
                    <td className={`${tableStyle}`}>{item.particularsAmount}</td>
                    <td className={`${tableStyle}`}>{item.grandTotal}</td>
                  </tr>
                ))}
                {[...Array(Math.max(5 - formData.items.length, 0))].map((_, emptyIndex) => (
                  <tr key={`empty-${index}-${emptyIndex}`}>
                    <td className={`${tableStyle}`}></td>
                    <td className={`${tableStyle}`}></td>
                    <td className={`${tableStyle}`}></td>
                    <td className={`${tableStyle}`}></td>
                    <td className={`${tableStyle}`}></td>
                    <td className={`${tableStyle}`}></td>
                    <td className={`${tableStyle}`}></td>
                    <td className={`${tableStyle}`}></td>
                    <td className={`${tableStyle}`}></td>
                    <td className={`${tableStyle}`}></td>
                    <td className={`${tableStyle}`}></td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        </div>
        <div className="two-column grid grid-cols-2 gap-6 mt-10">
        <div>
          <table className="border border-black w-full">
            <tbody className="w-full">
              <tr>
                <td className="border border-black px-2 py-1 font-semibold">
                  TOTAL EXPENSE
                </td>
                <td className="border border-black px-2 py-1 font-bold">
                  {printData?.id.form_data[0].totalExpense}
                </td>
              </tr>
             
              <tr>
                <td className="border border-black px-2 py-1 font-semibold">
                  CASH Advance
                </td>
                <td className="border border-black px-2 py-1 font-bold">
                  {printData?.id.form_data[0].cashAdvance}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-semibold">
                  Short
                </td>
                <td className="border border-black px-2 py-1 font-bold">
                  {printData?.id.form_data[0].short}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      
        <div>
          <table className="border border-black w-full">
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 font-semibold">
                  NAME OF EMPLOYEE
                </td>
                <td className="border border-black px-2 py-1 font-bold">
                {printData?.user.data.lastName},   {printData?.user.data.firstName}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-semibold">
                  SIGNATURE
                </td>
                <td className="border border-black px-2 py-1 font-bold">
                  <img src={printData?.user.data.signature} alt="Signature" />
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-semibold">
                EMPLOYEE NO.
                </td>
                <td className="border border-black px-2 py-1 font-bold">
                  {printData?.user.data.employee_id}
                </td>
              </tr>
            
            </tbody>
          </table>
        </div>
        </div>
        <div className="mt-4 w-full">
          <div className="flex flex-wrap justify-between w-full">
            {/* Requested By Section */}
            <div className="mb-4 flex-grow">
              <h3 className="font-bold mb-3">Requested By:</h3>
              <div className="flex flex-col items-center justify-center text-center relative pt-8">
                <img
                  className="absolute top-2"
                  src={printData?.user.data.signature}
                  alt="avatar"
                  width={120}
                />
                <p className="relative z-10 px-2 underline font-bold">
                  {printData?.user.data.firstName}{" "}
                  {printData?.user.data.lastName}
                </p>
                <p className="font-bold text-xs text-center">
                  {printData?.user.data.position}
                </p>
              </div>
            </div>

            {/* Noted By Section */}
            <div className="mb-4 flex-grow">
              <h3 className="font-bold mb-3">Noted By:</h3>
              <div className="flex flex-wrap justify-around">
                {printData?.notedBy.map((approver: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col  mr-2 relative pt-8"
                  >
                    {approver.status === "Approved" && (
                      <img
                        className="absolute top-2"
                        src={approver.signature}
                        alt=""
                        width={120}
                      />
                    )}
                    <p className="underline text-center font-bold">
                      {approver.firstname} {approver.lastname}
                    </p>
                    <p className="font-bold text-xs text-center">
                      {approver.position}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Approved By Section */}
            <div className="mb-4 flex-grow">
              <h3 className="font-bold mb-3">Approved By:</h3>
              <div className="flex flex-wrap justify-evenly">
                {printData?.approvedBy.map((approver: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col justify-start items-center mr-2 relative pt-8"
                  >
                    {approver.status === "Approved" && (
                      <img
                        className="absolute top-2"
                        src={approver.signature}
                        alt=""
                        width={120}
                      />
                    )}
                    <p className="underline text-center font-bold">
                      {approver.firstname} {approver.lastname}
                    </p>
                    <p className="font-bold text-xs text-center">
                      {approver.position}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
</div>
      
      </div>
    </div>
  );
};

export default PrintLiquidation;

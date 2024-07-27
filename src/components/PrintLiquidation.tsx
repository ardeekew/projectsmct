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
    }
    window.print();
    localStorage.removeItem('printData');
  }, []);

  const tableStyle = "border border-black px-4 py-4";

  return (
    <div className="print-container p-5">
      <style>
        {`
          @media print {
            .print-container {
              padding: 10px;
              margin: 0;
              max-height: 5.5in; /* Set max-height to half of bond paper */
              overflow: hidden; /* Hide overflow to ensure content fits */
            }

            table {
              width: 80%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }

            th, td {
              padding: 8px;
              border: 1px solid black;
              vertical-align: top;
              font-size: 10px;
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
          }
        `}
      </style>
      <div className="border-2 border-black px-10">
        <div className="flex flex-col justify-center items-center">
          <div className="justify-center w-1/2 mt-10">{logo}</div>
          <h1 className="font-bold text-lg uppercase">Application for Cash Advance</h1>
          <div className="flex flex-col items-center font-bold mt-2">
            <h1 className="font-medium text-[16px] uppercase underline">
              {printData?.user.data.branch || ''}
            </h1>
            <h1 className="text-lg">BRANCH</h1>
          </div>
        </div>

        <table className="border-collapse w-full border-black border mt-10">
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

        <div className="grid grid-cols-1 md:grid-cols-2 w-full md:gap-2 mt-10">
          <table className="border border-black w-full">
            <tbody>
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
                  AMOUNT CASH ADVANCE
                </td>
                <td className="border border-black px-2 py-1 font-bold">
                  {printData?.id.form_data[0].amountCashAdvance}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-semibold">
                  CASH RETURNABLE
                </td>
                <td className="border border-black px-2 py-1 font-bold">
                  {printData?.id.form_data[0].cashReturnable}
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-semibold">
                  REIMBURSABLE
                </td>
                <td className="border border-black px-2 py-1 font-bold">
                  {printData?.id.form_data[0].reimbursable}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 w-full mt-10">
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center border-t border-black p-2 w-full">
              <span className="font-bold uppercase">
                {printData?.notedByUser?.name || "N/A"}
              </span>
              <span>Noted By</span>
            </div>
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center border-t border-black p-2 w-full">
              <span className="font-bold uppercase">
                {printData?.approvedByUser?.name || "N/A"}
              </span>
              <span>Approved By</span>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex justify-center">
            <div className="w-full">
              <p className="text-sm font-semibold">Purpose of Cash Advance:</p>
              <p className="text-sm">{printData?.id.form_data[0].purpose}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintLiquidation;

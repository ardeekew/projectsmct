import React, { useState } from 'react';

type Props = {};

const Request = (props: Props) => {
    const [darkMode, setDarkMode] = useState(true);
    const [selected, setSelected] = useState<number | null>(null);

    const handleClick = (index: number) => {
        setSelected(index);
    };

    const items = ['All Requests', 'Pending Requests', 'Approved Requests', 'Unsuccessful Requests'];
    const titles = ['Request ID', 'Type of Request', 'Date', 'Branch', 'Status', 'Action'];

    return (
        <div className="bg-graybg dark:bg-blackbg w-full h-screen pt-4 px-10 md:px-10 lg:px-30">
              <button className='bg-primary text-white rounded-[12px] mb-2 w-[120px] sm:w-[151px] h-[34px]'>Send Request</button>
            <div className='w-full  h-auto  drop-shadow-lg rounded-lg  md:mr-4 relative '>
            
                <div className="bg-white   rounded-lg  w-full flex flex-col items-center overflow-x-auto">
                    <div className="w-full border-b-2  md:px-30">
                        <ul className=" px-2 md:px-30 flex justify-start items-center space-x-4 md:space-x-6 py-4 font-medium overflow-x-auto">
                            {items.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleClick(index)}
                                    className={`cursor-pointer hover:text-primary px-2 ${selected === index ? 'underline text-primary' : ''} underline-offset-8 decoration-primary decoration-2`}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='w-full  overflow-x-auto '>
                        <ul className='flex  justify-between space-x-4 py-4 font-bold px-4 md:px-30 overflow-x-auto' >
                            {titles.map((title, index) => (
                                <li key={index} 
                                >
                                    {title}
                                   
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Request;

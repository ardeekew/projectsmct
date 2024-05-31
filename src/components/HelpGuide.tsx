
import React, {useEffect, useRef} from 'react'
import ReactPlayer from 'react-player'


type Props = {}

const HelpGuide = (props: Props) => {
       
    return (
        <div className="bg-graybg dark:bg-blackbg  h-full pt-[26px]  px-[35px] ">
            <h1 className="text-primary dark:text-primaryD text-[32px] font-bold">Create Request</h1>
            <div className="bg-white w-full  mb-5 rounded-[12px] flex flex-col p-10">
             <div className='flex justify-center items-center '>
             <ReactPlayer url='https://www.youtube.com/watch?v=RnM3u99xIf4'   width='100%' height={640}  />
             </div>
             <p className=' font-bold'>"Comprehensive Video Guide: Setting Up Your Request with Detailed Instructions</p>
         </div>
        </div>
    )
}

export default HelpGuide;
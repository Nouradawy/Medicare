import {useState} from "react";

export default function Dropdown({children , trigger}){
    const [show,setShow] = useState(false);


    return(
        <div
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            className="relative inline-block"
            >
            <div
                className={`w-fit ${show ? "bg-white rounded-t-xl" : ""}`}>{trigger}</div>
            {show && <ul className="absolute w-full z-10
            bg-white divide-y divide-gray-100 rounded-b-lg shadow overflow-hidden"

            >{children}</ul> }
        </div>
    )
}

export function DropdownItem({children}){
    return(
        <li className="flex gap-3 items-center px-4 py-2 text-gray-800 hover:bg-gray-50
        cursor-pointer ">{children}</li>
    )
}
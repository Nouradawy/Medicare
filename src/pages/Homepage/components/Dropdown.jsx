import {useState , useRef} from "react";

export default function Dropdown({children , trigger}){
    const [show,setShow] = useState(false);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setShow(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setShow(false);
        }, 400); // adjust delay as needed
    };

    return(
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative inline-block"
            >
            <div
                className={`w-fit ${show ? "bg-white rounded-t-xl" : ""}`}>{trigger}</div>
            {show && (<ul className="absolute w-full z-11
            bg-white divide-y divide-gray-100 rounded-b-lg shadow-2xl shadow-black overflow-hidden"

            >{children}</ul>) }
        </div>
    )
}

export function DropdownItem({children }){
    return(
        <li className="flex gap-3 items-center px-4 py-2 text-gray-800 hover:bg-gray-50
        cursor-pointer ">{children}</li>
    )
}


export default function SearchBar({text ,Input, change , width}){

    return(
        <div className="flex rounded-2xl ">
            <svg width="56" height="59" viewBox="0 0 56 59" fill="none" xmlns="http://www.w3.org/2000/svg" className="z-10 ">
                <path d="M0 10C0 4.47715 4.47715 0 10 0H46C51.5229 0 56 4.47715 56 10V49C56 54.5228 51.5229 59 46 59H10C4.47715 59 0 54.5228 0 49V10Z" fill="#95D2FF"/>
                <path d="M36.625 40.5L31.7312 35.425M34.375 28.8333C34.375 33.988 30.3456 38.1667 25.375 38.1667C20.4044 38.1667 16.375 33.988 16.375 28.8333C16.375 23.6787 20.4044 19.5 25.375 19.5C30.3456 19.5 34.375 23.6787 34.375 28.8333Z" stroke="#444444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            <input
                style={{ width }}
                className="flex max-w-[600px] h-[59px] bg-[rgb(120,111,173,17%)] text-[Poppins] font-bold text-[#7B7B7B] rounded-xl  absolute z-0  pl-20 items-center justify-start focus:border-gray-400 focus:border-2 outline-0  "
                type="text"
                placeholder={text}
                value={Input}
                onChange={change}/>

        </div>

    );
}
import React, { useRef} from 'react';
import PropTypes from 'prop-types';

import './DragDropFile.css';
import {Trash} from "lucide-react";


import uploadImg from '../../assets/cloud-upload-regular-240.png';
import {ImageConfig} from "../../Constants/constant.jsx";
import APICalls from "../../services/APICalls.js";

export default function DragDropFile({ fileList , setFileList}) {

    const wrapperRef = useRef(null);



    const onDragEnter = () => wrapperRef.current.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            const updatedList = [...fileList, newFile];
            setFileList(updatedList);

        }
    }

    const fileRemove = (file) => {
        const updatedList = [...fileList];
        updatedList.splice(fileList.indexOf(file), 1);
        setFileList(updatedList);
    }

    return (
        <div className="flex flex-row" >
            <div
                ref={wrapperRef}
                className="drop-file-input"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="drop-file-input__label object-contain w-20 ">
                    <img src={uploadImg} alt="" />
                    <p className="text-ellipsis text-[11px] w-20">Upload File</p>
                </div>
                <input
                    type="file" value="" onChange={onFileDrop}/>
            </div>
            {
                fileList.length > 0 ? (
                    <div className="flex flex-row space-x-6 items-center mt-2 px-4">

                        {
                            fileList.map((item, index) => (
                                <div key={index} className=" group flex-col flex items-center justify-center ">
                                    <img
                                        className="object-contain w-10"
                                        src={ImageConfig[item.type.split('/')[1]] || ImageConfig['default']} alt="" />
                                    <span className="overflow-hidden text-ellipsis text-[11px] line-clamp-2 whitespace-pre-line text w-15 group-hover:line-clamp-none">
                                        {item.name}
                                    </span>
                                    <span className="absolute z-1 rounded-full bg-red-300 p-1 mt-14 hidden group-hover:inline-flex cursor-pointer " onClick={() => fileRemove(item)}><Trash className="w-4"/></span>
                                </div>
                            ))
                        }
                        {/*<button*/}
                        {/*    type="button"*/}
                        {/*    onClick={async ()=>{*/}
                        {/*        const formData = new FormData();*/}
                        {/*        fileList.forEach(file => formData.append('file', file));*/}
                        {/*        await APICalls.uploadDocument(formData,patientId);*/}
                        {/*        setFileList([]);*/}
                        {/*        onFileChange([]);*/}
                        {/*    }*/}
                        {/*}*/}
                        {/*    className="drop-file-preview__btn">*/}

                        {/*    Upload</button>*/}
                    </div>
                ) : null
            }
        </div>
    );
}

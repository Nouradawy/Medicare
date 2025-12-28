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
    };

    const fileRemove = (file) => {
        const updatedList = [...fileList];
        const idx = updatedList.indexOf(file);
        if (idx > -1) updatedList.splice(idx, 1);
        setFileList(updatedList);
    };

    const getExt = (item) => {
        // File: use MIME type -> image/png => png
        const mimeExt = item?.type?.split('/')?.[1];
        if (mimeExt) return mimeExt.toLowerCase();

        // String URL: use path extension
        if (typeof item === 'string') {
            const name = item.split('?')[0].split('#')[0];
            const ext = name.split('.').pop();
            return (ext || 'default').toLowerCase();
        }
        return 'default';
    };

    const getName = (item) => {
        if (item?.name) return item.name;
        if (typeof item === 'string') return item.split('/').pop();
        return 'file';
    };



    return (
        <div className="flex flex-col w-full">
            <div
                ref={wrapperRef}
                className="relative group cursor-pointer w-full"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <span className="material-icons-round">cloud_upload</span>
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Click to upload or drag &amp; drop
                            </p>
                            <p className="text-xs text-gray-400">PDF, PNG, JPG (max. 10MB)</p>
                        </div>
                    </div>
                </div>

                <input
                    type="file"
                    value=""
                    onChange={onFileDrop}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>

            {Array.isArray(fileList) && fileList.length > 0 ? (
                <div className="flex flex-row space-x-6 items-center mt-2 px-4">
                    {fileList.map((item, index) => {
                        const ext = getExt(item);
                        const name = getName(item);
                        const icon = ImageConfig[ext] || ImageConfig['default'];
                        return (
                            <div key={index} className="group flex-col flex items-center justify-center">
                                <img className="object-contain w-10 h-10" src={icon} alt="" />
                                <span className="overflow-hidden text-ellipsis text-[11px] line-clamp-2 whitespace-pre-line group-hover:line-clamp-none">
                  {name}
                </span>
                                <span
                                    className="absolute z-10 rounded-full bg-red-300 p-1 mt-14 hidden group-hover:inline-flex cursor-pointer"
                                    onClick={() => fileRemove(item)}
                                >
                  <Trash className="w-4" />
                </span>
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}

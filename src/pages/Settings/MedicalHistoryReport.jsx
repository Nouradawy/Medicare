import {DefaultFemale, DefaultMale, ImageConfig} from "../../Constants/constant.jsx";
import {ChevronRight, Send, Loader2, Plus, Trash2} from "lucide-react";
import React, {useEffect, useState} from "react";
import DragDropFile from "../../components/FilePicker/DragDropFile.jsx";
import PDFReader from "./PDFReader.jsx";
import APICalls from "../../services/APICalls.js";
import toast from 'react-hot-toast';
import {useEditor, EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import {TextStyle} from '@tiptap/extension-text-style'; // use named import
import {Color} from '@tiptap/extension-color'; // use named import
import {Extension} from '@tiptap/core';

// Reusable TipTap editor component with toolbar
function RichTextEditor ({editor, className = ""}) {
    if (!editor) return null;
    return (
        <div className={className}>
            <div className="flex flex-wrap items-center gap-2 mb-2">
                <button type="button" className="px-2 py-1 border rounded"
                        onClick={() => editor.chain ().focus ().toggleBold ().run ()} title="Bold">B
                </button>
                <button type="button" className="px-2 py-1 border rounded"
                        onClick={() => editor.chain ().focus ().toggleItalic ().run ()} title="Italic">I
                </button>
                <button type="button" className="px-2 py-1 border rounded"
                        onClick={() => editor.chain ().focus ().toggleUnderline?. ().run ()} title="Underline">U
                </button>
                <button type="button" className="px-2 py-1 border rounded"
                        onClick={() => editor.chain ().focus ().setTextAlign ('left').run ()} title="Align Left">Left
                </button>
                <button type="button" className="px-2 py-1 border rounded"
                        onClick={() => editor.chain ().focus ().setTextAlign ('center').run ()}
                        title="Align Center">Center
                </button>
                <button type="button" className="px-2 py-1 border rounded"
                        onClick={() => editor.chain ().focus ().setTextAlign ('right').run ()} title="Align Right">Right
                </button>
                <button type="button" className="px-2 py-1 border rounded"
                        onClick={() => editor.chain ().focus ().setTextAlign ('justify').run ()} title="Justify">Justify
                </button>
                <input type="color" className="h-8 w-8 p-0 border rounded"
                       onChange={(e) => editor.chain ().focus ().setColor (e.target.value).run ()} title="Text Color"/>
                <select
                    className="px-2 py-1 border rounded text-sm"
                    title="Font Size"
                    defaultValue=""
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                            editor.commands.unsetFontSize ();
                        } else {
                            editor.commands.setFontSize (val);
                        }
                    }}
                >
                    <option value="">Size</option>
                    <option value="12px">Small</option>
                    <option value="16px">Normal</option>
                    <option value="20px">Large</option>
                    <option value="28px">Huge</option>
                </select>
            </div>
            <div
                className="flex-1 border border-gray-200 rounded-lg mx-2 mb-2 p-2 cursor-text focus:outline-none focus:ring-0 focus:border-gray-200"
                onMouseDown={(e) => {
                    // If clicking the empty container (outside the actual editor content), focus the editor
                    const target = e.target;
                    const isInsideEditor = target.closest ('.tiptap');
                    if (!isInsideEditor) {
                        editor?.chain ().focus ().run ();
                    }
                    // Do NOT preventDefault here; allow native text selection to work on content
                }}
                style={{minHeight: '5rem'}}
            >
                <EditorContent
                    editor={editor}
                    className="tiptap min-h-[4rem] focus:outline-none"
                />
            </div>
        </div>
    );
}

// Custom FontSize extension using TextStyle mark
const FontSize = Extension.create ({
    name: 'fontSize',
    addGlobalAttributes () {
        return [
            {
                types: ['textStyle'],
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize?.replace (/['\"]+/g, '') || null,
                        renderHTML: attributes => {
                            if (!attributes.fontSize) return {};
                            return {style: `font-size: ${attributes.fontSize}`};
                        },
                    },
                },
            },
        ];
    },
    addCommands () {
        return {
            setFontSize:
                fontSize => ({chain}) => {
                    return chain ().setMark ('textStyle', {fontSize}).run ();
                },
            unsetFontSize:
                () => ({chain}) => {
                    return chain ().setMark ('textStyle', {fontSize: null}).run ();
                },
        };
    },
});

function GenericModal ({open, type, value, onChange, onClose, onSave, config}) {
    const [isSaving, setIsSaving] = useState (false);

    if (!open || !type) return null;
    const cfg = config[type];

    const handleSubmit = async (e) => {
        e.preventDefault ();
        try {
            setIsSaving (true);
            await onSave (); // wait for save to complete
        } finally {
            setIsSaving (false);
        }
    };

    // Helper: render one input/select with label and placeholder
    const renderField = (f) => {
        const common = {
            name: f.name,
            value: value[f.name] || "",
            onChange,
            required: !!f.required,
            className: "w-full border-2 border-gray-200 rounded-lg p-2",
            placeholder: f.placeholder || ""
        };

        return (
            <div key={f.name}>
                <label className="block text-sm mb-1">{f.label}</label>
                {f.type === "select" ? (
                    <select {...common}>
                        <option value="">Select</option>
                        {(f.options || []).map ((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                ) : f.type === "textarea" ? (
                    <textarea
                        {...common}
                        rows={f.rows || 6}
                        className={common.className + " min-h-32 resize-y"}
                    />
                ) : (
                    <input type={f.type || "text"} {...common} />
                )}
            </div>
        );
    };

    // Layout rules:
    // - fields with group: "single" render as single rows
    // - fields with group: "grid2" render in a 2-column grid
    // - default is "single"
    const singles = (cfg.fields || []).filter ((f) => (f.group || "single") === "single");
    const grid2 = (cfg.fields || []).filter ((f) => f.group === "grid2");

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
            <div className="relative z-[1001] w-[92vw] max-w-lg rounded-lg bg-white p-5 shadow-xl">
                <h3 className="text-lg font-semibold mb-4">{cfg.title}</h3>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Single-row fields */}
                    {singles.map (renderField)}

                    {/* Two-column grid fields */}
                    {grid2.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                            {grid2.map (renderField)}
                        </div>
                    )}

                    {/* Optional description/help text */}
                    {cfg.helpText && (
                        <p className="text-xs text-gray-500 mt-1">{cfg.helpText}</p>
                    )}

                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={"px-4 py-2 rounded-lg text-white " + (isSaving ? "bg-blue-400 cursor-wait" : "bg-blue-500 hover:bg-blue-600")}
                            disabled={isSaving}
                        >

                            {isSaving ? (
                                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin"/>
                  Saving...
                </span>
                            ) : (
                                "Save"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function MedicalHistoryReport ({appointment, Index, user, setUser, onAddHistory}) {
    const currentAppointment = appointment[Index];
    const [refreshKey, setRefreshKey] = useState (0);
    const [dropdownIndex, setDropdownIndex] = useState (null);
    const [showPDF, setShowPDF] = useState (false);
    const [PDFurl, setPDFurl] = useState (null);
    const [fileList, setFileList] = useState ([]);
    const [uploading, setUploading] = useState (false);
    const [modalOpen, setModalOpen] = useState (false);
    const [modalType, setModalType] = useState (null); // 'drugHistories' | 'allergies' | 'chronicDiseases' | 'medicalHistories'
    const [modalValue, setModalValue] = useState ({});
    const [showHistory, setShowHistory] = useState (false);
    const [formData, setFormData] = useState ({
        ReportText: "",
        PatientIssue: appointment[Index].visitPurpose,
    });

    // Define local user state used by dropdown tables
    const [localUser, setLocalUser] = useState (currentAppointment?.user);

    // Reservation context and existing visit lookup
    const reservationId = currentAppointment?.id;
    const existingVisit = React.useMemo (
        () => (user?.doctor?.preVisits || []).find (v => v.reservationId === reservationId),
        [user, reservationId]
    );

    // Modal config used by GenericModal
    const MODAL_CONFIG = {
        drugHistories: {
            title: "Add New Medication",
            helpText: "Fill all relevant fields. You can save and add more later.",
            empty: {drugName: "", dosage: "", route: "", frequency: "", duration: "", prescribingPhysician: ""},
            fields: [
                {
                    name: "drugName",
                    label: "Medication Name",
                    type: "text",
                    required: true,
                    placeholder: "e.g., Amoxicillin",
                    group: "single"
                },
                {name: "dosage", label: "Dosage", type: "text", placeholder: "e.g., 500 mg", group: "grid2"},
                {
                    name: "route",
                    label: "Route",
                    type: "select",
                    options: ["Oral", "IV", "IM", "Topical"],
                    group: "grid2"
                },
                {name: "frequency", label: "Frequency", type: "text", placeholder: "e.g., 3 times/day", group: "grid2"},
                {name: "duration", label: "Duration", type: "text", placeholder: "e.g., 7 days", group: "grid2"},
                {
                    name: "prescribingPhysician",
                    label: "Prescribing Physician",
                    type: "text",
                    placeholder: "e.g., Dr. Smith",
                    group: "single"
                }
            ]
        },
        allergies: {
            title: "Add New Allergy",
            helpText: "Specify allergen, reaction, and severity.",
            empty: {allergy: "", reaction: "", severity: ""},
            fields: [
                {
                    name: "allergy",
                    label: "Allergen",
                    type: "text",
                    required: true,
                    placeholder: "e.g., Penicillin",
                    group: "single"
                },
                {name: "reaction", label: "Reaction", type: "text", placeholder: "e.g., Rash, hives", group: "grid2"},
                {
                    name: "severity",
                    label: "Severity",
                    type: "select",
                    options: ["Mild", "Moderate", "Severe"],
                    group: "grid2"
                }
            ]
        },
        chronicDiseases: {
            title: "Add Chronic Disease",
            helpText: "Enter the disease name and optional notes.",
            empty: {name: "", description: ""},
            fields: [
                {
                    name: "name",
                    label: "Disease Name",
                    type: "text",
                    required: true,
                    placeholder: "e.g., Diabetes Mellitus",
                    group: "single"
                },
                {
                    name: "description",
                    label: "Description",
                    type: "text",
                    placeholder: "e.g., Type 2, on Metformin",
                    group: "single"
                }
            ]
        },
        medicalHistories: {
            title: "Add Medical History",
            helpText: "Add the event date and description.",
            empty: {date: "", description: ""},
            fields: [
                {name: "date", label: "Date", type: "date", required: true, group: "single"},
                {
                    name: "description",
                    label: "Description",
                    type: "textarea",
                    required: true,
                    placeholder: "e.g., Appendectomy",
                    group: "single"
                }
            ]
        }
    };

    // Placeholder state to aggregate modal changes locally (used by saveNewItem)
    const [, setmodelData] = useState ({
        allergies: Array.isArray (currentAppointment?.user?.allergy) ? currentAppointment.user.allergy : [],
        chronicDiseases: Array.isArray (currentAppointment?.user?.chronicDiseases) ? currentAppointment.user.chronicDiseases : [],
        drugHistories: Array.isArray (currentAppointment?.user?.drugHistories) ? currentAppointment.user.drugHistories : [],
        medicalHistories: Array.isArray (currentAppointment?.user?.medicalHistories) ? currentAppointment.user.medicalHistories : []
    });

    // Initialize TipTap editor bound to ReportText
    const editor = useEditor ({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            TextAlign.configure ({types: ['heading', 'paragraph']}),
            FontSize,
        ],
        content: formData.ReportText,
        onUpdate ({editor}) {
            const html = editor.getHTML ();
            setFormData ((prev) => ({...prev, ReportText: html}));
        }
    });

    // When existingVisit changes, seed editor content
    useEffect (() => {
        if (editor && existingVisit) {
            editor.commands.setContent (existingVisit.reportText || "");
        }
    }, [editor, existingVisit?.reportText]);

    // Read-only TipTap instance to render saved report text
    const viewEditor = useEditor ({
        extensions: [StarterKit, TextStyle, Color, TextAlign.configure ({types: ['heading', 'paragraph']})],
        content: existingVisit?.reportText || '',
        editable: false
    });

    useEffect (() => {
        if (viewEditor) {
            viewEditor.commands.setContent (existingVisit?.reportText || '');
        }
    }, [viewEditor, existingVisit?.reportText]);

    const openModal = (type, item) => {
        const cfg = MODAL_CONFIG[type];
        if (!cfg) return;

        // If the clicked item has that field, use it; otherwise fall back to cfg.empty.
        const seeded = (cfg.fields || []).reduce ((acc, f) => {
            acc[f.name] = item && item[f.name] != null
                ? item[f.name]
                : (cfg.empty?.[f.name] ?? "");
            return acc;
        }, {});
        if (item?.id != null) seeded.id = item.id;
        setModalType (type);
        setModalValue (seeded);
        setModalOpen (true);
    };

    const closeModal = () => {
        setModalOpen (false);
        setModalType (null);
        setModalValue ({});
    };
    const handleModalChange = (e) => {

        const {name, value} = e.target;
        setModalValue ((prev) => ({...prev, [name]: value}));
    };
    const saveNewItem = async () => {
        if (!modalType) return;
        setmodelData ((prev) => ({
            ...prev,
            [modalType]: [...(Array.isArray (prev[modalType]) ? prev[modalType] : []), {...modalValue}]
        }));
        const payload = {
            patientId: currentAppointment?.patientId,
            [modalType]: [modalValue],
        };
        console.log (payload);

        try {
            await APICalls.DoctorEditPatientInfo (payload);
            toast.success ('Medical history saved successfully!');
            setLocalUser ((prev) => {
                if (!prev) return prev;
                const next = {...prev};
                if (Array.isArray (next[modalType])) {
                    const idx = next[modalType].findIndex ((x) => x.id === modalValue.id && modalValue.id != null);
                    next[modalType] = idx >= 0
                        ? [...next[modalType].slice (0, idx), {...modalValue}, ...next[modalType].slice (idx + 1)]
                        : [...next[modalType], {...modalValue}];
                }
                return next;
            });
        } catch (error) {
            toast.error (error.message || 'Failed to save medical history');
        } finally {
            // Refresh appointments to get updated data
            setRefreshKey ((k) => k + 1);
            setModalOpen (false);
        }


    };


    const refreshUser = async () => {
        const updatedUser = await APICalls.GetCurrentUser ();
        setUser (updatedUser);
    };

    const handleDeleteFile = async (fileUrl) => {
        setUploading (true);
        try {
            const data = new FormData ();
            data.append ("ReservationId", reservationId);
            data.append ("action", "delete");
            data.append ("fileUrl", fileUrl);
            await APICalls.uploadDocument (data, appointment[Index].patientId);
            await refreshUser ();
            toast.success ("File deleted.");
        } catch (e) {
            toast.error (e?.message || "Failed to delete file");
        } finally {
            setUploading (false);
        }
    };

    const handleReplaceFiles = async () => {
        if (fileList.length === 0) return;
        setUploading (true);
        try {
            const data = new FormData ();
            data.append ("ReservationId", reservationId);
            data.append ("action", "replace");
            fileList.forEach ((file) => data.append ("file", file));
            await APICalls.uploadDocument (data, appointment[Index].patientId);
            setFileList ([]);
            await refreshUser ();
            toast.success ("Files replaced.");
        } catch (e) {
            toast.error (e?.message || "Failed to replace files");
        } finally {
            setUploading (false);
        }
    };

    function ReadOnlyReport ({content}) {
        const roEditor = useEditor ({
            extensions: [StarterKit, TextStyle, Color, TextAlign.configure ({types: ['heading', 'paragraph']})],
            content: content || '',
            editable: false,
        });

        return <EditorContent editor={roEditor}/>;
    }

    function VisitHistoryList ({
                                   visits = [],
                                   maxHeight = "40vh",
                                   onFileClick,
                                   formatDate,
                                   className = "",
                               }) {
        const handleFileClick = (file) => {
            if (onFileClick) onFileClick (file);
        };

        return (
            <div
                className={`overflow-y-auto pr-2 ${className}`}
                style={{maxHeight}}
            >
                {visits.map ((visit, index) => (
                    <div className="flex flex-row" key={index}>
                        <div className="flex-col w-full px-4 pt-4">
                            <div className="flex-row flex items-center w-full justify-between">
                                <p className="text-sm font-medium ml-2">{formatDate (visit.date)}</p>
                                <div className="w-[55cqw] h-[2px] bg-gray-300/40"></div>
                            </div>
                            <div className="flex-row flex w-full justify-between items-start mt-2 gap-4">
                                <div className="text-sm ml-2 flex-1">
                                    <ReadOnlyReport content={visit.reportText}/>
                                </div>
                                <div
                                    className="flex-col flex overflow-y-auto h-[100px] w-[20cqw] border-l-2 border-gray-400 items-center ">
                                    {visit.reportFiles.map ((file, i2) => (
                                        <button
                                            key={i2}
                                            type="button"
                                            className="justify-center items-center flex-col flex"
                                            onClick={() => handleFileClick (file)}
                                        >
                                            <img
                                                className="object-contain w-10"
                                                src={ImageConfig[file.split (".").pop ()] || ImageConfig["default"]}
                                                alt=""
                                            />
                                            <span className="text-[11px] w-15">{file.split ("/").pop ()}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            {
                showPDF === true ? (
                    <PDFReader close={setShowPDF} url={PDFurl}/>
                ) : (
                    <div className="bg-white h-full rounded-lg shadow p-6 flex flex-col">
                        <div className="flex flex-row">
                            <img
                                src={appointment[Index].user.imageUrl != null ? appointment[Index].user.imageUrl : appointment[Index].user.gender === "male" ? DefaultMale : DefaultFemale}
                                className="h-22 w-22 rounded-full object-cover" alt=""/>
                            <div className="flex-col">
                                <p> Name: {appointment[Index].user.fullName}</p>
                                <p> Gender: {appointment[Index].user.gender}</p>
                                <p> Age: {appointment[Index].user.age}</p>
                                <p> Age: {appointment[Index].user.dateOfBirth}</p>
                            </div>

                        </div>
                        {/*First Dropdown*/}
                        <button
                            type="button"
                            className="flex flex-row  mt-5 bg-amber-300 rounded-t-lg py-2"
                            onClick={() => dropdownIndex !== 0 ? setDropdownIndex (0) : setDropdownIndex (null)}>
                            <div
                                className={`${dropdownIndex === 0 ? "rotate-90" : ""} duration-300 transition-all ease-in-out`}>
                                <ChevronRight/></div>
                            VISIT REPORT
                        </button>

                        {/* Make the dropdown content a fixed height panel when open so the editor can fill it */}
                        <div
                            className={`flex flex-col rounded-b-xl duration-300 transition-all ease-in-out 
                       overflow-hidden @container 
                       ${dropdownIndex === 0 ?
                                showHistory ? "h-[68vh]" : existingVisit ? "h-[45vh]" : "h-[30vh]"
                                : "h-0"}
                       `}
                        >
                            {/* Allow file selection only when creating a new report */}
                            {!existingVisit &&
                                (
                                    <div className="flex flex-col px-4 pt-2 gap-3">
                                        {/* Reusable editor for composing a new report */}
                                        <RichTextEditor editor={editor}/>
                                        {/* New report files uploader and Upload button */}
                                        <div className="flex flex-row items-center gap-3">
                                            <DragDropFile fileList={fileList} setFileList={setFileList}/>

                                        </div>
                                        <button
                                            type="button"
                                            className="self-end bg-amber-300 w-30 rounded-lg py-2 px-4
                                   hover:bg-amber-400 transition-colors
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={uploading || !formData.ReportText?.trim ()}
                                            onClick={async () => {
                                                setUploading (true);
                                                try {
                                                    const data = new FormData ();
                                                    data.append ("ReportText", formData.ReportText);
                                                    data.append ("ReservationId", reservationId);
                                                    fileList.forEach (file => data.append ("file", file));
                                                    await APICalls.uploadDocument (data, appointment[Index].patientId);
                                                    setFileList ([]);
                                                    setFormData ({...formData, ReportText: ""});

                                                    const updatedUser = await APICalls.GetCurrentUser ();
                                                    setUser (updatedUser);
                                                    toast.success ("Report uploaded successfully!");
                                                } catch (error) {
                                                    toast.error (error.message || "Failed to upload report");
                                                } finally {
                                                    setUploading (false);
                                                }
                                            }}
                                        >
                                            <div className="flex-row flex items-center gap-1">
                                                {uploading ? <Loader2 className="w-4 h-4 animate-spin"/> :
                                                    <Send className="w-4 h-4"/>}
                                                {uploading ? "Uploading..." : "Upload"}
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            className="text-xs bg-amber-300 hover:bg-amber-400 rounded px-3 py-1 transition-colors"
                                            onClick={() => setShowHistory ((v) => !v)}
                                        >
                                            {showHistory ? "Hide history" : "Show history"}
                                        </button>
                                    </div>
                                )}

                            {/* Show existing report entry for this reservation if present */}
                            {existingVisit ? (
                                <div className="flex flex-row">
                                    <div className="flex-col w-full px-4 pt-2">{/* reduce top padding */}
                                        <div className="flex-row flex items-center w-full justify-between">
                                            <p className="text-sm font-medium ml-2">{formatDate (existingVisit.date)}</p>
                                            <div className="w-[55cqw] h-[2px] bg-gray-300/40"></div>
                                        </div>
                                        {/* Stack report text and files vertically */}
                                        <div className="flex flex-col w-full mt-2 gap-3">
                                            <div className="text-sm ml-2">
                                                {/* Inline toolbar above editable content */}
                                                <RichTextEditor editor={editor} className=""/>
                                            </div>

                                            {/* Files section under report text */}
                                            <div
                                                className="flex flex-col max-h-[240px] w-full border-t-2 border-gray-200 gap-2 px-2 pt-2">
                                                {existingVisit.reportFiles.map ((file, index) => (
                                                    <div key={index}
                                                         className="flex items-center justify-between gap-2">
                                                        <button
                                                            type="button"
                                                            className="justify-center items-center flex-row gap-2"
                                                            onClick={() => {
                                                                setPDFurl (file.toString ());
                                                                setShowPDF (true);
                                                            }}
                                                        >
                                                            <img
                                                                className="object-contain w-10"
                                                                src={ImageConfig[file.split (".").pop ()] || ImageConfig["default"]}
                                                                alt=""
                                                            />
                                                            <span
                                                                className="text-[11px]">{file.split ("/").pop ()}</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="text-red-600 hover:text-red-700 px-2 py-1 rounded flex items-center gap-1 disabled:opacity-50"
                                                            disabled={uploading}
                                                            onClick={() => handleDeleteFile (file)}
                                                            title="Delete file"
                                                        >
                                                            <Trash2 className="w-4 h-4"/>
                                                            Delete
                                                        </button>
                                                    </div>
                                                ))}


                                            </div>
                                            <div className="mt-2">
                                                <div
                                                    className={`mb-5 bg-gray-100 justify-center rounded-xl flex border border-gray-200`}>
                                                    <DragDropFile fileList={fileList} setFileList={setFileList}/>
                                                </div>

                                                <div className={'flex justify-items-center flex-row justify-center'}><p
                                                    className="text-[11px] text-gray-500 mt-1">
                                                    Selected files will replace existing files for this reservation.
                                                </p>
                                                    <button
                                                        type="button"
                                                        className="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        disabled={uploading}
                                                        onClick={async () => {
                                                            setUploading (true);
                                                            try {
                                                                const data = new FormData ();
                                                                data.append ("ReportText", formData.ReportText);
                                                                data.append ("ReservationId", reservationId);
                                                                fileList.forEach (file => data.append ("file", file));
                                                                await APICalls.uploadDocument (data, appointment[Index].patientId);

                                                                const updatedUser = await APICalls.GetCurrentUser ();
                                                                setUser (updatedUser);
                                                                toast.success ("Report updated successfully!");
                                                            } catch (error) {
                                                                toast.error (error.message || "Failed to update report");
                                                            } finally {
                                                                setUploading (false);
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex-row flex items-center gap-1">
                                                            {uploading ? <Loader2 className="w-4 h-4 animate-spin"/> :
                                                                <Send className="w-4 h-4"/>}
                                                            {uploading ? "Saving..." : "Save changes"}
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>


                                        </div>

                                        {/* Save changes button at the bottom */}
                                        <div className="flex justify-end mt-4">


                                        </div>
                                        <button
                                            type="button"
                                            className="text-xs bg-amber-300 hover:bg-amber-400 rounded px-3 py-1 transition-colors"
                                            onClick={() => setShowHistory ((v) => !v)}
                                        >
                                            {showHistory ? "Hide history" : "Show history"}
                                        </button>

                                        {showHistory ? (
                                            <VisitHistoryList
                                                visits={user.doctor.preVisits.slice ().reverse ()}
                                                maxHeight="40vh"
                                                formatDate={formatDate}
                                                onFileClick={(file) => {
                                                    setPDFurl (file.toString ());
                                                    setShowPDF (true);
                                                }}
                                            />
                                        ) : null}
                                    </div>

                                </div>
                            ) : (
                                showHistory ? (
                                    <VisitHistoryList
                                        visits={user.doctor.preVisits.slice ().reverse ()}
                                        maxHeight="40vh"
                                        formatDate={formatDate}
                                        onFileClick={(file) => {
                                            setPDFurl (file.toString ());
                                            setShowPDF (true);
                                        }}
                                    />) : null
                            )}
                        </div>
                        {/*Second Dropdown - medicalHistories*/}
                        <div
                            className="flex flex-row items-center justify-between mt-5 bg-amber-300 rounded-t-lg py-2 pr-2">
                            <button
                                type="button"
                                className="flex flex-row flex-1"
                                onClick={() => dropdownIndex !== 1 ? setDropdownIndex (1) : setDropdownIndex (null)}>
                                <div
                                    className={`${dropdownIndex === 1 ? "rotate-90" : ""} duration-300 transition-all ease-in-out`}>
                                    <ChevronRight/></div>
                                MEDICAL HISTORY
                            </button>
                            {onAddHistory && dropdownIndex === 1 && (
                                <button
                                    type="button"
                                    className="bg-amber-500 text-white hover:bg-amber-600 px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation ();
                                        onAddHistory (currentAppointment);
                                    }}
                                >
                                    <Plus size={14}/> Add
                                </button>
                            )}
                        </div>
                        <div
                            className={`flex flex-col rounded-b-xl duration-300 transition-all ease-in-out overflow-hidden @container ${dropdownIndex === 1 ? "max-h-200" : "max-h-0"}`}>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 ">
                                    {(localUser?.medicalHistories || []).map ((history, index) => (
                                        <tr
                                            key={history.id ?? index}
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() => openModal ("medicalHistories", history)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">{history.date}</td>
                                            <td className="px-6 py-4">{history.description}</td>
                                        </tr>
                                    ))}


                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/*Third Dropdown - chronicDiseases*/}
                        <button
                            type="button"
                            className="flex flex-row  mt-5 bg-amber-300 rounded-t-lg py-2"
                            onClick={() => dropdownIndex !== 2 ? setDropdownIndex (2) : setDropdownIndex (null)}>
                            <div
                                className={`${dropdownIndex === 2 ? "rotate-90" : ""} duration-300 transition-all ease-in-out`}>
                                <ChevronRight/></div>
                            CHRONIC DISEASE
                        </button>
                        <div
                            className={`flex flex-col rounded-b-xl duration-300 transition-all ease-in-out overflow-hidden @container ${dropdownIndex === 2 ? "max-h-200" : "max-h-0"}`}>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 ">
                                    {(localUser?.chronicDiseases || [])
                                        .map ((disease, index) => (
                                            <tr
                                                key={disease.id ?? index}
                                                className="hover:bg-gray-50 cursor-pointer"
                                                onClick={() => openModal ("chronicDiseases", disease)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">{disease.name}</td>
                                                <td className="px-6 py-4">{disease.description}</td>
                                            </tr>
                                        ))}


                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/*Forth Dropdown - allergies */}
                        <button
                            type="button"
                            className="flex flex-row  mt-5 bg-amber-300 rounded-t-lg py-2"
                            onClick={() => dropdownIndex !== 3 ? setDropdownIndex (3) : setDropdownIndex (null)}>
                            <div
                                className={`${dropdownIndex === 3 ? "rotate-90" : ""} duration-300 transition-all ease-in-out`}>
                                <ChevronRight/></div>
                            Allergies
                        </button>
                        <div
                            className={`flex flex-col rounded-b-xl duration-300 transition-all ease-in-out overflow-hidden @container ${dropdownIndex === 3 ? "max-h-200" : "max-h-0"}`}>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Allergies
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 ">
                                    {(localUser?.allergies || [])
                                        .map ((allergy, index) => (

                                            <tr
                                                key={allergy.id ?? index}
                                                className="hover:bg-gray-50 cursor-pointer"
                                                onClick={() => openModal ("allergies", allergy)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">{allergy.allergy}</td>
                                                <td className="px-6 py-4">{allergy.description}</td>
                                            </tr>
                                        ))}


                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/*Fifth Dropdown - drugHistories*/}
                        <button
                            type="button"
                            className="flex flex-row  mt-5 bg-amber-300 rounded-t-lg py-2"
                            onClick={() => dropdownIndex !== 4 ? setDropdownIndex (4) : setDropdownIndex (null)}>
                            <div
                                className={`${dropdownIndex === 4 ? "rotate-90" : ""} duration-300 transition-all ease-in-out`}>
                                <ChevronRight/></div>
                            MEDICATIONS
                        </button>
                        <div
                            className={`flex flex-col rounded-b-xl duration-300 transition-all ease-in-out overflow-hidden @container ${dropdownIndex === 4 ? "max-h-200" : "max-h-0"}`}>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            MEDICATIONS
                                        </th>

                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 ">
                                    {(localUser?.drugHistories || [])
                                        .map ((drug) => (
                                            <tr
                                                key={drug.id ?? `${drug.drugName}-${Math.random ()}`
                                                }
                                                className="hover:bg-gray-50 cursor-pointer"
                                                onClick={() => openModal ("drugHistories", drug)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">{drug.drugName}</td>
                                            </tr>
                                        ))}


                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Edit Modal */}
                        <GenericModal
                            open={modalOpen}
                            type={modalType}
                            value={modalValue}
                            onChange={handleModalChange}
                            onClose={closeModal}
                            onSave={saveNewItem}
                            config={MODAL_CONFIG}
                        />
                    </div>


                )
            }
        </>

    );

}

function formatDate (dateString) {
    const date = new Date (dateString);
    const day = date.toLocaleDateString ('en-US', {weekday: 'long'});
    const month = date.toLocaleDateString ('en-US', {month: 'short'});
    const dayNum = date.getDate ();
    const getOrdinal = n => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    };
    return `${day}, ${month} ${dayNum}${getOrdinal (dayNum)}`;
}
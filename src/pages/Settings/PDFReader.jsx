import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import {useState} from "react";
export default function PDFReader({url,close}) {
    const [numPages, setNumPages] = useState(null);
    const [scale, setScale] = useState(2.0);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    return(<div className="fixed inset-0 bg-[rgba(64,64,64,61%)] flex flex-col justify-center items-center z-10">

        <div
            className="rounded-2xl"
            style={{ height: '90vh', width: '60vw', overflowY: 'auto', background: 'white', borderRadius: 8, padding: 16, alignItems: "center", display: "flex", flexDirection: "column" }}>
            <button
                className="fixed right-0 px-4  z-11 mr-[20vw] rounded-full bg-red-500 text-white p-2 transform translate-x-2 -translate-y-5"
                onClick={() => close(false)}>x</button>
        <div style={{ marginBottom: 10 }}>

            <button onClick={() => setScale(s => Math.min(s + 0.2, 3))}>Zoom In</button>
            <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} style={{ marginLeft: 8 }}>Zoom Out</button>
            <span style={{ marginLeft: 12 }}>Zoom: {Math.round(scale * 100)}%</span>
        </div>

            <Document file={`http://localhost:8080/proxy/${url.split('/')[0]}`}
                     onLoadSuccess={onDocumentLoadSuccess}
                     onLoadError={console.error}>
            {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={scale}/>
            ))}
        </Document></div>
    </div>)

}
import React, { useEffect, useState } from "react";
import "./drag-drop.css";
import { MdClear } from "react-icons/md";
import { AiOutlineCheckCircle, AiOutlineCloudUpload } from "react-icons/ai";

export const DragNDropPDF = ({
    onFilesSelected,
    width,
    height,
    setErrorMessage,
}) => {
    const [files, setFiles] = useState([]);

    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            if (event.target.files[0].type === 'application/pdf') {
                setErrorMessage('');
                const newFiles = Array.from(selectedFiles);
                setFiles(newFiles);
            } else {
                setFiles([])
                setErrorMessage("Archivo no permitido, sólo archivos PDF");
            }
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFiles = event.dataTransfer.files;
        if (droppedFiles.length > 0) {
            if (droppedFiles.length > 1) {
                setErrorMessage("Sólo puedes arrastrar un archivo")
                setFiles([])
            } else {
                if (droppedFiles[0].type === 'application/pdf') {
                    setErrorMessage('');
                    const newFiles = Array.from(droppedFiles);
                    setFiles(newFiles);
                } else {
                    setFiles([])
                    setErrorMessage("Archivo no permitido, sólo archivos PDF");
                }
            }
        }
    };

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setErrorMessage("")
    };

    useEffect(() => {
        onFilesSelected(files);
    }, [files, onFilesSelected]);

    return (
        <section className="drag-drop" style={{ width: width, height: height }}>
            <div
                className={`document-uploader ${files.length > 0 ? "upload-box active" : "upload-box"}`}
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}>
                <>
                    <div className="upload-info">
                        <AiOutlineCloudUpload />
                        <div>
                            <p>Arrastra tus archivos aquí</p>
                            <p>Permitidos: .PDF</p>
                        </div>
                    </div>
                    <input
                        type="file"
                        hidden
                        id="browse"
                        onChange={handleFileChange}
                        accept="application/pdf" />
                    <label htmlFor="browse" className="browse-btn">
                        Seleccionar archivo...
                    </label>
                </>
                {files.length > 0 && (
                    <div className="file-list">
                        <div className="file-list__container">
                            {files.map((file, index) => (
                                <div className="file-item" key={index}>
                                    <div className="file-info" style={{ justifyContent: "center" }}>
                                        <p>{file.name}&nbsp;&nbsp;&nbsp;<MdClear onClick={() => handleRemoveFile(index)} /></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {files.length > 0 && (
                    <div className="success-file">
                        <AiOutlineCheckCircle
                            style={{ color: "#6DC24B", marginRight: 1 }}
                        />
                        <p>{files.length} archivo seleccionado</p>
                    </div>
                )}
            </div>
        </section>
    );
};
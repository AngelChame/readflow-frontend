"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { IconUpload } from "../atoms/icons/IconUpload";

interface DropZoneProps {
  onFileSelected?: (file: File) => void;
}

export default function DropZone({ onFileSelected }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (incoming: File) => {
    if (incoming.type !== "application/pdf") {
      setError("Solo se aceptan archivos PDF.");
      setFile(null);
      return;
    }
    setError(null);
    setFile(incoming);
    onFileSelected?.(incoming);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={[
        "flex flex-col items-center justify-center gap-3",
        "h-40 w-full md:w-1/2 rounded-xl cursor-pointer select-none",
        "outline-dashed outline-2 transition-all duration-200",
        "bg-background-upload",
        isDragging
          ? "outline-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[1.02]"
          : "outline-border-secondary hover:outline-blue-400 hover:bg-background-upload-hover",
      ].join(" ")}
    >
      <IconUpload
        className={`w-8 h-8 transition-colors duration-200 ${isDragging ? "text-blue-500" : "text-slate-400"}`}
      />

      {file ? (
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 text-center px-4 truncate max-w-full">
          📄 {file.name}
        </span>
      ) : (
        <span className="text-sm font-medium text-slate-400 text-center px-4">
          {isDragging
            ? "Suelta el PDF aquí"
            : "Arrastra tu PDF aquí o haz clic para seleccionar"}
        </span>
      )}

      {error && (
        <span className="text-xs text-red-500 font-medium">{error}</span>
      )}

      {/* input oc*/}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}

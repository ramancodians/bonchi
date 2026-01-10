import React, { useRef, useState } from "react";
import { Upload, X, File, CheckCircle } from "lucide-react";
import { useFileUpload } from "../../hooks/useFileUpload";

interface FileUploadProps {
  onUploadComplete?: (file: any) => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  accept = "*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadFile, uploading, progress, error, uploadedFile, resetUpload } =
    useFileUpload();

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${(maxSize / (1024 * 1024)).toFixed(
        0
      )}MB limit`;
    }
    return null;
  };

  const handleFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    setSelectedFile(file);
    try {
      const result = await uploadFile(file);
      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    resetUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
          ${
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
          }
          ${uploading ? "pointer-events-none" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
        />

        <div className="flex flex-col items-center justify-center text-center space-y-4">
          {uploadedFile ? (
            <>
              <CheckCircle className="w-12 h-12 text-success" />
              <div>
                <p className="font-semibold text-success">Upload Complete!</p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedFile?.name}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                className="btn btn-sm btn-outline"
              >
                Upload Another
              </button>
            </>
          ) : uploading ? (
            <>
              <File className="w-12 h-12 text-primary animate-pulse" />
              <div className="w-full max-w-xs">
                <p className="font-semibold mb-2">Uploading...</p>
                <progress
                  className="progress progress-primary w-full"
                  value={progress}
                  max="100"
                ></progress>
                <p className="text-sm text-gray-500 mt-1">{progress}%</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <p className="font-semibold text-gray-700">
                  Drop your file here or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Maximum file size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
                </p>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="alert alert-error">
              <X className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}
      </div>

      {selectedFile && !uploadedFile && !uploading && (
        <div className="mt-4 p-4 bg-base-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <File className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium text-sm">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

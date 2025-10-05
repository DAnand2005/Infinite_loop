'use client';

import { toast } from "sonner";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { parsePdf } from "@/actions/parse-pdf";
import { Button } from "@/components/ui/button";

type Props = {
  isUploaded: boolean;
  setIsUploaded: (isUploaded: boolean) => void;
  fileName: string;
  setFileName: (fileName: string) => void;
  setUploadedDocumentContext: (context: string) => void;
};

function FileUpload({
  isUploaded,
  setIsUploaded,
  fileName,
  setFileName,
  setUploadedDocumentContext,
}: Props) {
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setFileName(file.name);
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File is too large", {
            description: "Please upload a file smaller than 10MB.",
            position: "bottom-right",
            duration: 3000,
        });
        return;
      }

      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        const result = await parsePdf(formData);
        if (!result.success) {
          throw new Error(result.error);
        }

        setUploadedDocumentContext(result.text || "");
        setIsUploaded(true);
      } catch (error) {
        console.error(error);
        toast.error("Error reading PDF", {
          description: "Could not extract text from the PDF. Please try again.",
          duration: 3000,
        });
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className='rounded-lg border bg-muted/20 border-border'>
      {uploading ? (
        <div className="flex flex-col items-center justify-center p-8 gap-2"> 
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className='text-sm text-muted-foreground'>Processing your document...</p>
        </div>
      ) : isUploaded ? (
        <div className="flex items-center justify-between p-4 pl-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <p className="text-sm font-medium text-foreground">{fileName}</p>
          </div>
          <Button 
            variant="link" 
            size="sm" 
            onClick={() => { 
              setIsUploaded(false); 
              setFileName(''); 
              setUploadedDocumentContext(''); 
            }}
          >
            Re-upload
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps({
            className:
              "border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors duration-200 ease-in-out",
          })}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <UploadCloud className="h-8 w-8" />
            <p className="font-medium">Drag & drop your PDF here</p>
            <p className="text-xs">Max file size: 10MB</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;

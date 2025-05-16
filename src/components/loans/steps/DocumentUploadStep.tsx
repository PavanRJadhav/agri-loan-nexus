
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowRight, Upload, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DocumentUploadStepProps {
  onComplete: (data: any) => void;
  initialData?: any;
}

interface Document {
  type: string;
  name: string;
  uploaded: boolean;
  required: boolean;
  file?: File | null;
  fileName?: string;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ onComplete, initialData = [] }) => {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [documents, setDocuments] = useState<Document[]>([
    { 
      type: 'idProof', 
      name: 'ID Proof (Aadhaar/PAN Card)', 
      uploaded: initialData.some((doc: any) => doc.type === 'idProof') || false,
      required: true,
      fileName: initialData.find((doc: any) => doc.type === 'idProof')?.fileName || ''
    },
    { 
      type: 'addressProof', 
      name: 'Address Proof (Ration Card/Utility Bill)', 
      uploaded: initialData.some((doc: any) => doc.type === 'addressProof') || false,
      required: true,
      fileName: initialData.find((doc: any) => doc.type === 'addressProof')?.fileName || ''
    },
    { 
      type: 'landRecords', 
      name: 'Land Records/Property Documents', 
      uploaded: initialData.some((doc: any) => doc.type === 'landRecords') || false,
      required: true,
      fileName: initialData.find((doc: any) => doc.type === 'landRecords')?.fileName || ''
    },
    { 
      type: 'bankStatements', 
      name: 'Bank Statements (Last 6 months)', 
      uploaded: initialData.some((doc: any) => doc.type === 'bankStatements') || false,
      required: true,
      fileName: initialData.find((doc: any) => doc.type === 'bankStatements')?.fileName || ''
    },
    { 
      type: 'incomeProof', 
      name: 'Income Proof/Tax Returns', 
      uploaded: initialData.some((doc: any) => doc.type === 'incomeProof') || false,
      required: false,
      fileName: initialData.find((doc: any) => doc.type === 'incomeProof')?.fileName || ''
    },
    { 
      type: 'photographs', 
      name: 'Recent Passport-sized Photographs', 
      uploaded: initialData.some((doc: any) => doc.type === 'photographs') || false,
      required: true,
      fileName: initialData.find((doc: any) => doc.type === 'photographs')?.fileName || ''
    }
  ]);
  
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const updatedDocuments = [...documents];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      uploaded: true,
      file,
      fileName: file.name
    };
    
    setDocuments(updatedDocuments);
    setErrorMessage('');
    
    toast.success(`${file.name} uploaded successfully`, {
      description: "Your document has been attached to your application"
    });
  };
  
  const handleUploadClick = (index: number) => {
    // Trigger the hidden file input
    fileInputRefs.current[index]?.click();
  };
  
  const validateSubmission = () => {
    // Check if all required documents are uploaded
    const missingRequired = documents.filter(doc => doc.required && !doc.uploaded);
    
    if (missingRequired.length > 0) {
      setErrorMessage(`Please upload all required documents: ${missingRequired.map(doc => doc.name).join(', ')}`);
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateSubmission()) {
      // Format the data to be passed to the next step
      const documentsData = documents
        .filter(doc => doc.uploaded)
        .map(doc => ({
          type: doc.type,
          name: doc.name,
          fileName: doc.fileName
        }));
      
      onComplete({ documents: documentsData });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> For demonstration purposes, uploaded files won't be stored on a server.
          In a production environment, these would be securely stored.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {documents.map((doc, index) => (
          <div 
            key={doc.type} 
            className={`flex items-center justify-between p-4 border rounded-md ${
              doc.uploaded ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}
          >
            {/* Hidden file input */}
            <input
              type="file"
              ref={el => fileInputRefs.current[index] = el}
              className="hidden"
              onChange={(e) => handleFileChange(index, e)}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            
            <div className="flex items-center space-x-2">
              {doc.uploaded ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <>
                  {doc.required ? (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <HelpCircle className="h-5 w-5 text-gray-400" />
                  )}
                </>
              )}
              <div>
                <Label className="font-medium">
                  {doc.name}
                  {doc.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {doc.fileName && (
                  <p className="text-xs text-green-600">{doc.fileName}</p>
                )}
                {!doc.required && (
                  <p className="text-xs text-muted-foreground">Optional</p>
                )}
              </div>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={doc.uploaded ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleUploadClick(index)}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {doc.uploaded ? 'Change File' : 'Select File'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {doc.uploaded 
                    ? 'Document already uploaded. You can upload a new file if needed.' 
                    : `Upload your ${doc.name} file`}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}
      
      <div className="flex justify-end mt-6">
        <Button type="submit" className="flex items-center">
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default DocumentUploadStep;

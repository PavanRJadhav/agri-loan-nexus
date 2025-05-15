
import React, { useState } from 'react';
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
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ onComplete, initialData = [] }) => {
  const [documents, setDocuments] = useState<Document[]>([
    { 
      type: 'idProof', 
      name: 'ID Proof (Aadhaar/PAN Card)', 
      uploaded: initialData.some((doc: any) => doc.type === 'idProof') || false,
      required: true
    },
    { 
      type: 'addressProof', 
      name: 'Address Proof (Ration Card/Utility Bill)', 
      uploaded: initialData.some((doc: any) => doc.type === 'addressProof') || false,
      required: true
    },
    { 
      type: 'landRecords', 
      name: 'Land Records/Property Documents', 
      uploaded: initialData.some((doc: any) => doc.type === 'landRecords') || false,
      required: true
    },
    { 
      type: 'bankStatements', 
      name: 'Bank Statements (Last 6 months)', 
      uploaded: initialData.some((doc: any) => doc.type === 'bankStatements') || false,
      required: true
    },
    { 
      type: 'incomeProof', 
      name: 'Income Proof/Tax Returns', 
      uploaded: initialData.some((doc: any) => doc.type === 'incomeProof') || false,
      required: false
    },
    { 
      type: 'photographs', 
      name: 'Recent Passport-sized Photographs', 
      uploaded: initialData.some((doc: any) => doc.type === 'photographs') || false,
      required: true
    }
  ]);
  
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleUpload = (index: number) => {
    // Simulate document upload
    // In a real application, this would handle actual file uploads
    
    toast.success("Document uploaded successfully");
    
    const updatedDocuments = [...documents];
    updatedDocuments[index].uploaded = true;
    setDocuments(updatedDocuments);
    
    // Clear any previous error
    setErrorMessage('');
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
      const documentsData = documents.filter(doc => doc.uploaded).map(doc => ({
        type: doc.type,
        name: doc.name
      }));
      
      onComplete({ documents: documentsData });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> For demonstration purposes, document uploads are simulated. 
          In a real application, you would need to upload actual document files.
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
                    onClick={() => handleUpload(index)}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {doc.uploaded ? 'Re-upload' : 'Upload'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {doc.uploaded 
                    ? 'Document already uploaded. You can upload a new version if needed.' 
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

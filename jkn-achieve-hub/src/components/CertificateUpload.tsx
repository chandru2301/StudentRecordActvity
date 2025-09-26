import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X, Eye, Download, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { certificateService } from '@/services/certificateService';
import { CertificateUploadRequest, CertificateType, FileUploadProgress } from '@/types/certificate';
import { useToast } from '@/hooks/use-toast';

const CertificateUpload = () => {
  const [certificateName, setCertificateName] = useState('');
  const [certificateType, setCertificateType] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { isStudent, hasPermission } = useRole();
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid file type (PDF, JPEG, PNG)';
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const processFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError(null);
    setSuccess(null);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || !certificateName || !certificateType) {
      setError('Please fill in all required fields and select a file');
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select a file",
        variant: "destructive"
      });
      return;
    }

    if (!user?.profile?.id) {
      setError('User profile not found');
      toast({
        title: "Authentication Error",
        description: "User profile not found. Please log in again.",
        variant: "destructive"
      });
      return;
    }

    if (!isStudent || !hasPermission('canUploadCertificates')) {
      setError('You do not have permission to upload certificates');
      toast({
        title: "Permission Denied",
        description: "You do not have permission to upload certificates",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate file upload progress
      setUploadProgress({
        fileName: selectedFile.name,
        progress: 0,
        status: 'uploading'
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (!prev) return null;
          const newProgress = Math.min(prev.progress + 10, 90);
          return {
            ...prev,
            progress: newProgress
          };
        });
      }, 200);

      // Prepare upload request
      const uploadRequest: CertificateUploadRequest = {
        studentId: user.profile.id,
        certificateName,
        certificateType,
        fileName: selectedFile.name,
        filePath: `/uploads/certificates/${selectedFile.name}`, // This would be set by the backend
        fileSize: selectedFile.size,
        fileType: selectedFile.type
      };

      // Upload certificate
      const response = await certificateService.uploadCertificate(uploadRequest);

      clearInterval(progressInterval);
      setUploadProgress({
        fileName: selectedFile.name,
        progress: 100,
        status: 'completed'
      });

      const successMessage = `Certificate "${response.certificateName}" uploaded successfully!`;
      setSuccess(successMessage);
      
      toast({
        title: "Upload Successful",
        description: successMessage,
        variant: "default"
      });
      
      // Reset form
      setCertificateName('');
      setCertificateType('');
      setSelectedFile(null);
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Clear progress after 2 seconds
      setTimeout(() => {
        setUploadProgress(null);
      }, 2000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload certificate';
      setUploadProgress({
        fileName: selectedFile.name,
        progress: 0,
        status: 'error',
        error: errorMessage
      });
      setError(errorMessage);
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Upload Certificate
        </h1>
        <p className="text-muted-foreground">
          Upload your certificates for faculty review and approval
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-heading">Certificate Upload Form</CardTitle>
          <CardDescription>
            Fill in the details and upload your certificate document
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Certificate Name */}
          <div className="space-y-2">
            <Label htmlFor="certificateName">Certificate Name *</Label>
            <Input
              id="certificateName"
              placeholder="e.g., Mathematics Excellence Award"
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
              disabled={isUploading}
            />
          </div>

          {/* Certificate Type */}
          <div className="space-y-2">
            <Label htmlFor="certificateType">Certificate Type *</Label>
            <Select value={certificateType} onValueChange={setCertificateType} disabled={isUploading}>
              <SelectTrigger>
                <SelectValue placeholder="Select certificate type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CertificateType.ACADEMIC}>Academic Certificate</SelectItem>
                <SelectItem value={CertificateType.ACHIEVEMENT}>Achievement Certificate</SelectItem>
                <SelectItem value={CertificateType.PARTICIPATION}>Participation Certificate</SelectItem>
                <SelectItem value={CertificateType.COMPLETION}>Course Completion Certificate</SelectItem>
                <SelectItem value={CertificateType.MERIT}>Merit Certificate</SelectItem>
                <SelectItem value={CertificateType.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">Certificate Document *</Label>
            
            {/* Drag and Drop Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-gray-400'
              } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile ? 'File selected' : 'Drag and drop your certificate here'}
                  </p>
                  <p className="text-xs text-gray-500">or</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    Browse Files
                  </Button>
                </div>
              </div>
              
              <Input
                ref={fileInputRef}
                id="file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              Supported formats: PDF, JPEG, PNG (Max size: 10MB)
            </p>
          </div>

          {/* Selected File Display */}
          {selectedFile && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {filePreview ? (
                      <ImageIcon className="h-5 w-5 text-green-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-blue-600" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Badge variant="outline">{selectedFile.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {filePreview && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(filePreview, '_blank')}
                        disabled={isUploading}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={removeFile}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Image Preview */}
              {filePreview && (
                <div className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Preview</span>
                  </div>
                  <div className="max-w-md mx-auto">
                    <img
                      src={filePreview}
                      alt="Certificate preview"
                      className="w-full h-auto rounded-lg border shadow-sm"
                      style={{ maxHeight: '300px', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{uploadProgress.fileName}</span>
                {uploadProgress.status === 'uploading' && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {uploadProgress.status === 'completed' && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                {uploadProgress.status === 'error' && (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <Progress value={uploadProgress.progress} className="w-full" />
              {uploadProgress.status === 'error' && uploadProgress.error && (
                <p className="text-sm text-red-600">{uploadProgress.error}</p>
              )}
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile || !certificateName || !certificateType}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Certificate
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Upload Guidelines */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-heading">Upload Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Ensure your certificate is clear and readable</li>
            <li>• Supported file formats: PDF, JPEG, PNG</li>
            <li>• Maximum file size: 10MB</li>
            <li>• Certificates will be reviewed by faculty before approval</li>
            <li>• You will be notified once your certificate is reviewed</li>
            <li>• Keep a copy of your original certificate for your records</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateUpload;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar,
  Upload,
  Save,
  AlertCircle,
  FileText,
  X
} from "lucide-react";
import { toast } from "sonner";
import { activityService, ActivityRequest, ACTIVITY_TYPES } from '@/services/activityService';
import { fileUploadService } from '@/services/fileUploadService';
import { useAuth } from '@/contexts/AuthContext';

interface ActivityFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<ActivityRequest>;
  isEditing?: boolean;
  activityId?: number;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ 
  onSuccess, 
  onCancel, 
  initialData, 
  isEditing = false,
  activityId 
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ActivityRequest>({
    activityType: 'HACKATHON',
    fromDate: '',
    toDate: '',
    certificateUrl: '',
    feedback: '',
    studentId: user?.profile?.id || 0,
    ...initialData
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.activityType) {
      newErrors.activityType = 'Activity type is required';
    }

    if (!formData.fromDate) {
      newErrors.fromDate = 'From date is required';
    }

    if (!formData.toDate) {
      newErrors.toDate = 'To date is required';
    }

    if (formData.fromDate && formData.toDate) {
      const fromDate = new Date(formData.fromDate);
      const toDate = new Date(formData.toDate);
      
      if (fromDate > toDate) {
        newErrors.toDate = 'To date must be after from date';
      }
      
      if (fromDate > new Date()) {
        newErrors.fromDate = 'From date cannot be in the future';
      }
    }

    if (!formData.studentId) {
      newErrors.studentId = 'Student ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ActivityRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF or image file (JPEG, PNG)');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setCertificateFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setCertificatePreview(previewUrl);
      
      // Upload file to server
      try {
        const uploadResponse = await fileUploadService.uploadCertificate(file);
        setFormData(prev => ({ ...prev, certificateUrl: uploadResponse.fileUrl }));
        toast.success('Certificate uploaded successfully');
      } catch (error: any) {
        console.error('Error uploading file:', error);
        toast.error('Failed to upload certificate');
        setCertificateFile(null);
        setCertificatePreview('');
      }
    }
  };

  const removeCertificate = () => {
    setCertificateFile(null);
    setCertificatePreview('');
    setFormData(prev => ({ ...prev, certificateUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && activityId) {
        await activityService.updateActivity(activityId, formData);
        toast.success('Activity updated successfully!');
      } else {
        await activityService.createActivity(formData);
        toast.success('Activity created successfully!');
      }
      
      onSuccess?.();
    } catch (error: any) {
      console.error('Error submitting activity:', error);
      toast.error(error.response?.data?.message || 'Failed to save activity');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {isEditing ? 'Edit Activity' : 'Add New Activity'}
        </CardTitle>
        <CardDescription>
          {isEditing ? 'Update the activity details below.' : 'Fill in the details to add a new activity.'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Activity Type */}
          <div className="space-y-2">
            <Label htmlFor="activityType">Activity Type *</Label>
            <Select
              value={formData.activityType}
              onValueChange={(value) => handleInputChange('activityType', value)}
            >
              <SelectTrigger className={errors.activityType ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.activityType && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.activityType}
              </p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromDate">From Date *</Label>
              <Input
                id="fromDate"
                type="date"
                value={formatDate(formData.fromDate)}
                onChange={(e) => handleInputChange('fromDate', e.target.value)}
                className={errors.fromDate ? 'border-red-500' : ''}
              />
              {errors.fromDate && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.fromDate}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="toDate">To Date *</Label>
              <Input
                id="toDate"
                type="date"
                value={formatDate(formData.toDate)}
                onChange={(e) => handleInputChange('toDate', e.target.value)}
                className={errors.toDate ? 'border-red-500' : ''}
              />
              {errors.toDate && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.toDate}
                </p>
              )}
            </div>
          </div>

          {/* Certificate Upload */}
          <div className="space-y-2">
            <Label htmlFor="certificate">Certificate</Label>
            <div className="space-y-3">
              <Input
                id="certificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              
              {certificatePreview && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-700 flex-1">
                    {certificateFile?.name || 'Certificate uploaded'}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeCertificate}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                Upload PDF or image files (max 5MB)
              </p>
            </div>
          </div>

          {/* Feedback */}
          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Share your experience and learnings from this activity..."
              value={formData.feedback}
              onChange={(e) => handleInputChange('feedback', e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Activity' : 'Create Activity'}
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ActivityForm;

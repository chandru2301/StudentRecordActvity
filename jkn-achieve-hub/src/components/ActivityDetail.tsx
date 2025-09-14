import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Edit,
  Trash2,
  Download,
  Eye,
  ArrowLeft,
  User,
  Mail,
  GraduationCap,
  Building,
  FileText,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { activityService, Activity, ACTIVITY_TYPES } from '@/services/activityService';
import { fileUploadService } from '@/services/fileUploadService';
import ActivityForm from './ActivityForm';

interface ActivityDetailProps {
  activityId: number;
  onBack?: () => void;
  onEdit?: (activity: Activity) => void;
  onDelete?: (activityId: number) => void;
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({ 
  activityId, 
  onBack, 
  onEdit, 
  onDelete 
}) => {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchActivity();
  }, [activityId]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const data = await activityService.getActivityById(activityId);
      setActivity(data);
    } catch (error: any) {
      console.error('Error fetching activity:', error);
      toast.error('Failed to fetch activity details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (activity) {
      setShowEditForm(true);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      await activityService.deleteActivity(activityId);
      toast.success('Activity deleted successfully');
      onDelete?.(activityId);
    } catch (error: any) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
    }
  };

  const handleFormSuccess = () => {
    setShowEditForm(false);
    fetchActivity();
  };

  const handleFormCancel = () => {
    setShowEditForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'HACKATHON':
        return 'default';
      case 'INTER_COLLEGE':
        return 'secondary';
      case 'OUTER_COLLEGE':
        return 'outline';
      case 'GOVERNMENT_EVENT':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getActivityTypeLabel = (type: string) => {
    const activityType = ACTIVITY_TYPES.find(t => t.value === type);
    return activityType?.label || type;
  };

  const calculateDuration = (fromDate: string, toDate: string) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            <span>Loading activity details...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activity) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Activity not found</h3>
          <p className="text-gray-500 mb-4">The requested activity could not be found.</p>
          {onBack && (
            <Button onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Activity Details
                </CardTitle>
                <CardDescription>
                  Detailed information about this activity
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Activity Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Activity Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Activity Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant={getActivityTypeBadgeVariant(activity.activityType)} className="text-sm">
                  {getActivityTypeLabel(activity.activityType)}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {calculateDuration(activity.fromDate, activity.toDate)} day(s)
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">From Date</label>
                  <p className="text-lg">{formatDate(activity.fromDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">To Date</label>
                  <p className="text-lg">{formatDate(activity.toDate)}</p>
                </div>
              </div>

              {activity.feedback && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Feedback</label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{activity.feedback}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certificate Section */}
          {activity.certificateUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Certificate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-2">Certificate File</p>
                    <p className="font-medium">{activity.certificateUrl}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => window.open(fileUploadService.getFileUrl(activity.certificateUrl), '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = fileUploadService.getFileUrl(activity.certificateUrl!);
                        link.download = `certificate_${activity.id}`;
                        link.click();
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Student Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg font-medium">{activity.studentName}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{activity.studentEmail}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{activity.studentClassName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{activity.studentDepartment}</span>
              </div>
            </CardContent>
          </Card>

          {/* Activity Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activity Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-sm">{formatDateTime(activity.createdAt)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-sm">{formatDateTime(activity.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ActivityForm
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
              initialData={{
                activityType: activity.activityType,
                fromDate: activity.fromDate,
                toDate: activity.toDate,
                certificateUrl: activity.certificateUrl,
                feedback: activity.feedback,
                studentId: activity.studentId
              }}
              isEditing={true}
              activityId={activity.id}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityDetail;

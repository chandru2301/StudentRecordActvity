import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Calendar,
  Edit,
  Trash2,
  Plus,
  Download,
  Eye,
  Filter,
  Search,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { activityService, Activity, ACTIVITY_TYPES } from '@/services/activityService';
import { fileUploadService } from '@/services/fileUploadService';
import { useAuth } from '@/contexts/AuthContext';
import ActivityForm from './ActivityForm';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityListProps {
  studentId?: number;
  showAll?: boolean;
  onActivitySelect?: (activityId: number) => void;
  onEditActivity?: (activity: Activity) => void;
  onDeleteActivity?: (activityId: number) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ 
  studentId, 
  showAll = false, 
  onActivitySelect,
  onEditActivity,
  onDeleteActivity 
}) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  const currentStudentId = studentId || user?.profile?.id;

  useEffect(() => {
    fetchActivities();
  }, [currentStudentId, showAll]);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, filterType]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      let data: Activity[];
      
      if (showAll) {
        data = await activityService.getAllActivities();
      } else if (currentStudentId) {
        data = await activityService.getActivitiesByStudent(currentStudentId);
      } else {
        data = [];
      }
      
      setActivities(data);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = activities;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.activityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by activity type
    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.activityType === filterType);
    }

    setFilteredActivities(filtered);
  };

  const handleEdit = (activity: Activity) => {
    if (onEditActivity) {
      onEditActivity(activity);
    } else {
      setEditingActivity(activity);
      setShowForm(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      await activityService.deleteActivity(id);
      toast.success('Activity deleted successfully');
      
      if (onDeleteActivity) {
        onDeleteActivity(id);
      } else {
        fetchActivities();
      }
    } catch (error: any) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingActivity(null);
    fetchActivities();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading activities...</span>
          </div>
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
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {showAll ? 'All Activities' : 'My Activities'}
              </CardTitle>
              <CardDescription>
                {showAll 
                  ? 'Manage and view all student activities' 
                  : 'Track your academic and extracurricular activities'
                }
              </CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {ACTIVITY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchActivities}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activities Table */}
      <Card>
        <CardContent className="p-0">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start by adding your first activity.'
                }
              </p>
              {!searchTerm && filterType === 'all' && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Activity
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity Type</TableHead>
                  <TableHead>Date Range</TableHead>
                  {showAll && <TableHead>Student</TableHead>}
                  <TableHead>Certificate</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow 
                    key={activity.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => onActivitySelect?.(activity.id)}
                  >
                    <TableCell>
                      <Badge variant={getActivityTypeBadgeVariant(activity.activityType)}>
                        {getActivityTypeLabel(activity.activityType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(activity.fromDate)}</div>
                        <div className="text-gray-500">to {formatDate(activity.toDate)}</div>
                      </div>
                    </TableCell>
                    {showAll && (
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{activity.studentName}</div>
                          <div className="text-gray-500">{activity.studentEmail}</div>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      {activity.certificateUrl ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(fileUploadService.getFileUrl(activity.certificateUrl!), '_blank')}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = fileUploadService.getFileUrl(activity.certificateUrl!);
                              link.download = `certificate_${activity.id}`;
                              link.click();
                            }}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No certificate</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {activity.feedback ? (
                          <p className="text-sm text-gray-700 truncate" title={activity.feedback}>
                            {activity.feedback}
                          </p>
                        ) : (
                          <span className="text-gray-400 text-sm">No feedback</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(activity);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(activity.id);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Activity Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ActivityForm
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
              initialData={editingActivity ? {
                activityType: editingActivity.activityType,
                fromDate: editingActivity.fromDate,
                toDate: editingActivity.toDate,
                certificateUrl: editingActivity.certificateUrl,
                feedback: editingActivity.feedback,
                studentId: editingActivity.studentId
              } : undefined}
              isEditing={!!editingActivity}
              activityId={editingActivity?.id}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityList;

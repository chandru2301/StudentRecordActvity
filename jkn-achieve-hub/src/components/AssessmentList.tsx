import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Clock, 
  Users, 
  Award, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Calendar,
  Timer,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { assessmentService } from '@/services/assessmentService';
import { AssessmentResponse, AssessmentType, AssessmentStatus } from '@/types/assessment';
import { useToast } from '@/hooks/use-toast';

const AssessmentList = () => {
  const [assessments, setAssessments] = useState<AssessmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { isStudent, isFaculty, isAdmin, hasPermission } = useRole();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadAssessments = async () => {
      if (!user?.profile?.id) {
        setError('User profile not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        if (isStudent && hasPermission('canTakeAssessments')) {
          // First try to get all active assessments
          try {
            console.log('Trying to get all active assessments...');
            const data = await assessmentService.getAllActiveAssessments();
            console.log('Successfully got all active assessments:', data);
            setAssessments(data);
          } catch (err) {
            // Fallback to student-specific endpoint
            console.warn('Failed to get all active assessments, trying student-specific endpoint:', err);
            try {
              const data = await assessmentService.getAvailableAssessmentsForStudent(user.profile.id);
              console.log('Successfully got student-specific assessments:', data);
              setAssessments(data);
            } catch (fallbackErr) {
              console.error('Both endpoints failed:', fallbackErr);
              throw fallbackErr; // Re-throw to be caught by outer catch
            }
          }
        } else if ((isFaculty || isAdmin) && hasPermission('canCreateAssessments')) {
          // Faculty can view their own assessments
          const data = await assessmentService.getAssessmentsByFaculty(user.profile.id);
          setAssessments(data);
        } else {
          setError('You do not have permission to view assessments');
        }
      } catch (err) {
        console.error('Failed to load assessments:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load assessments';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
  }, [user, isStudent, hasPermission, toast]);

  const getStatusBadge = (status: AssessmentStatus) => {
    const statusConfig = {
      [AssessmentStatus.ACTIVE]: { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      [AssessmentStatus.DRAFT]: { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' },
      [AssessmentStatus.COMPLETED]: { variant: 'outline' as const, color: 'bg-blue-100 text-blue-800' },
      [AssessmentStatus.ARCHIVED]: { variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status] || statusConfig[AssessmentStatus.DRAFT];
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getTypeIcon = (type: AssessmentType) => {
    switch (type) {
      case AssessmentType.QUIZ:
        return <FileText className="h-5 w-5 text-blue-600" />;
      case AssessmentType.EXAM:
        return <Award className="h-5 w-5 text-purple-600" />;
      case AssessmentType.TEST:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case AssessmentType.ASSIGNMENT:
        return <FileText className="h-5 w-5 text-orange-600" />;
      case AssessmentType.SURVEY:
        return <Users className="h-5 w-5 text-indigo-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isAssessmentAvailable = (assessment: AssessmentResponse) => {
    const now = new Date();
    const startDate = new Date(assessment.startDate);
    const endDate = new Date(assessment.endDate);
    
    return now >= startDate && now <= endDate && assessment.status === AssessmentStatus.ACTIVE;
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const handleStartAssessment = (assessment: AssessmentResponse) => {
    if (!isAssessmentAvailable(assessment)) {
      toast({
        title: "Assessment Not Available",
        description: "This assessment is not currently available for taking.",
        variant: "destructive"
      });
      return;
    }

    // Navigate to assessment taking page
    navigate(`/assessments/take/${assessment.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading assessments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          {isStudent ? 'Available Assessments' : 'My Assessments'}
        </h1>
        <p className="text-muted-foreground">
          {isStudent 
            ? 'Take quizzes, tests, and assignments assigned by your faculty'
            : 'Manage and view your created assessments'
          }
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {assessments.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {isStudent ? 'No assessments available' : 'No assessments created'}
              </h3>
              <p className="text-muted-foreground">
                {isStudent 
                  ? 'There are no assessments available for you to take at this time.'
                  : 'You haven\'t created any assessments yet. Create your first assessment to get started.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {assessments.map((assessment) => (
            <Card key={assessment.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(assessment.type)}
                    <div>
                      <CardTitle className="text-xl">{assessment.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {assessment.description || 'No description provided'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(assessment.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Starts: {formatDate(assessment.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Ends: {formatDate(assessment.endDate)}</span>
                  </div>
                  {assessment.timeLimitMinutes && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Timer className="h-4 w-4" />
                      <span>Time Limit: {assessment.timeLimitMinutes} minutes</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-sm">
                    <span className="font-medium">Type:</span> {assessment.typeDisplayName}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Questions:</span> {assessment.totalQuestions || 'N/A'}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Max Attempts:</span> {assessment.maxAttempts || 'Unlimited'}
                  </div>
                </div>

                {assessment.totalMarks && (
                  <div className="text-sm">
                    <span className="font-medium">Total Marks:</span> {assessment.totalMarks}
                    {assessment.passingMarks && (
                      <span className="ml-4">
                        <span className="font-medium">Passing Marks:</span> {assessment.passingMarks}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {isStudent ? (
                      isAssessmentAvailable(assessment) ? (
                        <span className="text-green-600 font-medium">
                          {getTimeRemaining(assessment.endDate)}
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          {new Date() < new Date(assessment.startDate) ? 'Not started yet' : 'Expired'}
                        </span>
                      )
                    ) : (
                      <span className="text-blue-600 font-medium">
                        Status: {assessment.statusDisplayName}
                      </span>
                    )}
                  </div>
                  
                  {isStudent ? (
                    <Button
                      onClick={() => handleStartAssessment(assessment)}
                      disabled={!isAssessmentAvailable(assessment)}
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      {isAssessmentAvailable(assessment) ? 'Start Assessment' : 'Not Available'}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssessmentList;

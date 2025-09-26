import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Plus, 
  CheckCircle, 
  Clock, 
  Users, 
  Award,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { assessmentService } from '@/services/assessmentService';
import { AssessmentResponse, AssessmentStats } from '@/types/assessment';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import AssessmentList from '@/components/AssessmentList';
import AssessmentCreator from '@/components/AssessmentCreator';
import AssessmentGrading from '@/components/AssessmentGrading';

const AssessmentPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [stats, setStats] = useState<AssessmentStats>({
    totalAssessments: 0,
    activeAssessments: 0,
    completedAssessments: 0,
    totalSubmissions: 0,
    pendingGrading: 0,
    averageScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { isStudent, isFaculty, isAdmin, hasPermission } = useRole();
  const { toast } = useToast();

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.profile?.id) {
        setError('User profile not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (isFaculty || isAdmin) {
          const facultyStats = await assessmentService.getAssessmentStats(user.profile.id);
          setStats({
            totalAssessments: facultyStats.totalAssessments,
            activeAssessments: facultyStats.activeAssessments,
            completedAssessments: facultyStats.completedAssessments,
            totalSubmissions: facultyStats.totalSubmissions,
            pendingGrading: facultyStats.pendingGrading,
            averageScore: 0 // This would need a separate endpoint
          });
        } else if (isStudent) {
          const studentProgress = await assessmentService.getStudentAssessmentProgress(user.profile.id);
          setStats({
            totalAssessments: studentProgress.availableAssessments.length + studentProgress.completedAssessments.length,
            activeAssessments: studentProgress.availableAssessments.length,
            completedAssessments: studentProgress.completedAssessments.length,
            totalSubmissions: studentProgress.completedAssessments.length,
            pendingGrading: 0,
            averageScore: 0
          });
        }
      } catch (err) {
        console.error('Failed to load assessment stats:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load assessment statistics';
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

    loadStats();
  }, [user, isStudent, isFaculty, isAdmin, toast]);

  const getDefaultTab = () => {
    if (isStudent) return 'list';
    if (isFaculty || isAdmin) return 'list';
    return 'list';
  };

  const getAvailableTabs = () => {
    const tabs = [];

    if (isStudent && hasPermission('canTakeAssessments')) {
      tabs.push({ value: 'list', label: 'Available Assessments', icon: FileText });
    }

    if ((isFaculty || isAdmin) && hasPermission('canCreateAssessments')) {
      tabs.push({ value: 'list', label: 'My Assessments', icon: FileText });
      tabs.push({ value: 'create', label: 'Create Assessment', icon: Plus });
    }

    if ((isFaculty || isAdmin) && hasPermission('canGradeAssessments')) {
      tabs.push({ value: 'grading', label: 'Grade Submissions', icon: CheckCircle });
    }

    return tabs;
  };

  const availableTabs = getAvailableTabs();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading assessment data...</span>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            {isStudent ? 'Assessments' : 'Assessment Management'}
          </h1>
          <p className="text-muted-foreground">
            {isStudent 
              ? 'Take quizzes, tests, and assignments assigned by your faculty'
              : 'Create, manage, and grade assessments for your students'
            }
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Assessments</p>
                  <p className="text-2xl font-bold">{stats.totalAssessments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isStudent ? 'Available' : 'Active'}
                  </p>
                  <p className="text-2xl font-bold">{stats.activeAssessments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isStudent ? 'Completed' : 'Total Submissions'}
                  </p>
                  <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {(isFaculty || isAdmin) && (
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Users className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Grading</p>
                    <p className="text-2xl font-bold">{stats.pendingGrading}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        {availableTabs.length === 1 ? (
          // If only one tab is available, show the content directly
          <div>
            {activeTab === 'list' && <AssessmentList />}
            {activeTab === 'create' && <AssessmentCreator />}
            {activeTab === 'grading' && <AssessmentGrading />}
          </div>
        ) : (
          // If multiple tabs are available, show tabs
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              {availableTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              <AssessmentList />
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <AssessmentCreator />
            </TabsContent>

            <TabsContent value="grading" className="space-y-6">
              <AssessmentGrading />
            </TabsContent>
          </Tabs>
        )}

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {isStudent && hasPermission('canTakeAssessments') && (
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('list')}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View Available Assessments
                </Button>
              )}
              
              {(isFaculty || isAdmin) && hasPermission('canCreateAssessments') && (
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('create')}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create New Assessment
                </Button>
              )}
              
              {(isFaculty || isAdmin) && hasPermission('canGradeAssessments') && (
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('grading')}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Grade Submissions
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AssessmentPage;

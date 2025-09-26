import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  Activity, 
  Calendar, 
  Award, 
  Users, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Upload,
  Eye,
  Settings,
  ArrowRight,
  BookOpen,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useRole } from '../hooks/useRole';
import { RoleGuard, RoleBasedComponent } from '../components/RoleGuard';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const RoleBasedDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    roleConfig, 
    dashboardWidgets, 
    quickActions, 
    profileInfo, 
    isStudent, 
    isFaculty, 
    isAdmin,
    hasPermission,
    defaultRoute 
  } = useRole();

  const [stats, setStats] = useState({
    totalActivities: 0,
    completedActivities: 0,
    pendingCertificates: 0,
    approvedCertificates: 0,
    attendanceRate: 0,
    recentActivity: [],
    loading: true,
  });

  useEffect(() => {
    // Redirect to role-specific dashboard if user is logged in
    if (user && defaultRoute && defaultRoute !== '/dashboard') {
      navigate(defaultRoute, { replace: true });
      return;
    }

    // Load dashboard data based on user role
    const loadDashboardData = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true }));
        
        // Simulate API calls based on user role
        const mockData = {
          student: {
            totalActivities: 12,
            completedActivities: 8,
            pendingCertificates: 2,
            approvedCertificates: 5,
            attendanceRate: 85,
            recentActivity: [
              { id: 1, title: 'Certificate uploaded', time: '2 hours ago', status: 'pending', type: 'certificate' },
              { id: 2, title: 'Activity completed', time: '1 day ago', status: 'completed', type: 'activity' },
              { id: 3, title: 'Assessment submitted', time: '2 days ago', status: 'completed', type: 'assessment' },
              { id: 4, title: 'Attendance marked', time: '3 days ago', status: 'completed', type: 'attendance' },
            ],
          },
          faculty: {
            totalActivities: 45,
            completedActivities: 38,
            pendingCertificates: 15,
            approvedCertificates: 23,
            attendanceRate: 92,
            recentActivity: [
              { id: 1, title: 'Certificate approved', time: '1 hour ago', status: 'completed', type: 'certificate' },
              { id: 2, title: 'Assessment created', time: '3 hours ago', status: 'completed', type: 'assessment' },
              { id: 3, title: 'Student activity reviewed', time: '1 day ago', status: 'completed', type: 'activity' },
              { id: 4, title: 'Attendance report generated', time: '2 days ago', status: 'completed', type: 'attendance' },
            ],
          },
          admin: {
            totalActivities: 156,
            completedActivities: 142,
            pendingCertificates: 8,
            approvedCertificates: 89,
            attendanceRate: 95,
            recentActivity: [
              { id: 1, title: 'System backup completed', time: '30 minutes ago', status: 'completed', type: 'system' },
              { id: 2, title: 'User account created', time: '2 hours ago', status: 'completed', type: 'user' },
              { id: 3, title: 'Certificate batch approved', time: '4 hours ago', status: 'completed', type: 'certificate' },
              { id: 4, title: 'System maintenance scheduled', time: '1 day ago', status: 'pending', type: 'system' },
            ],
          }
        };

        const userData = isStudent ? mockData.student : isFaculty ? mockData.faculty : mockData.admin;
        
        setStats({
          ...userData,
          loading: false,
        });

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setStats(prev => ({ ...prev, loading: false }));
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      }
    };

    loadDashboardData();
  }, [user, isStudent, isFaculty, isAdmin, defaultRoute, navigate, toast]);

  const getCompletionPercentage = () => {
    if (stats.totalActivities === 0) return 0;
    return Math.round((stats.completedActivities / stats.totalActivities) * 100);
  };

  const handleQuickAction = (action: any) => {
    if (action.action) {
      if (typeof action.action === 'string') {
        navigate(action.action);
      } else if (typeof action.action === 'function') {
        action.action();
      }
    } else {
      // Default navigation based on action title
      const actionMap: Record<string, string> = {
        'View Activities': '/student/activities',
        'Upload Certificate': '/certificates',
        'View Attendance': '/attendance',
        'Take Assessment': '/assessments',
        'Manage Activities': '/admin/activities',
        'Review Certificates': '/certificates',
        'Generate Reports': '/analytics',
        'System Settings': '/admin/settings',
      };
      
      const route = actionMap[action.title];
      if (route) {
        navigate(route);
      } else {
        toast({
          title: "Action Not Available",
          description: `The action "${action.title}" is not yet implemented.`,
          variant: "default"
        });
      }
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'certificate': return <Award className="h-4 w-4" />;
      case 'activity': return <Activity className="h-4 w-4" />;
      case 'assessment': return <FileText className="h-4 w-4" />;
      case 'attendance': return <Calendar className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'certificate': return 'text-yellow-600';
      case 'activity': return 'text-blue-600';
      case 'assessment': return 'text-purple-600';
      case 'attendance': return 'text-green-600';
      case 'system': return 'text-gray-600';
      case 'user': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  };

  if (stats.loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Welcome back, {profileInfo.name}!
          </h1>
          <p className="text-muted-foreground">
            {roleConfig?.description || 'Manage your activities and track your progress'}
          </p>
        </div>

        {/* Role-based Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RoleBasedComponent
            student={
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    My Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.totalActivities}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.completedActivities} completed
                  </p>
                  <Progress value={getCompletionPercentage()} className="mt-2" />
                </CardContent>
              </Card>
            }
            faculty={
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Students Managed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">{stats.totalActivities}</div>
                  <p className="text-xs text-muted-foreground">
                    Active students
                  </p>
                </CardContent>
              </Card>
            }
            admin={
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{stats.totalActivities}</div>
                  <p className="text-xs text-muted-foreground">
                    System users
                  </p>
                </CardContent>
              </Card>
            }
          />

          <RoleBasedComponent
            student={
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.approvedCertificates}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingCertificates} pending approval
                  </p>
                </CardContent>
              </Card>
            }
            faculty={
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certificates to Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pendingCertificates}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting review
                  </p>
                </CardContent>
              </Card>
            }
            admin={
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    System Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{stats.approvedCertificates}</div>
                  <p className="text-xs text-muted-foreground">
                    Total approved
                  </p>
                </CardContent>
              </Card>
            }
          />

          <RoleBasedComponent
            student={
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Attendance Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.attendanceRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    This month
                  </p>
                  <Progress value={stats.attendanceRate} className="mt-2" />
                </CardContent>
              </Card>
            }
            faculty={
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Reports Generated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{stats.completedActivities}</div>
                  <p className="text-xs text-muted-foreground">
                    This month
                  </p>
                </CardContent>
              </Card>
            }
            admin={
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <p className="text-xs text-muted-foreground">
                    Uptime
                  </p>
                </CardContent>
              </Card>
            }
          />

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{getCompletionPercentage()}%</div>
              <p className="text-xs text-muted-foreground">
                Overall completion
              </p>
              <Progress value={getCompletionPercentage()} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Role-based Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading">Quick Actions</CardTitle>
                  <CardDescription>
                    {isStudent 
                      ? 'Common tasks you can perform'
                      : isFaculty 
                      ? 'Manage student activities and reviews'
                      : 'System administration tasks'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action, index) => (
                    <RoleGuard
                      key={action.title}
                      requiredPermission={action.requiresPermission as any}
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-between group hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
                        onClick={() => handleQuickAction(action)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span>{action.title}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Button>
                    </RoleGuard>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading">Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest actions and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full bg-muted/50 ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                        <Badge 
                          variant={activity.status === 'completed' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <RoleBasedComponent
              student={
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="font-heading">My Activities</CardTitle>
                    <CardDescription>
                      Track your academic and extracurricular activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Manage Your Activities</h3>
                      <p className="text-muted-foreground mb-4">
                        View and manage all your academic activities
                      </p>
                      <Button onClick={() => navigate('/student/activities')}>
                        <Activity className="mr-2 h-4 w-4" />
                        View Activities
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              }
              faculty={
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="font-heading">Student Activities</CardTitle>
                    <CardDescription>
                      Review and validate student activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Manage Student Activities</h3>
                      <p className="text-muted-foreground mb-4">
                        Review and approve student submissions
                      </p>
                      <Button onClick={() => navigate('/admin/activities')}>
                        <Users className="mr-2 h-4 w-4" />
                        Manage Activities
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              }
              admin={
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="font-heading">System Activities</CardTitle>
                    <CardDescription>
                      Monitor all system activities and user actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">System Administration</h3>
                      <p className="text-muted-foreground mb-4">
                        Monitor and manage all system activities
                      </p>
                      <Button onClick={() => navigate('/admin/activities')}>
                        <Settings className="mr-2 h-4 w-4" />
                        System Admin
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              }
            />
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-heading">Recent Updates</CardTitle>
                <CardDescription>
                  Latest changes and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">System updated successfully</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">New features available</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Documentation updated</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RoleBasedDashboard;

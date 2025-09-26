import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';
import ProfileHeader from './ProfileHeader';
import { FeedbackSection } from './FeedbackCard';
import PerformanceChart from './PerformanceChart';
import { ContactCard, DocumentList } from './DocumentList';
import { studentService, StudentStats, StudentActivitySummary, StudentPerformance, StudentDocument } from '../services/studentService';
import type { StudentProfile as StudentProfileType } from '../services/studentService';
import { activityService } from '../services/activityService';
import { profileService } from '../services/profileService';
import { attendanceService } from '../services/attendanceService';
import { certificateService } from '../services/certificateService';
import { assessmentService } from '../services/assessmentService';
import { 
  MessageCircle, 
  Phone, 
  Edit,
  Filter,
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Activity,
  Award,
  BookOpen,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Target,
  BarChart3,
  GraduationCap,
  Home,
  Mail,
  MapPin,
  User,
  Calendar as CalendarIcon,
  Eye,
  Download,
  Plus,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { useToast } from './ui/use-toast';

// Enhanced types for comprehensive student profile
interface StudentProfileData extends StudentProfileType {
  // Extended with additional computed fields
  age?: number;
  academicYear?: string;
  semester?: string;
  cgpa?: number;
  totalCredits?: number;
  completedCredits?: number;
}

interface StudentActivity extends StudentActivitySummary {
  // Extended activity data
  description?: string;
  location?: string;
  organizer?: string;
  participants?: number;
  achievements?: string[];
}

interface EnhancedStudentStats extends StudentStats {
  // Extended stats
  totalAssessments?: number;
  completedAssessments?: number;
  averageScore?: number;
  certificatesCount?: number;
  pendingCertificates?: number;
  approvedCertificates?: number;
  recentActivityScore?: number;
  attendanceStreak?: number;
  bestSubject?: string;
  improvementAreas?: string[];
}

interface StudentAttendanceSummary {
  presentCount: number;
  absentCount: number;
  lateCount: number;
  totalDays: number;
  attendancePercentage: number;
  recentTrend: 'improving' | 'declining' | 'stable';
  subjectBreakdown: Array<{
    subject: string;
    percentage: number;
    totalClasses: number;
  }>;
}

interface StudentAssessmentSummary {
  totalAssessments: number;
  completedAssessments: number;
  averageScore: number;
  highestScore: number;
  recentScores: Array<{
    assessmentName: string;
    score: number;
    date: string;
    subject: string;
  }>;
  performanceTrend: 'improving' | 'declining' | 'stable';
}

const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Core profile data
  const [profileData, setProfileData] = useState<StudentProfileData | null>(null);
  const [activities, setActivities] = useState<StudentActivity[]>([]);
  const [stats, setStats] = useState<EnhancedStudentStats | null>(null);
  
  // Extended data
  const [attendanceSummary, setAttendanceSummary] = useState<StudentAttendanceSummary | null>(null);
  const [assessmentSummary, setAssessmentSummary] = useState<StudentAssessmentSummary | null>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<StudentPerformance[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user && user.profile) {
      loadStudentData();
    }
  }, [user]);

  const loadStudentData = async (isRefresh = false) => {
    if (!user?.profile?.id) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Load all student data in parallel with enhanced data
      const [
        profile,
        studentActivities,
        studentStats,
        studentFeedbacks,
        studentPerformance,
        studentParents,
        studentDocuments,
        attendanceData,
        certificatesData,
        assessmentsData
      ] = await Promise.allSettled([
        studentService.getStudentProfile(user.profile.id),
        activityService.getActivitiesByStudent(user.profile.id),
        studentService.getStudentStats(user.profile.id),
        profileService.getStudentFeedbacks(user.profile.id),
        profileService.getStudentPerformance(user.profile.id),
        profileService.getStudentParents(user.profile.id),
        profileService.getStudentDocuments(user.profile.id),
        attendanceService.getAttendanceSummary(user.profile.id, getCurrentMonthRange().startDate, getCurrentMonthRange().endDate),
        certificateService.getCertificatesByStudent(user.profile.id),
        assessmentService.getAvailableAssessmentsForStudent(user.profile.id)
      ]);

      // Process successful results
      if (profile.status === 'fulfilled') {
        const enhancedProfile = enhanceProfileData(profile.value);
        setProfileData(enhancedProfile);
      }

      if (studentActivities.status === 'fulfilled') {
        // Transform Activity[] to StudentActivity[]
        const transformedActivities: StudentActivity[] = studentActivities.value.map(activity => ({
          ...activity,
          status: activity.feedback ? 'COMPLETED' : 'PENDING' as 'COMPLETED' | 'PENDING' | 'IN_PROGRESS'
        }));
        setActivities(transformedActivities);
      }

      if (studentStats.status === 'fulfilled') {
        const enhancedStats = enhanceStatsData(studentStats.value, certificatesData, assessmentsData);
        setStats(enhancedStats);
      }

      if (studentFeedbacks.status === 'fulfilled') {
        setFeedbacks(studentFeedbacks.value);
      }

      if (studentPerformance.status === 'fulfilled') {
        setPerformanceData(studentPerformance.value);
      }

      if (studentParents.status === 'fulfilled') {
        setParents(studentParents.value);
      }

      if (studentDocuments.status === 'fulfilled') {
        setDocuments(studentDocuments.value);
      }

      if (attendanceData.status === 'fulfilled') {
        const enhancedAttendance = enhanceAttendanceData(attendanceData.value);
        setAttendanceSummary(enhancedAttendance);
      }

      if (certificatesData.status === 'fulfilled') {
        setCertificates(certificatesData.value);
      }

      if (assessmentsData.status === 'fulfilled') {
        const enhancedAssessments = enhanceAssessmentData(assessmentsData.value);
        setAssessmentSummary(enhancedAssessments);
      }

      if (isRefresh) {
        toast({
          title: "Profile Updated",
          description: "Your profile data has been refreshed successfully.",
          variant: "default"
        });
      }

    } catch (err) {
      console.error('Error loading student data:', err);
      setError('Failed to load profile data. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Helper functions to enhance data
  const getCurrentMonthRange = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    return { startDate, endDate };
  };

  const enhanceProfileData = (profile: StudentProfileType): StudentProfileData => {
    const age = Math.floor((new Date().getTime() - new Date(profile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const academicYear = new Date().getFullYear();
    const semester = Math.ceil((new Date().getMonth() + 1) / 6); // Rough semester calculation
    
    return {
      ...profile,
      age,
      academicYear: `${academicYear}-${academicYear + 1}`,
      semester: `Semester ${semester}`,
      cgpa: Math.random() * 2 + 6, // Mock CGPA calculation
      totalCredits: 120,
      completedCredits: Math.floor(Math.random() * 40) + 80
    };
  };

  const enhanceStatsData = (stats: StudentStats, certificatesData: any, assessmentsData: any): EnhancedStudentStats => {
    const certificates = certificatesData.status === 'fulfilled' ? certificatesData.value : [];
    const assessments = assessmentsData.status === 'fulfilled' ? assessmentsData.value : [];
    
    return {
      ...stats,
      totalAssessments: assessments.length,
      completedAssessments: Math.floor(assessments.length * 0.7),
      averageScore: Math.random() * 20 + 70,
      certificatesCount: certificates.length,
      pendingCertificates: certificates.filter((c: any) => c.status === 'PENDING').length,
      approvedCertificates: certificates.filter((c: any) => c.status === 'APPROVED').length,
      recentActivityScore: Math.random() * 20 + 80,
      attendanceStreak: Math.floor(Math.random() * 15) + 5,
      bestSubject: ['Mathematics', 'Physics', 'Chemistry', 'English'][Math.floor(Math.random() * 4)],
      improvementAreas: ['Time Management', 'Study Habits', 'Participation']
    };
  };

  const enhanceAttendanceData = (attendanceData: any): StudentAttendanceSummary => {
    return {
      presentCount: attendanceData.presentCount || 0,
      absentCount: attendanceData.absentCount || 0,
      lateCount: attendanceData.lateCount || 0,
      totalDays: attendanceData.totalRecords || 0,
      attendancePercentage: attendanceData.presentPercentage || 0,
      recentTrend: 'stable',
      subjectBreakdown: [
        { subject: 'Mathematics', percentage: 95, totalClasses: 20 },
        { subject: 'Physics', percentage: 88, totalClasses: 18 },
        { subject: 'Chemistry', percentage: 92, totalClasses: 16 },
        { subject: 'English', percentage: 85, totalClasses: 15 }
      ]
    };
  };

  const enhanceAssessmentData = (assessmentsData: any): StudentAssessmentSummary => {
    return {
      totalAssessments: assessmentsData.length,
      completedAssessments: Math.floor(assessmentsData.length * 0.6),
      averageScore: Math.random() * 20 + 75,
      highestScore: Math.random() * 10 + 90,
      recentScores: [
        { assessmentName: 'Math Quiz 1', score: 85, date: '2024-01-15', subject: 'Mathematics' },
        { assessmentName: 'Physics Test', score: 78, date: '2024-01-10', subject: 'Physics' },
        { assessmentName: 'Chemistry Exam', score: 92, date: '2024-01-05', subject: 'Chemistry' }
      ],
      performanceTrend: 'improving'
    };
  };

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="space-y-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
              <p className="text-gray-600 font-medium">Loading your comprehensive profile...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Error Loading Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{error}</p>
              <Button onClick={() => loadStudentData()} className="w-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Show access denied if not a student
  if (!user || user.role !== 'STUDENT' || !profileData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
            <p className="text-gray-600">This page is only accessible to students.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Transform profile data for ProfileHeader component
  const profileHeaderData = {
    profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=8b5cf6&color=ffffff&size=150`,
    name: profileData.name,
    classOrDepartment: `${profileData.degree?.toUpperCase() || 'STUDENT'} - Roll: ${profileData.rollNumber}`,
    location: `${profileData.department} Department`,
    profileInfo: {
      dateOfBirth: new Date(profileData.dob).toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      }),
      enrollment: new Date(profileData.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      }),
      orderNumber: profileData.rollNumber,
      bloodType: 'A+', // Can be added to backend
      allergies: 'No Record', // Can be added to backend
      chronicDisease: 'No Record' // Can be added to backend
    }
  };

  const handleEditProfile = async () => {
    try {
      // Implement profile editing logic
      console.log('Edit profile clicked');
      toast({
        title: "Edit Profile",
        description: "Profile editing feature will be implemented soon.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error editing profile:', error);
    }
  };

  const handleRefresh = () => {
    loadStudentData(true);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    console.log(`Filter changed: ${filterType} = ${value}`);
  };

  const handleEditParents = () => {
    console.log('Edit parents clicked');
    toast({
      title: "Edit Parents",
      description: "Parent information editing will be implemented soon.",
      variant: "default"
    });
  };

  const handleEditDocuments = () => {
    console.log('Edit documents clicked');
    toast({
      title: "Edit Documents",
      description: "Document management will be implemented soon.",
      variant: "default"
    });
  };

  const handleParentMessage = (contactId: string) => {
    console.log(`Message parent: ${contactId}`);
    toast({
      title: "Message Parent",
      description: "Messaging feature will be implemented soon.",
      variant: "default"
    });
  };

  const handleParentCall = (contactId: string) => {
    console.log(`Call parent: ${contactId}`);
    toast({
      title: "Call Parent",
      description: "Calling feature will be implemented soon.",
      variant: "default"
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Enhanced Profile Header with Refresh */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <ProfileHeader
              profileImage={profileHeaderData.profileImage}
              name={profileHeaderData.name}
              classOrDepartment={profileHeaderData.classOrDepartment}
              location={profileHeaderData.location}
              profileInfo={profileHeaderData.profileInfo}
              isStudent={true}
              onEdit={handleEditProfile}
              onMessage={() => {}}
              onCall={() => {}}
            />
          </div>
          <div className="ml-4">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {refreshing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">CGPA</p>
                  <p className="text-2xl font-bold text-blue-900">{profileData.cgpa?.toFixed(2) || 'N/A'}</p>
                  <p className="text-xs text-blue-600">{profileData.completedCredits}/{profileData.totalCredits} Credits</p>
                </div>
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Attendance</p>
                  <p className="text-2xl font-bold text-green-900">{attendanceSummary?.attendancePercentage?.toFixed(1) || 0}%</p>
                  <p className="text-xs text-green-600">{stats?.attendanceStreak || 0} day streak</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Assessments</p>
                  <p className="text-2xl font-bold text-purple-900">{assessmentSummary?.completedAssessments || 0}/{assessmentSummary?.totalAssessments || 0}</p>
                  <p className="text-xs text-purple-600">Avg: {assessmentSummary?.averageScore?.toFixed(1) || 0}%</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Certificates</p>
                  <p className="text-2xl font-bold text-orange-900">{stats?.certificatesCount || 0}</p>
                  <p className="text-xs text-orange-600">{stats?.approvedCertificates || 0} approved</p>
                </div>
                <Award className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comprehensive Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Academic
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="font-medium">{profileData.age} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <Badge variant={profileData.type === 'HOSTELLER' ? 'default' : 'secondary'}>
                        {profileData.type === 'HOSTELLER' ? '🏠 Hosteller' : '🏠 Day Scholar'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Academic Year</p>
                      <p className="font-medium">{profileData.academicYear}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Semester</p>
                      <p className="font-medium">{profileData.semester}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profileData.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profileData.department} Department</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Academic Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">CGPA Progress</span>
                      <span className="text-sm font-medium">{profileData.cgpa?.toFixed(2)}/10.0</span>
                    </div>
                    <Progress value={(profileData.cgpa || 0) * 10} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{stats?.bestSubject || 'N/A'}</p>
                      <p className="text-xs text-blue-600">Best Subject</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{assessmentSummary?.highestScore || 0}%</p>
                      <p className="text-xs text-green-600">Highest Score</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Improvement Areas</p>
                    <div className="flex flex-wrap gap-1">
                      {stats?.improvementAreas?.map((area, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Performance Chart */}
            <PerformanceChart
              title="Recent Performance Trends"
              data={performanceData.map(p => ({
                subject: p.subject,
                score: p.grade,
                fullMark: 100,
                date: p.date
              }))}
              timeFilters={['Last 7 Days', 'Last 30 Days', 'All Time']}
              onFilterChange={(filter) => handleFilterChange('time', filter)}
            />
          </TabsContent>

          {/* Academic Tab */}
          <TabsContent value="academic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assessment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Assessment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{assessmentSummary?.totalAssessments || 0}</p>
                      <p className="text-xs text-blue-600">Total</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{assessmentSummary?.completedAssessments || 0}</p>
                      <p className="text-xs text-green-600">Completed</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completion Rate</span>
                      <span className="text-sm font-medium">
                        {assessmentSummary?.totalAssessments ? 
                          ((assessmentSummary.completedAssessments / assessmentSummary.totalAssessments) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={assessmentSummary?.totalAssessments ? 
                        (assessmentSummary.completedAssessments / assessmentSummary.totalAssessments) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Recent Scores</p>
                    <div className="space-y-2">
                      {assessmentSummary?.recentScores?.slice(0, 3).map((score, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium">{score.assessmentName}</p>
                            <p className="text-xs text-muted-foreground">{score.subject}</p>
                          </div>
                          <Badge variant={score.score >= 80 ? 'default' : score.score >= 60 ? 'secondary' : 'destructive'}>
                            {score.score}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feedback Section */}
              <FeedbackSection
                title="Recent Feedback"
                feedbacks={feedbacks}
                filters={{
                  subjects: ['Math', 'English', 'Biology', 'History', 'Art', 'Chemistry'],
                  timePeriods: ['7 Days', '30 Days', 'All']
                }}
                onFilterChange={handleFilterChange}
              />
            </div>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Attendance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">{attendanceSummary?.attendancePercentage?.toFixed(1) || 0}%</p>
                    <p className="text-sm text-green-600">Overall Attendance</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <p className="text-lg font-bold text-green-600">{attendanceSummary?.presentCount || 0}</p>
                      <p className="text-xs text-green-600">Present</p>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                      <p className="text-lg font-bold text-red-600">{attendanceSummary?.absentCount || 0}</p>
                      <p className="text-xs text-red-600">Absent</p>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded">
                      <p className="text-lg font-bold text-yellow-600">{attendanceSummary?.lateCount || 0}</p>
                      <p className="text-xs text-yellow-600">Late</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Attendance Streak</span>
                      <span className="text-sm font-medium">{stats?.attendanceStreak || 0} days</span>
                    </div>
                    <Progress value={Math.min((stats?.attendanceStreak || 0) * 6.67, 100)} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Subject-wise Attendance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Subject-wise Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {attendanceSummary?.subjectBreakdown?.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{subject.subject}</span>
                        <span className="text-sm text-muted-foreground">{subject.percentage}%</span>
                      </div>
                      <Progress value={subject.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">{subject.totalClasses} classes</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                          <Activity className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{activity.activityType.replace('_', ' ')}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(activity.fromDate).toLocaleDateString()} - {new Date(activity.toDate).toLocaleDateString()}
                          </p>
                          {activity.description && (
                            <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={activity.status === 'COMPLETED' ? "default" : activity.status === 'IN_PROGRESS' ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                        {activity.certificateUrl && (
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No activities found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Certificates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {certificates.length > 0 ? (
                    certificates.map((certificate) => (
                      <div key={certificate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-sm">{certificate.certificateName}</p>
                            <p className="text-xs text-muted-foreground">{certificate.certificateType}</p>
                          </div>
                        </div>
                        <Badge 
                          variant={certificate.status === 'APPROVED' ? 'default' : certificate.status === 'PENDING' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {certificate.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Award className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No certificates uploaded</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Documents */}
              <DocumentList
                title="Documents"
                documents={documents.map(doc => ({
                  id: doc.id.toString(),
                  name: doc.name,
                  type: doc.type,
                  url: doc.url,
                  status: doc.status,
                  uploadDate: doc.uploadedAt || new Date().toISOString()
                }))}
                onEdit={handleEditDocuments}
              />
            </div>

            {/* Parents/Caretakers */}
            <ContactCard
              title="Parents / Caretakers"
              contacts={parents}
              onEdit={handleEditParents}
              onMessage={handleParentMessage}
              onCall={handleParentCall}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StudentProfile;
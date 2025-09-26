import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/Layout";
import { CalendarDays, Users, UserCheck, Clock, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { attendanceService } from "@/services/attendanceService";
import { 
  AttendanceSummaryResponse, 
  AttendancePeriodResponse, 
  AttendanceStats, 
  DailyAttendance 
} from "@/types/attendance";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [dailyAttendance, setDailyAttendance] = useState<AttendancePeriodResponse | null>(null);
  const [recentAttendance, setRecentAttendance] = useState<DailyAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Calculate date range for current month
  const getCurrentMonthRange = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0]
    };
  };

  // Load attendance data
  useEffect(() => {
    const loadAttendanceData = async () => {
      if (!user?.profile?.id) {
        setError('Student profile not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { startDate, endDate } = getCurrentMonthRange();
        
        // Load attendance summary for current month
        const summary = await attendanceService.getAttendanceSummary(
          user.profile.id, 
          startDate, 
          endDate
        );

        // Convert summary to stats format
        const stats: AttendanceStats = {
          present: summary.presentCount,
          absent: summary.absentCount,
          late: summary.lateCount,
          excused: summary.excusedCount,
          medicalLeave: summary.medicalLeaveCount,
          total: summary.totalRecords,
          presentPercentage: summary.presentPercentage,
          absentPercentage: summary.absentPercentage,
          latePercentage: summary.latePercentage,
          excusedPercentage: summary.excusedPercentage,
          medicalLeavePercentage: summary.medicalLeavePercentage
        };
        setAttendanceStats(stats);

        // Load recent attendance (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentStartDate = sevenDaysAgo.toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];

        const recentData = await attendanceService.getAttendanceByStudentAndDateRange(
          user.profile.id,
          recentStartDate,
          today
        );

        // Group by date and calculate daily stats
        const dailyStats: Record<string, DailyAttendance> = {};
        recentData.forEach(record => {
          const date = record.date;
          if (!dailyStats[date]) {
            dailyStats[date] = {
              date,
              present: 0,
              absent: 0,
              late: 0,
              excused: 0,
              medicalLeave: 0,
              percentage: 0
            };
          }

          switch (record.status) {
            case 'PRESENT':
              dailyStats[date].present++;
              break;
            case 'ABSENT':
              dailyStats[date].absent++;
              break;
            case 'LATE':
              dailyStats[date].late++;
              break;
            case 'EXCUSED':
              dailyStats[date].excused++;
              break;
            case 'MEDICAL_LEAVE':
              dailyStats[date].medicalLeave++;
              break;
          }
        });

        // Calculate percentages and convert to array
        const recentAttendanceArray = Object.values(dailyStats)
          .map(day => {
            const total = day.present + day.absent + day.late + day.excused + day.medicalLeave;
            day.percentage = total > 0 ? (day.present / total) * 100 : 0;
            return day;
          })
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 7);

        setRecentAttendance(recentAttendanceArray);

      } catch (err) {
        console.error('Failed to load attendance data:', err);
        
        // Check if it's a network/server error
        const errorMessage = err instanceof Error ? err.message : 'Failed to load attendance data';
        
        if (errorMessage.includes('Network error') || errorMessage.includes('HTML instead of JSON')) {
          // Set fallback data when API is not available
          const fallbackStats: AttendanceStats = {
            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
            medicalLeave: 0,
            total: 0,
            presentPercentage: 0,
            absentPercentage: 0,
            latePercentage: 0,
            excusedPercentage: 0,
            medicalLeavePercentage: 0
          };
          setAttendanceStats(fallbackStats);
          setRecentAttendance([]);
          setError('Unable to connect to the server. Please ensure the backend server is running on http://localhost:8081');
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    loadAttendanceData();
  }, [user]);

  // Load daily attendance when date is selected
  useEffect(() => {
    const loadDailyAttendance = async () => {
      if (!selectedDate || !user?.profile?.id) return;

      try {
        const dateString = selectedDate.toISOString().split('T')[0];
        const dailyData = await attendanceService.getAttendanceByStudentAndDate(
          user.profile.id,
          dateString
        );
        setDailyAttendance(dailyData);
      } catch (err) {
        console.error('Failed to load daily attendance:', err);
        // Don't set error state for daily attendance, just set to null
        setDailyAttendance(null);
      }
    };

    loadDailyAttendance();
  }, [selectedDate, user]);

  // Mock faculty schedule (keeping existing functionality)
  const facultySchedule = [
    { time: "09:00 AM", subject: "Mathematics", faculty: "Dr. Kumar", room: "A-101", status: "scheduled" },
    { time: "10:30 AM", subject: "Physics", faculty: "Prof. Singh", room: "B-205", status: "ongoing" },
    { time: "12:00 PM", subject: "Chemistry", faculty: "Dr. Sharma", room: "C-301", status: "completed" },
    { time: "02:00 PM", subject: "Computer Science", faculty: "Dr. Patel", room: "D-102", status: "scheduled" }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading attendance data...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Attendance Monitoring System
          </h1>
          <p className="text-muted-foreground">
            Track student attendance and manage faculty schedules with real-time insights
            </p>
          </div>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>{error}</p>
                {error.includes('Unable to connect to the server') && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm font-medium text-red-800 mb-2">To fix this issue:</p>
                    <ol className="text-sm text-red-700 list-decimal list-inside space-y-1">
                      <li>Make sure the Spring Boot backend server is running on port 8080</li>
                      <li>Check that the attendance API endpoints are properly configured</li>
                      <li>Verify that CORS is enabled for the frontend URL</li>
                      <li>Check the browser console for more detailed error information</li>
                    </ol>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            {user?.role === 'STUDENT' ? 'My Attendance' : 'Attendance Monitoring System'}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'STUDENT' 
              ? 'Track your attendance records and view detailed reports'
              : 'Track student attendance and manage faculty schedules with real-time insights'
            }
          </p>
        </div>

        <Tabs defaultValue="student" className="space-y-6">
          <TabsList className={`grid w-full ${user?.role === 'STUDENT' ? 'grid-cols-1' : 'grid-cols-2'} lg:w-[400px]`}>
            <TabsTrigger value="student" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {user?.role === 'STUDENT' ? 'My Attendance' : 'Student Attendance'}
            </TabsTrigger>
            {user?.role !== 'STUDENT' && (
            <TabsTrigger value="faculty" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Faculty Schedule
            </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="student" className="space-y-6">
            {attendanceStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                      Present This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
                  <p className="text-xs text-muted-foreground">
                      {attendanceStats.presentPercentage.toFixed(1)}% attendance
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                      Absent This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
                  <p className="text-xs text-muted-foreground">
                      {attendanceStats.absentPercentage.toFixed(1)}% absent
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Late Arrivals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</div>
                  <p className="text-xs text-muted-foreground">
                      {attendanceStats.latePercentage.toFixed(1)}% late
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{attendanceStats.total}</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading">Attendance Calendar</CardTitle>
                  <CardDescription>
                    Select a date to view detailed attendance records
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border shadow-sm"
                  />
                  {selectedDate && dailyAttendance && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">
                        Attendance for {selectedDate.toDateString()}
                      </h4>
                      {dailyAttendance.periods.length > 0 ? (
                        <div className="space-y-2">
                          {dailyAttendance.periods.map((period, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{period.subject}</span>
                                <span className="text-xs text-muted-foreground">({period.periodTimeSlot})</span>
                              </div>
                              <Badge 
                                variant={
                                  period.status === 'PRESENT' ? 'default' :
                                  period.status === 'ABSENT' ? 'destructive' :
                                  period.status === 'LATE' ? 'secondary' : 'outline'
                                }
                                className={
                                  period.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                                  period.status === 'ABSENT' ? 'bg-red-100 text-red-800' :
                                  period.status === 'LATE' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }
                              >
                                {period.statusDisplayName}
                        </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No attendance records found for this date.
                        </div>
                      )}
                    </div>
                  )}
                  {selectedDate && !dailyAttendance && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Loading attendance data for {selectedDate.toDateString()}...
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading">Recent Attendance</CardTitle>
                  <CardDescription>
                    Daily attendance trends for the past week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAttendance.length > 0 ? (
                      recentAttendance.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <div className="font-medium">{new Date(day.date).toLocaleDateString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {day.present} present, {day.absent} absent
                              {day.late > 0 && `, ${day.late} late`}
                              {day.excused > 0 && `, ${day.excused} excused`}
                            </div>
                        </div>
                        <Badge 
                          variant={day.percentage >= 95 ? "default" : day.percentage >= 90 ? "secondary" : "destructive"}
                          className="font-medium"
                        >
                            {day.percentage.toFixed(1)}%
                        </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No recent attendance data available.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {user?.role !== 'STUDENT' && (
          <TabsContent value="faculty" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading">Faculty Schedule Calendar</CardTitle>
                  <CardDescription>
                    Manage and view faculty schedules and availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border shadow-sm"
                  />
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      Add Schedule
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading">Today's Schedule</CardTitle>
                  <CardDescription>
                    Faculty schedule and class assignments for today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {facultySchedule.map((schedule, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{schedule.subject}</span>
                            <Badge 
                              variant={
                                schedule.status === "completed" ? "default" :
                                schedule.status === "ongoing" ? "secondary" : "outline"
                              }
                              className="text-xs"
                            >
                              {schedule.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {schedule.faculty} • Room {schedule.room}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-right">
                          {schedule.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Attendance;
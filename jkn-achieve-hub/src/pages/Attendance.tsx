import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Users, UserCheck, Clock } from "lucide-react";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Mock attendance data
  const attendanceStats = {
    present: 245,
    absent: 23,
    late: 12,
    total: 280
  };

  const recentAttendance = [
    { date: "2024-01-15", present: 267, absent: 13, percentage: 95.4 },
    { date: "2024-01-14", present: 254, absent: 26, percentage: 90.7 },
    { date: "2024-01-13", present: 271, absent: 9, percentage: 96.8 },
    { date: "2024-01-12", present: 249, absent: 31, percentage: 88.9 }
  ];

  const facultySchedule = [
    { time: "09:00 AM", subject: "Mathematics", faculty: "Dr. Kumar", room: "A-101", status: "scheduled" },
    { time: "10:30 AM", subject: "Physics", faculty: "Prof. Singh", room: "B-205", status: "ongoing" },
    { time: "12:00 PM", subject: "Chemistry", faculty: "Dr. Sharma", room: "C-301", status: "completed" },
    { time: "02:00 PM", subject: "Computer Science", faculty: "Dr. Patel", room: "D-102", status: "scheduled" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Attendance Monitoring System
          </h1>
          <p className="text-muted-foreground">
            Track student attendance and manage faculty schedules with real-time insights
          </p>
        </div>

        <Tabs defaultValue="student" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="student" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Student Attendance
            </TabsTrigger>
            <TabsTrigger value="faculty" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Faculty Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Present Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
                  <p className="text-xs text-muted-foreground">
                    {((attendanceStats.present / attendanceStats.total) * 100).toFixed(1)}% attendance
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Absent Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
                  <p className="text-xs text-muted-foreground">
                    {((attendanceStats.absent / attendanceStats.total) * 100).toFixed(1)}% absent
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
                    {((attendanceStats.late / attendanceStats.total) * 100).toFixed(1)}% late
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{attendanceStats.total}</div>
                  <p className="text-xs text-muted-foreground">Enrolled this semester</p>
                </CardContent>
              </Card>
            </div>

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
                  {selectedDate && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">
                        Attendance for {selectedDate.toDateString()}
                      </h4>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Present: 89%
                        </Badge>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Absent: 11%
                        </Badge>
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
                    {recentAttendance.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <div className="font-medium">{new Date(day.date).toLocaleDateString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {day.present} present, {day.absent} absent
                          </div>
                        </div>
                        <Badge 
                          variant={day.percentage >= 95 ? "default" : day.percentage >= 90 ? "secondary" : "destructive"}
                          className="font-medium"
                        >
                          {day.percentage}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

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
        </Tabs>
      </div>
    </div>
  );
};

export default Attendance;
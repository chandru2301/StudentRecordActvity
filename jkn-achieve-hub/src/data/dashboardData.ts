// Mock data for Student Dashboard
export const studentDashboardData = {
  summaryCards: {
    coursesEnrolled: 8,
    creditsCompleted: 120,
    gpa: 3.7,
    attendancePercentage: 92
  },
  
  examResultsChart: {
    title: "Exam Results by Subject",
    subtitle: "Performance Overview",
    data: [
      { subject: "Mathematics", marks: 85, maxMarks: 100 },
      { subject: "Physics", marks: 78, maxMarks: 100 },
      { subject: "Chemistry", marks: 82, maxMarks: 100 },
      { subject: "English", marks: 90, maxMarks: 100 },
      { subject: "Computer Science", marks: 88, maxMarks: 100 },
      { subject: "Economics", marks: 75, maxMarks: 100 }
    ]
  },
  
  gradeDistributionChart: {
    title: "Grade Distribution",
    subtitle: "Current Semester",
    data: [
      { grade: "A", count: 3, color: "#10B981" },
      { grade: "B", count: 4, color: "#3B82F6" },
      { grade: "C", count: 1, color: "#F59E0B" },
      { grade: "D", count: 0, color: "#EF4444" }
    ]
  },
  
  upcomingExams: [
    { id: 1, subject: "Advanced Mathematics", date: "2024-02-15", status: "Scheduled", time: "10:00 AM" },
    { id: 2, subject: "Data Structures", date: "2024-02-20", status: "Scheduled", time: "2:00 PM" },
    { id: 3, subject: "Database Systems", date: "2024-02-25", status: "Scheduled", time: "9:00 AM" },
    { id: 4, subject: "Software Engineering", date: "2024-03-01", status: "Scheduled", time: "11:00 AM" }
  ],
  
  notifications: [
    {
      id: 1,
      type: "exam",
      title: "Midterm Exam Schedule",
      message: "Midterm exams will be conducted from March 1-15, 2024. Please check your timetable.",
      timestamp: "2 hours ago",
      icon: "📚"
    },
    {
      id: 2,
      type: "fee",
      title: "Semester Fee Due",
      message: "Your semester fee payment is due on February 28, 2024. Please make payment to avoid late fees.",
      timestamp: "1 day ago",
      icon: "💰"
    },
    {
      id: 3,
      type: "assignment",
      title: "Project Submission",
      message: "Final year project submission deadline is March 10, 2024. Submit your project report.",
      timestamp: "3 days ago",
      icon: "📝"
    }
  ]
};

// Mock data for Faculty Dashboard
export const facultyDashboardData = {
  summaryCards: {
    studentsAssigned: 156,
    coursesTeaching: 4,
    attendanceRate: 89,
    reportsGenerated: 23
  },
  
  studentPerformanceChart: {
    title: "Student Performance by Class",
    subtitle: "Average Marks Comparison",
    data: [
      { class: "CS-101", averageMarks: 78, totalStudents: 40 },
      { class: "CS-102", averageMarks: 82, totalStudents: 35 },
      { class: "CS-201", averageMarks: 75, totalStudents: 42 },
      { class: "CS-301", averageMarks: 85, totalStudents: 39 }
    ]
  },
  
  attendanceDistributionChart: {
    title: "Attendance Distribution",
    subtitle: "Current Semester",
    data: [
      { status: "Present", count: 89, color: "#10B981" },
      { status: "Absent", count: 11, color: "#EF4444" }
    ]
  },
  
  studentPerformance: [
    { id: 1, studentName: "John Smith", subject: "Data Structures", marks: 85, status: "Passed", rollNumber: "CS2024001" },
    { id: 2, studentName: "Sarah Johnson", subject: "Algorithms", marks: 92, status: "Passed", rollNumber: "CS2024002" },
    { id: 3, studentName: "Mike Wilson", subject: "Database Systems", marks: 78, status: "Passed", rollNumber: "CS2024003" },
    { id: 4, studentName: "Emily Davis", subject: "Software Engineering", marks: 88, status: "Passed", rollNumber: "CS2024004" },
    { id: 5, studentName: "David Brown", subject: "Computer Networks", marks: 65, status: "Needs Improvement", rollNumber: "CS2024005" }
  ],
  
  validationRequests: [
    { id: 1, studentName: "Alice Cooper", subject: "Machine Learning", requestType: "Grade Review", status: "Pending", submittedDate: "2024-02-10" },
    { id: 2, studentName: "Bob Taylor", subject: "AI Fundamentals", requestType: "Attendance Appeal", status: "Approved", submittedDate: "2024-02-08" },
    { id: 3, studentName: "Carol White", subject: "Data Mining", requestType: "Assignment Extension", status: "Pending", submittedDate: "2024-02-12" }
  ],
  
  notifications: [
    {
      id: 1,
      type: "deadline",
      title: "Grade Submission Deadline",
      message: "Final grades for CS-301 must be submitted by March 5, 2024. Please complete grading.",
      timestamp: "1 hour ago",
      icon: "⏰"
    },
    {
      id: 2,
      type: "meeting",
      title: "Faculty Meeting",
      message: "Monthly faculty meeting scheduled for February 28, 2024 at 2:00 PM in Conference Room A.",
      timestamp: "2 hours ago",
      icon: "👥"
    },
    {
      id: 3,
      type: "submission",
      title: "New Assignment Submission",
      message: "15 new assignments submitted for CS-201. Please review and grade.",
      timestamp: "4 hours ago",
      icon: "📄"
    }
  ]
};

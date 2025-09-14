// Mock data for Student Profile
export const studentMockData = {
  profile: {
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    name: 'Giorgi Gavashelishvili',
    classOrDepartment: 'X-B Class',
    location: 'Tbilisi, Georgia',
    profileInfo: {
      dateOfBirth: 'May/23/2007',
      enrollment: 'Sep/23/2012',
      orderNumber: '8547921',
      bloodType: 'A+',
      allergies: 'No Record',
      chronicDisease: 'No Record'
    }
  },
  feedbacks: [
    {
      id: '1',
      teacherName: 'Tinatin Papadze',
      teacherImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      subject: 'Math',
      date: '14/Mar',
      lesson: 'Trigonometric equations, Page 24, 1-7, 8-12; 15-16',
      comment: 'Good Job Giorgi',
      grade: 9,
      status: 'completed' as const,
      homework: 'Complete exercises 1-7, 8-12, 15-16'
    },
    {
      id: '2',
      teacherName: 'Mzia Saatashvili',
      teacherImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      subject: 'English',
      date: '12/Mar',
      lesson: 'Lesson #12, Page 30',
      comment: 'Giorgi, Please be more prepared for next lesson',
      grade: 7,
      status: 'completed' as const,
      homework: 'Read pages 28-30'
    },
    {
      id: '3',
      teacherName: 'Nino Kiknadze',
      teacherImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      subject: 'Biology',
      date: '10/Mar',
      lesson: 'Cell Structure and Function',
      comment: 'Excellent understanding of the topic',
      grade: 10,
      status: 'completed' as const,
      homework: 'Review chapter 5'
    },
    {
      id: '4',
      teacherName: 'David Chkheidze',
      teacherImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      subject: 'History',
      date: '08/Mar',
      lesson: 'World War II',
      comment: 'Good participation in class discussion',
      grade: 8,
      status: 'pending' as const,
      homework: 'Write essay on WWII causes'
    }
  ],
  performanceData: [
    { subject: 'Math', score: 9, fullMark: 10 },
    { subject: 'Georgian Literature', score: 8.5, fullMark: 10 },
    { subject: 'Biology', score: 9.5, fullMark: 10 },
    { subject: 'History', score: 7.5, fullMark: 10 },
    { subject: 'Art', score: 6.5, fullMark: 10 },
    { subject: 'Chemistry', score: 8, fullMark: 10 }
  ],
  parents: [
    {
      id: '1',
      name: 'Natia Gavashelishvili',
      relation: 'Mother',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      phone: '+995 555 123 456',
      email: 'natia.gavashelishvili@email.com'
    },
    {
      id: '2',
      name: 'Nugzar Gavashelishvili',
      relation: 'Father',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      phone: '+995 555 123 457',
      email: 'nugzar.gavashelishvili@email.com'
    }
  ],
  documents: [
    {
      id: '1',
      name: 'Birth Certificate',
      type: 'certificate' as const,
      status: 'available' as const,
      uploadDate: 'Jan 15, 2023',
      downloadUrl: '/documents/birth-certificate.pdf',
      previewUrl: '/documents/birth-certificate-preview.pdf'
    },
    {
      id: '2',
      name: 'Form 100',
      type: 'form' as const,
      status: 'available' as const,
      uploadDate: 'Feb 20, 2023',
      downloadUrl: '/documents/form-100.pdf',
      previewUrl: '/documents/form-100-preview.pdf'
    },
    {
      id: '3',
      name: 'Medical Certificate',
      type: 'certificate' as const,
      status: 'pending' as const,
      uploadDate: 'Mar 10, 2023'
    }
  ]
};

export const facultyMockData = {
  profile: {
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    name: 'Dr. Alexander Johnson',
    classOrDepartment: 'Computer Science Department',
    location: 'University of Technology, Tbilisi',
    profileInfo: {
      dateOfJoining: 'Sep/15/2018',
      role: 'Professor',
      specialization: 'Machine Learning & AI',
      officeHours: 'Mon-Fri 10:00-12:00',
      facultyId: 'FAC-2023-001'
    }
  },
  studentSubmissions: [
    {
      id: '1',
      studentName: 'Giorgi Gavashelishvili',
      studentImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      assignment: 'Machine Learning Project',
      subject: 'CS-401',
      submissionDate: 'Mar 15, 2023',
      status: 'pending' as const,
      grade: null
    },
    {
      id: '2',
      studentName: 'Mariam Kiknadze',
      studentImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      assignment: 'Data Structures Assignment',
      subject: 'CS-301',
      submissionDate: 'Mar 12, 2023',
      status: 'approved' as const,
      grade: 95
    },
    {
      id: '3',
      studentName: 'David Chkheidze',
      studentImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      assignment: 'Algorithm Analysis',
      subject: 'CS-302',
      submissionDate: 'Mar 10, 2023',
      status: 'rejected' as const,
      grade: 65
    }
  ],
  attendanceData: [
    { subject: 'CS-401', present: 45, absent: 5, total: 50 },
    { subject: 'CS-301', present: 38, absent: 2, total: 40 },
    { subject: 'CS-302', present: 42, absent: 8, total: 50 }
  ],
  feedbackLogs: [
    {
      id: '1',
      studentName: 'Giorgi Gavashelishvili',
      studentImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      subject: 'CS-401',
      date: 'Mar 14, 2023',
      feedback: 'Excellent work on the machine learning project. Your implementation shows deep understanding of the concepts.',
      grade: 92,
      status: 'completed' as const
    },
    {
      id: '2',
      studentName: 'Mariam Kiknadze',
      studentImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      subject: 'CS-301',
      date: 'Mar 12, 2023',
      feedback: 'Good understanding of data structures. Consider optimizing the time complexity.',
      grade: 88,
      status: 'completed' as const
    }
  ],
  documents: [
    {
      id: '1',
      name: 'CV - Dr. Alexander Johnson',
      type: 'other' as const,
      status: 'available' as const,
      uploadDate: 'Jan 10, 2023',
      downloadUrl: '/documents/cv-alexander-johnson.pdf'
    },
    {
      id: '2',
      name: 'Research Publications List',
      type: 'report' as const,
      status: 'available' as const,
      uploadDate: 'Feb 15, 2023',
      downloadUrl: '/documents/publications-list.pdf'
    },
    {
      id: '3',
      name: 'Teaching Philosophy Statement',
      type: 'other' as const,
      status: 'pending' as const,
      uploadDate: 'Mar 5, 2023'
    }
  ],
  schedule: [
    {
      id: '1',
      title: 'CS-401 Lecture',
      time: '09:00-10:30',
      location: 'Room 201',
      type: 'lecture' as const,
      date: '2023-03-20'
    },
    {
      id: '2',
      title: 'Office Hours',
      time: '10:00-12:00',
      location: 'Office 305',
      type: 'office' as const,
      date: '2023-03-20'
    },
    {
      id: '3',
      title: 'CS-301 Lab',
      time: '14:00-16:00',
      location: 'Lab 101',
      type: 'lab' as const,
      date: '2023-03-20'
    }
  ]
};

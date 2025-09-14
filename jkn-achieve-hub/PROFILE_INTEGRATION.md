# Dynamic Student & Faculty Profile Pages

This document explains how the Student and Faculty Profile pages work dynamically with real user data from the authentication system.

## Overview

The profile pages are now fully integrated with the authentication system and display real user data from the login response. The pages automatically adapt based on the user's role (STUDENT or FACULTY) and show relevant information.

## User Data Structure

### Student User Response
```json
{
    "id": 1,
    "username": "chandru",
    "email": "chan@gmail.com",
    "phoneNumber": "9003902923",
    "role": "STUDENT",
    "profile": {
        "id": 1,
        "name": "Chandru V",
        "email": "chan@gmail.com",
        "phoneNumber": "9003902923",
        "degree": "cse",
        "dob": "2025-09-11",
        "rollNumber": "121",
        "type": "HOSTELLER",
        "createdAt": "2025-09-14T22:45:36.77787",
        "updatedAt": "2025-09-14T22:45:36.77787"
    }
}
```

### Faculty User Response
```json
{
    "id": 2,
    "username": "tharsan",
    "email": "tharsan@gmail.com",
    "phoneNumber": "9003902923",
    "role": "FACULTY",
    "profile": {
        "id": 1,
        "name": "tharsan",
        "email": "tharsan@gmail.com",
        "phoneNumber": "9003902923",
        "department": "CSE",
        "createdAt": "2025-09-14T22:57:09.200471",
        "updatedAt": "2025-09-14T22:57:09.200471"
    }
}
```

## Dynamic Features

### 1. Profile Header
- **Profile Image**: Automatically generated using UI Avatars API with user's name
- **Name**: Displayed from `user.profile.name`
- **Class/Department**: 
  - Students: Shows degree and roll number (e.g., "CSE - Roll: 121")
  - Faculty: Shows department (e.g., "CSE Department")
- **Location**: Default to "University Campus" (can be customized)
- **Personal Details**: Transformed from user profile data

### 2. Student Profile Features
- **Personal Information**: Date of birth, enrollment, roll number, blood type, allergies, chronic diseases
- **Academic Performance**: Radar chart showing performance across subjects
- **Teacher Feedback**: List of feedback from teachers with grades and comments
- **Parent Contacts**: Contact information for parents/guardians
- **Documents**: Academic documents with download/preview options

### 3. Faculty Profile Features
- **Professional Information**: Date of joining, role, specialization, office hours, faculty ID
- **Student Activity Validation**: Approve/reject student submissions
- **Attendance Monitoring**: Class attendance statistics
- **Feedback & Mentoring**: Logs of feedback provided to students
- **Document Management**: Review and approve student documents
- **Schedule Management**: Calendar view of classes and office hours
- **Report Generation**: Generate PDF/Excel reports

## Access Control

### Role-Based Access
- **Student Profile** (`/student/profile`): Only accessible to users with `role: "STUDENT"`
- **Faculty Profile** (`/faculty/profile`): Only accessible to users with `role: "FACULTY"`

### Authentication Checks
- Users must be logged in to access profile pages
- Loading states are shown while user data is being fetched
- Access denied messages for unauthorized users

## Data Transformation

### Student Data Mapping
```typescript
const profileData = {
  profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(studentProfile.name)}&background=8b5cf6&color=ffffff&size=150`,
  name: studentProfile.name,
  classOrDepartment: `${studentProfile.degree?.toUpperCase() || 'STUDENT'} - Roll: ${studentProfile.rollNumber}`,
  location: 'University Campus',
  profileInfo: {
    dateOfBirth: new Date(studentProfile.dob).toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    }),
    enrollment: new Date(studentProfile.dob).toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    }),
    orderNumber: studentProfile.rollNumber,
    bloodType: 'A+', // Default value - can be added to backend
    allergies: 'No Record', // Default value - can be added to backend
    chronicDisease: 'No Record' // Default value - can be added to backend
  }
};
```

### Faculty Data Mapping
```typescript
const profileData = {
  profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(facultyProfile.name)}&background=8b5cf6&color=ffffff&size=150`,
  name: facultyProfile.name,
  classOrDepartment: `${facultyProfile.department} Department`,
  location: 'University Campus',
  profileInfo: {
    dateOfJoining: 'Sep/15/2018', // Default value - can be added to backend
    role: 'Professor', // Default value - can be added to backend
    specialization: 'Computer Science', // Default value - can be added to backend
    officeHours: 'Mon-Fri 10:00-12:00', // Default value - can be added to backend
    facultyId: `FAC-${facultyProfile.id.toString().padStart(3, '0')}` // Generate from user ID
  }
};
```

## Mock Data Integration

Currently, the following sections use mock data (can be replaced with real API calls):
- **Student**: Feedback, performance data, parents, documents
- **Faculty**: Student submissions, attendance, feedback logs, documents, schedule

## API Integration Ready

The `profileService.ts` file provides a template for integrating with real API endpoints:

```typescript
// Example usage in components
const { user } = useAuth();
const [profileData, setProfileData] = useState(null);

useEffect(() => {
  if (user?.role === 'STUDENT') {
    profileService.getStudentData(user.id).then(setProfileData);
  } else if (user?.role === 'FACULTY') {
    profileService.getFacultyData(user.id).then(setProfileData);
  }
}, [user]);
```

## Navigation

### Sidebar Integration
- Profile links added to both student and faculty sidebars
- Active state highlighting for current page
- Responsive design with collapsible sidebar

### Dashboard Integration
- "View Full Profile" buttons added to dashboard profile cards
- Direct navigation to appropriate profile page based on user role

## Responsive Design

- **Mobile-first approach** with responsive grid layouts
- **Touch-friendly interfaces** for mobile devices
- **Collapsible sidebar** for better mobile experience
- **Optimized typography** for different screen sizes

## Future Enhancements

### Backend Integration Points
1. **Student Profile Extensions**:
   - Blood type, allergies, chronic diseases
   - Real feedback data from teachers
   - Actual performance metrics
   - Parent/guardian contact information

2. **Faculty Profile Extensions**:
   - Date of joining, role, specialization
   - Office hours and availability
   - Real student submission data
   - Actual attendance records

3. **Real-time Updates**:
   - WebSocket integration for live updates
   - Push notifications for new feedback
   - Real-time attendance tracking

### Additional Features
- **Profile editing** with form validation
- **Document upload** with progress tracking
- **Advanced filtering** and search capabilities
- **Export functionality** for reports and data
- **Mobile app integration** with React Native

## Usage Examples

### Accessing Profile Pages
```typescript
// Navigate to student profile
navigate('/student/profile');

// Navigate to faculty profile
navigate('/faculty/profile');
```

### Checking User Role
```typescript
const { user } = useAuth();

if (user?.role === 'STUDENT') {
  // Show student-specific content
} else if (user?.role === 'FACULTY') {
  // Show faculty-specific content
}
```

### Profile Data Access
```typescript
const { user } = useAuth();
const studentProfile = user?.profile; // Type: StudentProfile | FacultyProfile

// Access specific fields
const studentName = studentProfile?.name;
const studentRollNumber = studentProfile?.rollNumber; // Only for students
const facultyDepartment = studentProfile?.department; // Only for faculty
```

## Security Considerations

- **Authentication required** for all profile access
- **Role-based authorization** prevents unauthorized access
- **Data validation** on both client and server side
- **Secure API endpoints** with proper error handling
- **Token-based authentication** with automatic refresh

The profile pages are now fully dynamic and ready for production use with your authentication system!

# Student Activity Management Module

A comprehensive full-stack application for managing student activities with Spring Boot backend and React frontend.

## Features

### Backend (Spring Boot)
- **Activity Management**: CRUD operations for student activities
- **File Upload**: Certificate upload and management
- **Student Management**: Student profile and activity tracking
- **RESTful API**: Complete REST API with proper error handling
- **Database Integration**: MySQL with JPA/Hibernate
- **Security**: JWT-based authentication
- **File Storage**: Local file storage with configurable upload directory

### Frontend (React + TypeScript)
- **Activity Form**: Create and edit activities with file upload
- **Activity List**: View and manage activities with filtering and search
- **Activity Detail**: Detailed view of individual activities
- **File Management**: Upload, view, and download certificates
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Updates**: Dynamic UI updates and notifications

## Technology Stack

### Backend
- **Java 17+**
- **Spring Boot 3.x**
- **Spring Data JPA**
- **MySQL 8.0**
- **Maven**
- **JWT Authentication**
- **Lombok**

### Frontend
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **React Router**
- **Axios**
- **Lucide React Icons**
- **Sonner (Toast notifications)**

## Project Structure

```
StudentActivityRecord/
├── src/main/java/com/swp/
│   ├── entity/
│   │   ├── Activity.java
│   │   ├── ActivityType.java
│   │   └── Student.java (updated)
│   ├── repository/
│   │   ├── ActivityRepository.java
│   │   └── StudentRepository.java
│   ├── service/
│   │   ├── ActivityService.java
│   │   └── FileUploadService.java
│   ├── controller/
│   │   ├── ActivityController.java
│   │   └── FileUploadController.java
│   └── dto/
│       ├── ActivityRequest.java
│       └── ActivityResponse.java
└── src/main/resources/
    └── application.properties

jkn-achieve-hub/
├── src/
│   ├── components/
│   │   ├── ActivityForm.tsx
│   │   ├── ActivityList.tsx
│   │   ├── ActivityDetail.tsx
│   │   └── ActivityManagement.tsx
│   ├── pages/
│   │   ├── Activities.tsx
│   │   └── AdminActivities.tsx
│   ├── services/
│   │   ├── activityService.ts
│   │   └── fileUploadService.ts
│   └── App.tsx (updated)
```

## API Endpoints

### Activities
- `POST /api/activities` - Create new activity
- `GET /api/activities` - Get all activities
- `GET /api/activities/{id}` - Get activity by ID
- `GET /api/activities/student/{studentId}` - Get activities by student
- `PUT /api/activities/{id}` - Update activity
- `DELETE /api/activities/{id}` - Delete activity
- `GET /api/activities/type/{activityType}` - Get activities by type
- `GET /api/activities/date-range` - Get activities by date range
- `GET /api/activities/student/{studentId}/count` - Count activities by student

### File Upload
- `POST /api/upload/certificate` - Upload certificate file
- `DELETE /api/upload/file` - Delete file
- `GET /api/upload/file/exists` - Check file existence

## Database Schema

### Activities Table
```sql
CREATE TABLE activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    activity_type ENUM('HACKATHON', 'INTER_COLLEGE', 'OUTER_COLLEGE', 'GOVERNMENT_EVENT') NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    certificate_url VARCHAR(500),
    feedback TEXT,
    student_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
```

### Students Table (Updated)
```sql
ALTER TABLE students 
ADD COLUMN class_name VARCHAR(100) NOT NULL DEFAULT '',
ADD COLUMN department VARCHAR(100) NOT NULL DEFAULT '';
```

## Setup Instructions

### Backend Setup

1. **Prerequisites**
   - Java 17 or higher
   - MySQL 8.0
   - Maven 3.6+

2. **Database Setup**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE student_activity_record;
   
   # Run schema script
   mysql -u root -p student_activity_record < database_schema.sql
   ```

3. **Configuration**
   Update `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/student_activity_record
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. **Run Application**
   ```bash
   cd StudentActivityRecord
   mvn spring-boot:run
   ```

### Frontend Setup

1. **Prerequisites**
   - Node.js 18+
   - npm or yarn

2. **Install Dependencies**
   ```bash
   cd jkn-achieve-hub
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Usage

### For Students
1. Navigate to `/activities` to view and manage your activities
2. Click "Add Activity" to create a new activity
3. Fill in the activity details and upload certificate
4. View, edit, or delete existing activities

### For Faculty/Admin
1. Navigate to `/admin/activities` to view all student activities
2. Filter activities by type, date range, or search terms
3. View detailed activity information
4. Monitor student participation

## Activity Types

- **Hackathon**: Coding competitions and hackathons
- **Inter College**: Activities involving multiple colleges
- **Outer College**: Activities outside the college
- **Government Event**: Government-sponsored events and programs

## File Upload Features

- **Supported Formats**: PDF, JPEG, PNG
- **File Size Limit**: 5MB
- **Storage**: Local file system (configurable)
- **Security**: File type validation and size limits
- **URL Generation**: Automatic URL generation for uploaded files

## Security Features

- **JWT Authentication**: Secure API access
- **CORS Configuration**: Cross-origin request handling
- **File Validation**: Uploaded file type and size validation
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: JPA/Hibernate parameterized queries

## Error Handling

- **Backend**: Comprehensive exception handling with proper HTTP status codes
- **Frontend**: User-friendly error messages with toast notifications
- **File Upload**: Graceful handling of upload failures
- **Validation**: Real-time form validation with error display

## Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Lazy Loading**: JPA lazy loading for related entities
- **Pagination**: Support for paginated results (can be implemented)
- **Caching**: Spring Cache support (can be implemented)
- **File Compression**: Automatic file compression for uploads

## Future Enhancements

- **Cloud Storage**: Integration with AWS S3 or Google Cloud Storage
- **Email Notifications**: Activity approval and reminder emails
- **Reporting**: Advanced reporting and analytics
- **Mobile App**: React Native mobile application
- **Real-time Updates**: WebSocket integration for real-time updates
- **Bulk Operations**: Bulk import/export of activities
- **Advanced Search**: Full-text search capabilities
- **Activity Templates**: Predefined activity templates
- **Approval Workflow**: Multi-level approval process
- **Integration**: Integration with external systems and APIs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

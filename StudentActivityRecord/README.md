# Student Activity Record System

A complete Register & Login functionality using Spring Boot (Java) for backend and React for frontend.

## Features

### Backend (Spring Boot)
- **Spring Boot 3** with **Spring Security** and **JWT** authentication
- **Spring Data JPA** with **MySQL** database
- **Role-based authentication** (STUDENT, FACULTY)
- **BCrypt password hashing**
- **CORS configuration** for frontend integration

### Frontend (React)
- **React 18** with **TypeScript**
- **React Router** for navigation
- **React Hook Form** with **Zod** validation
- **Axios** for API calls
- **JWT token management** with localStorage
- **Route protection** with PrivateRoute component
- **Responsive UI** with Tailwind CSS and shadcn/ui

## Project Structure

### Backend Structure
```
src/main/java/com/swp/
├── entity/
│   ├── User.java
│   ├── Student.java
│   └── Faculty.java
├── repository/
│   ├── UserRepository.java
│   ├── StudentRepository.java
│   └── FacultyRepository.java
├── service/
│   ├── AuthService.java
│   └── UserDetailsServiceImpl.java
├── controller/
│   └── AuthController.java
├── security/
│   ├── SecurityConfig.java
│   └── JwtAuthenticationFilter.java
├── util/
│   └── JwtUtil.java
└── dto/
    ├── LoginRequest.java
    ├── RegisterRequest.java
    ├── AuthResponse.java
    └── UserProfileResponse.java
```

### Frontend Structure
```
src/
├── components/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── Dashboard.tsx
│   └── PrivateRoute.tsx
├── contexts/
│   └── AuthContext.tsx
├── services/
│   └── authService.ts
└── App.tsx
```

## Prerequisites

- **Java 17** or higher
- **Node.js 16** or higher
- **MySQL 8.0** or higher
- **Maven 3.6** or higher

## Setup Instructions

### 1. Database Setup

1. Install MySQL and create a database:
```sql
CREATE DATABASE student_activity_record;
```

2. Run the database schema script:
```bash
mysql -u root -p student_activity_record < database_schema.sql
```

3. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 2. Backend Setup (Spring Boot)

1. Navigate to the backend directory:
```bash
cd D:\java\StudentActivityRecord
```

2. Install dependencies:
```bash
mvn clean install
```

3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`

### 3. Frontend Setup (React)

1. Navigate to the frontend directory:
```bash
cd C:\Users\admin\Documents\StudentRecordActivity\jkn-achieve-hub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/me` - Get current user information

### Request/Response Examples

#### Register Request
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "1234567890",
  "role": "STUDENT",
  "name": "John Doe",
  "degree": "Computer Science",
  "dob": "2000-01-15",
  "rollNumber": "CS2024001",
  "type": "HOSTELLER"
}
```

#### Login Request
```json
{
  "usernameOrEmail": "john_doe",
  "password": "password123",
  "captcha": "ABC123"
}
```

#### Auth Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "STUDENT",
  "profile": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "1234567890",
    "degree": "Computer Science",
    "dob": "2000-01-15",
    "rollNumber": "CS2024001",
    "type": "HOSTELLER"
  }
}
```

## Usage

### Registration
1. Navigate to `http://localhost:3000/register`
2. Fill in the registration form
3. Select role (Student or Faculty)
4. Fill in role-specific fields
5. Submit the form

### Login
1. Navigate to `http://localhost:3000/login`
2. Enter username/email and password
3. Enter captcha (currently simplified)
4. Click "Sign In"

### Dashboard
1. After successful login, you'll be redirected to the dashboard
2. View your account information and profile details
3. Role-specific information will be displayed based on your user type

## Security Features

- **JWT Token Authentication** - Secure token-based authentication
- **Password Hashing** - BCrypt for secure password storage
- **CORS Configuration** - Proper cross-origin resource sharing
- **Input Validation** - Server-side validation with Bean Validation
- **Role-based Access** - Different access levels for Students and Faculty

## Development Notes

- The captcha validation is simplified for development purposes
- JWT tokens expire after 24 hours (configurable)
- Database schema is auto-generated on first run
- CORS is configured to allow requests from `http://localhost:3000`

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in `application.properties`
   - Verify database exists

2. **CORS Error**
   - Ensure backend is running on port 8080
   - Check CORS configuration in `SecurityConfig.java`

3. **JWT Token Issues**
   - Check JWT secret key in `application.properties`
   - Verify token expiration settings

4. **Frontend Build Issues**
   - Run `npm install` to install dependencies
   - Check Node.js version compatibility

## Production Considerations

- Change JWT secret key to a secure random string
- Implement proper captcha service
- Add rate limiting for authentication endpoints
- Use HTTPS in production
- Implement proper logging and monitoring
- Add database connection pooling
- Set up proper error handling and user feedback

## Sample Data

The database schema includes sample data:
- **Student**: username: `john_student`, password: `password123`
- **Faculty**: username: `prof_smith`, password: `password123`

**Note**: Change these default passwords in production!

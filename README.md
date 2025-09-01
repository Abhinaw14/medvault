# MedVault - Medical Management System

A comprehensive medical management system built with Spring Boot backend and React frontend.

## Features

- **Admin Registration**: Secure admin user registration with validation
- **Password Reset**: Admin password reset functionality
- **User Management**: Complete user CRUD operations
- **Role-based Access**: Support for ADMIN, DOCTOR, and PATIENT roles
- **Modern UI**: Beautiful, responsive React frontend
- **Secure Backend**: Spring Security with BCrypt password encoding

## Project Structure

```
medvault/
├── backend/                    # Spring Boot backend
│   ├── main/
│   │   ├── java/com/medvault/
│   │   │   ├── config/          # Security configuration
│   │   │   ├── controller/      # REST API controllers
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── entity/         # JPA entities
│   │   │   ├── repository/     # Data access layer
│   │   │   └── service/        # Business logic
│   │   └── resources/
│   │       └── application.properties
│   └── pom.xml                 # Maven dependencies
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── pages/              # React components
│   │   │   ├── AdminRegistration.js
│   │   │   ├── AdminRegistration.css
│   │   │   ├── ResetPassword.js
│   │   │   └── ResetPassword.css
│   │   ├── App.js              # Main React component
│   │   ├── App.css             # Main styles
│   │   └── index.js            # React entry point
│   ├── public/
│   │   └── index.html
│   └── package.json            # Node.js dependencies
├── docs/                       # Documentation
├── mvnw                        # Maven wrapper
├── mvnw.cmd                    # Maven wrapper (Windows)
└── README.md                   # This file
```

## Prerequisites

- Java 21 or higher
- Maven 3.6+
- Node.js 16+ and npm
- MySQL 8.0+

## Setup Instructions

### Backend Setup

1. **Database Configuration**
   - Create a MySQL database named `medvault`
   - Update `backend/main/resources/application.properties` with your database credentials

2. **Run the Backend**
   ```bash
   cd medvault/backend
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd medvault/frontend
   npm install
   ```

2. **Start the Frontend**
   ```bash
   npm start
   ```
   The frontend will start on `http://localhost:3000`

## API Endpoints

### Admin Registration
- **POST** `/api/users/admin/register`
- **Body**: 
  ```json
  {
    "username": "admin",
    "password": "password123",
    "email": "admin@medvault.com",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```

### Password Reset
- **POST** `/api/users/admin/reset-password`
- **Body**:
  ```json
  {
    "username": "admin",
    "currentPassword": "oldpassword",
    "newPassword": "newpassword123"
  }
  ```

### User Management
- **GET** `/api/users` - Get all users
- **GET** `/api/users/{id}` - Get user by ID
- **POST** `/api/users` - Create user
- **DELETE** `/api/users/{id}` - Delete user

## Security Features

- BCrypt password hashing
- CORS configuration for frontend integration
- Role-based access control
- Input validation and sanitization
- Secure password reset process

## Frontend Features

- Responsive design with modern UI
- Form validation and error handling
- Loading states and user feedback
- Clean navigation between pages
- Mobile-friendly interface

## Database Schema

The system uses JPA with automatic schema generation. Key entities include:

- **User**: Base user entity with role-based inheritance
- **Admin**: Administrative users
- **Doctor**: Medical professionals
- **Patient**: Medical patients
- **Appointment**: Medical appointments
- **MedicalRecord**: Patient medical records

## Development

### Adding New Features
1. Create DTOs for data transfer
2. Add service methods for business logic
3. Create controller endpoints
4. Update frontend components
5. Add appropriate styling

### Testing
- Backend: Use Spring Boot Test framework
- Frontend: Use React Testing Library

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in `application.properties`
   - Ensure database `medvault` exists

2. **Frontend Build Issues**
   - Clear `node_modules` and reinstall: `cd frontend && rm -rf node_modules && npm install`
   - Check Node.js version compatibility

3. **CORS Issues**
   - Verify backend CORS configuration
   - Check frontend proxy settings in `frontend/package.json`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

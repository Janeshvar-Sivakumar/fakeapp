# FakeApp - Error Analysis Test Repository

A deliberately flawed Node.js application for testing GitHub AI Agent error analysis and code correction capabilities.

## Description

This repository contains a login and database viewing application with **60+ intentional security vulnerabilities, bugs, and code quality issues** for testing automated error detection and correction systems.

⚠️ **WARNING: This code contains intentional security vulnerabilities and should NEVER be used in production!**

## Application Features

- User registration and authentication
- JWT-based session management
- User database viewing and management
- RESTful API endpoints
- Frontend login/dashboard interface

## Installation

```bash
npm install
```

## Database Setup

```bash
# Install MySQL and create database
mysql -u root -p < database/setup.sql
```

## Usage

```bash
# Start the application
npm start

# Development mode
npm run dev

# Run tests
npm test
```

Access the application at `http://localhost:3000`

## Intentional Errors for AI Agent Testing

This repository contains **60+ categorized errors** across multiple files:

### Security Vulnerabilities (High Priority)
- SQL Injection vulnerabilities
- Hardcoded secrets and credentials
- Missing input validation
- JWT token storage in localStorage
- Password hash exposure
- Missing HTTPS enforcement
- No rate limiting
- Weak password hashing

### Backend Issues (server.js)
- Missing error handling
- No database connection verification
- Exposed database errors to client
- Missing authentication on sensitive endpoints
- No authorization checks
- Hardcoded configuration values

### Frontend Issues (public/index.html)
- No client-side validation
- Poor error handling
- XSS vulnerabilities potential
- Missing form cleanup
- No confirmation dialogs for destructive actions

### Database Issues (database/setup.sql)
- Missing constraints and indexes
- No foreign key relationships
- Weak table structure
- Missing audit trails

### Configuration Issues (.env)
- Sensitive data in repository
- Weak secrets
- Debug mode enabled

### Testing Issues (tests/auth.test.js)
- Incomplete test coverage
- No test isolation
- Missing edge cases
- No security testing

## Test Scenarios for AI Agent

Your GitHub AI Agent should be able to:

1. **Detect** SQL injection vulnerabilities and suggest parameterized queries
2. **Identify** hardcoded secrets and recommend environment variables
3. **Find** missing input validation and add proper sanitization
4. **Spot** authentication/authorization flaws
5. **Recognize** weak error handling patterns
6. **Suggest** security best practices
7. **Improve** code structure and maintainability
8. **Add** missing error boundaries and validation
9. **Enhance** test coverage and quality
10. **Implement** proper logging and monitoring

## Expected AI Agent Workflow

1. Receive error log with file path
2. Fetch file from GitHub repository
3. Analyze code for errors and vulnerabilities
4. Generate corrected code
5. Create pull request with fixes
6. Provide detailed explanation of changes

## Contributing

This is a test repository. Feel free to add more intentional errors or improve the existing ones for better AI agent testing.

## License

This project is licensed under the MIT License.

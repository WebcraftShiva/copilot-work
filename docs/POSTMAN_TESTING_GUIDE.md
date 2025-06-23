# Billfree 2.0 API - Postman Testing Guide

## Overview
This comprehensive guide covers all API endpoints in the Billfree 2.0 NestJS application with complete Postman testing examples, validation rules, and test scenarios.

## Base Configuration

### Environment Variables
Create a Postman environment with the following variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `base_url` | `http://localhost:3000` | Application base URL |
| `auth_token` | `{{auth_token}}` | JWT token (auto-populated) |
| `user_id` | `{{user_id}}` | User ID (auto-populated) |

---

## Authentication Endpoints

### 1. User Login
**Endpoint:** `POST {{base_url}}/auth/login`

#### Description
Authenticate user with username and password. Returns JWT token and user information. Automatically migrates MD5 passwords to bcrypt on successful login.

#### Request Headers
```
Content-Type: application/json
```

#### Request Body
```json
{
  "username": "test_user",
  "password": "password123"
}
```

#### Validation Rules
- **username**: 
  - Required, 3-50 characters
  - Only letters, numbers, and underscores
  - Pattern: `/^[a-zA-Z0-9_]+$/`
- **password**: 
  - Required, 6-128 characters
  - No special format requirements

#### Success Response (200)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 946080000,
  "user": {
    "id": 1,
    "username": "test_user",
    "email": "test@example.com"
  }
}
```

#### Error Responses

**400 - Validation Error**
```json
{
  "statusCode": 400,
  "message": [
    "Username required",
    "Password too short (min 6 chars)"
  ],
  "error": "Bad Request"
}
```

**401 - Invalid Credentials**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

**500 - Server Error**
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

#### Test Scripts
Add to Postman Tests tab:
```javascript
// Test successful login
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has access token", function () {
    const response = pm.response.json();
    pm.expect(response).to.have.property('access_token');
    pm.expect(response.access_token).to.be.a('string');
    
    // Store token for other requests
    pm.environment.set("auth_token", response.access_token);
    pm.environment.set("user_id", response.user.id);
});

pm.test("Token type is Bearer", function () {
    const response = pm.response.json();
    pm.expect(response.token_type).to.eql("Bearer");
});

pm.test("User object is present", function () {
    const response = pm.response.json();
    pm.expect(response.user).to.have.property('id');
    pm.expect(response.user).to.have.property('username');
    pm.expect(response.user).to.have.property('email');
});
```

#### Test Cases
1. **Valid credentials** - Use existing test user
2. **Invalid username** - Non-existent user
3. **Invalid password** - Wrong password
4. **Empty username** - Should return validation error
5. **Empty password** - Should return validation error
6. **Username too short** - Less than 3 characters
7. **Username too long** - More than 50 characters
8. **Password too short** - Less than 6 characters
9. **Invalid username format** - With special characters

---

### 2. Generate Long-Term Token
**Endpoint:** `POST {{base_url}}/auth/v3/token/generate`

#### Description
Generate a 30-year authentication token for API access using device information and user credentials.

#### Request Headers
```
Content-Type: application/json
```

#### Request Body
```json
{
  "dev_token": "device_12345_abcdef",
  "dev_info": "iOS 15.0, iPhone 13",
  "user_id": 1,
  "os": "iOS",
  "user_type": "user",
  "salt": "random_salt_string"
}
```

#### Validation Rules
- **dev_token**: Required string
- **dev_info**: Required string
- **user_id**: Required number
- **os**: Optional string
- **user_type**: Optional enum (`user`, `merchant`, `api`, `business`)
- **salt**: Optional string

#### Success Response (200)
```json
{
  "auth_token": "bf_token_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 946080000,
  "user_id": 1,
  "token_type": "Bearer"
}
```

#### Error Responses

**400 - Validation Error**
```json
{
  "statusCode": 400,
  "message": [
    "Device token required",
    "User ID must be a number"
  ],
  "error": "Bad Request"
}
```

**401 - Unauthorized**
```json
{
  "statusCode": 401,
  "message": "User not found or inactive"
}
```

#### Test Scripts
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has auth token", function () {
    const response = pm.response.json();
    pm.expect(response).to.have.property('auth_token');
    pm.expect(response.auth_token).to.be.a('string');
    
    // Store long-term token
    pm.environment.set("long_term_token", response.auth_token);
});

pm.test("Token has correct prefix", function () {
    const response = pm.response.json();
    pm.expect(response.auth_token).to.match(/^bf_token_/);
});

pm.test("Response has user_id", function () {
    const response = pm.response.json();
    pm.expect(response).to.have.property('user_id');
    pm.expect(response.user_id).to.be.a('number');
});
```

#### Test Cases
1. **Valid request** - All required fields
2. **Missing dev_token** - Should return validation error
3. **Missing dev_info** - Should return validation error
4. **Missing user_id** - Should return validation error
5. **Invalid user_id type** - String instead of number
6. **Invalid user_type** - Value not in enum
7. **Non-existent user_id** - User doesn't exist
8. **Optional fields only** - Test with minimal required fields

---

### 3. Validate Token
**Endpoint:** `POST {{base_url}}/auth/v2/token/validate`

#### Description
Validate if an authentication token is valid and active.

#### Request Headers
```
Content-Type: application/json
```

#### Request Body
```json
{
  "auth_token": "{{long_term_token}}",
  "user_type": "user"
}
```

#### Validation Rules
- **auth_token**: Required string
- **user_type**: Optional string

#### Success Response (200)
```json
{
  "error": false,
  "response": 200,
  "message": "Valid token"
}
```

#### Invalid Token Response (200)
```json
{
  "error": true,
  "response": 401,
  "message": "Invalid or expired token"
}
```

#### Test Scripts
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Valid token returns success", function () {
    const response = pm.response.json();
    if (response.error === false) {
        pm.expect(response.response).to.eql(200);
        pm.expect(response.message).to.eql("Valid token");
    }
});

pm.test("Invalid token returns error", function () {
    const response = pm.response.json();
    if (response.error === true) {
        pm.expect(response.response).to.eql(401);
        pm.expect(response.message).to.eql("Invalid or expired token");
    }
});

pm.test("Response has required fields", function () {
    const response = pm.response.json();
    pm.expect(response).to.have.property('error');
    pm.expect(response).to.have.property('response');
    pm.expect(response).to.have.property('message');
});
```

#### Test Cases
1. **Valid token** - Use token from generate endpoint
2. **Invalid token** - Malformed token string
3. **Expired token** - Use old/expired token
4. **Empty token** - Empty string
5. **Null token** - Null value
6. **With user_type** - Include optional user_type
7. **Without user_type** - Test optional field

---

### 4. Get User by Token
**Endpoint:** `POST {{base_url}}/auth/get-user-by-token`

#### Description
Retrieve user ID from authentication token. Useful for identifying the user associated with a token.

#### Request Headers
```
Content-Type: application/json
```

#### Request Body
```json
{
  "auth_token": "{{long_term_token}}"
}
```

#### Validation Rules
- **auth_token**: Required string

#### Success Response (200)
```json
{
  "error": false,
  "response": 1
}
```

#### User Not Found Response (200)
```json
{
  "error": true,
  "response": "User not found"
}
```

#### Test Scripts
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Valid token returns user ID", function () {
    const response = pm.response.json();
    if (response.error === false) {
        pm.expect(response.response).to.be.a('number');
        pm.expect(response.response).to.be.above(0);
    }
});

pm.test("Invalid token returns error", function () {
    const response = pm.response.json();
    if (response.error === true) {
        pm.expect(response.response).to.eql("User not found");
    }
});

pm.test("Response has required fields", function () {
    const response = pm.response.json();
    pm.expect(response).to.have.property('error');
    pm.expect(response).to.have.property('response');
});
```

#### Test Cases
1. **Valid token** - Returns user ID
2. **Invalid token** - Returns user not found
3. **Expired token** - Returns user not found
4. **Empty token** - Returns user not found
5. **Malformed token** - Returns user not found

---

## Complete Test Scenarios

### Scenario 1: Full Authentication Flow
1. **Login** - Get JWT token
2. **Generate Long-term Token** - Create device token
3. **Validate Token** - Verify token is valid
4. **Get User by Token** - Retrieve user information

### Scenario 2: MD5 to Bcrypt Migration Test
1. **Setup** - Ensure test user has MD5 password in database
2. **Login** - Authenticate with MD5 password
3. **Verify Migration** - Check database shows bcrypt hash
4. **Re-login** - Authenticate again with same password (now bcrypt)

### Scenario 3: Error Handling
1. **Invalid Credentials** - Test wrong username/password
2. **Validation Errors** - Test all validation rules
3. **Token Expiry** - Test with expired tokens
4. **Server Errors** - Test error responses

### Scenario 4: Security Testing
1. **SQL Injection** - Test with malicious input
2. **XSS Attempts** - Test with script tags
3. **Token Manipulation** - Test with modified tokens
4. **Brute Force** - Test multiple failed attempts

---

## Postman Collection Structure

### Folders Organization
```
Billfree 2.0 API
├── Authentication
│   ├── 1. User Login
│   ├── 2. Generate Long-term Token
│   ├── 3. Validate Token
│   └── 4. Get User by Token
├── Test Scenarios
│   ├── Full Auth Flow
│   ├── MD5 Migration Test
│   ├── Error Handling
│   └── Security Tests
└── Negative Tests
    ├── Validation Errors
    ├── Invalid Tokens
    └── Edge Cases
```

### Collection Variables
Set these at collection level:
```json
{
  "base_url": "http://localhost:3000",
  "test_username": "test_user",
  "test_password": "password123",
  "invalid_token": "invalid_token_string"
}
```

---

## Pre-request Scripts

### Global Pre-request Script
Add to collection pre-request script:
```javascript
// Set common headers
pm.request.headers.add({
    key: 'Content-Type',
    value: 'application/json'
});

// Log request for debugging
console.log(`Making ${pm.request.method} request to: ${pm.request.url}`);
```

### Token Generation Pre-request
For token generation endpoint:
```javascript
// Generate unique device token
const timestamp = Date.now();
const deviceToken = `device_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
pm.environment.set("device_token", deviceToken);

// Generate device info
const devices = [
    "iOS 15.0, iPhone 13",
    "Android 12, Samsung Galaxy S21",
    "iOS 14.0, iPhone 12",
    "Android 11, Google Pixel 5"
];
const deviceInfo = devices[Math.floor(Math.random() * devices.length)];
pm.environment.set("device_info", deviceInfo);
```

---

## Common Test Patterns

### Authentication Test Template
```javascript
// Status code check
pm.test("Status code is as expected", function () {
    pm.response.to.have.status(pm.globals.get("expected_status") || 200);
});

// Response time check
pm.test("Response time is less than 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// JSON response check
pm.test("Response is JSON", function () {
    pm.response.to.be.json;
});

// Content type check
pm.test("Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});
```

### Error Response Test Template
```javascript
pm.test("Error response has correct structure", function () {
    if (pm.response.code >= 400) {
        const response = pm.response.json();
        pm.expect(response).to.have.property('statusCode');
        pm.expect(response).to.have.property('message');
        pm.expect(response.statusCode).to.eql(pm.response.code);
    }
});
```

---

## Database Verification

### Test User Setup
Before running tests, ensure test user exists:
```sql
-- Test user with MD5 password (for migration testing)
INSERT INTO bf_users (username, user_pass, user_email, status) 
VALUES ('test_user', MD5('password123'), 'test@example.com', 'active');

-- Test user with bcrypt password
INSERT INTO bf_users (username, user_pass, user_email, status) 
VALUES ('bcrypt_user', '$2b$10$...', 'bcrypt@example.com', 'active');
```

### Migration Verification
After login, check password hash:
```sql
SELECT username, user_pass, 
       CASE WHEN user_pass LIKE '$2b$%' THEN 'bcrypt' ELSE 'md5' END as hash_type
FROM bf_users 
WHERE username = 'test_user';
```

---

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure server is running on port 3000
   - Check base_url in environment

2. **Token Validation Fails**
   - Verify token is properly stored in environment
   - Check token format and expiry

3. **Database Errors**
   - Ensure MySQL is running
   - Verify database connection in .env

4. **Validation Errors**
   - Check request body format
   - Verify all required fields are present

### Debug Commands
```bash
# Check server status
curl http://localhost:3000/auth/login

# Test database connection
npm run migration:show

# View application logs
npm run start:dev
```

---

## Import Instructions

1. **Create New Collection** in Postman
2. **Import Environment** with base_url variable
3. **Set up Pre-request Scripts** as documented
4. **Create Requests** following the examples above
5. **Add Test Scripts** for validation
6. **Run Collection** to verify all endpoints

This comprehensive guide provides everything needed to thoroughly test the Billfree 2.0 authentication API using Postman.

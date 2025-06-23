# BillFree 2.0 - Developer Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Setup](#project-setup)
4. [Architecture](#architecture)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Module Breakdown](#module-breakdown)
8. [Development Guidelines](#development-guidelines)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Contributing](#contributing)

## Project Overview

BillFree 2.0 is a modern NestJS-based backend API system that replaces the legacy PHP application. It provides comprehensive digital billing, customer engagement, and business management capabilities.

### Key Features
- JWT-based authentication system
- RESTful API design
- Real-time caching with Redis
- Comprehensive error handling and logging
- Swagger API documentation
- TypeScript for type safety
- Modular architecture

## Technology Stack

### Core Technologies
- **Framework**: NestJS 10.x (Node.js)
- **Language**: TypeScript 5.x
- **Database**: MySQL with TypeORM
- **Caching**: Redis
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI 3.0

### Development Tools
- **Monitoring**: Sentry for error tracking
- **Logging**: Winston
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier
- **Environment**: dotenv for configuration

### Dependencies
```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/platform-express": "^10.0.0",
  "@nestjs/typeorm": "^10.0.0",
  "@nestjs/swagger": "^7.0.0",
  "@nestjs/config": "^3.0.0",
  "@nestjs/cache-manager": "^2.0.0",
  "typeorm": "^0.3.0",
  "mysql2": "^3.0.0",
  "redis": "^4.0.0",
  "bcrypt": "^5.0.0",
  "jsonwebtoken": "^9.0.0",
  "@sentry/nestjs": "^8.0.0",
  "winston": "^3.0.0"
}
```

## Project Setup

### Prerequisites
- Node.js 18.x or higher
- MySQL 8.0+
- Redis 6.0+
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd billfree-2.0
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Copy the development environment file:
```bash
cp .env.development .env
```

Configure your environment variables:
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=billfree2

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# Application Configuration
PORT=3333
HOST=localhost
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key

# Swagger Configuration
SWAGGER_UI_ENABLED=true
SWAGGER_UI_URL=/docs
SWAGGER_SPEC_URL=/swagger.json
```

4. **Database Setup**
```bash
# Run database migrations
npm run migration:run

# Or sync database schema (development only)
npm run db:sync
```

5. **Start the application**
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

### Development Commands
```bash
# Start in watch mode
npm run start:dev

# Build the application
npm run build

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate migration
npm run migration:generate -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## Architecture

### Project Structure
```
src/
├── app.module.ts              # Root application module
├── main.ts                    # Application entry point
├── app.controller.ts          # Main application controller
├── app.service.ts             # Main application service
├── auth/                      # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── token.service.ts
│   ├── dto/                   # Data Transfer Objects
│   │   ├── login.dto.ts
│   │   ├── register.dto.ts
│   │   ├── generate-token.dto.ts
│   │   └── *-response.dto.ts
│   ├── strategies/            # Passport strategies
│   └── tests/                 # Auth module tests
├── common/                    # Shared utilities and constants
│   ├── constants/
│   ├── validators/
│   ├── pipes/
│   └── dto/
├── config/                    # Configuration modules
│   ├── cache/                 # Redis cache configuration
│   ├── database/              # Database configuration
│   ├── logger/                # Winston logging
│   └── sentry/                # Error monitoring
└── models/                    # Database entities
    ├── user/
    │   └── user.entity.ts
    └── bf-tokens/
        └── bf-tokens.entity.ts
```

### Module Architecture

#### Core Modules
1. **AppModule**: Root module that imports all other modules
2. **AuthModule**: Handles authentication and authorization
3. **DatabaseModule**: Database connection and configuration
4. **CacheConfigModule**: Redis caching configuration
5. **LoggerModule**: Application-wide logging

#### Design Patterns
- **Dependency Injection**: NestJS built-in DI container
- **Repository Pattern**: TypeORM repositories for data access
- **DTO Pattern**: Data validation and transformation
- **Strategy Pattern**: Passport authentication strategies
- **Interceptor Pattern**: Request/response transformation
- **Guard Pattern**: Route protection and authorization

## Database Schema

### Entity Relationship Diagram
```
Users (bf_users)
├── id (Primary Key)
├── user_email (Unique)
├── user_phone
├── user_password (bcrypt hashed)
├── user_type (user/merchant/api/business)
├── status (active/inactive)
├── is_merchant (y/n)
├── email_verified
├── date_added
└── date_updated

BfTokens (bf_tokens)
├── id (Primary Key)
├── user_id (Foreign Key → Users.id)
├── auth_token (Unique JWT)
├── user_type
├── device_token
├── device_info
├── date_added
└── date_updated
```

### User Entity
```typescript
@Entity('bf_users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  user_email: string;

  @Column()
  user_phone: string;

  @Column()
  user_password: string;

  @Column({ 
    type: 'enum', 
    enum: ['user', 'merchant', 'api', 'business'],
    default: 'user' 
  })
  user_type: string;

  @Column({ default: 'a' })
  status: string;

  @Column({ default: 'n' })
  is_merchant: string;

  @Column({ default: 'n' })
  email_verified: string;

  @CreateDateColumn()
  date_added: Date;

  @UpdateDateColumn()
  date_updated: Date;
}
```

### BfTokens Entity
```typescript
@Entity('bf_tokens')
export class BfTokens {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ unique: true })
  auth_token: string;

  @Column()
  user_type: string;

  @Column({ nullable: true })
  device_token: string;

  @Column({ type: 'text', nullable: true })
  device_info: string;

  @CreateDateColumn()
  date_added: Date;

  @UpdateDateColumn()
  date_updated: Date;
}
```

## API Documentation

### Base URL
- **Development**: `http://localhost:3333`
- **Swagger UI**: `http://localhost:3333/api`

### Authentication Endpoints

#### POST /auth/login
**Description**: Authenticate user with credentials

**Request Body**:
```json
{
  "username": "user@example.com",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "user_email": "user@example.com",
      "user_type": "merchant",
      "is_merchant": "y"
    }
  }
}
```

#### POST /auth/v2/generate/token
**Description**: Generate API token for external integrations

**Request Body**:
```json
{
  "username": "user@example.com",
  "password": "securePassword123",
  "user_type": "api",
  "device_token": "optional_device_token",
  "device_info": "optional_device_info"
}
```

#### POST /auth/validate-token
**Description**: Validate JWT token

**Request Body**:
```json
{
  "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/get-user-by-token
**Description**: Get user information by token

### Cache Management Endpoints

#### POST /cache
**Description**: Set cache value (Authenticated)

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Request Body**:
```json
{
  "key": "cache_key",
  "value": "cache_value"
}
```

#### GET /cache?key=cache_key
**Description**: Get cache value

### Health Check Endpoints

#### GET /
**Description**: Application health check
**Response**: "Hello World!"

#### GET /debug-sentry
**Description**: Test Sentry error tracking

## Module Breakdown

### 1. Authentication Module (`src/auth/`)

**Purpose**: Handles user authentication, token management, and authorization

**Key Components**:
- **AuthController**: HTTP endpoints for login, token generation
- **AuthService**: Business logic for user validation
- **TokenService**: JWT token operations
- **JwtStrategy**: Passport JWT strategy

**Key Features**:
- JWT token generation with 30-year expiry
- bcrypt password hashing
- Legacy MD5 password migration
- Multi-user type support
- Device token tracking

### 2. Cache Module (`src/config/cache/`)

**Purpose**: Redis-based caching for performance optimization

**Key Components**:
- **CacheService**: Cache operations (get, set, delete)
- **CacheModule**: Redis configuration
- **CacheDto**: Cache request validation

### 3. Database Module (`src/config/database/`)

**Purpose**: Database connection and ORM configuration

**Key Components**:
- **DatabaseConfigService**: TypeORM configuration
- **DatabaseModule**: Database providers
- **Migrations**: Database schema versioning

### 4. Logger Module (`src/config/logger/`)

**Purpose**: Comprehensive application logging

**Key Components**:
- **Winston Configuration**: Structured logging
- **LoggingInterceptor**: Request/response logging
- **ExceptionsFilter**: Error handling and logging

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow NestJS conventions
- Use decorators for metadata
- Implement proper error handling
- Write comprehensive tests

### Naming Conventions
- **Files**: kebab-case (e.g., `auth.service.ts`)
- **Classes**: PascalCase (e.g., `AuthService`)
- **Methods**: camelCase (e.g., `validateUser`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `JWT_SECRET`)

### Error Handling
```typescript
// Use HTTP exceptions
throw new HttpException('User not found', HttpStatus.NOT_FOUND);

// Use custom exception filters
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // Handle exception
  }
}
```

### Validation
```typescript
// Use DTOs with validation decorators
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

### Database Operations
```typescript
// Use repository pattern
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { user_email: email } });
  }
}
```

## Testing

### Test Structure
```
src/
└── auth/
    └── tests/
        ├── auth.controller.spec.ts
        ├── auth.service.spec.ts
        └── auth-validation.spec.ts
```

### Unit Testing
```typescript
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate user credentials', async () => {
    // Test implementation
  });
});
```

### Test Commands
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run test coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## Deployment

### Environment Configuration
```bash
# Production environment variables
NODE_ENV=production
PORT=3000
DB_HOST=production-db-host
JWT_SECRET=secure-production-secret
REDIS_HOST=production-redis-host
```

### Build Process
```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Health Monitoring
- **Sentry**: Error tracking and performance monitoring
- **Winston**: Application logs
- **Health Check**: `/` endpoint for load balancer checks

## Contributing

### Development Workflow
1. Create feature branch from `develop`
2. Implement feature with tests
3. Ensure all tests pass
4. Update documentation
5. Create pull request
6. Code review and merge

### Commit Guidelines
```bash
# Use conventional commits
feat: add user registration endpoint
fix: resolve JWT token validation issue
docs: update API documentation
test: add unit tests for auth service
```

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Error handling is implemented
- [ ] Security considerations are addressed
- [ ] Performance impact is considered

## Troubleshooting

### Common Issues

**Database Connection Issues**:
```bash
# Check MySQL connection
mysql -h localhost -u root -p

# Verify environment variables
echo $DB_HOST $DB_PORT $DB_NAME
```

**Redis Connection Issues**:
```bash
# Test Redis connection
redis-cli ping

# Check Redis configuration
redis-cli config get "*"
```

**JWT Token Issues**:
- Verify JWT_SECRET is set
- Check token expiration
- Validate token format

### Performance Optimization
- Use Redis caching for frequently accessed data
- Implement database query optimization
- Monitor API response times
- Use connection pooling

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Maintainer**: Development Team

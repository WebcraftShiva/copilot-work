# dependencies:

npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs @nestjs/config @nestjs/typeorm typeorm pg

- @nestjs/jwt, passport-jwt: For JWT authentication.

- bcryptjs: For password hashing.

- @nestjs/config: For environment variable management.

- @nestjs/typeorm, typeorm, pg: For PostgreSQL integration.

- npm install --save @nestjs/typeorm typeorm mysql2

# 1. Done things in stage 1:

✅ Installed core dependencies.

✅ Setup .env config and environment variables.

✅ Configured MySQL database using @nestjs/typeorm.

✅ Made the project modular by planning for User, Auth, and Note modules.

✅ Set up global validation pipe and config module.

# Done with stage 2:

build the user/ module step-by-step. This module will handle:

✅ User registration

✅ Storing users securely (hashed passwords)

✅ Basic validation using DTOs

✅ Fetching user by username for login (used later in Auth)

import { Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from '@nestjs/config';
import * as Joi from 'joi'; // Joi is a validation library for JavaScript and TypeScript

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // validationSchema: allow us to validate the environment variables
        MONGODB_URI: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService], // ConfigService is a service that provides access to the configuration
  exports: [ConfigService], // export ConfigService so it can be used in other modules
})
export class ConfigModule {}

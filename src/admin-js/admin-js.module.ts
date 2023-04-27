import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AdminModule } from '@adminjs/nestjs';
import { AdminJsController } from './admin-js.controller.js';
import { AdminJsService } from './admin-js.service.js';
import * as AdminJSMongoose from '@adminjs/mongoose';
import AdminJS from 'adminjs';

import { getAdminConfig } from './adminjs.config.js';

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

@Module({
  imports: [
    AdminModule.createAdminAsync({
      useFactory: () => getAdminConfig(),
    }),
  ],
  controllers: [AdminJsController],
  providers: [AdminJsService],
})
export class AdminJsModule {}

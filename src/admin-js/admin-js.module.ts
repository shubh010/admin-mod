import { Module } from '@nestjs/common';
import { AdminModule } from '@adminjs/nestjs';
import { AdminJsController } from './admin-js.controller.js';
import { AdminJsService } from './admin-js.service.js';
import * as AdminJSMongoose from '@adminjs/mongoose';
import AdminJS from 'adminjs';

import { ComponentLoader } from 'adminjs';
import { getAdminConfig } from './adminjs.config.js';

const componentLoader = new ComponentLoader();

const Components = {
  // Dashboard: componentLoader.add('Dashboard', './dashboard/index'),
  // other custom components
};

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

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

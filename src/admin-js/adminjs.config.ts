import * as AdminJSMongoose from '@adminjs/mongoose';
import { AdminModuleOptions } from '@adminjs/nestjs';
import { getAutoGenerateResources } from './auto-generate.config.js';
import { uploads } from './upload.config.js';
import { Components, componentLoader } from './component.loader.js';

import { dark, light, noSidebar } from '@adminjs/themes';
import { fileURLToPath } from 'url';
import { overrides } from '../themes/my-custom-theme/overrides.js';
import { dashboardHandler } from './frontend/dashboard.js';

import AdminJS, { AdminJSOptions } from 'adminjs';

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const dir = fileURLToPath(new URL('.', import.meta.url));

const myCustomTheme = {
  id: 'my-custom-theme',
  name: 'My Custom Theme',
  overrides: overrides,
  bundlePath: `${dir}../../src/themes/my-custom-theme/theme.bundle.js`,
  stylePath: `${dir}../../src/themes/my-custom-theme/style.css`,
};

export const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'admin#123',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

export const getAdminConfig = async () => {
  const { resources, autoGenerateModelResources } =
    await getAutoGenerateResources({ logging: true });

  const adminJsOptions: AdminJSOptions = {
    branding: {
      companyName: 'New Admin',
      withMadeWithLove: false,
      logo: '',
    },
    defaultTheme: light.id,
    availableThemes: [dark, light, noSidebar, myCustomTheme],
    settings: {
      defaultPerPage: 30,
    },
    rootPath: '/admin',
    componentLoader: componentLoader,
    dashboard: {
      handler: dashboardHandler,
      component: Components.DashboardHome,
    },

    resources: [...resources, ...autoGenerateModelResources, uploads],
    pages: {
      about: {
        component: Components.AboutPage,
      },
    },
  };

  const adminConfig: AdminModuleOptions = {
    shouldBeInitialized: true,
    adminJsOptions: adminJsOptions,
    auth: {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: 'secret_c',
    },
    sessionOptions: {
      resave: false,
      saveUninitialized: true,
      secret: 'secret_c',
    },
  };

  return adminConfig;
};

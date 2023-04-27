import { ComponentLoader } from 'adminjs';
import { fileURLToPath } from 'url';

const componentLoader = new ComponentLoader();
export const __dirname = fileURLToPath(new URL('.', import.meta.url));

const dashboardDir = `${__dirname}../../src/admin-js/dashboard/`;

const Components = {
  Dashboard: componentLoader.add('Dashboard', `${dashboardDir}/index`),
  // @ts-ignore
};

export { componentLoader, Components };

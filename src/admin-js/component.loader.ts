import { ComponentLoader } from 'adminjs';
import { fileURLToPath } from 'url';

const componentLoader = new ComponentLoader();
export const __dirname = fileURLToPath(new URL('.', import.meta.url));

const dashboardDir = `${__dirname}../../src/admin-js/dashboard`;
const pagesDir = `${__dirname}../../src/admin-js/pages`;

const Components = {
  Dashboard: componentLoader.add('Dashboard', `${dashboardDir}/index`),
  Sidebar: componentLoader.override('Sidebar', `${dashboardDir}/Sidebar`),
  AboutPage: componentLoader.add('About', `${pagesDir}/about`),
};

export { componentLoader, Components };

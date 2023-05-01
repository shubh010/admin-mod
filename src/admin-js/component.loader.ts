import { ComponentLoader } from 'adminjs';
import { fileURLToPath } from 'url';

const componentLoader = new ComponentLoader();
export const __dirname = fileURLToPath(new URL('.', import.meta.url));

const frontendDir = `${__dirname}../../src/admin-js/frontend`;
const pagesDir = `${__dirname}../../src/admin-js/pages`;

const Components = {
  DashboardHome: componentLoader.add('Dashboard', `${frontendDir}/dashboard`),
  // Sidebar: componentLoader.override('Sidebar', `${frontendDir}/Sidebar`),
  AboutPage: componentLoader.add('About', `${pagesDir}/about`),
};

export { componentLoader, Components };

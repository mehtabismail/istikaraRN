let env = 'prod';
// let env = 'dev';

const DEV_API_URL: string = 'https://demo-ist.slashcodes.com';

const PROD_API_URL: string = 'https://istikara.com';

export const API_URL = env == 'dev' ? DEV_API_URL : PROD_API_URL;

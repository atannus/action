import {getDotenv} from 'universal/utils/dotenv';

// Import .env and expand variables:
getDotenv();

export const getMailgunApiConfig = () => ({
  apiKey: process.env.MAILGUN_API_KEY || '',
  domain: process.env.MAILGUN_DOMAIN || 'mail.parabol.co'
});

export const getMailgunOptions = () => ({
  from: process.env.MAILGUN_FROM || '',
});

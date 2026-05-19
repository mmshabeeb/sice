// This file programmatically starts Next.js in production mode.
// Hostinger will run this file using 'node server.js' to start your website.

/* eslint-disable @typescript-eslint/no-require-imports */
process.argv.push('start');
require('next/dist/bin/next');

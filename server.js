// This file programmatically starts Next.js using 'web' as the project root.
// Hostinger runs this file from the root directory to boot up SICE.

process.argv.push('start');
process.argv.push('web');
require('next/dist/bin/next');

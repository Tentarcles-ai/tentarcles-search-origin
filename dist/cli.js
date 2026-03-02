#!/usr/bin/env node
import { startServer } from './index.js';
import { parseArgs } from 'util';
const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
        port: { type: 'string' }
    }
});
const port = parseInt(values.port || '3097');
console.log(`Starting search-origin server on port ${port}`);
startServer(port);

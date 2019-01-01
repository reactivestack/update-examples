#!/usr/bin/env node

const glob = require('glob');
const updateExamples = require('./update-examples');

const patterns = process.argv.slice(2);
patterns.forEach(pattern => {
  glob(pattern, (er, files) => {
    if (er) throw err;
    files.forEach(updateExamples);
  });
});

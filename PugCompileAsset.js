'use strict';

/*!
 * Pug Bundler: Pug Compile Asset
 * Copyright(c) 2020 Adam Goldstein <agoldstein03@gmail.com>
 * MIT Licensed
 */

const pug = require('pug');

exports.name = "pug";
const regex = exports.regex = /(^.*)\.pug$/;

function rename(filePath) {
  return filePath.replace(regex, "$1.pug.js");
}
exports.rename = rename;

exports.transform = function transform(data) {
  return [{
    path: rename(data.filePath),
    contents: pug.compileFileClient(data.filePath, {
      filename: data.filePath,
      basedir: data.basePath,
      compileDebug: false,
      ...data.options,
      plugins: [data.bundler, ...(data.options.plugins || [])],
    }),
    relativePath: data.relativePath
  }];
}

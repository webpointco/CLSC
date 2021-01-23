'use strict';

/*!
 * Pug Bundler: Pug Asset
 * Copyright(c) 2020 Adam Goldstein <agoldstein03@gmail.com>
 * MIT Licensed
 */

const pug = require("pug");

exports.name = "pug";
const regex = exports.regex = /(^.*)\.pug$/;

function rename(filePath) {
  return filePath.replace(regex, "$1");
}
exports.rename = rename;

exports.transform = function transform(data) {
  return [{
    path: rename(data.filePath),
    contents: pug.renderFile(data.filePath, {
      filename: data.filePath,
      basedir: data.basePath,
      ...data.options,
      plugins: [data.bundler, ...(data.options.plugins || [])],
    })
  }];
}
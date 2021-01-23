const fs = require("fs"),
  JSON5 = require("json5"),
  nodeEval = require("node-eval"),
  path = require("path"),
  PugBundler = require("pug-bundler"),
  PugCompileAsset = require("./PugCompileAsset"),
  PugAssetNoHTML = require("./PugAssetNoHTML");

const enFiles = [],
  enAttrs = new Set(),
  zhFiles = [],
  zhAttrs = new Set(),
  importedPugOptions = JSON5.parse(fs.readFileSync("src/.pugrc")),
  importedChinesePugOptions = JSON5.parse(fs.readFileSync("src/zh.pugrc")),
  importedPugOptionsDev = {...importedPugOptions},
  importedChinesePugOptionsDev = {...importedChinesePugOptions},
  wasHTMLFile = /^.*[\/\\][^\.]*$/;

importedPugOptionsDev.locals.DEV = true;
importedChinesePugOptionsDev.locals.DEV = true;


fs.rmdirSync("dist", {recursive: true});
fs.mkdirSync("dist");
fs.mkdirSync("dist/secure");

function tryEval(code, locals) {
  try {
    return nodeEval(code, null, locals);
  } catch (e) {
    //console.warn(e);
  }
}

new PugBundler({
  files: [
    "src"
  ],
  exclude: [
    "src/.pugrc",
    "src/zh.pugrc",
    "src/templates"
  ],
  assets: [
    PugCompileAsset
  ],
  handleWrite: file => {
    const relativePath = path.relative("src", file.path.replace(".pug.js", ".html"));
    if (file.type === "pug") {
      enFiles.push({path: file.path, contents: file.contents.toString(), relativePath});
    }
    return relativePath;
  },
  sass: {
    includePaths: ["node_modules"]
//    includePaths: [path.resolve("node_modules")]
  },
  pug: {
    ...importedPugOptionsDev,
    ...importedPugOptionsDev.locals,
    plugins: [
      {
        postLex: (value, pugOptions) => {
          for (const token of value) {
            if (token.type === "attribute" && token.name === "data-editable") {
              const val = tryEval(token.val, importedPugOptionsDev.locals);
              //console.log({token, val});
              if (val) {
                enAttrs.add(val);
              }
            }
          }
          return value;
        }
      }
    ],
  }
});

console.log({enAttrs});
fs.writeFileSync("dist/secure/en_out.js", "export default "+JSON.stringify({files: enFiles, /*attrs: [...enAttrs],*/ defaultLocals: {...importedPugOptions.locals, DEV: false}}));


new PugBundler({
  files: [
    "src"
  ],
  exclude: [
    "src/.pugrc",
    "src/zh.pugrc",
    "src/templates"
  ],
  assets: [
    PugCompileAsset
  ],
  handleWrite: file => {
    const relativePath = path.relative("src", file.path.replace(".pug.js", ".html"));
    if (file.type === "pug") {
      zhFiles.push({path: file.path, contents: file.contents.toString(), relativePath});
    }
    return relativePath;
  },
  sass: {
    includePaths: ["node_modules"]
//    includePaths: [path.resolve("node_modules")]
  },
  pug: {
    ...importedChinesePugOptionsDev,
    ...importedChinesePugOptionsDev.locals,
    plugins: [
      {
        postLex: (value, pugOptions) => {
          for (const token of value) {
            if (token.type === "attribute" && token.name === "data-editable") {
              const val = tryEval(token.val, importedChinesePugOptionsDev.locals);
              if (val) {
                zhAttrs.add(val);
              }
            }
          }
          return value;
        }
      }
    ]
  }
});

console.log({zhAttrs});
fs.writeFileSync("dist/secure/zh_out.js", "export default "+JSON.stringify({files: zhFiles, /*attrs: [...zhAttrs],*/ defaultLocals: {...importedChinesePugOptions.locals, DEV: false}}));

new PugBundler({
  files: [
    "src"
  ],
  exclude: [
    "src/.pugrc",
    "src/zh.pugrc",
    "src/templates"
  ],
  assets: [
    PugAssetNoHTML
  ],
  handleWrite: file => {
    let adjustedPath = file.path;
    console.log({adjustedPath});
    if (wasHTMLFile.test(adjustedPath)) {
      adjustedPath += "_en.html";
    }
    console.log({filePath: file.path, adjustedPath});
    const finalPath = path.resolve("dist/secure", path.relative("src", adjustedPath)),
      returnPath = path.resolve("dist/secure", path.relative("src", file.path));
    fs.mkdirSync(path.dirname(finalPath), {recursive: true});
    fs.writeFileSync(finalPath, file.contents);
    return returnPath;
  },
  sass: {
    includePaths: ["node_modules"]
  },
  pug: {
    ...importedPugOptionsDev,
    ...importedPugOptionsDev.locals,
    lang: "en",
  }
});

new PugBundler({
  files: [
    "src"
  ],
  exclude: [
    "src/.pugrc",
    "src/zh.pugrc",
    "src/templates"
  ],
  assets: [
    PugAssetNoHTML
  ],
  handleWrite: file => {
    let adjustedPath = file.path;
    if (wasHTMLFile.test(adjustedPath)) {
      adjustedPath += "_zh.html";
    }
    const finalPath = path.resolve("dist/secure", path.relative("src", adjustedPath)),
      returnPath = path.resolve("dist/secure", path.relative("src", file.path));
    fs.mkdirSync(path.dirname(finalPath), {recursive: true});
    fs.writeFileSync(finalPath, file.contents);
    return returnPath;
  },
  sass: {
    includePaths: ["node_modules"]
  },
  pug: {
    ...importedChinesePugOptionsDev,
    ...importedChinesePugOptionsDev.locals,
    lang: "zh"
  }
});

new PugBundler({
  files: [
    "src"
  ],
  exclude: [
    "src/.pugrc",
    "src/zh.pugrc",
    "src/templates"
  ],
  assets: [
    PugAssetNoHTML
  ],
  handleWrite: file => {
    let adjustedPath = file.path;
    if (wasHTMLFile.test(adjustedPath)) {
      adjustedPath += "_en.html";
    }
    const finalPath = path.resolve("dist", path.relative("src", adjustedPath)),
      returnPath = path.resolve("dist/secure", path.relative("src", file.path));
    fs.mkdirSync(path.dirname(finalPath), {recursive: true});
    fs.writeFileSync(finalPath, file.contents);
    return returnPath;
  },
  sass: {
    includePaths: ["node_modules"]
  },
  pug: {
    ...importedPugOptions,
    ...importedPugOptions.locals,
    lang: "en",
    DEV: false
  }
});

new PugBundler({
  files: [
    "src"
  ],
  exclude: [
    "src/.pugrc",
    "src/zh.pugrc",
    "src/templates"
  ],
  assets: [
    PugAssetNoHTML
  ],
  handleWrite: file => {
    let adjustedPath = file.path;
    if (wasHTMLFile.test(adjustedPath)) {
      adjustedPath += "_zh.html";
    }
    const finalPath = path.resolve("dist", path.relative("src", adjustedPath)),
      returnPath = path.resolve("dist/secure", path.relative("src", file.path));
    fs.mkdirSync(path.dirname(finalPath), {recursive: true});
    fs.writeFileSync(finalPath, file.contents);
    return returnPath;
  },
  sass: {
    includePaths: ["node_modules"]
  },
  pug: {
    ...importedChinesePugOptions,
    ...importedChinesePugOptions.locals,
    lang: "zh",
    DEV: false
  }
});

const pathNames = enFiles.map(file => file.relativePath.replace(".html", ""));
fs.writeFileSync("dist/secure/paths.php", 
`<?php
const PATHS = [
${
  ["en", "zh"]
    .map(lang => 
      `\t"${lang}" => [\n${
        pathNames
        .map(name => `\t\t"/${name !== "index" ? name : ""}" => "${name}_${lang}.html"`)
        .join(",\n")
      }\n\t]`)
    .join(",\n")
}];
?>`
)

const strippedNames = pathNames.map(name => name !== "index" ? name : "");
strippedNames.sort();
fs.appendFileSync("dist/.htaccess", `RewriteRule ^(${strippedNames.join("|")})$ router.php [QSA,L]\n`);
fs.appendFileSync("dist/secure/.htaccess", `RewriteRule ^(${strippedNames.join("|")})$ secure/router.php [QSA,L]\n`);

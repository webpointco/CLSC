const fs = require("fs"),
  JSON5 = require("json5"),
  nodeEval = require("node-eval"),
  path = require("path"),
  PugBundler = require("pug-bundler"),
  PugCompileAsset = require("./PugCompileAsset");

const files = [],
  attrs = new Set(),
  importedPugOptions = JSON5.parse(fs.readFileSync("src/.pugrc")),
  importedChinesePugOptions = JSON5.parse(fs.readFileSync("src/zh.pugrc"));
  
importedPugOptions.locals.DEV = true;

new PugBundler({
  files: [
    //"src/index.pug"
    "src"
    /*"src/index.pug",
    "src/about-us.pug",
    "src/portfolio.pug",
    "src/contact.pug"*/
  ],
  exclude: [
    "src/.pugrc",
    "src/templates"
  ],
  assets: [
    PugCompileAsset
  ],
  handleWrite: file => {
    const relativePath = path.relative("src", file.path.replace(".pug.js", ".html"));
    if (file.type === "pug") {
      files.push({path: file.path, contents: file.contents.toString(), relativePath});
    }
    return relativePath;
  },
  sass: {
    includePaths: ["node_modules"]
//    includePaths: [path.resolve("node_modules")]
  },
  pug: {
    ...importedPugOptions,
    ...importedPugOptions.locals,
    plugins: [
      {
        postLex: (value, pugOptions) => {
          //Object.assign(this, importedPugOptions.locals);
          for (const token of value) {
            if (token.type === "attribute" && token.name === "data-editable") {
              const val = tryEval(token.val);
              if (val) {
                attrs.add(val);
              }
            }
          }
          return value;
        }
      }
    ]
  }
});

new PugBundler({
  files: [
    "src"
  ],
  exclude: [
    "src/.pugrc",
    "src/templates"
  ],
  handleWrite: file => {
    const finalPath = path.resolve("dist", path.relative("src", file.path.replace(".html", "_en.html")));
    fs.mkdirSync(path.dirname(finalPath), {recursive: true});
    fs.writeFileSync(finalPath, file.contents);
    return finalPath;
  },
  sass: {
    includePaths: ["node_modules"]
  },
  pug: {
    importedPugOptions,
    ...importedPugOptions.locals,
    lang: "en"
  }
});

new PugBundler({
  files: [
    "src"
  ],
  exclude: [
    "src/.pugrc",
    "src/templates"
  ],
  handleWrite: file => {
    const finalPath = path.resolve("dist", path.relative("src", file.path.replace(".html", "_zh.html")));
    fs.mkdirSync(path.dirname(finalPath), {recursive: true});
    fs.writeFileSync(finalPath, file.contents);
    return finalPath;
  },
  sass: {
    includePaths: ["node_modules"]
  },
  pug: {
    importedChinesePugOptions,
    ...importedChinesePugOptions.locals,
    lang: "zh"
  }
});

function tryEval(code) {
  try {
    return nodeEval(code, null, importedPugOptions.locals);
  } catch (e) {
    //console.warn(e);
  }
}

console.log({attrs});
fs.writeFileSync("dist/out.js", "export default "+JSON.stringify({files, attrs: [...attrs], defaultLocals: {...importedPugOptions.locals, DEV: false}}));
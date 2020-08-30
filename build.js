const fs = require("fs"),
  JSON5 = require("json5"),
  nodeEval = require("node-eval"),
//  path = require("path"),
  PugBundler = require("pug-bundler"),
  PugCompileAsset = require("./PugCompileAsset");

const files = [],
  attrs = new Set(),
  importedPugOptions = JSON5.parse(fs.readFileSync("src/.pugrc"));
  
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
    if (file.type === "pug") {
      files.push({path: file.path, contents: file.contents.toString(), relativePath: file.relativePath.replace(".pug", ".html")});
    }
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
  sass: {
    includePaths: ["node_modules"]
//    includePaths: [path.resolve("node_modules")]
  },
  pug: {
    importedPugOptions,
    ...importedPugOptions.locals
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
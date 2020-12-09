import out from "/out.js";
console.log(out);

document.getElementById("preview").addEventListener("click", () => {
  const locals = {...out.defaultLocals};
  for (const node of document.querySelectorAll("[data-editable]")) {
    const path = node.dataset.editable.split(".");
    let parent = locals,
      i = 0;
    for (; i < path.length - 1; i++) {
      parent = parent[path[i]];
    }
    parent[path[i]] = node.innerHTML; //.innerText to avoid <b></b> sorts of issues
  }
  locals.DEV = false;
  document.getElementById("previewFrame").srcdoc = (new Function(
    out.files.find(file => (new URL(location.href.replace("_en", "").replace("_zh", "").replace(".html", "")).pathname === new URL(file.relativePath.replace("_en", "").replace("_zh", "").replace(".html", ""), location).pathname)).contents+
    ";return template")
  )()(locals);
});

document.getElementById("save").addEventListener("click", () => {

});

for (const node of document.querySelectorAll("[data-editable]")) {
  node.contentEditable = "true";
}

//test.match(/(?<=\\)[^\\]*(?=\.pug\.js)/);

for (const attr of out.attrs) {
  document.querySelectorAll(`[data-editable=${attr}]`)
}
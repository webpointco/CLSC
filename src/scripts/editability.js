const lang = window.lang;
import(`/secure/${lang}_out.js`).then(module => {
  const out = module.default;
  console.log(out);

  const loc = new URL(location.href.replace(".html", "")).pathname.replace(/^\/secure\//, ""),
    thisFile = out.files.find(file => loc === getPathName(file));

  let oldLocals = JSON.stringify(getLocals(false));

  document.getElementById("preview").addEventListener("click", () => {
    const locals = getLocals(false);
    oldLocals = JSON.stringify(locals);
    document.getElementById("previewFrame").srcdoc = render(thisFile, locals, false);
  });

  document.getElementById("save").addEventListener("click", () => {
    const locals = getLocals(false),
      devLocals = getLocals(true);
    
    if (oldLocals === JSON.stringify(locals) || confirm("Edits have been made since the last preview. Are you sure you want to upload before previewing?")) {
      const promises = [];
      for (const file of out.files) {
        promises.push(pushChanges(render(file, locals), "/"+getPathName(file), false, lang));
        promises.push(pushChanges(render(file, devLocals), "/"+getPathName(file), true, lang));
      }
      Promise.all(promises).then(_ => {location.reload()})
    }
  });

  for (const node of document.querySelectorAll("[data-editable]")) {
    node.contentEditable = "true";
  }

  function getLocals(dev) {
    const locals = {...out.defaultLocals};
    for (const node of document.querySelectorAll("[data-editable]")) {
      const path = node.dataset.editable.split(".");
      let parent = locals,
        i = 0;
      for (; i < path.length - 1; i++) {
        parent = parent[path[i]];
      }
      parent[path[i]] = node.innerText; // replace with .innerHTML if Pug implementation uses raw input, which allows for bolding, italics, etc.
    }
    locals.DEV = dev;
    return locals;
  }

  function render(file, locals) {
    return (new Function(file.contents+";return template"))()(locals);
  }

  function getPathName(file) {
    return file.relativePath.replace(".html", "").replace(/^index$/, "");
  }

  function pushChanges(content, page, editable, lang = lang) {
    return fetch("post.php", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify({content, lang, page, editable})
    }).then(rawResponse => rawResponse.text()).then(response => {console.log({response, page, editable, lang, content})});
  }

})

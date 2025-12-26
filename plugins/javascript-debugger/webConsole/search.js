
let lastSearch = {text: "", caseSensitive: false};

function findText(selector, text, caseSensitive) {
  lastSearch.text = text;
  lastSearch.caseSensitive = caseSensitive;
  var sel = window.getSelection();
  sel.collapse(document.body, 0);

  return self.find(text, caseSensitive);
}

function findNext() {
  window.getSelection().collapseToEnd();
  self.find(lastSearch.text, lastSearch.caseSensitive, false, true);
}

function findPrev() {
  window.getSelection().collapseToStart();
  self.find(lastSearch.text, lastSearch.caseSensitive, true, true);
}
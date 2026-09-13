const originalPrivacyText =
  'No names, weight, substance-use history or relationship information are requested.';
const revisedPrivacyText = 'No names or relationship information are requested.';

function updatePrivacyText() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;

  while ((node = walker.nextNode())) {
    if (node.nodeValue.includes(originalPrivacyText)) {
      node.nodeValue = node.nodeValue.replace(originalPrivacyText, revisedPrivacyText);
    }
  }
}

new MutationObserver(updatePrivacyText).observe(document.body, {
  childList: true,
  subtree: true,
});

updatePrivacyText();

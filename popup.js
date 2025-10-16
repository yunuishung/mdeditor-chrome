// State
let editor1Content = '';
let editor2Content = '';
let showEditor2 = true;
let darkMode = false;

// Elements
const editor1 = document.getElementById('editor');
const editor2 = document.getElementById('editor2');
const editorContainer = document.querySelector('.editor-container');
const togglePreviewBtn = document.getElementById('togglePreview');
const copyBtn = document.getElementById('copyBtn');
const uploadFile = document.getElementById('uploadFile');
const downloadBtn = document.getElementById('downloadBtn');
const darkModeBtn = document.getElementById('darkModeBtn');
const openFullBtn = document.getElementById('openFullBtn');
const openSidePanelBtn = document.getElementById('openSidePanelBtn');
const openWindowBtn = document.getElementById('openWindowBtn');
const previewIcon = document.getElementById('previewIcon');
const darkModeIcon = document.getElementById('darkModeIcon');
const copyIcon = document.getElementById('copyIcon');

// Display version
document.getElementById('version').textContent = `v${chrome.runtime.getManifest().version}`;

// Load saved data
chrome.storage.local.get(['editor1Content', 'editor2Content', 'darkMode', 'showEditor2'], (result) => {
  if (result.editor1Content !== undefined) {
    editor1Content = result.editor1Content;
  }
  if (result.editor2Content !== undefined) {
    editor2Content = result.editor2Content;
  }
  if (result.darkMode !== undefined) {
    darkMode = result.darkMode;
  }
  if (result.showEditor2 !== undefined) {
    showEditor2 = result.showEditor2;
  }

  editor1.value = editor1Content;
  editor2.value = editor2Content;
  applyDarkMode();
  applyEditor2Toggle();
});

// Editor 1 change handler
editor1.addEventListener('input', () => {
  editor1Content = editor1.value;
  saveToStorage();
});

// Editor 2 change handler
editor2.addEventListener('input', () => {
  editor2Content = editor2.value;
  saveToStorage();
});

// Save to storage
function saveToStorage() {
  chrome.storage.local.set({
    editor1Content: editor1Content,
    editor2Content: editor2Content,
    darkMode: darkMode,
    showEditor2: showEditor2
  });
}

// Toggle editor 2 visibility
togglePreviewBtn.addEventListener('click', () => {
  showEditor2 = !showEditor2;
  applyEditor2Toggle();
  saveToStorage();
});

function applyEditor2Toggle() {
  if (showEditor2) {
    editorContainer.classList.remove('editor-only');
    previewIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>';
  } else {
    editorContainer.classList.add('editor-only');
    previewIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>';
  }
}

// Copy to clipboard (editor 1 content)
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(editor1Content);
    copyIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>';
    setTimeout(() => {
      copyIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
});

// Upload file (loads into editor 1)
uploadFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      editor1Content = e.target.result;
      editor1.value = editor1Content;
      saveToStorage();
    };
    reader.readAsText(file);
  }
});

// Download file (saves editor 1 content)
downloadBtn.addEventListener('click', () => {
  const blob = new Blob([editor1Content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Dark mode toggle
darkModeBtn.addEventListener('click', () => {
  darkMode = !darkMode;
  applyDarkMode();
  saveToStorage();
});

function applyDarkMode() {
  if (darkMode) {
    document.body.classList.add('dark');
    darkModeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
  } else {
    document.body.classList.remove('dark');
    darkModeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>';
  }
}

// Open in new tab
openFullBtn.addEventListener('click', () => {
  chrome.tabs.create({
    url: 'editor.html'
  });
});

// Open side panel
openSidePanelBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.sidePanel.open({ windowId: tab.windowId });
  window.close(); // Close popup after opening side panel
});

// Open resizable window
openWindowBtn.addEventListener('click', () => {
  chrome.windows.create({
    url: 'editor.html',
    type: 'popup',
    width: 1000,
    height: 700,
    left: 100,
    top: 100
  });
  window.close(); // Close popup after opening window
});

// Check for updates when popup opens
initUpdateCheck();

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + S: Save
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveToStorage();
    console.log('Saved to storage');
  }

  // Ctrl/Cmd + D: Download
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault();
    downloadBtn.click();
  }

  // Ctrl/Cmd + Shift + C: Copy
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
    e.preventDefault();
    copyBtn.click();
  }

  // Ctrl/Cmd + E: Toggle editor 2
  if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
    e.preventDefault();
    togglePreviewBtn.click();
  }

  // Ctrl/Cmd + Shift + D: Toggle dark mode
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
    e.preventDefault();
    darkModeBtn.click();
  }
});

// Auto-save indicator
let saveTimeout;
editor1.addEventListener('input', () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    console.log('Editor 1 saved');
  }, 1000);
});

editor2.addEventListener('input', () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    console.log('Editor 2 saved');
  }, 1000);
});

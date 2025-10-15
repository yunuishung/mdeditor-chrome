// State
let markdown = `# 마크다운 편집기에 오신 것을 환영합니다!

여기에 마크다운을 작성하세요...

## 기능

- 실시간 미리보기
- 파일 업로드/다운로드
- 다크모드
- 전체 화면 모드
- 깔끔한 UI

\`\`\`javascript
const hello = "Hello World!";
console.log(hello);
\`\`\`

**굵게** *기울임* ~~취소선~~

> 인용문입니다

- 목록 1
- 목록 2
- 목록 3

---

[링크 예시](https://www.example.com)`;

let showPreview = true;
let darkMode = false;

// Elements
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const editorContainer = document.querySelector('.editor-container');
const togglePreviewBtn = document.getElementById('togglePreview');
const copyBtn = document.getElementById('copyBtn');
const uploadFile = document.getElementById('uploadFile');
const downloadBtn = document.getElementById('downloadBtn');
const darkModeBtn = document.getElementById('darkModeBtn');
const previewIcon = document.getElementById('previewIcon');
const darkModeIcon = document.getElementById('darkModeIcon');
const copyIcon = document.getElementById('copyIcon');

// Load saved data
chrome.storage.local.get(['markdown', 'darkMode', 'showPreview'], (result) => {
  if (result.markdown !== undefined) {
    markdown = result.markdown;
  }
  if (result.darkMode !== undefined) {
    darkMode = result.darkMode;
  }
  if (result.showPreview !== undefined) {
    showPreview = result.showPreview;
  }

  editor.value = markdown;
  updatePreview();
  applyDarkMode();
  applyPreviewToggle();
});

// Editor change handler
editor.addEventListener('input', () => {
  markdown = editor.value;
  updatePreview();
  saveToStorage();
});

// Update preview
function updatePreview() {
  preview.innerHTML = convertMarkdownToHtml(markdown);
}

// Save to storage
function saveToStorage() {
  chrome.storage.local.set({
    markdown: markdown,
    darkMode: darkMode,
    showPreview: showPreview
  });
}

// Toggle preview
togglePreviewBtn.addEventListener('click', () => {
  showPreview = !showPreview;
  applyPreviewToggle();
  saveToStorage();
});

function applyPreviewToggle() {
  if (showPreview) {
    editorContainer.classList.remove('editor-only');
    previewIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>';
  } else {
    editorContainer.classList.add('editor-only');
    previewIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>';
  }
}

// Copy to clipboard
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(markdown);
    copyIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>';
    setTimeout(() => {
      copyIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
});

// Upload file
uploadFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      markdown = e.target.result;
      editor.value = markdown;
      updatePreview();
      saveToStorage();
    };
    reader.readAsText(file);
  }
});

// Download file
downloadBtn.addEventListener('click', () => {
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.md';
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

// Auto-save indicator (optional)
let saveTimeout;
editor.addEventListener('input', () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    console.log('Saved to storage');
  }, 1000);
});

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

// Display version
document.getElementById('version').textContent = `v${chrome.runtime.getManifest().version}`;

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

// Track previous cursor line for vertical position change detection
let previousCursorLine = 0;

// Sync scroll between editor and preview (only when vertical position changes)
function syncScroll() {
  if (!showPreview) return;

  const cursorPosition = editor.selectionStart;
  const textBeforeCursor = editor.value.substring(0, cursorPosition);
  const linesBeforeCursor = textBeforeCursor.split('\n').length;

  // Only sync if cursor line changed (vertical movement)
  if (linesBeforeCursor === previousCursorLine) return;
  previousCursorLine = linesBeforeCursor;

  const totalLines = editor.value.split('\n').length;

  // Calculate scroll percentage based on cursor line position
  const scrollPercentage = totalLines > 1 ? (linesBeforeCursor - 1) / (totalLines - 1) : 0;

  // Apply scroll to preview
  const maxScroll = preview.scrollHeight - preview.clientHeight;
  preview.scrollTop = maxScroll * scrollPercentage;
}

// Editor change handler
editor.addEventListener('input', () => {
  markdown = editor.value;
  updatePreview();
  saveToStorage();
  syncScroll();
});

// Sync scroll on cursor position change
editor.addEventListener('click', syncScroll);
editor.addEventListener('keyup', syncScroll);

// Sync preview scroll when editor is scrolled
editor.addEventListener('scroll', () => {
  if (!showPreview) return;

  const scrollPercentage = editor.scrollHeight > editor.clientHeight
    ? editor.scrollTop / (editor.scrollHeight - editor.clientHeight)
    : 0;

  const maxScroll = preview.scrollHeight - preview.clientHeight;
  preview.scrollTop = maxScroll * scrollPercentage;
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

// Markdown formatting functions
function wrapSelection(before, after = before) {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selectedText = editor.value.substring(start, end);
  const replacement = before + selectedText + after;

  editor.setRangeText(replacement, start, end, 'select');
  editor.focus();

  markdown = editor.value;
  updatePreview();
  saveToStorage();
}

function replaceSelection(text) {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;

  editor.setRangeText(text, start, end, 'end');
  editor.focus();

  markdown = editor.value;
  updatePreview();
  saveToStorage();
}

function insertAtLineStart(prefix) {
  const start = editor.selectionStart;
  const value = editor.value;
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const line = value.substring(lineStart, value.indexOf('\n', start) !== -1 ? value.indexOf('\n', start) : value.length);

  if (line.startsWith(prefix)) {
    // Remove prefix if already present
    editor.setRangeText('', lineStart, lineStart + prefix.length, 'start');
  } else {
    // Add prefix
    editor.setRangeText(prefix, lineStart, lineStart, 'end');
  }

  editor.focus();
  markdown = editor.value;
  updatePreview();
  saveToStorage();
}

// Format button listeners
document.getElementById('formatBold').addEventListener('click', () => wrapSelection('**'));
document.getElementById('formatItalic').addEventListener('click', () => wrapSelection('*'));
document.getElementById('formatStrike').addEventListener('click', () => wrapSelection('~~'));
document.getElementById('formatH1').addEventListener('click', () => insertAtLineStart('# '));
document.getElementById('formatH2').addEventListener('click', () => insertAtLineStart('## '));
document.getElementById('formatH3').addEventListener('click', () => insertAtLineStart('### '));
document.getElementById('formatLink').addEventListener('click', () => {
  const url = prompt('URL을 입력하세요:', 'https://');
  if (url) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = editor.value.substring(start, end) || '링크 텍스트';
    wrapSelection('[', `](${url})`);
  }
});
document.getElementById('formatImage').addEventListener('click', () => {
  const url = prompt('이미지 URL을 입력하세요:', 'https://');
  if (url) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = editor.value.substring(start, end) || '이미지 설명';
    wrapSelection('![', `](${url})`);
  }
});
document.getElementById('formatCode').addEventListener('click', () => {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selectedText = editor.value.substring(start, end);

  if (selectedText.includes('\n')) {
    // Multi-line: use code block
    wrapSelection('```\n', '\n```');
  } else {
    // Single line: use inline code
    wrapSelection('`');
  }
});
document.getElementById('formatList').addEventListener('click', () => insertAtLineStart('- '));
document.getElementById('formatQuote').addEventListener('click', () => insertAtLineStart('> '));
document.getElementById('formatHR').addEventListener('click', () => {
  const start = editor.selectionStart;
  replaceSelection('\n\n---\n\n');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + S: Save (prevent browser save dialog)
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveToStorage();
    console.log('Saved to storage');
  }

  // Ctrl/Cmd + B: Bold
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault();
    document.getElementById('formatBold').click();
  }

  // Ctrl/Cmd + I: Italic
  if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
    e.preventDefault();
    document.getElementById('formatItalic').click();
  }

  // Ctrl/Cmd + K: Link
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('formatLink').click();
  }

  // Ctrl/Cmd + D: Download
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault();
    downloadBtn.click();
  }

  // Ctrl/Cmd + Shift + C: Copy markdown
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
    e.preventDefault();
    copyBtn.click();
  }

  // Ctrl/Cmd + E: Toggle preview
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

// Check for updates when editor opens
initUpdateCheck();

// Export to PDF
document.getElementById('exportPDF').addEventListener('click', async () => {
  try {
    // Create a new window with the preview content for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (!printWindow) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해주세요.');
      return;
    }

    const previewHTML = preview.innerHTML;
    const isDark = document.body.classList.contains('dark');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>마크다운 문서</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.7;
            color: #111827;
          }

          h1 {
            font-size: 32px;
            font-weight: bold;
            margin-top: 32px;
            margin-bottom: 16px;
          }

          h2 {
            font-size: 28px;
            font-weight: bold;
            margin-top: 28px;
            margin-bottom: 14px;
          }

          h3 {
            font-size: 24px;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
          }

          p {
            margin-bottom: 16px;
            font-size: 16px;
          }

          pre {
            background-color: #f3f4f6;
            color: #111827;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
            border: 1px solid #d1d5db;
          }

          code {
            font-family: 'Courier New', monospace;
            font-size: 14px;
          }

          strong {
            font-weight: bold;
          }

          em {
            font-style: italic;
          }

          del {
            text-decoration: line-through;
          }

          a {
            color: #3b82f6;
            text-decoration: none;
          }

          img {
            max-width: 100%;
            height: auto;
            margin: 20px 0;
          }

          blockquote {
            border-left: 4px solid #d1d5db;
            padding-left: 20px;
            font-style: italic;
            margin: 20px 0;
            color: #6b7280;
          }

          ul {
            list-style-type: disc;
            margin: 12px 0;
            padding-left: 32px;
          }

          li {
            margin-left: 24px;
            margin-bottom: 6px;
          }

          hr {
            margin: 28px 0;
            border: none;
            border-top: 1px solid #d1d5db;
          }

          @media print {
            body {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        ${previewHTML}
      </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for content to load, then trigger print dialog
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };

  } catch (err) {
    console.error('PDF export failed:', err);
    alert('PDF 내보내기에 실패했습니다.');
  }
});

// Auto-save indicator (optional)
let saveTimeout;
editor.addEventListener('input', () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    console.log('Saved to storage');
  }, 1000);
});

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension that provides a free markdown editor with real-time preview. It's a standalone extension that runs entirely in the browser with no backend - all data stays local to the user's Chrome storage.

**Key Features:**
- Real-time markdown editing with live preview
- File upload/download support (.md, .txt files)
- Dark mode toggle with persistent state
- Copy to clipboard functionality
- Split-pane editor/preview layout with toggle
- Full-screen editor mode in a separate tab
- Auto-save to Chrome local storage

**Original Source:**
This extension is a refactored version of a React-based web markdown editor (`/home/yuss/md-editor`), converted to use vanilla JavaScript for Chrome extension compatibility.

## Development Commands

This is a Chrome extension with no build process. To develop:

```bash
# Load extension in Chrome
1. Open chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this directory

# After making changes
- Click "Reload" button on chrome://extensions/ page
- Reopen the extension popup or refresh the full-screen editor tab
```

## Architecture

### Extension Structure

**Manifest V3**: Uses the latest Chrome extension manifest version with:
- `storage` permission for saving markdown and settings locally
- `action` API for popup interface
- No background scripts (not needed for this simple extension)

### Two UI Modes

1. **Popup Mode** (`popup.html`, `popup.js`):
   - Opens when clicking the extension icon
   - Fixed size (800x600px)
   - Quick access for short edits
   - Includes button to open full-screen mode

2. **Full-Screen Mode** (`editor.html`, `editor.js`):
   - Opens in a new tab via `chrome.tabs.create()`
   - Full viewport usage with responsive layout
   - Better for longer editing sessions

Both modes share the same markdown parser and storage, ensuring consistent behavior.

### Shared Components

**markdown-parser.js**: Contains the `convertMarkdownToHtml()` function - a custom regex-based markdown-to-HTML converter. This is the same lightweight parser from the original React app, with no dependencies.

**Markdown Parsing Order** (important when modifying):
1. Code blocks (must be first to prevent other patterns matching code)
2. Headers (H1, H2, H3)
3. Bold, italic, strikethrough formatting
4. Links and images
5. Blockquotes
6. Lists
7. Horizontal rules
8. Line breaks and paragraphs

### State Management

All state is managed through:
- Chrome Storage API (`chrome.storage.local`) for persistence
- Plain JavaScript variables for runtime state

**Stored Data:**
- `markdown`: Current editor content (string)
- `darkMode`: Dark mode enabled state (boolean)
- `showPreview`: Preview pane visibility (boolean)

State is synchronized between popup and full-screen modes via Chrome storage.

### Styling Approach

**No Build Process**: All styles are inline in HTML files using `<style>` tags. This keeps the extension simple with no bundler needed.

**Dark Mode**: Controlled by adding/removing the `dark` class on `<body>`. CSS uses `.dark` selectors for dark mode styles.

**Responsive Grid**: Editor/preview layout uses CSS Grid:
- `grid-template-columns: 1fr 1fr` for split view
- `grid-template-columns: 1fr` when preview is hidden
- `.editor-only` class toggles the layout

### File Operations

- **Upload**: Uses `FileReader` API to read `.md`/`.txt` files into the editor
- **Download**: Creates a `Blob` and triggers download as "document.md"
- **Copy**: Uses Clipboard API (`navigator.clipboard.writeText`)

All operations work offline since there's no server communication.

## Development Workflow

### Making Changes

1. **Edit source files** - All files are directly usable, no compilation needed
2. **Reload extension** - Go to `chrome://extensions/` and click reload
3. **Test changes** - Reopen popup or refresh full-screen tab

### Common Tasks

**Adding new markdown syntax support:**
1. Edit `convertMarkdownToHtml()` in `markdown-parser.js`
2. Add regex pattern in the correct order (see parsing order above)
3. Reload extension and test with sample markdown

**Modifying UI:**
1. Edit inline styles in `popup.html` or `editor.html`
2. Or edit `styles.css` for popup-specific styles
3. Ensure dark mode styles are included (`.dark` selectors)

**Adding new features:**
1. Add UI controls in HTML files
2. Add event listeners in JS files
3. If state needs persistence, add to Chrome storage save/load logic

### Debugging

**Popup debugging:**
- Right-click popup > "Inspect" to open DevTools
- Console logs appear in this DevTools instance
- Note: Popup closes when focus is lost, making debugging tricky

**Full-screen debugging:**
- Open full-screen mode and press F12
- Standard Chrome DevTools available
- Easier to debug than popup

**Storage debugging:**
- Open DevTools > Application tab > Storage > Local Storage
- View Chrome extension storage directly

## Chrome Extension Specifics

### Permissions

- `storage`: Required for `chrome.storage.local` API
- No other permissions needed (no network access, no tabs manipulation beyond opening editor.html)

### Content Security Policy

Manifest V3 enforces strict CSP by default:
- No inline JavaScript in HTML (`<script>` tags must reference external files)
- No `eval()` or `new Function()`
- Current implementation complies with these restrictions

### Icons

Extension requires icons in three sizes:
- `icons/icon16.png` - Toolbar icon
- `icons/icon48.png` - Extension management page
- `icons/icon128.png` - Chrome Web Store (if published)

Currently, icon files need to be created. See `icons/README.md` for instructions.

## Korean Language Support

The UI is in Korean (한국어):
- All user-facing text is in Korean
- Placeholder text, button titles, and labels are in Korean
- Keep this consistent when modifying UI text

## Key Differences from Original React App

1. **No React**: Converted to vanilla JavaScript with direct DOM manipulation
2. **No npm/build process**: All code runs directly in browser
3. **Chrome Storage**: Uses `chrome.storage.local` instead of React state
4. **Manifest V3**: Added Chrome extension manifest and structure
5. **Two UI modes**: Added popup mode in addition to full-screen
6. **No Tailwind CDN**: Converted to inline CSS for extension compatibility
7. **No lucide-react**: Replaced with inline SVG icons

## Deployment

### Packaging for Chrome Web Store

```bash
# Create a zip file of the extension (excluding development files)
zip -r mdeditor-chrome.zip . -x "*.git*" "*.claude*" "*.DS_Store" "README.md" "CLAUDE.md"
```

### Publishing Steps

1. Create a developer account at Chrome Web Store Developer Dashboard
2. Pay one-time $5 registration fee
3. Upload the zip file
4. Fill in store listing details (description, screenshots, etc.)
5. Submit for review

### Version Updates

Update `version` in `manifest.json` for each release following semantic versioning.

## Testing Checklist

Before releasing updates:
- [ ] Test popup mode: editor, preview, all buttons
- [ ] Test full-screen mode: all features work
- [ ] Test dark mode toggle in both modes
- [ ] Test file upload with .md and .txt files
- [ ] Test file download
- [ ] Test copy to clipboard
- [ ] Verify state persists between sessions
- [ ] Test preview toggle (show/hide)
- [ ] Check console for errors
- [ ] Verify markdown rendering for all supported syntax
- [ ] Test on Windows, Mac, Linux (if possible)

## Browser Compatibility

Built for Chromium-based browsers:
- Google Chrome (primary target)
- Microsoft Edge (Chromium version)
- Brave, Opera, Vivaldi (should work but not officially tested)

Uses modern Web APIs (FileReader, Clipboard, Chrome Storage) - requires recent browser versions.

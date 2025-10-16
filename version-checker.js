// GitHub repository information
const GITHUB_REPO = 'yunuishung/mdeditor-chrome';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

// Check for updates
async function checkForUpdates() {
  try {
    const response = await fetch(GITHUB_API_URL);

    if (!response.ok) {
      console.log('Could not check for updates');
      return null;
    }

    const latestRelease = await response.json();
    const latestVersion = latestRelease.tag_name.replace('v', ''); // Remove 'v' prefix if present
    const currentVersion = chrome.runtime.getManifest().version;

    // Find the zip asset
    const zipAsset = latestRelease.assets.find(asset =>
      asset.name.endsWith('.zip') && asset.name.includes('source')
    );

    return {
      hasUpdate: compareVersions(latestVersion, currentVersion) > 0,
      latestVersion: latestVersion,
      currentVersion: currentVersion,
      downloadUrl: latestRelease.html_url,
      zipDownloadUrl: zipAsset ? zipAsset.browser_download_url : null,
      releaseNotes: latestRelease.body || '업데이트 내역이 없습니다.'
    };
  } catch (error) {
    console.error('Update check failed:', error);
    return null;
  }
}

// Compare version strings (e.g., "1.2.3" vs "1.1.0")
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0;
}

// Show update notification
function showUpdateNotification(updateInfo) {
  const notification = document.createElement('div');
  notification.id = 'update-notification';
  notification.className = 'update-notification';

  // Build button HTML based on available download options
  let buttonsHtml = '';
  if (updateInfo.zipDownloadUrl) {
    buttonsHtml = `
      <a href="${updateInfo.zipDownloadUrl}" class="update-btn update-btn-primary" download>
        ZIP 다운로드
      </a>
      <a href="${updateInfo.downloadUrl}" target="_blank" class="update-btn update-btn-secondary">
        릴리스 페이지
      </a>
    `;
  } else {
    buttonsHtml = `
      <a href="${updateInfo.downloadUrl}" target="_blank" class="update-btn update-btn-primary">
        GitHub에서 다운로드
      </a>
    `;
  }

  notification.innerHTML = `
    <div class="update-content">
      <div class="update-header">
        <span class="update-icon">🔔</span>
        <strong>새 버전 사용 가능!</strong>
        <button class="update-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
      </div>
      <p class="update-info">
        현재 버전: ${updateInfo.currentVersion} → 최신 버전: ${updateInfo.latestVersion}
      </p>
      <div class="update-actions">
        ${buttonsHtml}
        <button class="update-btn update-btn-tertiary" onclick="this.parentElement.parentElement.parentElement.remove()">
          나중에
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto-hide after 30 seconds if user doesn't interact
  setTimeout(() => {
    if (document.getElementById('update-notification')) {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }
  }, 30000);
}

// Initialize update check
async function initUpdateCheck(force = false) {
  // Check if we should skip (checked recently)
  const lastCheck = localStorage.getItem('lastUpdateCheck');
  const now = Date.now();
  const checkInterval = 6 * 60 * 60 * 1000; // 6 hours instead of 24 hours

  if (!force && lastCheck && (now - parseInt(lastCheck)) < checkInterval) {
    console.log('Update check skipped (checked recently)');
    return;
  }

  localStorage.setItem('lastUpdateCheck', now.toString());

  const updateInfo = await checkForUpdates();

  if (updateInfo && updateInfo.hasUpdate) {
    console.log('Update available:', updateInfo);
    showUpdateNotification(updateInfo);
  } else {
    console.log('No updates available');
  }
}

// Manual update check function (can be called from console)
window.checkForUpdatesNow = function() {
  console.log('Forcing update check...');
  localStorage.removeItem('lastUpdateCheck');
  initUpdateCheck(true);
};

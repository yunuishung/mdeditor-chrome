# 🏪 Chrome Web Store 출시 가이드

## 📋 목차
1. [출시 전 준비사항](#출시-전-준비사항)
2. [개발자 계정 등록](#개발자-계정-등록)
3. [확장 프로그램 패키징](#확장-프로그램-패키징)
4. [스토어 등록 절차](#스토어-등록-절차)
5. [스토어 리스팅 작성](#스토어-리스팅-작성)
6. [검토 및 출시](#검토-및-출시)
7. [업데이트 관리](#업데이트-관리)

---

## 1️⃣ 출시 전 준비사항

### ✅ 필수 체크리스트

#### A. 아이콘 준비 (⚠️ 현재 미완료)

현재 상태: manifest.json에 icons 섹션 없음

**필요한 아이콘:**
- **16x16px** - 확장 프로그램 툴바 아이콘
- **48x48px** - 확장 프로그램 관리 페이지
- **128x128px** - Chrome Web Store 썸네일

**아이콘 생성 방법:**

```bash
# 방법 1: 온라인 도구 사용
https://www.favicon-generator.org/
https://realfavicongenerator.net/

# 방법 2: ImageMagick 사용 (Linux/Mac)
convert icon.svg -resize 16x16 icons/icon16.png
convert icon.svg -resize 48x48 icons/icon48.png
convert icon.svg -resize 128x128 icons/icon128.png

# 방법 3: Figma/Photoshop으로 직접 제작
```

**아이콘 디자인 권장사항:**
- 단순하고 인식 가능한 디자인
- 📝 마크다운 또는 ✏️ 편집 관련 아이콘
- 투명 배경 PNG
- 선명한 색상 (브랜드 컬러)

**manifest.json에 추가:**
```json
{
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

#### B. 프로모션 이미지 준비

**필수:**
- **스토어 아이콘**: 128x128px (위에서 만든 것 사용)
- **스크린샷**: 최소 1개, 권장 3-5개
  - 크기: 1280x800 또는 640x400
  - 형식: PNG 또는 JPEG
  - 내용: 주요 기능 시연 (편집기, 미리보기, 다크모드, 포맷 툴바 등)

**선택적 (권장):**
- **프로모션 타일**: 440x280px
- **마퀘 프로모션 이미지**: 1400x560px
- **프로모션 비디오**: YouTube 링크

**스크린샷 예시:**
1. 메인 편집 화면 (라이트 모드)
2. 다크 모드 화면
3. 포맷 툴바 사용 예시
4. 사이드 패널 모드
5. 업데이트 알림

#### C. 설명 및 마케팅 문구 작성

**한국어 버전:**
```
제목: 무료 마크다운 편집기 - 실시간 미리보기

간단한 설명 (132자 이내):
실시간 미리보기, 다크모드, 파일 업로드/다운로드를 지원하는 무료 마크다운 편집기. 데이터는 로컬에만 저장됩니다.

자세한 설명:
📝 무료 마크다운 편집기

가볍고 빠른 Chrome 확장 프로그램으로 마크다운을 편집하세요!

✨ 주요 기능:
• 실시간 미리보기 - 입력하는 즉시 결과 확인
• 다크 모드 지원 - 눈의 피로 감소
• 포맷 툴바 - 클릭 한 번으로 마크다운 문법 적용
• 키보드 단축키 - 빠른 편집 (Ctrl+B, Ctrl+I 등)
• 파일 업로드/다운로드 - .md 파일 불러오기 및 저장
• 클립보드 복사 - 마크다운 텍스트 간편 복사
• 자동 저장 - 작업 내용 자동 보존
• 4가지 실행 모드 - 팝업, 사이드 패널, 새 탭, 크기 조절 가능한 창

🔒 개인정보 보호:
• 모든 데이터는 로컬에만 저장됩니다
• 서버로 전송되지 않습니다
• 완전히 오프라인에서 작동합니다

🎨 지원 마크다운 문법:
# 제목, **굵게**, *기울임*, ~~취소선~~, [링크](URL), ![이미지](URL),
`인라인 코드`, ```코드 블록```, 목록, 인용문, 구분선 등

💡 사용 방법:
1. 확장 프로그램 아이콘 클릭
2. 마크다운 작성
3. 오른쪽에서 실시간 미리보기 확인
4. 파일로 저장 또는 클립보드로 복사

🆓 완전 무료, 오픈소스
GitHub: https://github.com/yunuishung/mdeditor-chrome
```

**영어 버전 (선택적):**
```
Title: Free Markdown Editor - Live Preview

Short description:
Free markdown editor with live preview, dark mode, and file upload/download. All data stays local.

Detailed description:
📝 Free Markdown Editor

Edit markdown with a lightweight and fast Chrome extension!

✨ Key Features:
• Live Preview - See results as you type
• Dark Mode - Reduce eye strain
• Format Toolbar - Apply markdown syntax with one click
• Keyboard Shortcuts - Fast editing (Ctrl+B, Ctrl+I, etc.)
• File Upload/Download - Load and save .md files
• Copy to Clipboard - Easy text copying
• Auto-save - Preserve your work automatically
• 4 Display Modes - Popup, side panel, new tab, resizable window

🔒 Privacy:
• All data stored locally only
• No server transmission
• Works completely offline

🎨 Supported Markdown Syntax:
# Headings, **bold**, *italic*, ~~strikethrough~~, [links](URL),
![images](URL), `inline code`, ```code blocks```, lists, quotes, horizontal rules

💡 How to Use:
1. Click the extension icon
2. Write markdown
3. See live preview on the right
4. Save as file or copy to clipboard

🆓 Completely free and open source
GitHub: https://github.com/yunuishung/mdeditor-chrome
```

#### D. 개인정보 처리방침 (Privacy Policy)

**Chrome Web Store는 사용자 데이터를 수집하는 확장 프로그램에 대해 개인정보 처리방침을 요구합니다.**

우리 확장 프로그램은 데이터를 수집하지 않지만, 명시적으로 작성하는 것이 좋습니다.

**privacy-policy.md 예시:**
```markdown
# Privacy Policy for Free Markdown Editor

Last updated: 2025-10-16

## Data Collection
This extension does NOT collect, store, or transmit any personal data.

## Data Storage
- All markdown content is stored locally in your browser using Chrome Storage API
- No data is sent to external servers
- No analytics or tracking is implemented

## Permissions Used
- **storage**: To save your markdown content and preferences locally
- **sidePanel**: To display the editor in a side panel
- **host_permissions (api.github.com)**: To check for extension updates only

## Third-Party Services
- GitHub API is used only to check for extension updates
- No personal information is sent to GitHub

## Contact
For questions, please contact: [your-email@example.com]
```

이 파일을 GitHub Pages나 개인 웹사이트에 호스팅하고 URL을 제공해야 합니다.

---

## 2️⃣ 개발자 계정 등록

### A. Chrome Web Store 개발자 등록

1. **Chrome Web Store 개발자 대시보드 접속**
   ```
   https://chrome.google.com/webstore/devconsole
   ```

2. **Google 계정으로 로그인**
   - 개인 또는 조직 Google 계정 사용

3. **개발자 등록비 결제**
   - **금액: $5 (일회성)**
   - 결제 수단: 신용카드/체크카드
   - 환불 불가

4. **개발자 정보 입력**
   - 이름 또는 조직명
   - 이메일 주소
   - 웹사이트 (선택사항)

5. **약관 동의**
   - Chrome Web Store 개발자 계약
   - Google API 서비스 약관

### B. 결제 완료 확인

등록 완료 후 대시보드에서 "New Item" 버튼이 보이면 성공!

---

## 3️⃣ 확장 프로그램 패키징

### A. 배포용 ZIP 파일 생성

**포함할 파일:**
```
mdeditor-chrome/
├── manifest.json          ✅ 필수
├── popup.html             ✅ 필수
├── popup.js               ✅ 필수
├── styles.css             ✅ 필수
├── editor.html            ✅ 필수
├── editor.js              ✅ 필수
├── markdown-parser.js     ✅ 필수
├── version-checker.js     ✅ 필수
├── background.js          ✅ 필수
├── icons/                 ✅ 필수 (생성 필요!)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              ⚠️ 선택 (사용자용 설명)
```

**제외할 파일:**
```
❌ .git/
❌ .gitignore
❌ .claude/
❌ CLAUDE.md
❌ SUMMARY-*.md
❌ RELEASE.md
❌ CHROME-WEB-STORE-GUIDE.md
❌ node_modules/ (없음)
❌ package.json (없음)
❌ 개발 관련 문서
```

**ZIP 파일 생성 명령어:**

**Linux/Mac:**
```bash
cd /home/yuss/mdeditor-chrome

# 아이콘 생성 후
zip -r mdeditor-chrome-v1.1.0.zip . \
  -x "*.git*" \
  -x "*.claude*" \
  -x "*.DS_Store" \
  -x "CLAUDE.md" \
  -x "SUMMARY-*.md" \
  -x "RELEASE.md" \
  -x "CHROME-WEB-STORE-GUIDE.md"
```

**Windows (PowerShell):**
```powershell
# 필요한 파일만 선택해서 압축
$files = @(
    "manifest.json",
    "popup.html", "popup.js", "styles.css",
    "editor.html", "editor.js",
    "markdown-parser.js", "version-checker.js", "background.js",
    "icons/*"
)
Compress-Archive -Path $files -DestinationPath mdeditor-chrome-v1.1.0.zip
```

**또는 Windows 탐색기:**
1. 필요한 파일들만 선택
2. 마우스 오른쪽 클릭 → "압축 파일로 보내기"
3. `mdeditor-chrome-v1.1.0.zip` 이름 변경

### B. ZIP 파일 검증

압축 해제 후 다음 항목 확인:
- [ ] manifest.json이 루트에 있음
- [ ] 모든 HTML/JS/CSS 파일 포함
- [ ] icons 폴더와 3개 PNG 파일 포함
- [ ] 불필요한 개발 파일 제외됨
- [ ] 파일 크기: 일반적으로 500KB 이하

---

## 4️⃣ 스토어 등록 절차

### A. 새 항목 등록

1. **개발자 대시보드 접속**
   ```
   https://chrome.google.com/webstore/devconsole
   ```

2. **"New Item" 클릭**

3. **ZIP 파일 업로드**
   - 앞서 생성한 `mdeditor-chrome-v1.1.0.zip` 선택
   - 업로드 및 자동 검증 대기 (1-2분)

4. **검증 오류 확인**
   - Manifest 오류
   - 권한 관련 경고
   - 아이콘 누락 오류 등

   **오류가 있으면 수정 후 다시 업로드**

---

## 5️⃣ 스토어 리스팅 작성

ZIP 업로드 후 스토어 페이지 정보 입력:

### A. 기본 정보

| 필드 | 내용 | 예시 |
|------|------|------|
| **Product name** | 확장 프로그램 이름 | 무료 마크다운 편집기 |
| **Summary** | 간단한 설명 (132자) | 실시간 미리보기, 다크모드, 파일 업로드/다운로드를 지원하는 무료 마크다운 편집기 |
| **Description** | 자세한 설명 | [위의 "자세한 설명" 사용](#c-설명-및-마케팅-문구-작성) |
| **Category** | 카테고리 선택 | **Productivity** (생산성) |
| **Language** | 주 언어 | Korean (한국어) |

### B. 그래픽 자산

| 자산 | 크기 | 필수 여부 |
|------|------|----------|
| **Store icon** | 128x128px | ✅ 필수 |
| **Screenshots** | 1280x800 또는 640x400 | ✅ 최소 1개 (권장 3-5개) |
| **Small tile** | 440x280px | ⚠️ 선택 (추천에 표시) |
| **Marquee** | 1400x560px | ⚠️ 선택 (featured 섹션) |
| **Promotional video** | YouTube 링크 | ⚠️ 선택 |

**스크린샷 순서 권장:**
1. 메인 편집 화면 (기능 전체 보임)
2. 포맷 툴바 사용 예시
3. 다크 모드
4. 사이드 패널 모드
5. 업데이트 알림

### C. 추가 정보

| 필드 | 내용 |
|------|------|
| **Official URL** | GitHub 저장소 URL: `https://github.com/yunuishung/mdeditor-chrome` |
| **Homepage URL** | 동일하게 GitHub 사용 가능 |
| **Support URL** | GitHub Issues: `https://github.com/yunuishung/mdeditor-chrome/issues` |

### D. 개인정보 보호

| 필드 | 선택 |
|------|------|
| **Single purpose** | ✅ 체크 - "Markdown editor with live preview" |
| **Permission justification** | 각 권한 설명:<br>- storage: 마크다운 콘텐츠 로컬 저장<br>- sidePanel: 사이드 패널 모드 제공<br>- api.github.com: 업데이트 확인 |
| **Are you using remote code?** | ❌ No |
| **Data usage** | ❌ This item does not collect user data |
| **Privacy policy** | 개인정보 처리방침 URL (GitHub Pages 등) |

### E. 배포 대상

| 필드 | 선택 |
|------|------|
| **Visibility** | **Public** (모든 사용자에게 공개) |
| **Regions** | **All regions** (모든 지역) 또는 특정 국가 선택 |
| **Pricing** | **Free** (무료) |

---

## 6️⃣ 검토 및 출시

### A. 제출 전 최종 체크리스트

- [ ] manifest.json 버전 확인 (v1.1.0)
- [ ] 모든 아이콘 파일 포함
- [ ] 스크린샷 3개 이상 업로드
- [ ] 설명 작성 완료 (한국어)
- [ ] 개인정보 처리방침 URL 입력
- [ ] 권한 설명 작성
- [ ] 카테고리 선택 (Productivity)
- [ ] 테스트 완료 (로컬에서 최종 확인)

### B. 제출

1. **"Submit for review" 클릭**
2. 최종 확인 대화상자에서 "Submit" 클릭

### C. 검토 프로세스

**예상 소요 시간:**
- 자동 검토: 몇 분 ~ 1시간
- 수동 검토: 1-3일 (평균 1일)

**검토 단계:**
```
제출 → 자동 검사 → 수동 검토 → 승인 또는 거절
```

**거절 사유 예시:**
- 개인정보 처리방침 누락
- 권한 남용
- 스팸성 콘텐츠
- 상표권 위반
- 기능 불량

**거절 시 대응:**
1. 거절 이유 확인 (이메일 또는 대시보드)
2. 문제 수정
3. 새 버전 업로드
4. 재제출

### D. 출시 완료

승인되면:
- 이메일 알림 수신
- Chrome Web Store에서 검색 가능
- 고유 URL 생성: `https://chrome.google.com/webstore/detail/[extension-id]`

---

## 7️⃣ 업데이트 관리

### A. 버전 업데이트 프로세스

1. **코드 수정**
   ```bash
   # 새 기능 추가 또는 버그 수정
   git add .
   git commit -m "Add new feature"
   ```

2. **버전 번호 업데이트 (manifest.json)**
   ```json
   {
     "version": "1.2.0"  // 1.1.0 → 1.2.0
   }
   ```

   **버전 규칙 (Semantic Versioning):**
   - **Major (1.x.x)**: 호환성 깨는 변경
   - **Minor (x.1.x)**: 새 기능 추가 (호환성 유지)
   - **Patch (x.x.1)**: 버그 수정

3. **GitHub 릴리스 생성**
   ```bash
   git tag v1.2.0
   git push origin v1.2.0
   ```

   GitHub에서:
   - Releases → Create a new release
   - Tag: v1.2.0
   - 릴리스 노트 작성
   - 소스 코드 ZIP 첨부

4. **Chrome Web Store에 새 버전 업로드**
   - 개발자 대시보드 → 확장 프로그램 선택
   - "Upload Updated Package"
   - 새 ZIP 파일 업로드
   - 변경 사항 설명 (Change log)
   - "Submit for review"

### B. 사용자 업데이트

**자동 업데이트:**
- Chrome은 몇 시간 내에 자동으로 업데이트
- 사용자는 재시작 시 새 버전 사용

**수동 업데이트 (사용자):**
```
chrome://extensions/ → 개발자 모드 켜기 → "지금 업데이트"
```

### C. 업데이트 알림 (우리 확장 프로그램)

우리 확장 프로그램은 자체 업데이트 체크 기능 있음:
- 6시간마다 GitHub API 체크
- 새 버전 있으면 알림 표시
- ZIP 다운로드 + 릴리스 페이지 링크 제공

---

## 8️⃣ 배포 후 모니터링

### A. 통계 확인

Chrome Web Store 대시보드에서:
- **설치 수**: 일일/주간/총 설치 수
- **활성 사용자 수**: 실제 사용 중인 사용자
- **평점**: 별점 및 리뷰
- **충돌 보고서**: 오류 발생 시 자동 보고

### B. 사용자 피드백 관리

**리뷰 응답:**
- 긍정적 리뷰: 감사 표시
- 부정적 리뷰: 문제 해결 제안, 다음 업데이트 계획 공유
- 버그 보고: GitHub Issues로 유도

**GitHub Issues:**
```
https://github.com/yunuishung/mdeditor-chrome/issues
```
- 버그 리포트 템플릿 제공
- Feature request 라벨 사용
- 신속한 응답

---

## 9️⃣ 마케팅 및 홍보 (선택사항)

### A. 소셜 미디어

- **Twitter/X**: 출시 발표, 새 기능 소개
- **Reddit**: r/chrome, r/markdown, r/productivity
- **Product Hunt**: 런칭 플랫폼
- **Hacker News**: Show HN 포스트

### B. 블로그/커뮤니티

- 개발 과정 블로그 포스트
- Medium 기술 블로그
- 개발자 커뮤니티 (개발바닥, 44BITS 등)

### C. SEO 최적화

- Chrome Web Store 설명에 키워드 포함
  - "마크다운 편집기"
  - "markdown editor"
  - "무료 에디터"
  - "실시간 미리보기"
- GitHub README.md 작성 (배지, 스크린샷, 사용법)

---

## 🔟 자주 묻는 질문 (FAQ)

### Q1. 출시 비용은?
**A:** $5 일회성 개발자 등록비만 필요. 확장 프로그램은 무료로 배포 가능.

### Q2. 심사 기간은?
**A:** 보통 1-3일. 간단한 확장 프로그램은 몇 시간 내 승인되기도 함.

### Q3. 거절당하면?
**A:** 이유 확인 후 수정하여 재제출 가능. 횟수 제한 없음.

### Q4. 업데이트 심사도 필요한가?
**A:** 네. 모든 업데이트는 자동/수동 검토 거침. 하지만 초기 출시보다 빠름.

### Q5. 개인정보 처리방침 필수인가?
**A:** 권한을 사용하면 권장, 사용자 데이터 수집 시 필수.

### Q6. 아이콘 없이 출시 가능한가?
**A:** 불가능. 최소 128x128 아이콘 필수.

### Q7. 무료 확장 프로그램을 유료로 전환 가능한가?
**A:** 가능하지만 권장하지 않음. 처음부터 유료로 설정하거나, 기부 모델 사용 권장.

### Q8. 다국어 지원 어떻게?
**A:** Chrome i18n API 사용. `_locales/ko/messages.json`, `_locales/en/messages.json` 등.

---

## 🎯 출시 체크리스트 (최종)

### 출시 전
- [ ] 아이콘 3종 생성 (16/48/128px)
- [ ] manifest.json에 icons 추가
- [ ] 스크린샷 3-5개 촬영
- [ ] 개인정보 처리방침 작성 및 호스팅
- [ ] README.md 작성 (GitHub용)
- [ ] 로컬 테스트 완료 (모든 기능 동작 확인)
- [ ] ZIP 파일 생성 및 검증

### Chrome Web Store 등록
- [ ] 개발자 계정 등록 ($5 결제)
- [ ] ZIP 파일 업로드
- [ ] 스토어 리스팅 작성 (한국어)
- [ ] 그래픽 자산 업로드
- [ ] 개인정보 보호 섹션 작성
- [ ] 배포 대상 설정
- [ ] 제출

### 출시 후
- [ ] 승인 확인 (이메일 체크)
- [ ] Chrome Web Store URL 확인
- [ ] GitHub README에 설치 링크 추가
- [ ] 소셜 미디어 공유 (선택)
- [ ] 리뷰 및 통계 모니터링

---

## 📚 추가 리소스

- [Chrome Web Store 개발자 문서](https://developer.chrome.com/docs/webstore/)
- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Web Store 정책](https://developer.chrome.com/docs/webstore/program-policies/)
- [Chrome Web Store FAQ](https://developer.chrome.com/docs/webstore/faq/)
- [Chrome Extension 디자인 가이드](https://developer.chrome.com/docs/extensions/mv3/user_interface/)

---

**작성일:** 2025-10-16
**버전:** 1.0
**작성자:** Claude Code Assistant

# 릴리스 가이드

이 문서는 새 버전을 릴리스하고 자동 업데이트 알림을 테스트하는 방법을 설명합니다.

## 버전 업데이트 프로세스

### 1. 버전 번호 업데이트

`manifest.json` 파일의 `version` 필드를 업데이트합니다:

```json
{
  "version": "1.2.0"  // 기존: "1.1.0"
}
```

**버전 번호 규칙 (Semantic Versioning):**
- `1.0.0` → `1.0.1`: 버그 수정
- `1.0.0` → `1.1.0`: 새 기능 추가
- `1.0.0` → `2.0.0`: 대규모 변경 또는 호환성 변경

### 2. 변경사항 기록

변경된 내용을 정리합니다 (릴리스 노트 작성용):

```
## v1.2.0 (2025-10-16)

### 새 기능
- 마크다운 포맷팅 툴바 추가
- 자동 버전 체크 기능 추가
- 사이드 패널 모드 지원

### 개선사항
- 키보드 단축키 개선
- 다크모드 성능 향상

### 버그 수정
- 파일 업로드 시 한글 깨짐 수정
```

### 3. Git Commit 및 Push

```bash
# 변경사항 커밋
git add -A
git commit -m "Release v1.2.0: Add formatting toolbar and auto-update"

# GitHub에 푸시
git push origin main
```

### 4. GitHub Release 생성

#### 방법 1: GitHub 웹 인터페이스

1. GitHub 저장소 페이지로 이동
2. 우측의 "Releases" 클릭
3. "Draft a new release" 클릭
4. Tag version 입력: `v1.2.0`
5. Release title: `v1.2.0`
6. Description에 변경사항 작성:
   ```markdown
   ## 새 기능
   - 마크다운 포맷팅 툴바 추가
   - 자동 버전 체크 기능 추가
   - 사이드 패널 모드 지원

   ## 개선사항
   - 키보드 단축키 개선 (Ctrl+B, Ctrl+I, Ctrl+K)
   - 다크모드 성능 향상

   ## 설치 방법
   1. Chrome에서 `chrome://extensions/` 접속
   2. 우측 상단 "개발자 모드" 활성화
   3. "압축해제된 확장 프로그램을 로드합니다" 클릭
   4. 이 프로젝트 폴더 선택
   ```
7. "Publish release" 클릭

#### 방법 2: GitHub CLI (gh)

```bash
# 릴리스 생성
gh release create v1.2.0 \
  --title "v1.2.0" \
  --notes "$(cat <<'EOF'
## 새 기능
- 마크다운 포맷팅 툴바 추가
- 자동 버전 체크 기능 추가
- 사이드 패널 모드 지원

## 개선사항
- 키보드 단축키 개선
- 다크모드 성능 향상
EOF
)"
```

## 자동 업데이트 테스트

### 1. 릴리스 후 테스트

릴리스를 생성한 후, 확장 프로그램에서 업데이트 알림을 테스트합니다:

1. **현재 버전 확인**:
   - `manifest.json`의 `version`이 이전 버전인지 확인 (예: `1.1.0`)

2. **확장 프로그램 새로고침**:
   - `chrome://extensions/`에서 확장 프로그램 새로고침

3. **업데이트 체크**:
   - 확장 프로그램 아이콘 클릭 (popup 열기)
   - 또는 전체 화면 편집기 열기
   - 10초 이내에 우측 상단에 업데이트 알림이 표시되어야 함

4. **알림 내용 확인**:
   ```
   🔔 새 버전 사용 가능!
   현재 버전: 1.1.0 → 최신 버전: 1.2.0
   [GitHub에서 다운로드] [나중에]
   ```

### 2. 강제 테스트 (개발 중)

24시간 체크 제한을 우회하여 즉시 테스트하려면:

1. **브라우저 콘솔 열기** (F12)
2. **localStorage 초기화**:
   ```javascript
   localStorage.removeItem('lastUpdateCheck');
   ```
3. **페이지 새로고침** 또는 확장 프로그램 재실행
4. 업데이트 알림이 즉시 표시됨

### 3. 버전 비교 테스트

다양한 버전 시나리오 테스트:

| 현재 버전 | 최신 버전 | 예상 결과 |
|----------|----------|-----------|
| 1.0.0    | 1.1.0    | ✅ 알림 표시 |
| 1.1.0    | 1.1.0    | ❌ 알림 없음 |
| 1.2.0    | 1.1.0    | ❌ 알림 없음 (현재가 더 높음) |
| 1.0.9    | 1.1.0    | ✅ 알림 표시 |

## 버전 관리 팁

### 버전 번호 규칙

```
MAJOR.MINOR.PATCH
  │     │     │
  │     │     └─ 버그 수정 (1.0.0 → 1.0.1)
  │     └─────── 새 기능 (1.0.0 → 1.1.0)
  └───────────── 대규모 변경 (1.0.0 → 2.0.0)
```

### 릴리스 체크리스트

- [ ] `manifest.json` 버전 업데이트
- [ ] 변경사항 문서화
- [ ] 코드 커밋 및 푸시
- [ ] GitHub Release 생성 (tag: `v1.x.x`)
- [ ] Release notes 작성
- [ ] 자동 업데이트 알림 테스트
- [ ] 실제 기능 테스트
- [ ] README.md 업데이트 (필요시)

## 트러블슈팅

### 업데이트 알림이 표시되지 않음

1. **GitHub API 확인**:
   ```bash
   curl https://api.github.com/repos/yunuishung/mdeditor-chrome/releases/latest
   ```

2. **콘솔 로그 확인** (F12):
   ```
   Update check skipped (checked recently)  // 24시간 이내 재체크 방지
   No updates available                     // 이미 최신 버전
   Update available: ...                    // 업데이트 발견
   ```

3. **권한 확인**:
   - `manifest.json`에 `host_permissions: ["https://api.github.com/*"]` 있는지 확인

4. **localStorage 초기화**:
   ```javascript
   localStorage.removeItem('lastUpdateCheck');
   ```

### GitHub API Rate Limit

GitHub API는 시간당 60회 요청 제한이 있습니다. 개발 중 많이 테스트하면 제한에 걸릴 수 있습니다.

- 현재 제한 확인: https://api.github.com/rate_limit
- 해결: 1시간 대기 또는 GitHub Personal Access Token 사용

## 참고사항

- 업데이트 체크는 **24시간마다 1회만** 실행됩니다
- 알림은 **10초 후 자동으로 사라집니다**
- 사용자가 "나중에" 클릭해도 다음 날 다시 알림이 표시됩니다
- 네트워크 오류 시 조용히 실패하며 사용자에게 영향을 주지 않습니다

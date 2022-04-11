---
sidebar_position: 1
---

# Docusarus

- 페이스북 오픈소스 커뮤니티에서 관리하는 문서 웹사이트 생성 도구
- Markdown, [MDX](https://mdxjs.com/) 형식으로 문서와 블로그 포스트를 쉽게 작성할 수 있음

## 설치

### 기술스택

- nodejs 14 이상
- npx

### 설치

- npx를 이용하여 웹사이트 템플릿을 생성
```bash
npx create-docusaurus@latest [name] [template]
```
```bash
npx create-docusaurus@latest website classic
```

- 타입스크립트나 yarn을 이용하고 싶으면 옵션으로 `--typescript`나 `--package-manager yarn`를 붙이면 됨
- 프로젝트가 생성되면 다음과 같이 폴더가 생성됨.
```plain
wondsn
├── README.md
├── babel.config.js
├── blog
│   ├── 2019-05-28-first-blog-post.md
│   ├── 2019-05-29-long-blog-post.md
│   ├── 2021-08-01-mdx-blog-post.mdx
│   ├── 2021-08-26-welcome
│   └── authors.yml
├── docs
│   ├── blog
│   ├── intro.md
│   ├── programming
│   ├── testing
│   ├── tutorial-basics
│   └── tutorial-extras
├── docusaurus.config.js
├── node_modules
├── package.json
├── sidebars.js
├── src
└── static

```
- 이 중에서 주로 보게될 것은 다음과 같음
  - blog/: 블로그에 사용하는 마크다운 파일 디렉토리
  - docs/: 문서에 사용하는 마크다운 파일 디렉토리
  - docusaurus.config.js: 사이트 설정 파일.
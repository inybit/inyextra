# InyExtra — Hugo Theme

> **Every bit of thoughts & code. · Just a tiny bit of my world.**  
> 优雅、极速且全功能的现代化 Hugo 博客主题，独创微信朋友圈动态信息流与文档级深度阅读体验。

[![Hugo](https://img.shields.io/badge/Hugo-v0.128%2B-blue.svg)](https://gohugo.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 核心特性 (Features)

- ⚡ **原生极速构建**：零 Node.js / NPM 构建依赖，Hugo 原生单二进制秒级编译（~120ms 编译全站）。
- 🎨 **现代化视觉体系**：参考 Hextra / Nextra 优秀设计，具备毛玻璃渐变卡片、微动效与全平台响应式适配。
- 📷 **微信朋友圈信息流 (Moments)**：独家还原微信朋友圈交互，支持九宫格图库、地理位置打卡、实时点赞与评论。
- 💬 **自托管评论系统 (Artalk)**：深度对接 Artalk，支持博文与朋友圈数据互通、用户昵称共享与 Cravatar 像素头像生成。
- 📚 **文档与博客双重排版**：左侧多层级文档树（支持折叠与换行），右侧目录导航（TOC 阅读跟随高亮 ScrollSpy）。
- 🔍 **全站离线检索**：基于 FlexSearch.js，针对中英文定制分词分块，支持 `Ctrl + K` 快捷键唤起。
- 🧩 **开箱即用短代码组件**：
  - `filetree`：交互式目录树折叠展开，自动识别语言文件图标
  - `asciinema`：终端操作无损录屏在线播放 (`demo.cast`)
  - `tabs` / `tab`：多代码语言 / 多框架选项卡切换
  - `callout` / `cards` / `steps`：信息气泡、卡片网格与流程步骤条
- 🌓 **三态外观模式**：页脚极简平铺三态（浅色 / 深色 / 跟随系统），防白屏闪烁脚本内置。
- 🌐 **双语国际化 (i18n)**：完整支持简体中文 (`zh-cn`) 与 English (`en`) 双语并行。
- 🧱 **全模块化架构**：每个 CSS 与 JS 文件代码严格控制在 300 行以内，利用 Hugo Pipes 打包输出高性能 Bundle。

---

## 🚀 快速上手 (Quick Start)

### 方式一：Git Submodule（推荐）

在你的 Hugo 站点根目录下执行：

```bash
git submodule add https://github.com/yourusername/inyextra.git themes/inyextra
```

然后在 `hugo.toml` 中声明主题：

```toml
theme = 'inyextra'
```

### 方式二：直接克隆

```bash
git clone https://github.com/yourusername/inyextra.git themes/inyextra
```

---

## ⚙️ 核心配置指引 (Configuration)

在你的站点配置文件 `hugo.toml` 中加入以下核心参数：

```toml
baseURL = 'https://yourdomain.com/'
title = 'My Blog'
theme = 'inyextra'
defaultContentLanguage = 'zh-cn'

[params]
  search = true
  math = true
  mermaid = true
  toc = true
  breadcrumbs = true
  postNav = true

# 自托管评论系统 Artalk
[params.artalk]
  enable = true
  server = "https://artalk.yourdomain.com"
  site = "My Blog"
  placeholder = "说点什么吧..."
  gravatarMirror = "https://cravatar.cn/avatar/"
  gravatarDefault = "identicon"

# 朋友圈自定义封面与头像
[params.moments]
  cover = "/images/moments-cover.jpg" # 留空使用精美渐变默认背景
  avatar = "/images/avatar.jpg"        # 留空使用品牌字母徽标

# 首页精选服务导航卡片（支持无限增删）
[[params.services]]
  name = "IT-Tools"
  description = "开箱即用的在线实用开发运维工具箱。"
  url = "https://it-tools.tech"
  icon = "tool"
  badge = "精选"
```

完整配置请参考 [`exampleSite/hugo.toml`](exampleSite/hugo.toml)。

---

## 📝 短代码使用示例 (Shortcodes)

### 1. 交互式 FileTree 目录树

```markdown
{{</* filetree title="工程目录" */>}}
my-project/
├── content/
│   ├── posts/
│   │   └── hello.md
│   └── moments/
└── hugo.toml
{{</* /filetree */>}}
```

### 2. 多选项卡 Tabs

```markdown
{{</* tabs items="Go,Python,JavaScript" */>}}
  {{</* tab */>}}
  ```go
  fmt.Println("Hello Go")
  ```
  {{</* /tab */>}}
  {{</* tab */>}}
  ```python
  print("Hello Python")
  ```
  {{</* /tab */>}}
  {{</* tab */>}}
  ```javascript
  console.log("Hello JS")
  ```
  {{</* /tab */>}}
{{</* /tabs */>}}
```

### 3. 信息气泡 Callout

```markdown
{{</* callout type="tip" title="小提示" */>}}
这是一个开箱即用的提示气泡。
{{</* /callout */>}}
```

---

## 🛠️ 本地预览示例站点 (Preview Example Site)

```bash
cd exampleSite
hugo server --themesDir ../..
```

访问 `http://localhost:1313/` 即可体验包含全功能演示的站点。

---

## 📄 开源许可 (License)

本项目基于 [MIT License](LICENSE) 协议开源。

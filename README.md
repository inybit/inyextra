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

> [!NOTE]
> 短代码（Shortcodes）是 Hugo 专有的模板扩展语法。GitHub 纯静态渲染引擎不会执行 Hugo 模板解析，因此在博文中编写短代码时，将在编译生成的实际网站页面中呈现完整的交互式组件。

### 1. 交互式 FileTree 目录树

在文章中编写：

````markdown
{{</* filetree title="工程目录" */>}}
my-project/
├── content/
│   ├── posts/
│   │   └── hello.md
│   └── moments/
└── hugo.toml
{{</* /filetree */>}}
````

**效果特性**：在站点中自动渲染为可交互的树形结构，自动识别文件格式并赋予色彩图标，支持点击折叠/展开子目录。

---

### 2. 多选项卡 Tabs

在文章中编写：

````markdown
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
````

**效果特性**：在站点中自动渲染为现代化无边框选项卡，点击即可平滑切换不同编程语言或框架的代码范例。

---

### 3. 信息气泡 Callout

在文章中编写：

````markdown
{{</* callout type="tip" title="小提示" */>}}
这是一个开箱即用的提示气泡。
{{</* /callout */>}}
````

**在网站上的呈现效果**（支持 `note` / `tip` / `warning` / `danger` 四种情境）：

> [!TIP]
> **小提示**  
> 这是一个开箱即用的提示气泡。

---

### 4. 终端录屏播放器 Asciinema

在文章中编写：

````markdown
{{</* asciinema key="demo" rows="12" autoplay="false" */>}}
````

**效果特性**：本地免外链依赖，以极轻量终端动画无损回放命令执行过程，支持一键复制代码。

---

## 🛠️ 本地预览示例站点 (Preview Example Site)

进入示例目录即可一键启动完整功能预览：

```bash
cd exampleSite
hugo server --themesDir ../..
```

浏览器访问 `http://localhost:1313/` 即可直接体验包含朋友圈、多选项卡、交互目录树与离线搜索的全套功能。

---

## 📄 开源许可 (License)

本项目基于 [MIT License](LICENSE) 协议开源。

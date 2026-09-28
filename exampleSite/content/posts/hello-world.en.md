---
title: 'Hello, inybit'
date: 2026-09-23
draft: false
description: 'The birth of inybit blog, minimalist aesthetics, and batteries-included features.'
tags: ['Essay', 'Tech', 'Design', 'Hugo']
---

## What is inybit?

**inybit** (pronounced: `/ˈɪni-bɪt/`), a disyllabic name with the brisk cadence of **bit** at the end. It rolls off the tongue naturally and leaves a lasting impression.

A subtle pun: it sounds just like **"Tiny bit"**, carrying a modest, minimalist, and poetic nuance — *recording every tiny bit of thoughts and life*.

{{< callout type="tip" title="Dual Slogan Philosophy" >}}
- **Tech direction**: `Every bit of thoughts & code.`
- **Life direction**: `Just a tiny bit of my world.`
{{< /callout >}}

---

## Core Features

Inspired by modern benchmarks like Nextra and Hextra, crafted from scratch with native Hugo:

{{< cards >}}
  {{< card title="Fast and Full-featured" subtitle="Simple and easy to use, yet powerful and feature-rich." preview="doc" >}}
  {{< /card >}}
  {{< card title="Markdown is All You Need" subtitle="Compose with just Markdown. Enrich with Shortcode components." preview="code" >}}
  {{< /card >}}
  {{< card title="Full Text Search" subtitle="Built-in full text search with FlexSearch, no extra setup required." preview="search" >}}
  {{< /card >}}
  {{< card title="Lightweight as a Feather" subtitle="No dependency or Node.js is needed to use inybit. Powered by Hugo, one of the fastest static site generators, building in milliseconds." >}}
  {{< /card >}}
  {{< card title="Responsive with Dark Mode Included" subtitle="Looks great on different screen sizes. Built-in dark mode support, with auto-switching based on user's system preference." >}}
  {{< /card >}}
  {{< card title="Build and Host for Free" subtitle="Build with GitHub Actions, and host for free on GitHub Pages. Alternatively it can be hosted on any static hosting service." >}}
  {{< /card >}}
  {{< card title="Multi-Language Made Easy" subtitle="Create multi-language pages by just adding locales suffix to the Markdown file. Adding i18n support to your site is intuitive." >}}
  {{< /card >}}
  {{< card icon="✦" title="And Much More..." subtitle="Syntax highlighting / Table of contents / SEO / RSS / LaTeX / Mermaid / Customizable / and more..." >}}
  {{< /card >}}
{{< /cards >}}

---

## Code Block & Syntax Highlighting

High-contrast syntax highlighting in both light and dark modes, with language badge and one-click copy feedback.

```go
package main

import (
	"fmt"
	"time"
)

type InybitBlog struct {
	Name      string
	CreatedAt time.Time
	Slogan    string
}

func main() {
	blog := InybitBlog{
		Name:      "inybit",
		CreatedAt: time.Now(),
		Slogan:    "Every bit of thoughts & code.",
	}
	fmt.Printf("Welcome to %s: %s\n", blog.Name, blog.Slogan)
}
```

---

## LaTeX Math

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

---

## Diagrams (Mermaid)

```mermaid
graph TD
    A[Inspiration: inybit] --> B(Tech: Every bit of thoughts & code)
    A --> C(Life: Just a tiny bit of my world)
    B --> D{Native Hugo Engine}
    C --> D
    D --> E[Connected with the World]
```

Every tiny bit deserves to be recorded. ✨
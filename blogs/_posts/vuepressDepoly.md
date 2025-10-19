---
title: 博客部署
date: 2025-10-10
categories:
  - 编程
tags:
  - 前端
---


## 更新部署方法

### 方法一：一键部署（推荐）

部署依赖安装
```bash
npm install -D gh-pages
```

在 `package.json` 中添加部署脚本：

```json
{
  "scripts": {
    "dev": "vuepress dev .",
    "build": "vuepress build .",
    "deploy": "npm run build && npx gh-pages -d .vuepress/dist -b gh-pages"
  }
}
```

以后更新时只需要：
```bash
npm run deploy
```

### 方法二：手动部署步骤

每次更新博客后：

```bash
# 1. 构建项目
npm run build

# 2. 部署到 gh-pages
npx gh-pages -d .vuepress/dist -b gh-pages

# 3. 提交源代码到 main 分支（可选，但推荐）
git add .
git commit -m "更新: 描述您的更改"
git push origin main
```

### 方法三：使用批处理文件（Windows）

创建 `deploy.bat`：
```batch
@echo off
echo 开始构建和部署博客...

echo 1. 构建 VuePress...
npm run build

echo 2. 部署到 GitHub Pages...
npx gh-pages -d .vuepress/dist -b gh-pages

echo 3. 提交源代码...
git add .
git commit -m "更新: %date% %time%"
git push origin main

echo 部署完成！
echo 访问: https://sellyl.github.io
pause
```

## 不同类型的更新

### 1. 写新博客文章
- 在 `blogs/` 目录创建新的 `.md` 文件
- 运行 `npm run deploy`

### 2. 修改现有文章
- 编辑对应的 `.md` 文件
- 运行 `npm run deploy`

### 3. 修改样式或配置
- 编辑 `.vuepress/config.js` 或 `custom.css`
- 运行 `npm run deploy`

### 4. 添加图片或其他资源
- 放在 `.vuepress/public/` 目录
- 运行 `npm run deploy`

## 部署后的验证

每次部署后：
1. 等待 1-2 分钟让 GitHub Pages 更新
2. 访问 `https://sellyl.github.io`
3. 按 **Ctrl + F5** 强制刷新查看更改

## 最佳实践

### 1. 保持源代码管理
```bash
# 每次部署后，记得提交源代码到 main 分支
git add .
git commit -m "feat: 添加C++线程池教程"
git push origin main
```

### 2. 写有意义的提交信息
```
feat: 添加C++多线程教程
fix: 修复代码高亮问题
style: 调整页面布局
docs: 更新使用说明
```

### 3. 定期备份
您的代码已经在 GitHub 上，本身就是备份。

## 快速更新示例

假设您要写一篇新博客：

```bash
# 1. 创建新文章
echo "---
title: 新的技术文章
date: 2024-01-19
categories:
  - 技术
tags:
  - 教程
---

# 新的文章内容
..." > blogs/技术/2024/新文章.md

# 2. 一键部署
npm run deploy

# 3. 提交源代码
git add .
git commit -m "feat: 添加新技术文章"
git push origin main
```

## 注意事项

1. **部署需要时间**：GitHub Pages 更新通常需要 1-5 分钟
2. **缓存问题**：如果看不到更新，按 Ctrl+F5 强制刷新
3. **构建错误**：如果 `npm run build` 失败，先修复错误再部署


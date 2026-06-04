---
title: 'VSCode 安装与 Claude Code 接入 DeepSeek 完整指南'
date: '2026-06-04'
tags: ['工具', '教程', 'Claude Code', 'DeepSeek', 'VSCode']
excerpt: '从零开始安装配置 VSCode、Claude Code，并通过 CC-Switch 接入 DeepSeek 大模型，打造高效的 AI 辅助编程环境。'
---

## 一、安装 Claude Code 准备

### 1. 环境准备（软件下载）

1. **Node.js** 下载：
   https://nodejs.org/zh-cn/download

2. **Git** 下载（推荐 [Git for Windows x64 Setup](https://github.com/git-for-windows/git/releases/download/v2.54.0.windows.1/Git-2.54.0-64-bit.exe)）：
   https://git-scm.com/install/windows

### 2. Claude Code 安装

1. 按 **Win+R** 输入 **pwsh** 打开 PowerShell 命令行（也可以点 Win 键后直接搜索 PowerShell）。

   输入以下命令，解除终端脚本运行限制：

   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. 开始安装 Claude Code（国内网络如果 npm 官方源较慢，可临时切换镜像）：

   **（1）切换官方源为国内源：**

   ```powershell
   npm config set registry https://registry.npmmirror.com
   ```

   **（2）安装 Claude Code：**

   ```powershell
   npm install -g @anthropic-ai/claude-code
   ```

   **（3）切换回官方源：**

   ```powershell
   npm config set registry https://registry.npmjs.org
   ```

### 3. DeepSeek API Key 接入 Claude Code

1. **DeepSeek API Key 获取**：
   https://platform.deepseek.com/api_keys

   > 登录账号并实名认证，创建 DeepSeek 的 API Key，记得复制保存在只有自己能看的地方（比如微信"文件传输助手"或本地新建一个 txt 文件保存好）。

2. **CC-Switch 下载**：
   https://github.com/farion1231/cc-switch/releases

   > 根据自己的电脑系统下载，Windows 下载 `CC-Switch-v3.16.1-Windows.msi`。
   >
   > 下方为 Windows 直接下载链接（浏览器访问即下载，需科学上网）：
   > https://github.com/farion1231/cc-switch/releases/download/v3.16.1/CC-Switch-v3.16.1-Windows.msi

3. 使用 CC-Switch 将 Claude Code 的大模型切换为 DeepSeek：

   - 安装完成后打开 CC-Switch
   - 选择第一项「终端版 Claude Code」
   - 点击右上角 **+** 号，选择 **DeepSeek**
   - 填写 DeepSeek 的 API Key 配置信息
   - 点击「添加」

   > 填写完 DeepSeek 的 API Key 之后点击「添加」，Claude Code 的 AI 大模型就换成了 DeepSeek 的 `deepseek-v4-flash` 和 `deepseek-v4-pro`。

4. 按 **Win+R** 输入 **pwsh** 打开终端，输入以下指令即可使用终端版 Claude Code 全自动模式（无需多次点击 Yes）：

   ```powershell
   claude --dangerously-skip-permissions
   ```

---

## 二、VSCode 安装与 Claude Code 插件配置

### 1. VSCode 下载

https://code.visualstudio.com/Download

下载操作系统对应版本并安装。安装后登录 GitHub（注册一个 GitHub 账号，使用谷歌邮箱或 QQ 邮箱注册均可）。

### 2. VSCode 插件安装

1. **中文插件安装**：点击左侧插件市场，搜索 `chinese`，安装「中文（简体）」插件。

2. **Claude Code 插件安装**：搜索 `claude`，安装 Claude Code（注意官方信息为 **Anthropic**，不要装错）。

3. 安装完成后，点击 Claude 图标即可打开对话框界面开始使用。

---

## 三、Claude Code 重要 Skills 安装

### 1. GitHub 官方 Skills 安装

https://github.com/anthropics/skills

将以上链接直接发给 Claude Code，让它安装里面的技能即可。

### 2. 其他技能按需选择

需要什么技能可以直接让 Claude Code 搜索并安装。如果安装失败，告诉它你的代理端口号即可（它会使用代理进行下载安装）。

> **常用科学上网软件代理端口对照表**
>
> | 软件 | 代理协议 | 默认端口 | 说明 |
> |:-----|:--------:|:--------:|:-----|
> | **V2RayN** | SOCKS5 | **10808** | 本文使用的客户端，推荐与 Claude Code 配合 |
> | V2RayN | HTTP | **10809** | 同时开启的 HTTP 代理端口 |
> | **Clash Verge / FlClash** | HTTP / SOCKS5 | **7890** | 界面清爽，功能与 V2RayN 类似 |
> | **Shadowsocks** | SOCKS5 | **1080** | 经典代理，久经考验 |
> | **ShadowsocksR** | SOCKS5 | **1080** | SSR 分支，沿用默认端口 |
> | **Clash for Windows** | HTTP / SOCKS5 | **7890** | 老牌 Clash 客户端 |
> | **Surge** | SOCKS5 | **6153** | 仅限 macOS 平台 |
> | **Quantumult X** | SOCKS5 | **1080** | 仅限 iOS 平台 |
> | **Tor** | SOCKS5 | **9050** / **9150** | 匿名代理，Tor 浏览器用 9150 |
>
> 以上为默认端口，大部分软件支持自定义。如不确定，请查看代理软件设置中的「本地监听地址」或系统代理设置。

### 3. SkillHub — 专为中国用户优化的 Skills 社区

可以将以下链接发给 Claude，让它下载国内版的技能：

https://skillhub.cloud.tencent.com

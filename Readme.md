```markdown
# 25秋计算机综合2班 - 青春班级博客 (Pibo-ClassHub)

> 一个采用“绝对对称 + 苹果风毛玻璃”UI的纯静态班级博客，自带硬核“蓝屏关服维护”机制。

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-在线访问-brightgreen)](https://pibo0608.github.io/Pibo-ClassHub/)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/pibo0608/Pibo-ClassHub/blob/main/LICENSE)

## 📖 项目简介

本项目是一个**纯静态、零成本、无需后端**的班级数字中枢。使用原生 HTML5 / CSS3 / ES6+ JavaScript 开发，所有数据由本地 JSON 文件驱动。不仅拥有极其现代的用户界面，还配置了极其逼真的微软蓝屏维护系统。

**在线访问地址**：[https://pibo0608.github.io/Pibo-ClassHub/](https://pibo0608.github.io/Pibo-ClassHub/)

## ✨ 核心特性

- **🎨 青春毛玻璃 UI**：全站苹果风毛玻璃卡片，支持深浅色主题随时间自动切换。
- **📸 动态背景**：1920x1200 高清背景图，从左向右缓缓平移，每 30 秒自动切换。
- **🛠️ 蓝屏维护机制**：基于 `config.ini` 的总控开关，全站瞬间进入微软同款蓝屏。支持 12 种英文字体随机切换、随机停止代码、动态进度条和二维码生成。
- **📊 全面数据驱动**：值日表、课程表、班级干部、学生名单、作业看板，全部由 `data/` 文件夹下的 JSON 文件控制，无需修改代码即可更新。
- **🎲 随机点名器**：内置独立点名页面，支持名字飞速滚动、随机定格。
- **📖 开发文稿**：内置硬编码的开发文档页面，展示项目架构与维护指南。

## 🚀 快速上手

由于项目使用了 `fetch` 读取本地 JSON 文件，浏览器会拦截跨域请求，**请勿直接双击 HTML 打开**。

在项目根目录下执行：

```bash
# 启动 Python 本地服务器
python -m http.server 8000
```

然后在浏览器中访问 http://localhost:8000。

📁 项目结构

```text
Pibo-ClassHub/
├── index.html          (首页)
├── cadres.html         (班级干部页)
├── picker.html         (随机点名器)
├── devlog.html         (开发文稿页)
├── 403.html            (蓝屏维护页)
├── common.css          (公共样式)
├── index.css           (首页专属样式)
├── cadres.css          (干部页专属样式)
├── script.js           (首页逻辑)
├── Background/         (背景图片)
├── fonts/              (自定义字体)
├── js/                 (外部库)
│   ├── morphicons.esm.js
│   ├── qrcode.min.js
│   └── marked.min.js
└── data/               (数据文件夹)
    ├── duty.json       (值日数据)
    ├── courses.json    (课程数据)
    ├── personnel.json  (干部数据)
    ├── student.json    (点名名单)
    ├── homework.json   (作业数据)
    ├── 403.json        (蓝屏文案)
    └── config.ini      (维护总控开关)
```

🛠️ 维护与更新

1. 蓝屏维护（关服/开服）

修改 data/config.ini 中的数字：

· maintenance = 1：全站进入蓝屏维护状态。
· maintenance = 0：恢复正常访问。

2. 数据更新

· 值日表：修改 data/duty.json
· 课程表：修改 data/courses.json
· 班级干部：修改 data/personnel.json
· 点名名单：修改 data/student.json
· 作业看板：修改 data/homework.json

👨‍💻 作者

· 制作与构思：叶锋 (毗毘)
· GitHub：@pibo0608

📄 开源许可证

本项目采用 MIT License 开源许可证。

```
# Playtube 视频上传SDK

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

🌐 [English](README.md) | **简体中文**

用于Playtube平台的自动化视频上传Node.js SDK

## 功能特性

- 🚀 开箱即用的身份验证
- 🏷️ 元数据管理
- 🔒 会话持久化
- ⏱️ 上传进度追踪

## 使用方法
```javascript
const Playtube = require('./playtube-uploader');

// 初始化客户端
/**
 * @param {string} HOST - 你的Playtube平台域名，例如：'your-domain.com'。
 * @param {string} IP - 你的Playtube平台的IP，例如：'https://localhost'。方便绕过CDN在本地上传。
 */
const client = new Playtube('your-domain.com', 'https://localhost');

// 初始化身份验证
await client.init('username', 'secure_password');

// 上传视频文件并获取上传结果
/**
 * @param {string} filePath - 本地视频文件路径。
 * @param {boolean} isShort - 是否上传到短视频频道。这里如果设置为短视频，返回的缩略图是竖着裁剪的，如果是长视频则是横着的。
 */
const uploadResult = await client.uploadVideo('/path/to/video.mp4', false);

// Submit metadata
const videoData = {
    'title': "视频标题",
    'description': "视频简介",
    'category_id': "视频分类的ID",
    'sub_category_id': "子分类的ID，没有就填0",
    'tags': "使用,半角,逗号,分割,标签", 
    'video-location': uploadResult['file_path'],
    'video-thumnail': uploadResult['images'][Math.floor(Math.random() * videoDetail['images'].length)], // 随机选取一个缩略图
    'uploaded_id': uploadResult['uploaded_id']
}
/**
 * @param {object} videoData - 视频数据。
 * @param {boolean} isShort - 是否上传到短视频频道。这里如果设置为短视频，会上传到短视频分类
 */
const result = await client.submitVideo(videoData, false);

console.log('Publish successful:', result);
```
# Playtube Uploader SDK 

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

🌐 **English** | [简体中文](README.zh-CN.md)

A Node.js SDK for automated video publishing to Playtube-based platforms.

## Features

- 🚀 Zero-config authentication
- 🏷️ Metadata management
- 🔒 Session persistence
- ⏱️ Progress tracking

## Usage
```javascript
const Playtube = require('./playtube-uploader');

// Initialize client
/**
 * @param {string} HOST - Your Playtube-based platform's domain.
 * @param {string} IP - Your Playtube platform IP, localhost: 'https://localhost'.
 */
const client = new Playtube('your-domain.com', 'https://localhost');

// Authentication
await client.init('username', 'secure_password');

// Upload video
/**
 * @param {string} filePath - Path to the video file.
 * @param {boolean} isShort - Whether the video is shorts. If set as a short video here, the returned thumbnail will be cropped vertically, and if it is a long video, it will be cropped horizontally.
 */
const uploadResult = await client.uploadVideo('/path/to/video.mp4', false);

// Submit metadata
const videoData = {
    'title': "Your Video Title",
    'description': "Your Video Description",
    'category_id': "Your Category ID",
    'sub_category_id': "Your Sub Category ID, if do not have, use 0",
    'tags': "separate,tags,with,comma", // You can set sentences or words as tags, only separated by commas
    'video-location': uploadResult['file_path'],
    'video-thumnail': uploadResult['images'][Math.floor(Math.random() * videoDetail['images'].length)], // Randomly select a thumbnail
    'uploaded_id': uploadResult['uploaded_id']
}
/**
 * @param {object} videoData - Video metadata.
 * @param {boolean} isShort - Whether the video is shorts. If set as a short video here, it will be uploaded to the short video category
 */
const result = await client.submitVideo(videoData, false);

console.log('Publish successful:', result);
```
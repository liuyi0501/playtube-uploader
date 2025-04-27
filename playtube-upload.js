const axios = require("axios")
const FormData = require("form-data")
const crypto = require("crypto")
const path = require("path")
const fs = require("fs")
const fetch = require('node-fetch')


class Playtube{
    constructor(host, ip){
        this.HOST = host
        this.IP = ip
        this.uploadURL = this.IP + "/aj/upload-video-ffmpeg"
        this.submitURL = this.IP + "/aj/ffmpeg-submit"
        this.loginURL = this.IP + "/login"
        this.HASH = ''
        this.USER_ID = ''
        this.PHPSESSID = ''
    }
    init(username, password){
        return new Promise((resolve)=>{
            this.getCookie(username, password).then((cookies)=>{
                resolve(true)
            })
        })
    }
    getCookie(username, password){
        const loginForm = new FormData()
        loginForm.append('username', username)
        loginForm.append('password', password)
        loginForm.append('remember_device', 'on')
        return new Promise((resolve, reject)=>{
            fetch(`${this.loginURL}`, {
                method: 'POST',
                body: loginForm,
                headers: {
                    host: this.HOST,
                    ...loginForm.getHeaders()
                },
                redirect: 'manual'
            }).then((res)=>{
                let cookie = res.headers.get('set-cookie')
                cookie = cookie.replaceAll(',', ';').split(';')
                cookie.forEach(element => {
                    if ( element.indexOf("PHPSESSID") != -1 ){
                        this.PHPSESSID = element.split('=')[1]
                    }
                    if ( element.indexOf("user_id") != -1 ){
                        this.USER_ID = element.split('=')[1]
                    }
                });
                fetch(`${this.IP}`, { 
                    method: 'GET',
                    headers: {
                        host: this.HOST,
                        Cookie: `user_id=${this.USER_ID}; PHPSESSID=${this.PHPSESSID};`
                    }
                }).then((resIndex)=>{
                    resIndex.text().then((html)=>{
                        //<input type="hidden" class="main_session" value="xxxxxx">
                        let hash = html.match(/<input type="hidden" class="main_session" value="(.*)">/)[1]
                        this.HASH = hash
                        resolve({
                            PHPSESSID: this.PHPSESSID,
                            USER_ID: this.USER_ID,
                            HASH: this.HASH
                        })
                    })
                })
            }).catch(e=>reject)
        })
    }
    uploadVideo(videoPath, isShort = false){
        return new Promise(async (resolve, reject)=>{
            const formData = new FormData()
            let videoName = videoPath.substring( videoPath.lastIndexOf('/') + 1 )
            formData.append('name', videoName)
            formData.append('chunk', 0)
            formData.append('chunks', 1)
            formData.append('video', fs.createReadStream(videoPath));
            if (isShort == true || isShort == 'true') {
                formData.append('is_short', 'yes')
            }
        
            let res = await fetch(`${this.uploadURL}?hash=${this.HASH}`, {
                method: 'POST',
                body: formData, 
                headers: {
                    host: this.HOST,
                    ...formData.getHeaders(),
                    'Cookie': `user_id=${this.USER_ID}; PHPSESSID=${this.PHPSESSID};`
                }
            })
            let res_html = await res.clone().text()
            try{
                let res_json = await res.json()
                resolve(res_json)
            } catch(e){
                console.error(e)
                console.log("---error html---")
                console.log(res_html)
                console.log("---./end error html---")
                throw new Error(e)
            }
        })
    }
    submitVideo(videoDetail, isShort = false){
        return new Promise(async (resolve)=>{
            const formData = new FormData()
            formData.append('title', videoDetail['title'])
            formData.append('description', videoDetail['description'])
            formData.append('is_movie', 0)
            formData.append('set_p_v', '')
            formData.append('embedding', '')
            formData.append('category_id', videoDetail['category_id'])
            formData.append('sub_category_id', videoDetail['sub_category_id'])
            formData.append('tags', videoDetail['tags'].join(','))
            formData.append('privacy', 0)
            formData.append('age_restriction', 1)
            formData.append|('date', '')
            formData.append('hour', '12:00AM')
            formData.append(`video-location`, videoDetail['video-location'])
            formData.append(`video-thumnail`, videoDetail['video-thumnail'])
            formData.append('uploaded_id', videoDetail['uploaded_id'])
            if (isShort == true || isShort == 'true') {
                formData.append('is_short', 'yes')
            }
            let res = await fetch(`${this.submitURL}?hash=${this.HASH}`, {
                method: 'POST',
                body: formData, 
                headers: {
                    host: this.HOST,
                    ...formData.getHeaders(),
                    'Cookie': `user_id=${this.USER_ID}; PHPSESSID=${this.PHPSESSID};`
                }
            })
            let res_json = await res.json()
            resolve(res_json)
        })
    }
}
module.exports = Playtube
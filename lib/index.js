import React from "react";
import fetch from "isomorphic-fetch";

export default class Main extends React.Component {
    clickUpload = () => {
        let input = document.createElement('input')
        let inputBox = document.createElement('div')
        input.setAttribute('type','file');
        input.onchange = (e)=>{
            this.doUpload()
        }
        inputBox.style.height = 0;
        inputBox.style.overflow = 'hidden';
        inputBox.appendChild(input)
        document.body.appendChild(inputBox)
        this.input = input
        this.inputBox = inputBox
        input.click()
    }
    doUpload = () => {
        const file = this.input.files[0]
        const {url, upload} = this.props
        this.inputBox.parentNode.removeChild(this.inputBox)
        this.input = null
        this.inputBox = null
        getAliOssInfo(url).then(rst => {
            if (upload) {
                upload(rst, file, this.upLoadAlioss)
                return
            }
            this.upLoadAlioss(Object.assign({}, rst, {file}))
        })
    }
    upLoadAlioss = (options) => {
        const file = options.file
        let curDate = new FormData()
        const key = options.dir + new Date().getTime() + '_' + options.file.name
        curDate.append("OSSAccessKeyId", options.accessid);
        curDate.append("policy", options.policy);
        curDate.append("Signature", options.signature);
        curDate.append("key", key);
        curDate.append("success_action_status", '200');
        curDate.append('file', file)
        return fetch(options.host, {
            method: 'post',
            body: curDate,
        }).then(() => {
            this.props.uploadEnd(options.host + '/' + key)
        }).catch((err) => {
            this.props.uploadEnd(false)
        })
    }

    render() {
        const {children} = this.props
        return (
            <div className="react-alioss-upload-box">
                <div onClick={this.clickUpload}>
                    {children}
                </div>
            </div>
        )
    }
}

function getAliOssInfo(url) {
    return fetch(url, {
        credentials: 'include',
    }).then(rst => {
        return rst.json()
    }).catch(function (err) {
        return false
    })
}

import React from 'react';
import fetch from "isomorphic-fetch";

// function test(props) {
//     return (
//         <Main
//     url='http://127.0.0.1:8088/common/upload/alioss/vue'
//     uploadEnd={(data) => {
//         console.log(data)
//     }}
//     upload={(data, file, load) => {
//         load(Object.assign({}, data, {file}))
//     }}
// >
//     sdfsf
//     </Main>
// )
// }

export default class Main extends React.Component {
    clickUpload = () => {
        this.refs['vui_alioss_file'].click()
    }
    doUpload = () => {
        const file = this.refs['vui_alioss_file'].files[0]
        const {url, upload} = this.props
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
        <div style={{height: 0, overflow: 'hidden'}}>
    <input ref="vui_alioss_file" type="file" onChange={() => {
            this.doUpload()
        }}/>
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

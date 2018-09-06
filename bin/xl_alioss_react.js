#!/usr/bin/env node

var path = require('path');
var argv = require('yargs').argv
var program = require('commander')
var shell = require('shelljs')
var tag = require('../lib/tag.js')
// 如果存在本地的命令，执行本地的
try {
    var localWebpack = require.resolve(path.join(process.cwd(), "node_modules", "xl_alioss_react", "bin", "xl_alioss_react.js"));
    if (__filename !== localWebpack) {
        return require(localWebpack);
    }
} catch (e) {
}


let package = JSON.parse(shell.cat(path.join(__dirname, '../package.json')))


program
    .version(package.version)
    .usage('[cmd] [options]')
    .option('-m', '设置 commit -m 信息')
    .option('-t', 'tag -a <t> -m <m>')
program
    .command('push <path>')
    .description('上传某一个文件，或者所有文件')
    .action((path, options) => {

    })
program
    .command('tag <tag>')
    .description('打 tag 标签并，上传 tag 标签 ')
    .action((option, options) => {
        tag(argv)
    })
program.parse(process.argv)

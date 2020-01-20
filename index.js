const koa = require('koa');
const path = require('path');
const static = require('koa-static');
const koaBody = require('koa-body');
const fs = require('fs');

const { training, checkNumber } = require('./ai')
const app = new koa();

app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024   
    }
}));

async function init() {
    console.log('开始训练中...')
    const res = await training(10)
    console.log('训练结束')
    app.use(static(path.join(__dirname, './lib')));
    app.use(async(ctx) => {
        if (ctx.url === '/uploadFile') {
            const file = ctx.request.files.file // 获取上传文件
            const reader = fs.createReadStream(file.path);
            let filePath = path.join(__dirname, './upload') + `/${file.name}`;
            const upStream = fs.createWriteStream(filePath);
            reader.pipe(upStream);
            const res = await checkNumber(file.path)
            ctx.body = res
            ctx.end;
        }
    })
    app.listen(3000, function() {
        console.log('训练完毕')
    });
}

init();

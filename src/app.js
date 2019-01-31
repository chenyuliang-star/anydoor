 
const conf = require("./config/defaultConfig");
const http = require("http");
const path = require("path");
const fs = require("fs");
const handleBars = require("handlebars");
const promisify = require("util").promisify;
const mine = require("./config/mine");
const compress = require("./config/compress");
const range = require("./config/range");
const cache = require("./config/cache");

const server = http.createServer( (req, res) => {

   const url = req.url;
   const fileRoot = conf.root;
   const filePath = path.join(fileRoot, url);
   const stat = promisify(fs.stat);
  
   
   //获取模板html
   const dirHtmlPath = path.join(__dirname, "./template/dir.html");
   const dirHtmlSource = fs.readFileSync(dirHtmlPath);
   const dirHtmlTemplate = handleBars.compile(dirHtmlSource.toString());


   stat(filePath).then ( (status) => {

       if (status.isFile()) {  //是文件，展示
            
            const ext = mine(filePath);//获取Content-Type
            
            res.setHeader("Content-Type", ext);
            if (cache(status, res, req)) {//利用缓存
                res.statusCode = 304;
                res.end();
                return ;
            }
            
            let file;
            const { code, start, end} = range(status.size, res, req);
           
            //获取范围y
            if (code === 200) {
                res.statusCode = 200;
                file = fs.createReadStream(filePath);//获取文件流
            } else { //部分加载
                res.statusCode = 206;//部分加载
                file = fs.createReadStream(filePath, { start, end});
            }
             
            if (filePath.match(/\.(html|js|css|md)/)) {
                file = compress(file, res, req); //压缩文件
            }
            file.pipe(res);
       } else if (status.isDirectory()) { //文件夹，展示文件夹
            const readdir = promisify(fs.readdir);
            readdir(filePath).then( (files) => {//获取子文件名
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/html");
                const relativePath = path.relative(conf.root, filePath);
                //寻找路径
                const data = {
                    title: path.basename(filePath), 
                    dir: relativePath ? `/${relativePath}` : "",
                    files
                }
               // console.log(req.url, path.relative(conf.root, filePath));
                res.end(dirHtmlTemplate(data));
            }).catch( (err) => { //其他报错
                res.statusCode = 404 ;
                res.setHeader("Content-Type", "text/plain");
                res.end("对不起，你访问的资源不存在");
            })
       }
   }).catch ( (err) => { //未能找到，报错
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end("对不起，你访问的资源不存在");
   }) 
});


server.listen(conf.port, conf.hostname, () => {
    const str = `http://${conf.hostname}:${conf.port}`;
    console.log("Server started at " + str);
})


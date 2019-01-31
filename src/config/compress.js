
const { createGzip, createDeflate } = require("zlib");

//压缩文件处理

module.exports = (fs, res, req) => {
    const acceptCcoding = req.headers["accept-encoding"];
    if (!acceptCcoding || !acceptCcoding.match(/\b(gzip|deflate)\b/)) return fs;
    if (acceptCcoding.match(/\b(gzip)\b/))  {
        res.setHeader("Content-Encoding", "gzip");
        return fs.pipe(createGzip());  //gzip压缩
    }
    res.setHeader("Content-Encoding", "deflate"); 
    return fs.pipe(createDeflate()); //deflate压缩
} 
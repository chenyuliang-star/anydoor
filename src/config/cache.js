
//服务器端缓存处理
const range = require("./defaultConfig");

//设置响应头部

function refreshRes(status, res) {
    const { maxLenght, expires, cacheCrotrol,lastModified, etag } = range.cache; 
    if (expires) {
        const num = new Date(parseInt(Date.now()) + maxLenght * 1000).toUTCString();
        res.setHeader("Expires",  num);
    }
    if (cacheCrotrol) {
        res.setHeader("Cache-Control", `public, max-age=${maxLenght}`)
    }
    if (lastModified) {
        res.setHeader("Last-Modified", status.mtime.toUTCString());
    }   
    if (etag) {
        res.setHeader("ETag", `${status.size}-${status.mtime.toUTCString()}`);
    }
}

module.exports = (status, res, req) => {
    refreshRes(status, res);
    const lastModified = req.headers["if-motified-since"];
    const etag = req.headers["if-none-match"];  
    if (!lastModified || !etag) {
        return false;
    }
    if (lastModified && lastModified !== res.getHeader("lastModified")) {
        return false;
    }
    if (etag && etag !== res.getHeader("etag")) {
        return false;
    }
    return true;
}



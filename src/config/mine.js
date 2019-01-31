
//设置Content-Type
const path = require("path");
const mine = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "jpg": "image/jpeg",
    "svg": "image/svg+xml",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "txt": "text/plain",
    "xml": "text/xml",
}

module.exports = (filePath) => {
    let ext = path.extname(filePath).split(".").pop().toLocaleLowerCase();
    if (!ext) ext = filePath;
    return mine[ext] ? mine[ext] : mine["txt"];
}
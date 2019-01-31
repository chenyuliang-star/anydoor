module.exports = {
    root: process.cwd(),
    hostname: "127.0.0.1",
    port: 9000,
    cache: {
        maxLenght: 600,
        expires: true,
        cacheCrotrol: true,
        etag: true,
        lastModified: true
    }
}

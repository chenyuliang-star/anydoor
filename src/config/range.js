
//需求范围
module.exports = (totalSize, res, req) => {
    const range = req.headers["range"];
 
    if (!range) return { code: 200 }

    const num = range.match(/bytes=(\d*)-(\d*)/);
    const end = num[2] || totalSize - 1;
    const start = num[1] || totalSize - end;
    //获取start-end

    if (start > end || start < 0 || end > totalSize) {
        return { code: 200 }
    }
    return {
        code: 206,
        start: parseInt(start),
        end: parseInt(end)
    }

}
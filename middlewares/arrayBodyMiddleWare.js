module.exports = function (arrayName) {
    return (req, res, next) => {
        if (!Array.isArray(req.body[arrayName])) {
            req.body[arrayName] = [req.body[arrayName]]
        }
        next()
    }
}
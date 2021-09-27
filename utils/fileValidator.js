module.exports = function (files, options = { maxCount, minSize, maxSize, mimeTypes, required }) {
    let errors = []
    if (!Array.isArray(files)) {
        files = [files]
    }
    const { maxCount, minSize, maxSize, mimeTypes, required } = options;
    if (required && files.length === 0) {
        errors.push("Files are required!")
    }
    if (maxCount && files.length > maxCount) {
        errors.push("Too many files!")
    }
    files.forEach(f => {
        if (maxSize && f.size > maxSize) {
            errors.push(`${f.name} is too large!`)
        }
        if (minSize && f.size < minSize) {
            errors.push(`${f.name} is too small!`)
        }
        if (mimeTypes && mimeTypes.indexOf(f.mimeType) !== -1) {
            errors.push(`${f.name} is not in the type range!`)
        }
    })
    return errors;
}
const fs = require('fs');

module.exports = {
    save: function (files, path, dbPath) {
        let paths = []
        if (!Array.isArray(files)) {
            files = [files]
        }
        try {
            files.forEach(f => {
                const fileName = Date.now() + f.name;
                fs.writeFileSync(path + fileName, f.data)
                paths.push(dbPath + fileName)
            })
        } catch (err) {
            console.log(err)
        }
        return paths
    },
    delete: function (paths, prefix = '') {
        if (!Array.isArray(paths)) {
            paths = [paths]
        }
        try {
            paths.forEach(path => {
                fs.unlinkSync(prefix + path)
            })
        } catch (err) {
            console.log(err)
        }
    }

}
const glob = require("glob");

module.exports = {

    printProgress(progress) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(progress);
    },

    async listINIFiles(path) {
        console.log(`Getting INI files from ${path}`);
        return new Promise((resolve, reject) => {
            glob(`${path}/*.ini`, (error, fileList) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    resolve(fileList);
                }
            })
        })
    }

}
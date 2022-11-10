const glob = require("glob");
const fs = require('fs').promises;
const ini = require('js-ini');

module.exports = {

    padNum(number, pad) {
        return String(number).padStart(pad, '0');
    },

    printProgress(progress) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(progress);
    },

    async getIniFiles(folderPath, globOptions) {
        console.log(`Getting INI files from ${folderPath}`);
        return new Promise((resolve, reject) => {
            glob(`${folderPath}/*.ini`, globOptions, (error, fileList) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    resolve(fileList);
                }
            })
        })
    },

    async getSectionsFromIni(filePath, ...sectionNames) {
        const text = await fs.readFile(filePath, 'utf-8');
        const sections = [];
        text.split("[").forEach(section => {
            if (section) {
                const fullSection = `[${section}`;
                const parsed = ini.parse(fullSection);
                sectionNames.forEach(secName => {
                    if (secName in parsed) {
                        sections.push(parsed[secName]);
                    }
                });
            }
        })
        return sections;
    }
}
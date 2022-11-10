const glob = require("glob");
const fsPromises = require('fs').promises;
const fs = require('fs');
const ini = require('js-ini');

function padNum(number, pad) {
    return String(number).padStart(pad, '0');
}

function printProgress(progress) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(progress);
}

async function getIniFiles(folderPath, globOptions) {
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
}

async function getSectionsFromIni(filePath, ...sectionNames) {
    const text = await fsPromises.readFile(filePath, 'utf-8');
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

async function getSystemFiles(args) {
    let systemFiles = await getIniFiles("../DATA/UNIVERSE/SYSTEMS/*");
    let exclude = [];
    if (args[0] === "--exclude") {
        exclude = args.slice(1).filter(arg => !arg.includes("--"));
        systemFiles = systemFiles.filter(file => !exclude.some(sys => file.toLocaleLowerCase().includes(sys.toLocaleLowerCase())))
    }
    console.log(`Got ${systemFiles.length} system files, excluded ${exclude.length} file(s). Scanning for bad fields...`);
    return systemFiles;
}

async function writeListToFile(fileName, list) {
    let text = "";
    for (item of list) {
        text += item + "\n";
    }
    try {
        if (!(fs.existsSync('./output'))) {
            fs.mkdirSync('./output');
        }
        await fsPromises.writeFile(`./output/${fileName}.txt`, text);
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    padNum,
    printProgress,
    getIniFiles,
    getSectionsFromIni,
    getSystemFiles,
    writeListToFile
}
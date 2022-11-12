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

function getCommonArgs() {
    const args = process.argv.slice(2);
    const shouldExport = args.includes("--E");
    const shouldDelete = args.includes("--D");
    
    const excludeIndex = args.indexOf("--exclude");
    const excludeSystems = [];
    let excludeArgsIndex = excludeIndex + 1;
    while (args[excludeArgsIndex] && !args[excludeArgsIndex].includes("--")) {
        excludeSystems.push(args[excludeArgsIndex]);
        excludeArgsIndex++;
    }

    return {
        shouldExport,
        shouldDelete,
        excludeSystems
    }
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
    text.split(/(^\[)/gm).forEach(section => {
        if (section && section !== "[") {
            const parsed = ini.parse("["+section);
            sectionNames.forEach(secName => {
                if (secName in parsed) {
                    sections.push(parsed[secName]);
                }
            });
        }
    })
    return sections;
}

async function getSystemFiles(excludeSystems) {
    let systemFiles = await getIniFiles("../DATA/UNIVERSE/SYSTEMS/*");
    systemFiles = systemFiles
        .filter(file => 
            !excludeSystems.some(sys => file.toLocaleLowerCase().includes(sys.toLocaleLowerCase()))
            && !file.includes("intro")
            && !file.includes("HLP")
        )
    console.log(`Got ${systemFiles.length} system files, excluded ${excludeSystems.length} file(s).`);
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
    getCommonArgs,
    getIniFiles,
    getSectionsFromIni,
    getSystemFiles,
    writeListToFile
}
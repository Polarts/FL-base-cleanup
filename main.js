const ini = require('js-ini');
const fs = require('fs').promises;
const glob = require("glob");

function printProgress(progress){
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(progress);
}

async function getSystemFiles() {
    console.log("Getting system files...");
    return new Promise((resolve, reject) => {
        glob("../SYSTEMS/*/*.ini", (error, fileList) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                resolve(fileList);
            }
        })
    })
}

async function getBases() {
    console.log("Getting all bases from universe.ini");
    const text = await fs.readFile('../universe.ini', 'utf-8');
    const bases = [];
    text.split("[").forEach(section => {
        if (section) {
            const fullSection = `[${section}`;
            const parsed = ini.parse(fullSection);
            if ("Base" in parsed) {
                bases.push(parsed.Base);
            }
        }
    })
    return bases;
}

async function findBases() {
    const bases = await getBases();
    const systemFiles = await getSystemFiles();
    console.log(`Got ${systemFiles.length} system files. Scanning for bad bases...`);
    const badBases = [];
    for ([baseIdx, base] of bases.entries()) {
        const nick = base.nickname;
        let hasBase = false;
        for ([systemIdx, file] of systemFiles.entries()) {
            printProgress(`base ${baseIdx+1}/${bases.length} - system ${systemIdx+1}/${systemFiles.length}...`);
            const text = await fs.readFile(file, 'utf-8');
            if (text.toLocaleLowerCase().includes(nick.toLocaleLowerCase())) {
                hasBase = true;
            }
        }
        if (!hasBase) {
            badBases.push(nick);
        }
    }
    console.log();
    console.log(badBases);
}

findBases();


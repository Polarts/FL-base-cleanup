const ini = require('js-ini');
const fs = require('fs').promises;
const { printProgress, listINIFiles } = require('./utils');

async function getBases() {
    console.log("Getting all bases from universe.ini");
    const text = await fs.readFile('../DATA/UNIVERSE/universe.ini', 'utf-8');
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
    const systemFiles = await listINIFiles("../DATA/UNIVERSE/SYSTEMS/*");
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


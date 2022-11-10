const fs = require('fs').promises;
const { printProgress, getIniFiles, getSectionsFromIni } = require('./utils');

const args = process.argv.slice(2);

async function listUnusedBases() {
    const bases = await getSectionsFromIni('../DATA/UNIVERSE/universe.ini', "Base");
    let systemFiles = await getIniFiles("../DATA/UNIVERSE/SYSTEMS/*");
    let exclude = [];
    if (args[0] === "--exclude") {
        exclude = args.slice(1);
        systemFiles = systemFiles.filter(file => !exclude.some(sys => file.toLocaleLowerCase().includes(sys.toLocaleLowerCase())))
    }
    console.log(`Got ${systemFiles.length} system files, excluded ${exclude.length} file(s). Scanning for bad bases...`);
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

listUnusedBases();


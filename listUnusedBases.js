const fs = require('fs').promises;
const { printProgress, getIniFiles, getSectionsFromIni, getSystemFiles, writeListToFile, padNum, getCommonArgs } = require('./functions');

const { shouldExport, excludeSystems } = getCommonArgs();

async function listUnusedBases() {
    const bases = await getSectionsFromIni('../DATA/UNIVERSE/universe.ini', "Base");
    const systemFiles = await getSystemFiles(excludeSystems);
    const badBases = [];
    for ([baseIdx, base] of bases.entries()) {
        const nick = base.nickname;
        let hasBase = false;
        for ([systemIdx, file] of systemFiles.entries()) {
            printProgress(`base ${padNum(baseIdx + 1, 3)}/${bases.length} - system ${padNum(systemIdx + 1, 3)}/${systemFiles.length}...`);
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
    if (shouldExport) {
        console.log("Exporting result to file ./output/unusedBases.txt");
        await writeListToFile("unusedBases", badBases);
    }
}

listUnusedBases();


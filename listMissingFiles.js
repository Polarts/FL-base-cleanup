const { getCommonArgs, getSystemFiles, printProgress, padNum, getSectionsFromIni, writeListToFile } = require("./functions");
const fs = require('fs');
const {
    shouldExport,
    excludeSystems
} = getCommonArgs();

async function listMissingFiles() {
    const systems = await getSystemFiles(excludeSystems);
    const missingFiles = [];
    for (const [systemIdx, system] of systems.entries()) {
        const sections = await getSectionsFromIni(system);
        for (const [sectionIdx, section] in sections.entries()) {
            printProgress(`Scanning system ${padNum(systemIdx + 1, 3)}/${padNum(systems.length, 3)} - file ${system} - section ${padNum(sectionIdx + 1, 3)}/${padNum(sections.length, 3)}...`);
            const filePaths = Object.values(section).filter(str => str.includes("\\")).map(p => `\\data\\${p}`);
            filePaths.forEach(p => {
                if (!fs.existsSync(p)) {
                    missingFiles.push({
                        system,
                        filePath: p
                    })
                }
            })
        }
    }
    console.log();
    const out = missingFiles.map(mf => `${mf.system} - ${mf.filePath}`);
    console.log(out);
    if (shouldExport) {
        console.log("Exporting result to file ./output/missingFiles.txt");
        await writeListToFile("missingFiles", out);
    }
}

listMissingFiles();
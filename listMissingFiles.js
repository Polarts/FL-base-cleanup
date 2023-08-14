const { getCommonArgs, getSystemFiles, printProgress, padNum, getSectionsFromIni, writeListToFile } = require("./functions");
const fs = require('fs');
const {
    shouldExport,
    excludeSystems
} = getCommonArgs();

function extractPathsFromValues(values) {
    const paths = [];
    values.forEach(v => {
        if (typeof v === "string" && v.includes("\\")) {
            if (v.includes(",")) {
                const vPaths = v.replace(" ", "").split(",");
                vPaths.forEach(vPath => {
                    if (vPath.includes(",")) {
                        paths.push(vPath);
                    }
                })
            } else {
                paths.push(v);
            }
        }
    })
    return paths.map(p => `..\\data\\${p}`);
}

async function listMissingFiles() {
    const systems = await getSystemFiles(excludeSystems);
    const missingFiles = [];
    for (const [systemIdx, system] of systems.entries()) {
        const sections = await getSectionsFromIni(system);
        for (const [sectionIdx, section] of sections.entries()) {
            printProgress(`Scanning system ${padNum(systemIdx + 1, 3)}/${padNum(systems.length, 3)} - file ${system} - section ${padNum(sectionIdx + 1, 3)}/${padNum(sections.length, 3)}...`);
            try {
                const filePaths = extractPathsFromValues(Object.values(section));
                filePaths.forEach(p => {
                    if (!fs.existsSync(p)) {
                        missingFiles.push({
                            system,
                            filePath: p
                        })
                    }
                })
            } catch (e) {
                console.error(e);
            }
        }
    }
    console.log();
    if (missingFiles.length === 0) {
        console.log("Congratulations! No missing files found.");
    } else {
        const out = missingFiles.map(mf => `${mf.system} - ${mf.filePath}`);
        console.log(out);
        if (shouldExport) {
            console.log("Exporting result to file ./output/missingFiles.txt");
            await writeListToFile("missingFiles", out);
        }
    }
}

listMissingFiles();
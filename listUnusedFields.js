const { getIniFiles, printProgress, padNum, getSystemFiles, writeListToFile, getCommonArgs } = require('./functions');
const fs = require('fs').promises;
const prompt = require("prompt-sync")({ sigint: true });

const {
    shouldExport,
    shouldDelete,
    excludeSystems
} = getCommonArgs();

async function getFields() {
    const asteroidFields = await getIniFiles("../DATA/SOLAR/ASTEROIDS");
    console.log(`Got ${asteroidFields.length} asteroid field files.`);
    const nebulas = await getIniFiles("../DATA/SOLAR/NEBULA");
    console.log(`Got ${nebulas.length} nebula files.`);
    return [...asteroidFields, ...nebulas];
}

async function listUnusedFields() {
    const fields = await getFields();
    const fieldFileNames = fields.map(path => path.split("/").slice(-1).pop());
    excludeSystems.push("iw09");
    const systemFiles = await getSystemFiles(excludeSystems);
    const fieldOccurences = {};
    for ([systemIdx, file] of systemFiles.entries()) {
        const systemText = await fs.readFile(file, "utf-8");
        for ([fieldIdx, field] of fieldFileNames.entries()) {
            if (!excludeSystems.some(s => field.toLocaleLowerCase().includes(s.toLocaleLowerCase()))) {
                if (!fieldOccurences[field]) {
                    fieldOccurences[field] = {
                        path: fields[fieldIdx],
                        occurences: 0
                    };
                }
                printProgress(`scanning system ${padNum(systemIdx + 1, 3)}/${systemFiles.length} for field ${padNum(fieldIdx + 1, 3)}/${fields.length}`);
                if (systemText.toLocaleLowerCase().includes(field.toLocaleLowerCase())) {
                    fieldOccurences[field].occurences++;
                }
            }
        }
    }

    const badFields =
        Object.values(fieldOccurences)
            .filter(occ =>
                occ.occurences === 0
                && !occ.path.toLocaleLowerCase().includes("shape")
                && !occ.path.toLocaleLowerCase().includes("dsy_")
                && !occ.path.toLocaleLowerCase().includes("nomad.ini")
            ).map(occ => occ.path);

    console.log();
    console.log(badFields);
    if (shouldExport) {
        console.log("Exporting result to file ./output/unusedFields.txt");
        await writeListToFile("unusedFields", badFields);
    }
    if (shouldDelete) {
        const response = prompt("About to replace content of unused field files with ;, this is irreversible. Are you sure? (y/n) ");
        if (response.toLocaleLowerCase() === "y") {
            for (field of badFields) {
                //await fs.unlink(field);
                //console.log(`DELETED: ${field}`);

                // Asked by devs to replace content with ; instead
                await fs.writeFile(field, ";", "utf-8");
                console.log(`SMASHED ${field} WITH A BIG LUMP OF ;`);
            }
        }
    }
}

listUnusedFields();
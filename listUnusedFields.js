const { getIniFiles, printProgress, padNum, getSystemFiles, writeListToFile } = require('./functions');
const fs = require('fs').promises;
const prompt = require("prompt-sync")({ sigint: true });

const args = process.argv.slice(2);
const shouldExport = args.includes("--E");
const shouldDelete = args.includes("--D");

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
    const systemFiles = await getSystemFiles(args);
    const fieldOccurences = {};
    for ([systemIdx, file] of systemFiles.entries()) {
        const systemText = await fs.readFile(file, "utf-8");
        for ([fieldIdx, field] of fieldFileNames.entries()) {
            if (!fieldOccurences[field]) {
                fieldOccurences[field] = {
                    path: fields[fieldIdx],
                    occurences: 0
                };
            }
            printProgress(`scanning system ${padNum(systemIdx+1, 3)}/${systemFiles.length} for field ${padNum(fieldIdx+1, 3)}/${fields.length}`);
            if (systemText.toLocaleLowerCase().includes(field.toLocaleLowerCase())) {
                fieldOccurences[field].occurences++;
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
        const response = prompt("About to delete unused field files, this is irreversible. Are you sure? (y/n) ");
        if (response.toLocaleLowerCase() === "y") {
            for (field of badFields) {
                await fs.unlink(field);
                console.log(`DELETED: ${field}`);
            }
        }
    }
}

listUnusedFields();
const { getIniFiles, printProgress, padNum } = require('./utils');
const fs = require('fs').promises;

const args = process.argv.slice(2);

async function getFields() {
    const asteroidFields = await getIniFiles("../DATA/SOLAR/ASTEROIDS");
    console.log(`Got ${asteroidFields.length} asteroid field files.`);
    const nebulas = await getIniFiles("../DATA/SOLAR/NEBULA");
    console.log(`Got ${nebulas.length} nebula files.`);
    return [...asteroidFields, ...nebulas].map(path => path.split("/").slice(-1).pop());
}

async function listUnusedFields() {
    const fields = await getFields();
    let systemFiles = await getIniFiles("../DATA/UNIVERSE/SYSTEMS/*");
    let exclude = [];
    if (args[0] === "--exclude") {
        exclude = args.slice(1);
        systemFiles = systemFiles.filter(file => !exclude.some(sys => file.toLocaleLowerCase().includes(sys.toLocaleLowerCase())))
    }
    console.log(`Got ${systemFiles.length} system files, excluded ${exclude.length} file(s). Scanning for bad fields...`);
    const badFields = new Set();
    for ([systemIdx, file] of systemFiles.entries()) {
        const systemText = await fs.readFile(file, "utf-8");
        let hasField = true;
        for ([fieldIdx, field] of fields.entries()) {
            printProgress(`scanning system ${padNum(systemIdx+1, 3)}/${systemFiles.length} for field ${padNum(fieldIdx+1, 3)}/${fields.length}`);
            if (!systemText.toLocaleLowerCase().includes(field.toLocaleLowerCase())) {
                hasField = false;
            }
        }
        if (!hasField) {
            badFields.add(field)
        }

    }
    console.log();
    console.log([...badFields]);
}

listUnusedFields();
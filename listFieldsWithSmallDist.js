const { getCommonArgs, getIniFiles, getSectionsFromIni, printProgress, padNum } = require("./functions");

const { shouldExport } = getCommonArgs();

const argIdx = process.argv.indexOf("--dist");
const fillDist = argIdx[argIdx+1] ?? 1600;

async function getFields() {
    const asteroidFields = await getIniFiles("../DATA/SOLAR/ASTEROIDS");
    console.log(`Got ${asteroidFields.length} asteroid field files.`);
    return asteroidFields;
}

async function listFieldsWithSmallDist() {
    const fieldFiles = await getFields();
    const smolFields = [];
    for ([file, fileIdx] of fieldFiles.entries()) {
        printProgress(`Checking field ${padNum(fileIdx+1, 3)}/${fieldFiles.length} for fill_dist <= 1400...`);
        const fieldSection = (await getSectionsFromIni(file, "Field"))[0];
        if (fieldSection.fill_dist <= fillDist) {
            smolFields.push(file);
        }
    }
    console.log();
    console.log(smolFields);
    if (shouldExport) {
        console.log("Exporting result to file ./output/unusedFields.txt");
        await writeListToFile("fieldsWithSmallDist", smolFields);
    }
}

listFieldsWithSmallDist();
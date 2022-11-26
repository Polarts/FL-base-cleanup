const { getCommonArgs, getSystemFiles, printProgress, padNum, getSectionsFromIni, writeListToFile } = require("./functions");

const {
    shouldExport,
    excludeSystems
} = getCommonArgs()

async function listInvisibleBases() {
    excludeSystems.push("iw09");
    const systems = await getSystemFiles(excludeSystems);
    const invisibleBases = [];
    for ([systemIdx, system] of systems.entries()) {
        const bases = (await getSectionsFromIni(system, "Object")).filter(obj => "base" in obj);
        if (bases.length) {
            for ([baseIdx, base] of bases.entries()) {
                printProgress(`Scanning system ${padNum(systemIdx + 1, 3)}/${padNum(systems.length, 3)} - base ${padNum(baseIdx + 1, 3)}/${padNum(bases.length, 3)}...`);
                if (base.archetype.toLocaleLowerCase() === "invisible_base" && !base.nickname.toLocaleLowerCase().includes("_proxy")) {
                    invisibleBases.push({
                        system,
                        base: base.nickname
                    });
                }
            }
        }
    }
    console.log();
    const out = invisibleBases.map(b => `${b.system} - ${b.base}`);
    console.log(out);
    if (shouldExport) {
        console.log("Exporting result to file ./output/invisibleBases.txt");
        await writeListToFile("invisibleBases", out);
    }
}

listInvisibleBases();
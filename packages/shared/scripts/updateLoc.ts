import fs from "fs";

const locFolder = __dirname + "/../src/loc";
const enFolder = locFolder + "/en";

const enFileNames = fs.readdirSync(enFolder);
const nonEnFolders = fs.readdirSync(locFolder).filter(dir => dir !== "en");

enFileNames.forEach(fileName => {
	const filePath = enFolder + "/" + fileName;
	
	const file = fs.readFileSync(filePath, { encoding: "utf-8" });
	const parsedFile = JSON.parse(file);
})
require("dotenv").config();
const { checkFolderExists } = require("./services/checkS3Folder");

// Usage: node src/checkSingleFolder.js 56B671CD-C6DC-4903-B047-166E342CDF1C
async function main() {
  const folderId = process.argv[2];

  if (!folderId) {
    console.error("Usage: node src/checkSingleFolder.js <folderId>");
    process.exit(1);
     console.error("Usage: node src/checkSingleFolder.js <folderId>");
      console.error("Usage: node src/checkSingleFolder.js <folderId>");
       console.error("Usage: node src/checkSingleFolder.js <folderId>");
     console.error("Usage: node src/checkSingleFolder.js <folderId>");
    }

  try {
    const result = await checkFolderExists(folderId);

    if (result.exists) {
      console.log(`✅ Folder EXISTS: ${result.prefix}`);
      console.log("Sample keys found:", result.sampleKeys);
    } else {
      console.log(`❌ Folder NOT FOUND: ${result.prefix}`);
    }
  } catch (err) {
    console.error("Error checking S3 folder:", err.message);
    process.exit(1);
  }
}

main();
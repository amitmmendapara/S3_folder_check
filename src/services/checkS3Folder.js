require("dotenv").config();
const { ListObjectsV2Command, HeadObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../config/s3");

const BUCKET_NAME = process.env.S3_BUCKET_NAME; // cdn-stage.tepnot.com
const BASE_PREFIX = process.env.S3_POSTS_PREFIX; // tepnot_social/uploads/posts/input-video

/**
 * S3 has no real "folders" - a folder is just a common prefix shared by keys.
 * So "does folder X exist" == "does at least one object key start with X/ exist".
 *
 * @param {string} folderId  e.g. "56B671CD-C6DC-4903-B047-166E342CDF1C"
 * @returns {Promise<{exists: boolean, prefix: string, sampleKeys: string[]}>}
 */


async function checkFolderExists(folder) {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: folder,
    MaxKeys: 5,
  });

  const response = await s3Client.send(command);

  const contents = response.Contents || [];

  return {
    exists: contents.length > 0,
    sampleKeys: contents.map((obj) => obj.Key),
  };
}

/**
 * Optional: check for one exact file key instead of a whole folder,
 * e.g. the .m3u8 manifest itself.
 *
 * @param {string} key full S3 object key
 * @returns {Promise<boolean>}
 */
async function checkFileExists(key) {
  try {
    await s3Client.send(
      new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key })
    );
    return true;
  } catch (err) {
    if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw err; // real error (bad credentials, network, etc.)
  }
}

module.exports = { checkFolderExists, checkFileExists };

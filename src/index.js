// require("dotenv").config();

// const { connectDB, closeDB } = require("./config/db");
// const { checkFolderExists } = require("./services/checkS3Folder");
// const PostMedia = require("./models/postMedia.model");
// const UserPost = require("./models/userPost.model");
// const { qdrantPostCollection } = require("./config/QdrantConnection");

// async function main() {
//   try {
//     await connectDB();

//     const sixMonthsAgo = new Date();
//     sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

//     const startDate = new Date("2026-07-15T00:00:00.000Z");
//     const endDate = new Date("2026-07-20T23:59:59.999Z");

//     const posts = await PostMedia.find(
//       {
//         type: "video",
//         isRemove: false,
//         createdAt: { $gte: sixMonthsAgo },
//         url: { $exists: true, $ne: null },
//       },
//       {
//         _id: 1,
//         postId: 1,
//         url: 1,
//       }
//     )
//       .populate({
//         path: "postId",
//         select: "_id shareCode",
//       })
//       // Remove limit() when running for all records
//       .limit(500)
//       .lean();

//     console.log(`Found ${posts.length} post(s)\n`);

//     const results = {
//       exists: [],
//       missing: [],
//       errors: [],
//     };

//     for (const post of posts) {
//       try {
//         if (!post.url) continue;

//         const folder = post.url.substring(0, post.url.lastIndexOf("/") + 1);
//         console.log("postIdpostIdpostId", post.postId);
//         console.log(`Checking: ${folder}`);

//         const { exists, sampleKeys } = await checkFolderExists(folder);

//         if (exists) {
//           results.exists.push({
//             postMediaId: post._id,
//             userPostId: post.postId?._id,
//             shareCode: post.postId?.shareCode,
//             folder,
//           });

//           console.log(`✅ EXISTS`);

//           if (sampleKeys.length) {
//             console.log("Sample S3 Objects:");
//             sampleKeys.forEach((key) => console.log(`   - ${key}`));
//           }
//         } else {
//           results.missing.push({
//             postMediaId: post._id,
//             userPostId: post.postId?._id,
//             shareCode: post.postId?.shareCode,
//             folder,
//           });

//           console.log(`❌ MISSING`);
//         }

//         console.log("--------------------------------------------");
//       } catch (err) {
//         results.errors.push({
//           postMediaId: post._id,
//           error: err.message,
//         });

//         console.error(`❌ Error checking ${post._id}:`, err.message);
//       }
//     }

//     // ==========================================================
//     // UPDATE MONGO + QDRANT
//     // ==========================================================

//     // if (results.missing.length > 0) {
//     //   console.log("\n=======================================");
//     //   console.log("POSTS TO BE MARKED AS REMOVED");
//     //   console.log("=======================================");

//     //   results.missing.forEach((item, index) => {
//     //     console.log(
//     //       `${index + 1}. PostId: ${item.userPostId} | ShareCode: ${item.shareCode
//     //       }`
//     //     );
//     //     console.log(`   Folder: ${item.folder}`);
//     //   });

//     //   const postMediaIds = results.missing.map((x) => x.postMediaId);
//     //   const userPostIds = results.missing.map((x) => x.userPostId);

//     //   // ---------------- Mongo Update ----------------

//     //   const postMediaResult = await PostMedia.updateMany(
//     //     {
//     //       _id: { $in: postMediaIds },
//     //     },
//     //     {
//     //       $set: {
//     //         isRemove: true,
//     //         updatedAt: new Date(),
//     //       },
//     //     }
//     //   );

//     //   const userPostResult = await UserPost.updateMany(
//     //     {
//     //       _id: { $in: userPostIds },
//     //     },
//     //     {
//     //       $set: {
//     //         isRemove: true,
//     //         updatedAt: new Date(),
//     //       },
//     //     }
//     //   );

//     //   console.log("\n=======================================");
//     //   console.log("MONGODB UPDATE");
//     //   console.log("=======================================");
//     //   console.log(`PostMedia Updated : ${postMediaResult.modifiedCount}`);
//     //   console.log(`UserPost Updated  : ${userPostResult.modifiedCount}`);

//     //   console.log("\nMongoDB Updated Records:");

//     //   results.missing.forEach((item, index) => {
//     //     console.log(
//     //       `${index + 1}. ✅ PostId: ${item.userPostId} | ShareCode: ${item.shareCode
//     //       }`
//     //     );
//     //   });

//     //   // ---------------- Qdrant Update ----------------

//     //   console.log("\n=======================================");
//     //   console.log("QDRANT UPDATE");
//     //   console.log("=======================================");

//     //   let qdrantUpdated = 0;

//     //   for (const item of results.missing) {
//     //     if (!item.shareCode) {
//     //       console.log(
//     //         `⚠️ Skipped Qdrant | PostId: ${item.userPostId} | ShareCode missing`
//     //       );
//     //       continue;
//     //     }

//     //     try {
//     //       await qdrantPostCollection.post("/points/payload", {
//     //         filter: {
//     //           must: [
//     //             {
//     //               key: "shareCode",
//     //               match: {
//     //                 value: item.shareCode,
//     //               },
//     //             },
//     //           ],
//     //         },
//     //         payload: {
//     //           isRemove: true,
//     //         },
//     //       });

//     //       qdrantUpdated++;

//     //       console.log(
//     //         `✅ Qdrant Updated | PostId: ${item.userPostId} | ShareCode: ${item.shareCode}`
//     //       );
//     //     } catch (err) {
//     //       console.error(
//     //         `❌ Qdrant Failed | PostId: ${item.userPostId} | ShareCode: ${item.shareCode}`
//     //       );

//     //       console.error(err.response?.data || err.message);
//     //     }
//     //   }

//     //   console.log(`\nQdrant Updated Count : ${qdrantUpdated}`);
//     // }

//     console.log("\n=======================================");
//     console.log("SUMMARY");
//     console.log("=======================================");
//     console.log(`Total Checked : ${posts.length}`);
//     console.log(`Exists in S3  : ${results.exists.length}`);
//     console.log(`Missing in S3 : ${results.missing.length}`);
//     console.log(`Errors        : ${results.errors.length}`);

// console.log("\n=======================================");
// console.log("MISSING FOLDERS");
// console.log("=======================================");

//     if (results.missing.length === 0) {
//       console.log("🎉 No missing folders found.");
//     } else {
//       results.missing.forEach((item, index) => {
//         console.log(
//           `${index + 1}. PostId: ${item.userPostId} | ShareCode: ${item.shareCode
//           }`
//         );
//         console.log(`   Folder: ${item.folder}`);
//       });
//     }

//     if (results.errors.length) {
//       console.log("\n=======================================");
//       console.log("ERRORS");
//       console.log("=======================================");

//       results.errors.forEach((item) => {
//         console.log(`${item.postMediaId} -> ${item.error}`);
//       });
//     }
//   } catch (err) {
//     console.error("Fatal Error:", err);
//   } finally {
//     await closeDB();
//   }
// }

// main();




require("dotenv").config();

const { connectDB, closeDB } = require("./config/db");
const { checkFolderExists } = require("./services/checkS3Folder");
const PostMedia = require("./models/postMedia.model");
const UserPost = require("./models/userPost.model");
const { qdrantPostCollection } = require("./config/QdrantConnection");

const CHUNK_SIZE = 100; // Change as needed

async function processBatch(posts) {
  console.log(`\n=======================================`);
  console.log(`Processing Batch (${posts.length} records)`);
  console.log(`=======================================`);

  const results = {
    exists: [],
    missing: [],
    errors: [],
  };

  // -----------------------------
  // Check S3
  // -----------------------------

  for (const post of posts) {
    try {
      if (!post.url) continue;

      const folder = post.url.substring(
        0,
        post.url.lastIndexOf("/") + 1
      );

      console.log("============================================");
      console.log(`PostMediaId : ${post._id}`);
      console.log(`PostId      : ${post.postId?._id}`);
      console.log(`ShareCode   : ${post.postId?.shareCode}`);
      console.log(`Folder      : ${folder}`);

      const { exists, sampleKeys } = await checkFolderExists(folder);

      if (exists) {
        results.exists.push({
          postMediaId: post._id,
          userPostId: post.postId?._id,
          shareCode: post.postId?.shareCode,
          folder,
        });

        console.log("✅ EXISTS");

        // if (sampleKeys.length) {
        //   console.log("Sample S3 Objects:");
        //   sampleKeys.forEach((key) => console.log(`   - ${key}`));
        // }
      } else {
        results.missing.push({
          postMediaId: post._id,
          userPostId: post.postId?._id,
          shareCode: post.postId?.shareCode,
          folder,
        });

        console.log("❌ MISSING");
      }

      console.log("--------------------------------------------");
    } catch (err) {
      results.errors.push({
        postMediaId: post._id,
        error: err.message,
      });

      console.error(`❌ Error checking ${post._id}:`, err.message);
      console.log("--------------------------------------------");
    }
  }

  // -----------------------------
  // Mongo Update
  // -----------------------------

  if (results.missing.length) {
    console.log("\n=======================================");
    console.log("POSTS TO BE MARKED AS REMOVED");
    console.log("=======================================");

    results.missing.forEach((item, index) => {
      console.log(
        `${index + 1}. PostId: ${item.userPostId} | ShareCode: ${item.shareCode}`
      );
      console.log(`   Folder: ${item.folder}`);
    });

    const postMediaIds = results.missing.map((x) => x.postMediaId);

    const userPostIds = results.missing
      .map((x) => x.userPostId)
      .filter(Boolean);

    console.log("\n=======================================");
    console.log("MONGODB UPDATE");
    console.log("=======================================");
    console.log(`Updating ${postMediaIds.length} PostMedia records...`);
    console.log(`Updating ${userPostIds.length} UserPost records...`);

    const postMediaResult = await PostMedia.updateMany(
      {
        _id: { $in: postMediaIds },
      },
      {
        $set: {
          isRemove: true,
          isRecover: false,
          updatedAt: new Date(),
        },
      }
    );

    const userPostResult = await UserPost.updateMany(
      {
        _id: { $in: userPostIds },
      },
      {
        $set: {
          isRemove: true,
          updatedAt: new Date(),
        },
      }
    );

    console.log("\nMongoDB Update Completed");
    console.log("---------------------------------------");
    console.log(`PostMedia Updated : ${postMediaResult.modifiedCount}`);
    console.log(`UserPost Updated  : ${userPostResult.modifiedCount}`);

    console.log("\nUpdated Mongo Records:");

    results.missing.forEach((item, index) => {
      console.log(
        `${index + 1}. ✅ PostId: ${item.userPostId} | ShareCode: ${item.shareCode}`
      );
    });

    // -----------------------------
    // Qdrant Update
    // -----------------------------

    console.log("\n=======================================");
    console.log("QDRANT UPDATE");
    console.log("=======================================");

    let qdrantUpdated = 0;

    for (const item of results.missing) {
      if (!item.shareCode) {
        console.log(
          `⚠️ Skipped Qdrant | PostId: ${item.userPostId} | ShareCode missing`
        );
        continue;
      }

      try {
        console.log(
          `Updating Qdrant | PostId: ${item.userPostId} | ShareCode: ${item.shareCode}`
        );

        await qdrantPostCollection.post("/points/payload", {
          filter: {
            must: [
              {
                key: "shareCode",
                match: {
                  value: item.shareCode,
                },
              },
            ],
          },
          payload: {
            isRemove: true,
          },
        });

        qdrantUpdated++;

        console.log(
          `✅ Qdrant Updated | PostId: ${item.userPostId} | ShareCode: ${item.shareCode}`
        );
      } catch (err) {
        console.error(
          `❌ Qdrant Failed | PostId: ${item.userPostId} | ShareCode: ${item.shareCode}`
        );

        console.error(err.response?.data || err.message);
      }
    }

    console.log("---------------------------------------");
    console.log(`Qdrant Updated Count : ${qdrantUpdated}`);
    console.log("=======================================");
  } else {
    console.log("\n✅ No missing folders found in this batch.");
  }

  // -----------------------------
  // Print Missing Folders
  // -----------------------------

  console.log("\n=======================================");
  console.log("MISSING FOLDERS");
  console.log("=======================================");

  if (results.missing.length === 0) {
    console.log("🎉 No missing folders found in this batch.");
  } else {
    results.missing.forEach((item, index) => {
      console.log(
        `${index + 1}. PostId: ${item.userPostId} | ShareCode: ${item.shareCode}`
      );
      console.log(`   Folder: ${item.folder}`);
    });
  }

  if (results.errors.length) {
    console.log("\n=======================================");
    console.log("ERRORS");
    console.log("=======================================");

    results.errors.forEach((item) => {
      console.log(`${item.postMediaId} -> ${item.error}`);
    });
  }

  console.log(
    `Batch Completed -> Checked:${posts.length} Exists:${results.exists.length} Missing:${results.missing.length} Errors:${results.errors.length}`
  );

  return results;
}

async function main() {
  try {
    await connectDB();

    const startDate = new Date("2025-10-21T00:00:00.000Z");
    const endDate = new Date("2025-10-25T23:59:59.999Z");

    let lastId = null;

    let totalChecked = 0;
    let totalExists = 0;
    let totalMissing = 0;
    let totalErrors = 0;

    while (true) {
      const query = {
        type: "video",
        isRemove: false,
        //postId: "68d032c9c537e1cab971d37d",
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
        url: {
          $exists: true,
          $ne: null,
        },
      };

      if (lastId) {
        query._id = {
          $gt: lastId,
        };
      }

      const posts = await PostMedia.find(
        query,
        {
          _id: 1,
          postId: 1,
          url: 1,
        }
      )
        .sort({ _id: 1 })
        .limit(CHUNK_SIZE)
        .populate({
          path: "postId",
          select: "_id shareCode",
        })
        .lean();

      if (!posts.length) {
        console.log("\nNo more records found.");
        break;
      }

      console.log(
        `\nFetched ${posts.length} records (LastId: ${posts[posts.length - 1]._id})`
      );

      const result = await processBatch(posts);

      totalChecked += posts.length;
      totalExists += result.exists.length;
      totalMissing += result.missing.length;
      totalErrors += result.errors.length;

      lastId = posts[posts.length - 1]._id;

      console.log("\nRunning Summary");
      console.log("--------------------------------");
      console.log(`Checked : ${totalChecked}`);
      console.log(`Exists  : ${totalExists}`);
      console.log(`Missing : ${totalMissing}`);
      console.log(`Errors  : ${totalErrors}`);
      console.log("--------------------------------");
    }

    console.log("\n=======================================");
    console.log("FINAL SUMMARY");
    console.log("=======================================");
    console.log(`Total Checked : ${totalChecked}`);
    console.log(`Exists in S3  : ${totalExists}`);
    console.log(`Missing in S3 : ${totalMissing}`);
    console.log(`Errors        : ${totalErrors}`);
    console.log("=======================================");
  } catch (err) {
    console.error("Fatal Error:", err);
  } finally {
    await closeDB();
  }
}

main();
const mongoose = require("mongoose");
const userPostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user.social', // replace 'User' with your actual user model name if different
        required: true
    },
    caption: {
        type: String,
        default: ""
    },
    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public"
    },
    location: {
        longitude: { type: Number },
        latitude: { type: Number },
        name: { type: String },
    },
    tags: {
        type: [String],
        default: []
    },
    type: {
        type: String,
        // enum: ["shots", "post", "shop"],
        enum: ["shots", "post"],
        default: "post"
    },
    mentions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user.social'
        }
    ],
    likesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    shareCount: {
        type: Number,
        default: 0
    },
    repostCount: {
        type: Number,
        default: 0
    },
    isLikeCountShow: {
        type: Boolean,
        default: true
    },
    isCommentShow: {
        type: Boolean,
        default: true
    },
    isShareCountShow: {
        type: Boolean,
        default: true
    },
    isRepostCountShow: {
        type: Boolean,
        default: true
    },
    shareCode: {
        type: String,
        require: true
    },
    isRemove: {
        type: Boolean,
        default: false
    },
    isReviewed: {
        type: Boolean,
        default: false
    },
    isSensitive: {
        type: Boolean,
        default: false
    },
    viewCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isPin: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    isVisible: {
        type: Boolean,
        default: true
    },
    musicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post.music', // replace 'User' with your actual user model name if different
        required: false
    },
    musicDetails: {
        musicUrl: { type: String, default: "" },
        musicName: { type: String, default: "" },
        musicStartTime: { type: Number, default: 0 },
        musicPlaySecond: { type: Number, default: 0 },
        musicThumb: { type: String, default: "" }
    },
    isNeedChangeDate: {
        type: Boolean,
        default: false
    },
    isDefected: {
        type: Boolean,
        default: false
    },
    isCollaboration: {
        type: Boolean,
        default: false, // true if this post has active collaborators
    },
    collabrationCount: {
        type: Number,
        default: 0
    },
    productId: {
        type: Number,
        required: false
    },
    productIds: {
        type: String,
        required: false
    },
    isAiGenerated: {
        type: Boolean,
        required: false,
    },
    vendorId: {
        type: Number,
        required: false
    },
    dailyPostNumber: {
        type: Number,
        default: 1,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
userPostSchema.index({ userId: 1 });
// userPostSchema.post("save", async function (doc) {
//   try {
//     const index = client.index("post");
//     console.log("indexindexindexindex",doc);
//     await client.createIndex("post", { primaryKey: "id" });
//     await index.addDocuments([{
//       id: doc._id.toString(),
//       userId: doc.userId.toString(),
//       createdAt:doc.createdAt,
//       shareCode:doc.shareCode,
//       caption: doc.caption,
//       type:doc.type,
//       visibility:doc.visibility
//     }]);
//     console.log("✅ Post added to Meilisearch:", doc._id);
//   } catch (err) {
//     console.error("❌ Error adding post to Meilisearch:", err);
//   }
// });
// userPostSchema.post("updateMany", async function (res) {
//     try {
//         const filter = this.getFilter();   // which docs were updated

//         // Re-fetch updated docs
//         const docs = await this.model.find(filter).lean();

//         if (!docs.length) return;

//         const index = client.index("post");

//         const updatedDocs = docs.map(doc => ({
//             id: doc._id.toString(),
//             userId: doc.userId.toString(),
//             createdAt: doc.createdAt,
//             caption: doc.caption,
//             shareCode: doc.shareCode,
//             type: doc.type,
//             visibility: doc.visibility,
//         }));

//         await index.addDocuments(updatedDocs);
//         console.log(`♻️ Synced ${docs.length} posts to Meilisearch`);
//     } catch (err) {
//         console.error("❌ Error syncing Meilisearch (updateMany):", err);
//     }
// });
// userPostSchema.post(["findOneAndUpdate", "updateOne"], async function (doc) {
//     try {
//         const index = client.index("post");
//         const update = this.getUpdate();
//         const updatedFields = update?.$set || update || {};

//         // ⚡ Check if isRemove was set to true
//         if (updatedFields.isRemove === true) {
//             const filter = this.getFilter(); // which doc(s) were updated
//             const post = await this.model.findOne(filter).lean();

//             if (post) {
//                 await index.deleteDocument(post._id.toString());
//                 console.log("🗑️ Post removed from Meilisearch:", post._id);
//             }
//             return;
//         }
//         if (updatedFields.isArchived === true) {
//             const filter = this.getFilter(); // which doc(s) were updated
//             const post = await this.model.findOne(filter).lean();

//             if (post) {
//                 await index.deleteDocument(post._id.toString());
//                 console.log("🗑️ Post removed from Meilisearch:", post._id);
//             }
//         }
//         if (updatedFields.isArchived === false) {
//             const filter = this.getFilter(); // which doc(s) were updated
//             const post = await this.model.findOne(filter).lean();

//             if (post) {
//                 await index.addDocuments([{
//                     id: post._id.toString(),
//                     createdAt: post.createdAt,
//                     shareCode: post.shareCode,
//                     userId: post.userId.toString(),
//                     caption: post.caption,
//                     type: post.type,
//                     visibility: post.visibility
//                 }]);
//                 console.log("✅ Post added to Meilisearch:", post._id);
//             }
//         }
//     } catch (err) {
//         console.error("❌ Error syncing Meilisearch:", err);
//     }
// });



const UserPost = mongoose.model("user.post", userPostSchema);
module.exports = UserPost;

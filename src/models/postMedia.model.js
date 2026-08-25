const mongoose = require("mongoose");

const PostMediaSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user.post',
        required: true
    },
    url: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        enum: ["image", "video"],
        default: ""
    },
    thumbnail: {
        type: String,
        default: ""
    },
    aspectRatio: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        default: ""
    },
    peopleTags: {
        type: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "user.social",
                    required: true
                },
                x: { type: Number, required: true },     // 0–1
                y: { type: Number, required: true },     // 0–1
                width: { type: Number, required: true }, // 0–1
                height: { type: Number, required: true } // 0–1
            }
        ],
        default: [] // 👈 ensures empty array allowed
    },
    isRemove: {
        type: Boolean,
        default: false
    },
    isRecover: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});
PostMediaSchema.index({ postId: 1 });
const PostMedia = mongoose.model("post.media", PostMediaSchema);
module.exports = PostMedia;

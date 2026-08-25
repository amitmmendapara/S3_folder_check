# s3-folder-check

Small Node.js project to check whether a "folder" (S3 key prefix) exists in an S3 bucket,
for post/video folder IDs stored in MongoDB.

Built for paths like:
```
tepnot_social/uploads/posts/input-video/<folderId>/<folderId>.m3u8
```

## Setup

```bash
npm install
cp .env.example .env
# then edit .env with your real Mongo URI and AWS/S3 credentials
```

## How it works

S3 doesn't have real folders — a "folder" is just objects sharing a common key prefix.
So checking "does folder X exist" is done via `ListObjectsV2Command` with
`Prefix: "<basePrefix>/<folderId>/"` and `MaxKeys: 1-5`. If any object is returned, the
folder exists.

See `src/services/checkS3Folder.js` — that's the core logic, everything else is just
wiring (Mongo connection + CLI).

## Usage

### 1. Check a single folder ID directly (no MongoDB needed)

```bash
node src/checkSingleFolder.js 56B671CD-C6DC-4903-B047-166E342CDF1C
```

### 2. Check all folder IDs pulled from MongoDB

Edit `src/index.js` and set `FOLDER_ID_FIELD` to whatever field name your `posts`
collection actually uses to store the folder/video id (default assumed: `folderId`).

```bash
node src/index.js
# or
npm start
```

This will:
1. Connect to MongoDB (`src/config/db.js`)
2. Read all posts that have a folder id field
3. For each one, check S3 for a matching object prefix (`src/services/checkS3Folder.js`)
4. Print a per-post result plus a summary (existing / missing / errors)

## Swapping in your own connections

You said you'll just swap in your own MongoDB connection and S3 client/pool — that's
exactly what these two files are for, replace their contents/exports with your existing
setup and the rest of the project keeps working unchanged:

- `src/config/db.js` → replace with your existing MongoDB/mongoose connection
- `src/config/s3.js` → replace with your existing S3 client/pool instance

## Project structure

```
s3-folder-check/
├── package.json
├── .env.example
└── src/
    ├── config/
    │   ├── db.js          # MongoDB connection (swap this out)
    │   └── s3.js          # S3 client (swap this out)
    ├── services/
    │   └── checkS3Folder.js  # core "does folder exist" logic
    ├── checkSingleFolder.js  # CLI: check one folder id
    └── index.js              # main: check all folder ids from MongoDB
```
# S3_folder_check

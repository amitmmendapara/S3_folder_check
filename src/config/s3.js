// require("dotenv").config();
// const { S3Client } = require("@aws-sdk/client-s3");

// /**
//  * Single shared S3 client instance.
//  * If you already have your own S3 "pool"/client setup elsewhere in your app,
//  * just replace this file's export with that existing client instance.
//  */
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// module.exports = s3Client;


const { S3Client } = require("@aws-sdk/client-s3");
const { fromCognitoIdentityPool } = require("@aws-sdk/credential-provider-cognito-identity");

require("dotenv").config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: process.env.AWS_REGION },
    identityPoolId: process.env.AWS_COGNITO_IDENTITY_POOL_ID,
  }),
});

module.exports = s3;
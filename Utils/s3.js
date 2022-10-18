const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config({ path: "./config/Secrets.env" });
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

exports.uploadFile = (fileBuffer, fileName, mimetype) => {
  
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype,
  };
  

  return s3Client.send(new PutObjectCommand(uploadParams));
};

exports.deleteFile = (fileName) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  return s3Client.send(new DeleteObjectCommand(deleteParams));
};

exports.getObjectSignedUrl = async (key) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  const command = new GetObjectCommand(params);
  const seconds = 86400;
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });

  return url;
};
// https://mksrace.s3.us-west-1.amazonaws.com/Ads/30f5ede95907fb6ea615dad54186b58945664c268bcdb13c8f89f34caf26258d?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA4EQSQS5BJLB5APGG%2F20221013%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Date=20221013T162807Z&X-Amz-Expires=900&X-Amz-Signature=3cf16275df782931d83ad8f3b7900bf89e94618aa4efd394ee45cdf178247925&X-Amz-SignedHeaders=host&x-id=GetObject
// "https://mksrace.s3.us-west-1.amazonaws.com/Ads/30f5ede95907fb6ea615dad54186b58945664c268bcdb13c8f89f34caf26258d?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA4EQSQS5BJLB5APGG%2F20221013%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Date=20221013T162832Z&X-Amz-Expires=86400&X-Amz-Signature=3b29d08d85856d80076adb07772f04d5f5e761451dd3eff59bdc57c7f758e5e2&X-Amz-SignedHeaders=host&x-id=GetObject
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_END_POINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadToR2(bucket, key, file) {
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: "public-read",
    }),
  );

  // return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
  return `localhost:300/${key}`;
}

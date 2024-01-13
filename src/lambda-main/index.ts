import { S3Event, SNSMessage, SQSEvent } from "aws-lambda";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client();

export const handler = async (event: SQSEvent) => {
  const bodySQS = event.Records[0].body;
  const bodySQSParsed = JSON.parse(bodySQS) as SNSMessage;
  const bodySNS = bodySQSParsed.Message;
  const bodySNSParsed = JSON.parse(bodySNS) as S3Event;

  const bucketName = bodySNSParsed.Records[0].s3.bucket.name;
  const objectKey = bodySNSParsed.Records[0].s3.object.key;

  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    })
  );

  const body = await response.Body?.transformToString();
  console.log(
    `File ${objectKey}, was upload to ${bucketName} with this body: ${body}`
  );
};

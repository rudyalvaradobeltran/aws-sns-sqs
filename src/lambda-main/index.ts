import { S3Event } from "aws-lambda";

export const handler = (event: S3Event) => {
  console.log("Event", JSON.stringify(event, null, 2));
}
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { APIGatewayProxyHandler } from "aws-lambda";

const sns = new SNSClient();

export const handler:APIGatewayProxyHandler = async (event, _context) => {
  const message = event.queryStringParameters?.message || "empty"

  const command = new PublishCommand({
    TopicArn: process.env.TOPIC_ARN,
    Message: message,
  });

  return sns.send(command)
    .then(data => {
      return {
        statusCode: 200,
        body: `Marco "${message}" (sent ${data.MessageId})`
      }
    })
    .catch(e => {
      return {
        statusCode: 500,
        body: JSON.stringify(e),
      }
    })
};

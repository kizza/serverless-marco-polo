import { CloudWatchLogsClient, FilteredLogEvent, FilterLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";

const cloudWatchLogsClient = new CloudWatchLogsClient({ region: 'us-east-1' });

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const pollCloudWatchLogs = async (
  logGroupName: string,
  filterPattern: string,
  waitTime = 30,
) => {
  const startTime = Date.now();
  let events: FilteredLogEvent[] = [];

  while ((Date.now() - startTime) < (waitTime * 1000)) {
    // console.log('🔍 Polling CloudWatch Logs...');
    const filterParams = {
      logGroupName,
      filterPattern,
      limit: 10,
      startTime: Date.now() - 3 * 60 * 1000 // Look for logs in the last 3 minutes
    };

    const command = new FilterLogEventsCommand(filterParams);
    const result = await cloudWatchLogsClient.send(command);

    if (result.events && result.events.length > 0) {
      events = result.events;
      break;
    }

    await delay(2000); // Wait 5 seconds before retrying
  }

  if (events.length === 0) throw new Error('❌ No log events found in CloudWatch.');
  return events;
};


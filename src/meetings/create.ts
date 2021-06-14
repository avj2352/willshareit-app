import { APIGatewayProxyEventV2, Context, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

async function createMeeting (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyStructuredResultV2> {
    const tableName = process.env.TABLE_NAME!;

    return {
        statusCode: 200,
        body: `Welcome to Lambda Function - Table ${tableName}`
    };
}

export {createMeeting};
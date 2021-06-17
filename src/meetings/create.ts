import { APIGatewayProxyEventV2, Context, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { SendEmailRequest } from 'aws-sdk/clients/ses';
import {v4 as uuid}  from 'uuid';


async function createMeeting (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyStructuredResultV2> {
    const tableName = process.env.TABLE_NAME!;
    const emailFrom = process.env.SES_EMAIL_FROM!;
    const ses = new AWS.SES({ region: process.env.AWS_SES_REGION!})

    const MISSING_PAYLOAD = 'Invalid request, missing payload';
    const SUCCESS_MSG = 'Email sent successfully!';
    const INTERNAL_SERVER_ERROR = 'Oops something went wrong!';

    if (!event.body) {
        return { statusCode: 400, body: MISSING_PAYLOAD };
    }

    // CREATE A MEETING - using Chime
    try {
        const {name, email, message} = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
        if (name && email && message) {

            // send email
            const params: SendEmailRequest = {
                Source: emailFrom,
                Destination: {
                    ToAddresses: [email, emailFrom]
                },
                Message: {
                    Body: {
                        Text: {
                            Data: `Dear ${name}\n Hello from Willshareit Application\n ${message}`
                        },
                    },
                    Subject: {
                        Data: 'Test Mail - willshareit app'
                    }
                }
            };
            const result = await ses.sendEmail(params).promise();
            console.log(result);
            return {
                statusCode: 201,
                body: SUCCESS_MSG
            };
        } else {
            return { 
                statusCode: 400, 
                body: MISSING_PAYLOAD 
            };
        }        
    } catch (err) {
        console.log('Error occured: ', err);
        return {
            statusCode: 500,
            body: INTERNAL_SERVER_ERROR
        }
    }
}

export {createMeeting};
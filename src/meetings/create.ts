import { APIGatewayProxyEventV2, Context, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import {v4 as uuid}  from 'uuid';


async function createMeeting (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyStructuredResultV2> {
    const tableName = process.env.TABLE_NAME!;
    const region = process.env.AWS_REGION_WEBRTC_SETUP!;
    const response: {meeting: any, attendee: any} = {meeting: null, attendee: null};
    const chime = new AWS.Chime({region});

    if (!event.body) {
        return { statusCode: 400, body: 'invalid request, missing payload' };
    }

    // CREATE A MEETING - using Chime
    try {
        const {product} = typeof event.body == 'object' ? event.body : JSON.parse(event.body);

        if (product && product =='online') {
            console.log('\nCreate a new meeting');
            response.meeting = await chime
                .createMeeting({
                ClientRequestToken: uuid(),
                MediaRegion: region,
            }).promise();
            console.log('A new meeting was created:', response.meeting.Meeting.MeetingId);
        }

        console.log('\nAdd a new attendee');
        response.attendee = await chime
          .createAttendee({
                MeetingId: response.meeting.Meeting.MeetingId,
                ExternalUserId: uuid(),
        }).promise();
        console.log('A new attendee was added:', response.attendee);

        return {
            statusCode: 201,
            body: JSON.stringify(response)
        };

    } catch (err) {
        console.log('Error occured: ', err);
        return {
            statusCode: 500,
            body: `Oops something went wrong !`
        }
    }
}

export {createMeeting};
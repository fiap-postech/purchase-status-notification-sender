import {SendTemplatedEmailCommand, SESClient} from "@aws-sdk/client-ses";

const ses = new SESClient({ region: process.env.SES_AWS_REGION });

export const handler = async (event) => {
    try {
        console.log(`Event: ${JSON.stringify(event)}`);

        const record = event.Records[0];
        const body = JSON.parse(record.body);
        console.log(`Message body: ${JSON.stringify(body)}`);

        const command = new SendTemplatedEmailCommand({
            Destination: {
                ToAddresses: [body.customer.email],
            },
            Template: process.env.SES_TEMPLATE_NAME,
            ConfigurationSetName: "",
            TemplateData: `{"code":"${body.code}","name":"${body.customer.name}","status":"${body.status}"}`,
            Source: process.env.SES_SOURCE_ADDRESS
        });

        const response = await ses.send(command);
        console.log(`Purchase status notification sender success response: ${JSON.stringify(response)}`);
        return response;
    } catch (error) {
        console.error(`Purchase status notification sender error response: ${error}`);
        throw new Error(error);
    }
};
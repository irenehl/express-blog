import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

interface MailParams {
    toAddresses: string[];
    htmlData: string;
    subject: string;
    source: string;
}

interface MailInfo {
    htmlTemplate: string;
    subject: string;
    toAddresses: string[];
    textReplacer: (html: string) => string;
}

export class MailService {
    private readonly sesClient: SESClient;

    constructor() {
        this.sesClient = new SESClient({ region: 'us-east-1' });
    }

    private createParams(mailParams: MailParams) {
        return {
            Destination: {
                ToAddresses: mailParams.toAddresses,
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: mailParams.htmlData,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: mailParams.subject,
                },
            },
            Source: mailParams.source,
        };
    }

    async sendEmail({
        htmlTemplate,
        subject,
        textReplacer,
        toAddresses,
    }: MailInfo) {
        const htmlData = textReplacer(htmlTemplate);
        const mailParams = this.createParams({
            toAddresses,
            htmlData,
            subject,
            source: process.env.MAIL_IDENTITY!,
        });

        return this.sesClient.send(new SendEmailCommand(mailParams));
    }
}

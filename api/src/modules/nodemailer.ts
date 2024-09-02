import * as nodemailer from 'nodemailer'; 
import path from 'path';

const attachmentsFileNamesToCID: EmailAttachments = [
    { cid: "gif1", path: path.resolve(__dirname, "../templates/imgs/bdbc.gif")}
]

type EmailAttachments = Array<{ filename?: string, content?: Buffer, contentType?: string, cid?: string, path?: string }>

const IS_PROD_ENV = String(process.env.NODE_ENV).includes('prod');

const transporterConfig = {
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_SENDER, 
        pass: process.env.EMAIL_APP_PASS
    }
};

const EMAIL_SENDER = process.env.EMAIL_SENDER;

export async function sendEmail(
    toEmail: string | string[], 
    title: string,
    html: string, 
    attachments?: EmailAttachments,
    saleAttachments = true
){
    return new Promise((resolve, reject)=>{
        if(!toEmail){
            throw({ status: 500, message: '[sendEmail]: toEmail is mandatory!' })
        }
        
        const transporter = nodemailer.createTransport(transporterConfig);

        // console.log(`[sendEmail]: Enviando email de ${process.env.EMAIL_SENDER} para ${toEmail}`);
    
        const mailOptions = {
            from: `"App" <${EMAIL_SENDER}>`,
            to: (typeof toEmail === 'string') ? toEmail : toEmail.join(', '),
            subject: `${(!IS_PROD_ENV) ? `[AMBIENTE TESTE] ` : ''}` + title,
            html,
            attachments: (attachments) 
                ? attachmentsFileNamesToCID.concat(attachments)  
                : (saleAttachments) 
                ? attachmentsFileNamesToCID 
                : []
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erro ao enviar e-mail:', error);
                return resolve({ status: 409, error });
            } else {
                console.log('E-mail enviado:', info.response);
                return resolve(info.response);
            }
        });
    });
}
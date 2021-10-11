const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
   sendmail: true,
   secure: false,
    tls: {
        rejectUnauthorized: false,
    },
})

const options = {
    from: '1vasconalex1@gmail.com',
    to: '1vasconalex1@gmail.com',
    subject: 'sending email with node.js!',
    text: 'wow thats simple!'

}

transporter.sendMail(options, function(err, info) {
    if(err) {
        console.log(err)
        return;
    }

    console.log('sent: ' + info.response)
})
const { ethers } = require("hardhat");
const nodemailer = require("nodemailer");

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD
    }
},
    {
        from: {
            name: 'DevRewards',
            address: process.env.MAIL_ADDRESS
        },
    }
);


const indData = (balance, repoName) => {
    return `
  <!DOCTYPE html>
<html>
<head>
  <title>Low Balance Notification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      font-size: 24px;
      margin-bottom: 20px;
    }

    p {
      margin-bottom: 10px;
    }

    .highlight {
      color: #FF0000;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Low Balance Notification</h1>
    <p>Dear User,</p>
    <p>We wanted to inform you that your account balance for repository ${repoName} is currently <span class="highlight">${ethers.utils.formatEther(balance)}</span>.</p>
    <p>Please take the necessary actions to ensure your account is adequately funded to meet your financial needs.</p>
    <p>If you have any questions or concerns, please feel free to contact our support team at <a href="mailto:support@example.com">support@example.com</a>.</p>
    <p>Best regards,<br> 
    Your Company Name</p>
  </div>
</body>
</html>

    `
}



const sendBalanceMail = (to, balance, repoName) => {
    var mailOptions = {
        from: {
            name: 'DevRewards',
            address: process.env.MAIL_ADDRESS
        },
        to: to,
        subject: `Low Balance Notification for ${repoName}`,
        html: indData(balance, repoName),
    }
    mailTransporter.sendMail(mailOptions, (err, result) => {
        if (err) {
            console.error(err);
        } else {
            console.log(result.response);
        }
    })
}

module.exports = {
    sendBalanceMail,

}
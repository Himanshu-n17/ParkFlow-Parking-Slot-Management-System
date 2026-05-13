const nodemailer = require("nodemailer");

const sendDurationEndingMail = async ({ email, username, slotNumber }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"ParkFlow Alerts" <${process.env.EMAIL}>`,

    to: email,

    subject: "Parking Duration Ending Soon",

    html: `
      <div style="
        font-family: Arial;
        background:#f4f7fb;
        padding:30px;
      ">
        <div style="
          max-width:550px;
          margin:auto;
          background:white;
          border-radius:18px;
          overflow:hidden;
        ">

          <div style="
            background:linear-gradient(135deg,#f59e0b,#ea580c);
            padding:30px;
            text-align:center;
            color:white;
          ">
            <h1>⏳ Parking Alert</h1>
            <p>Your parking session is ending soon</p>
          </div>

          <div style="padding:35px;">

            <h2>Hello ${username},</h2>

            <p>
              Your parking duration for
              <strong>${slotNumber}</strong>
              will end in approximately
              <strong>5 minutes</strong>.
            </p>

            <div style="
              background:#fff7ed;
              border-left:4px solid #f59e0b;
              padding:18px;
              border-radius:12px;
              margin:24px 0;
            ">
              Please extend your duration or free the slot to avoid penalties.
            </div>

            <p style="
              color:#64748b;
              font-size:14px;
            ">
              ParkFlow Smart Parking Alerts 🚘
            </p>

          </div>

        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendDurationEndingMail;

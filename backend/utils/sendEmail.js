const nodemailer = require("nodemailer");

const sendEmail = async (email, otp, username = "User") => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Smart Parking Management System" <${process.env.EMAIL}>`,
    to: email,
    subject: "Verify Your Email - OTP Verification",
    // text: `Your OTP is ${otp}`,
    html: `
      <div style="
        font-family: Arial, sans-serif;
        background-color: #f4f6f8;
        padding: 20px;
      ">
        <div style="
          max-width: 500px;
          margin: auto;
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
        ">
        
          <h2 style="color:#2c3e50; text-align:center;">
            🚗 Smart Parking Management System
          </h2>

          <p>Hello <strong>${username}</strong>,</p>

          <p>
            Thank you for registering with our system.
            Please use the OTP below to verify your email address:
          </p>

          <div style="
            text-align:center;
            font-size:28px;
            letter-spacing:5px;
            font-weight:bold;
            color:#27ae60;
            margin:20px 0;
          ">
            ${otp}
          </div>

          <p>
            ⏳ This OTP is valid for <strong>5 minutes</strong>.
          </p>

          <p>
            For security reasons, please do not share this OTP with anyone.
          </p>

          <hr style="margin:25px 0"/>

          <p style="font-size:14px; color:gray; text-align:center;">
            If you did not request this verification, please ignore this email.
          </p>

          <p style="text-align:center; font-weight:bold;">
            Making parking smarter, faster & hassle-free 🚘
          </p>

        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

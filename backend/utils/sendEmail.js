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
            🚗 ParkFlow - Smart Parking Management System
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

const sendResetPasswordEmail = async (email, otp, username = "User") => {
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"ParkFlow Security" <${process.env.EMAIL}>`,

    to: email,

    subject: "Reset Your Password - ParkFlow",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        background: #f4f7fb;
        padding: 40px 20px;
      ">

        <div style="
          max-width: 520px;
          margin: auto;
          background: white;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        ">

          <!-- TOP HEADER -->

          <div style="
            background: linear-gradient(135deg,#4f46e5,#7c3aed);
            padding: 32px;
            text-align: center;
            color: white;
          ">

            <h1 style="
              margin: 0;
              font-size: 28px;
            ">
              🔐 Password Recovery
            </h1>

            <p style="
              margin-top: 10px;
              opacity: 0.9;
              font-size: 15px;
            ">
              ParkFlow Security Verification
            </p>

          </div>

          <!-- BODY -->

          <div style="padding: 36px;">

            <h2 style="
              color: #111827;
              margin-bottom: 12px;
            ">
              Hello ${username},
            </h2>

            <p style="
              color: #4b5563;
              line-height: 1.7;
              font-size: 15px;
            ">
              We received a request to reset your ParkFlow account password.
              Use the secure verification code below to continue.
            </p>

            <!-- OTP -->

            <div style="
              margin: 32px 0;
              text-align: center;
            ">

              <div style="
                display: inline-block;
                background: #f3f4f6;
                border: 2px dashed #7c3aed;
                border-radius: 16px;
                padding: 18px 34px;
                font-size: 34px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #7c3aed;
              ">
                ${otp}
              </div>

            </div>

            <p style="
              color: #6b7280;
              font-size: 14px;
              line-height: 1.7;
            ">
              ⏳ This OTP will expire in
              <strong>5 minutes</strong>.
            </p>

            <p style="
              color: #ef4444;
              font-size: 14px;
              line-height: 1.7;
            ">
              Never share this code with anyone.
              ParkFlow will never ask for your OTP.
            </p>

            <hr style="
              border: none;
              border-top: 1px solid #e5e7eb;
              margin: 28px 0;
            ">

            <p style="
              color: #9ca3af;
              font-size: 13px;
              text-align: center;
              line-height: 1.6;
            ">
              If you didn't request a password reset,
              you can safely ignore this email.
            </p>

          </div>

        </div>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendResetPasswordEmail,
  sendEmail,
};

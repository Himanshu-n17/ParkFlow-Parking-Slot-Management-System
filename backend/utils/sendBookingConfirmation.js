const nodemailer = require("nodemailer");

const sendBookingConfirmation = async ({
  email,
  username,
  slotNumber,
  duration,
  cost,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"ParkFlow Bookings" <${process.env.EMAIL}>`,

    to: email,

    subject: "Parking Slot Booked Successfully",

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
          box-shadow:0 10px 30px rgba(0,0,0,0.08);
        ">

          <div style="
            background:linear-gradient(135deg,#10b981,#059669);
            padding:30px;
            text-align:center;
            color:white;
          ">
            <h1>🚗 Booking Confirmed</h1>
            <p>Your parking slot is reserved</p>
          </div>

          <div style="padding:35px;">

            <h2>Hello ${username},</h2>

            <p>
              Your parking slot has been booked successfully.
            </p>

            <div style="
              background:#f8fafc;
              border-radius:16px;
              padding:24px;
              margin:25px 0;
            ">

              <p><strong>Slot Number:</strong> ${slotNumber}</p>

              <p><strong>Duration:</strong> ${duration} Hours</p>

              <p><strong>Estimated Cost:</strong> ₹${cost}</p>

            </div>

            <p>
              Please arrive before your reserved duration expires.
            </p>

            <hr style="
              border:none;
              border-top:1px solid #e5e7eb;
              margin:28px 0;
            ">

            <p style="
              text-align:center;
              color:#64748b;
              font-size:14px;
            ">
              Thank you for choosing ParkFlow 🚘
            </p>

          </div>

        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendBookingConfirmation;

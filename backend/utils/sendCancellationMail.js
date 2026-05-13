const nodemailer = require("nodemailer");

const sendCancellationMail = async ({
  email,
  username,
  slotNumber,
  refundAmount,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"ParkFlow Refunds" <${process.env.EMAIL}>`,

    to: email,

    subject: "Parking Slot Cancelled",

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
            background:linear-gradient(135deg,#ef4444,#dc2626);
            padding:30px;
            text-align:center;
            color:white;
          ">
            <h1>❌ Booking Cancelled</h1>
            <p>Your slot cancellation was successful</p>
          </div>

          <div style="padding:35px;">

            <h2>Hello ${username},</h2>

            <p>
              Your parking booking for slot
              <strong>${slotNumber}</strong>
              has been cancelled successfully.
            </p>

            <div style="
              background:#f8fafc;
              border-radius:16px;
              padding:22px;
              margin:25px 0;
            ">

              <p>
                <strong>Refund Amount:</strong>
                ₹${refundAmount}
              </p>

              <p>
                <strong>Cancellation Charge:</strong>
                ₹10
              </p>

            </div>

            <p>
              The refund will reflect in your ParkFlow wallet shortly.
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
              ParkFlow Smart Parking 🚘
            </p>

          </div>

        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendCancellationMail;

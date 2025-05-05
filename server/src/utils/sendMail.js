import nodemailer from "nodemailer";


export const sendVerifyMail = async (verificationUrl, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Email Verification Request",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Please click the link below to verify your email address:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Verify Email</a>
    </div>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error during sending mail:", error);
    throw new Error(error);
  }
};

export const sendResetPasswordMail = async (resetUrl, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Request</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. Please click the link below to reset your password:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
    </div>
    <p>If you didn't request a password reset, please ignore this email.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error during sending mail:", error);
    throw new Error(error);
  }
};

export const sendContactSubmitMail = async (email, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Contact Form Submission Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="text-align: center; color: #333;">Contact Form Submission Confirmation</h2>
          <p style="font-size: 16px; color: #333;">
            Dear ${name},
          </p>
          <p style="font-size: 16px; color: #333;">
            Thank you for reaching out to us! We have received your message and our team will get back to you shortly.
          </p>
          <p style="font-size: 16px; color: #333;">
            If you have any urgent inquiries, please feel free to contact our support team.
          </p>
          
          <p style="font-size: 16px; color: #333;">
            We appreciate your interest and look forward to assisting you!
          </p>
          <p style="font-size: 16px; color: #333;">
            Best regards,<br>
            The Customized PC Planner Team
          </p>
          <footer style="text-align: center; font-size: 12px; color: #777; margin-top: 20px;">
            &copy; 2024 Customized PC Planner!. All rights reserved.
          </footer>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions); // Use await to handle async operation
    // console.log("Password change confirmation email sent successfully");
  } catch (error) {
    console.error("Error during submitting form:", error);
    throw new Error(error);
  }
};

export const sendOrderConfirmationMail = async (
  email,
  name,
  orderId,
  products,
  totalAmount,
  paymentStatus,
  shippingAddress,
  orderStatus
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    // Format the products list into an HTML table
    const productListHTML = products
      .map(
        (item, index) => `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${index + 1}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${
          item.name || "Unnamed Product"
        }</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
      </tr>
    `
      )
      .join("");

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Your Order Confirmation - Ecommerce Bacola",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="text-align: center; color: #333;">Thank You for Your Order, ${name}!</h2>
          <p style="font-size: 16px; color: #333;">
            Your order has been successfully placed. Below are your order details:
          </p>
          <h3 style="color: #333;">Order ID: ${orderId}</h3>

          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr>
                <th style="padding: 10px; border: 1px solid #ddd;">#</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Product Name</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${productListHTML}
            </tbody>
          </table>

          <p style="font-size: 16px; color: #333; margin-top: 20px;">
            <strong>Total Amount:</strong> ${totalAmount} PKR
          </p>
          <p style="font-size: 16px; color: #333;">
            <strong>Payment Status:</strong> ${paymentStatus}
          </p>
          <p style="font-size: 16px; color: #333;">
            <strong>Shipping Address:</strong> ${shippingAddress}
          </p>
          <p style="font-size: 16px; color: #333;">
            <strong>Order Status:</strong> ${orderStatus}
          </p>

          <p style="font-size: 16px; color: #333;">
            We will notify you once your order is shipped. If you have any questions, feel free to contact our support team.
          </p>

          <p style="font-size: 16px; color: #333;">
            Best regards,<br>
            The Ecommerce Bacola Team
          </p>
          <footer style="text-align: center; font-size: 12px; color: #777; margin-top: 20px;">
            &copy; 2024 Ecommerce Bacola. All rights reserved.
          </footer>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    // console.log("Order confirmation email sent successfully");
  } catch (error) {
    console.error("Error during sending order confirmation email:", error);
  }
};

import ejs from "ejs";
import path from "path";
import nodemailer from "nodemailer";
import User from "./models/user.model.js";
import connectDB from "./database/connect.js";
import excelToJson from "convert-excel-to-json";

await connectDB();
const currentDir = path.resolve();

const sendMail = async (to, title, content) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "mail.privateemail.com",
      port: 587,
      service: "gmail",
      auth: {
        user: "itsupgen10.noreply@gmail.com",
        pass: "Hoi Chu Nhiem",
      },
    });
    await transporter.sendMail({
      from: `Câu lạc bộ Hỗ trợ kỹ thuật IT Supporter <itsupgen10.noreply@gmail.com>`,
      to: to,
      subject: title,
      html: content,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const sendWelcomeMail = async (to, data) => {
  console.log("sendWelcomeMail (36)::", data);
  try {
    const template = await ejs.renderFile(
      path.join(currentDir, "/src/view/email.ejs"),
      data
    );

    await sendMail(
      to,
      "Thông báo kết quả xét tuyển Cộng tác viên Gen 10 năm 2023",
      template
    );

    console.log(data.fullName);
  } catch (error) {
    console.log(error.message);
  }
};

let result = excelToJson({
  sourceFile: path.join(currentDir, "/src/data/congbohana.xlsx"),
  columnToKey: {
    A: "studentId",
    B: "fullName",
    C: "className",
    D: "phoneNumber",
    E: "email",
  },
}).test;

const isStudentIdExists = async (studentId) => {
  const existingUser = await User.findOne({ studentId });
  return existingUser !== null;
};

(async () => {
  for (let i = 0; i < result.length; ++i) {
    let u = result[i];

    try {
      const studentIdExists = await isStudentIdExists(u.studentId);

      if (studentIdExists) {
        await User.deleteOne({ studentId: u.studentId });
      }
      const user = new User({
        fullName: u.fullName,
        phoneNumber: u.phoneNumber,
        className: u.className,
        studentId: u.studentId,
        email: u.email,
      });
      await user.save();
      await sendWelcomeMail(u.email, u);
    } catch (error) {
      console.log("app.js (79):: " + u.email, error.message);
    }
  }
})();

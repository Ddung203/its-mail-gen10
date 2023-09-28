import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    studentId: { type: String, unique: true },
    fullName: String,
    className: String,
    phoneNumber: String,
    email: String,
  },
  { collection: "students", timestamps: true }
);

export default mongoose.model("User", UserSchema);

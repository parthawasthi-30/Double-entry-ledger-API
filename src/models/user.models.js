const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required for creating a user"],
      trim: true,
      lowercase: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email address"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Name is required for creating a account"],
    },
    password: {
      type: String,
      required: [true, "Password is required for creating a account"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    systemUser:{
      type: Boolean,
      default: false,
      immutable: true,
      select: false,
      
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePasswords = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
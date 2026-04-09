import mongoose, { Model } from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide your name"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            // Only works on CREATE and SAVE
            validator: function (passwordConfirm) {
                return this.password === passwordConfirm;
            },
            message: "Your password and confirmed password are not the same",
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
});
// Pre-save hook
userSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = "";
});
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = Math.floor(Math.random() * 900000 + 100000).toString();
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetTokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    return resetToken;
};
userSchema.methods.changedPasswordAfterJWT = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};
// Export as CommonJS
const User = mongoose.model("User", userSchema);
export default User;
//# sourceMappingURL=userModel.js.map
import type { Document } from "mongoose";
export interface IUser extends Document {
    username: string;
    role: "user" | "admin";
    password: string;
    passwordConfirm?: string;
    passwordChangedAt?: Date;
    passwordResetToken?: string | null;
    passwordResetTokenExpires?: Date | null;
    createdAt?: Date;
    correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
    createPasswordResetToken(): string;
    changedPasswordAfterJWT(JWTTimestamp: number | undefined): boolean;
}
//# sourceMappingURL=user.d.ts.map
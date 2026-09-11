import mongoose, { Model, Schema } from "mongoose";

export interface IRefreshToken {
    jti: string;
    userId: mongoose.Types.ObjectId;
    expiresAt: Date;
    revoked: boolean;
    createdAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
    jti: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    revoked: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const RefreshTokenModel: Model<IRefreshToken> =
    (mongoose.models.refresh_tokens as Model<IRefreshToken> | undefined) ||
    mongoose.model<IRefreshToken>("refresh_tokens", refreshTokenSchema);
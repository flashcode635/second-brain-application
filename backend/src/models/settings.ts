import mongoose, { Schema, model, Model } from "mongoose";

export interface ISettings {
    userId: mongoose.Types.ObjectId;
    theme: "light" | "dark";
}

const settingsSchema = new Schema<ISettings>({
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true, unique: true },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
});

export const SettingsModel: Model<ISettings> =
    mongoose.models?.settings as Model<ISettings> ||
    model<ISettings>("settings", settingsSchema);
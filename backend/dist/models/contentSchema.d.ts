import mongoose, { Document, Model } from "mongoose";
declare const contentTypes: readonly ["image", "video", "article", "audio"];
export interface IContent extends Document {
    link: string;
    type: typeof contentTypes[number];
    title: string;
    tags: mongoose.Types.ObjectId[];
    userId: mongoose.Types.ObjectId;
}
export declare const ContentModel: Model<IContent>;
export {};
//# sourceMappingURL=contentSchema.d.ts.map
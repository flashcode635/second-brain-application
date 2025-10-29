import mongoose, { Document, Model } from "mongoose";
declare const contentTypes: readonly ["twitter", "youtube", "linkedIn"];
export interface IContent extends Document {
    link: string;
    type: typeof contentTypes[number];
    title: string;
    tags: string[];
    userId: mongoose.Types.ObjectId;
}
export declare const ContentModel: Model<IContent>;
export {};
//# sourceMappingURL=contentSchema.d.ts.map
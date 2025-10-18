import mongoose from "mongoose";
// sharable link of brain - not users link!!
const linkSchema = new mongoose.Schema({
  hash: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
},{
    timestamps: true
});

const LinkModel = mongoose.model('Link', linkSchema);

export default LinkModel;

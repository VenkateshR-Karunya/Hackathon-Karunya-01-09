import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
title: { type: String, required: true, text: true },
description: { type: String, default: '', text: true },
images: [String],
price: { type: Number, required: true, index: true },
brand: { type: String, index: true },
rating: { type: Number, default: 0, index: true },
stock: { type: Number, default: 0, index: true },
category: { type: String, index: true },
active: { type: Boolean, default: true, index: true }
}, { timestamps: true });
productSchema.index({ title: 'text', description: 'text' });
export default mongoose.model('Product', productSchema);
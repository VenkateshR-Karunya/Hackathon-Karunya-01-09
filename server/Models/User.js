import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const otpSchema = new mongoose.Schema({
codeHash: String,
expiresAt: Date,
attempts: { type: Number, default: 0 },
}, { _id:false });


const resetSchema = new mongoose.Schema({
tokenHash: String,
expiresAt: Date,
}, { _id:false });


const userSchema = new mongoose.Schema({
name: String,
email: { type: String, required: true, unique: true, lowercase: true, index: true },
phone: String,
passwordHash: String,
roles: { type: [String], default: ['customer'], index: true },
otp: otpSchema,
resetToken: resetSchema,
}, { timestamps: true });


userSchema.methods.setPassword = async function(pw){ this.passwordHash = await bcrypt.hash(pw, 12); };
userSchema.methods.verifyPassword = async function(pw){ return bcrypt.compare(pw, this.passwordHash || ''); };


export default mongoose.model('User', userSchema);
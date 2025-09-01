import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";       // make sure User.js exists
import { genOtp, hash, signToken } from "../utils/crypto.js";  
import { sendMail } from "../utils/mail.js";  

const router = express.Router();


router.get("/", (req, res) => {
  res.send("🚀 Mini-Atoz API is running!");
});

// Request OTP (email)
router.post('/otp/request', async (req,res)=>{
const { email } = req.body;
let user = await User.findOne({ email });
if(!user){ user = new User({ email, roles:['customer'] }); await user.save(); }
const otp = genOtp();
user.otp = { codeHash: hash(otp), expiresAt: new Date(Date.now()+10*60*1000), attempts:0 };
await user.save();
try{
await sendMail({ to: email, subject: 'Your Login OTP', html:`<h2>${otp}</h2><p>Valid for 10 minutes</p>` });
}catch(e){ console.log('Email failed, OTP:', otp); }
res.json({ message:'OTP sent' });
});


// Verify OTP (login/signup)
router.post('/otp/verify', async (req,res)=>{
const { email, otp } = req.body;
const user = await User.findOne({ email });
if(!user || !user.otp) return res.status(400).json({ message:'Request OTP first' });
if(new Date() > user.otp.expiresAt) return res.status(400).json({ message:'OTP expired' });
if(hash(otp) !== user.otp.codeHash){ user.otp.attempts++; await user.save(); return res.status(400).json({ message:'Invalid OTP' }); }
user.otp = undefined;
await user.save();
const token = signToken(user);
res.json({ token, user: { id:user._id, email:user.email, roles:user.roles } });
});


// Forgot password (send reset OTP)
router.post('/forgot', async (req,res)=>{
const { email } = req.body;
const user = await User.findOne({ email });
if(!user) return res.json({ message:'If exists, email sent' });
const otp = genOtp();
user.resetToken = { tokenHash: hash(otp), expiresAt: new Date(Date.now()+10*60*1000) };
await user.save();
try{ await sendMail({ to: email, subject: 'Password Reset OTP', html:`<h2>${otp}</h2>` }); }catch(e){ console.log('Reset OTP:', otp); }
res.json({ message:'Reset OTP sent' });
});


// Reset password
router.post('/reset', async (req,res)=>{
const { email, otp, newPassword } = req.body;
const user = await User.findOne({ email });
if(!user?.resetToken) return res.status(400).json({ message:'No reset request' });
if(new Date() > user.resetToken.expiresAt) return res.status(400).json({ message:'Token expired' });
if(hash(otp) !== user.resetToken.tokenHash) return res.status(400).json({ message:'Invalid token' });
user.passwordHash = await bcrypt.hash(newPassword, 12);
user.resetToken = undefined;
await user.save();
res.json({ message:'Password reset' });
});


export default router;
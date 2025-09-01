import crypto from 'crypto';
export const hash = (val) => crypto.createHash('sha256').update(String(val)).digest('hex');
export const genOtp = () => String(Math.floor(100000 + Math.random()*900000));

// Sign a JWT token
export function signToken(payload) {
  const secret = process.env.JWT_SECRET || "supersecretkey"; // put in .env
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}
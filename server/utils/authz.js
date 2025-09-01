import jwt from 'jsonwebtoken';
export const signToken = (user) => jwt.sign({ id:user._id, roles:user.roles }, process.env.JWT_SECRET, { expiresIn: '2h' });
export const requireAuth = (req,res,next) => {
const token = (req.headers.authorization||'').replace('Bearer ','');
if(!token) return res.status(401).json({ message:'No token' });
try{ req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
catch(e){ return res.status(401).json({ message:'Invalid token' }); }
};
export const requireRole = (role) => (req,res,next)=>{
if(!req.user?.roles?.includes(role)) return res.status(403).json({ message:'Forbidden' });
next();
};
import mongoose, { Schema, Document } from 'mongoose';
import { User as IUser } from '../../../shared/index';

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema({
  stravaId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profileEmoji: { type: String },
  totalDistance: { type: Number, default: 0 },
  totalPace: { type: Number, default: 0 },
  activityCount: { type: Number, default: 0 },
  lastSyncedAt: { type: Date, default: Date.now },
  accessToken: { type: String },
  refreshToken: { type: String },
  expiresAt: { type: Number },
}, { timestamps: true });

export default mongoose.model<IUserModel>('User', UserSchema);

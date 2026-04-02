import mongoose, { Schema, Document } from 'mongoose';
import { Activity as IActivity } from '../../../shared/index';

export interface IActivityModel extends IActivity, Document {}

const ActivitySchema: Schema = new Schema({
  stravaId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  distance: { type: Number, required: true }, // in meters
  movingTime: { type: Number, required: true }, // in seconds
  elapsedTime: { type: Number, required: true }, // in seconds
  type: { type: String, enum: ['Run', 'Walk', 'Hike'], required: true },
  startDate: { type: Date, required: true },
  startLatLng: { type: [Number] },
  polyline: { type: String },
}, { timestamps: true });

// Ensure we only track activities from April 2026 for the leaderboard if needed
// or we can filter in the query.

export default mongoose.model<IActivityModel>('Activity', ActivitySchema);

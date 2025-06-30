// models/event.model.ts

import { Schema, model } from 'mongoose';
import { TEvent } from './event.interface';

const eventSchema = new Schema<TEvent>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    organizerName: {
      type: String,
      required: true,
    },
    organizerEmail: {
      type: String,
      required: true,
    },
    attendeeCount: {
      type: Number,
      required: true,
      default: 0,
    },
    joinedUsers: {
      type: [String], // storing user emails
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  },
);

export const EventModel = model('Event', eventSchema);

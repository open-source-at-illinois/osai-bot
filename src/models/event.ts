import mongoose = require("mongoose");

export interface EventType {
  name: string;
  code: string;
  description: string;
  when?: string;
  where?: string;
  points: number;
  active: boolean;
  attendees: [mongoose.Types.ObjectId];
}

const eventSchema = new mongoose.Schema<EventType>({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  when: {
    type: String,
    required: false,
  },
  where: {
    type: String,
    required: false,
  },
  points: {
    type: Number,
    required: true,
    default: 1,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Event = mongoose.model("Event", eventSchema);

export default Event;

// types/event.types.ts

export type TEvent = {
  title: string;
  description: string;
  location: string;
  dateTime: Date;
  organizerName: string;
  organizerEmail: string;
  joinedUsers: string[]; // array of user emails or IDs
};

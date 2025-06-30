import { StatusCodes } from 'http-status-codes';
import throwAppError from '../../utils/throwAppError';
import { TEvent } from './event.interface';
import { EventModel } from './event.model';
import { QueryBuilder } from '../../builder/QueryBuilder';

const createEventIntoDB = async (payload: TEvent) => {
  // Check for duplicate title
  const existingEvent = await EventModel.findOne({ title: payload.title });

  if (existingEvent) {
    throwAppError(
      'title',
      'An event with this title already exists. Please choose a different title.',
      StatusCodes.CONFLICT,
    );
  }

  const result = await EventModel.create(payload);

  if (!result) {
    throwAppError(
      '',
      "Couldn't Add the Event. Try again.",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return result;
};

const getAllEventsFromDB = async (query: Record<string, unknown>) => {
  const eventSearchableFields = ['title'];

  const eventsQuery = new QueryBuilder(query, EventModel.find())
    .search(eventSearchableFields)
    .filter()
    .sortBy()
    .paginate()
    .fields();

  const result = await eventsQuery.modelQuery;

  if (!result.length) {
    throwAppError('', 'No Events Found at this moment', StatusCodes.NOT_FOUND);
  }

  return result;
};

const getMyEventsFromDB = async (organizerEmail: string) => {
  const result = await EventModel.find({ organizerEmail });

  if (!result) {
    throwAppError(
      'organizerEmail',
      "You don't have any event at this moment, Add one",
      StatusCodes.NOT_FOUND,
    );
  }

  return result;
};

const assignUserAndAttendeeCountIntoDB = async (
  eventId: string,
  userEmail: string,
) => {
  const event = await EventModel.findById(eventId);

  if (!event) {
    throwAppError('', 'Event not found', StatusCodes.NOT_FOUND);
  }

  //prevent double joining
  const alreadyJoined = event?.joinedUsers.includes(userEmail);
  if (alreadyJoined) {
    throwAppError(
      '',
      'You have already joined this event',
      StatusCodes.CONFLICT,
    );
  }

  //now update the event atomically
  const updatedEvent = await EventModel.findByIdAndUpdate(
    eventId,
    {
      $inc: { attendeeCount: 1 },
      $addToSet: { joinedUsers: userEmail }, // avoids duplicates
    },
    { new: true },
  );

  return updatedEvent;
};

const updateEventIntoDB = async (
  userEmail: string,
  eventId: string,
  updateData: Partial<TEvent>,
) => {
  const event = await EventModel.findById(eventId);

  if (!event) {
    throwAppError('eventId', 'Event Not Found', StatusCodes.NOT_FOUND);
  }

  if (event?.organizerEmail !== userEmail) {
    throwAppError(
      'unauthorized',
      'You are unauthorized to update this event. You only can update your own event',
      StatusCodes.UNAUTHORIZED,
    );
  }

  const result = await EventModel.findByIdAndUpdate(eventId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throwAppError(
      '',
      "Something went wrong. Couldn't update the Event, try again",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return result;
};

const deleteEventFromDB = async (userEmail: string, eventId: string) => {
  const event = await EventModel.findById(eventId);

  if (!event) {
    throwAppError('eventId', 'Event Not Found', StatusCodes.NOT_FOUND);
  }

  if (event?.organizerEmail !== userEmail) {
    throwAppError(
      'unauthorized',
      'You are unauthorized to delete this event. You only can delete your own event',
      StatusCodes.UNAUTHORIZED,
    );
  }

  const result = await EventModel.findByIdAndDelete(eventId);

  if (!result) {
    throwAppError(
      'eventId',
      'Delete failed. Event may not found, try again.',
      StatusCodes.NOT_FOUND,
    );
  }
  return result;
};

export const EventService = {
  createEventIntoDB,
  getAllEventsFromDB,
  getMyEventsFromDB,
  assignUserAndAttendeeCountIntoDB,
  updateEventIntoDB,
  deleteEventFromDB,
};

import { StatusCodes } from 'http-status-codes';
import throwAppError from '../../utils/throwAppError';
import { TEvent } from './event.interface';
import { EventModel } from './event.model';

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

const getAllEventsFromDB = async () => {
  const result = await EventModel.find();

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

export const EventService = {
  createEventIntoDB,
  getAllEventsFromDB,
  getMyEventsFromDB,
};

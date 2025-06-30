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

export const EventService = {
  createEventIntoDB,
};

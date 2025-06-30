/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EventService } from './event.service';

const createEvent = catchAsync(async (req, res, next) => {
  const result = await EventService.createEventIntoDB(req.body);
  const message = 'Added the Event Successfully';
  sendResponse(res, StatusCodes.CREATED, true, message, result);
});

export const EventController = {
  createEvent,
};

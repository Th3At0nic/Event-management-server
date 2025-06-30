/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EventService } from './event.service';
import { JwtPayload } from 'jsonwebtoken';

const createEvent = catchAsync(async (req, res, next) => {
  const result = await EventService.createEventIntoDB(req.body);
  const message = 'Added the Event Successfully';
  sendResponse(res, StatusCodes.CREATED, true, message, result);
});

const getAllEvents = catchAsync(async (req, res, next) => {
  const result = await EventService.getAllEventsFromDB(req.query);
  const message = 'All Events are Retrieved Successfully';
  sendResponse(res, StatusCodes.OK, true, message, result);
});

const getMyEvents = catchAsync(async (req, res, next) => {
  const { userEmail } = req.user as JwtPayload;
  const result = await EventService.getMyEventsFromDB(userEmail);
  const message = 'Your Events are Retrieved Successfully';
  sendResponse(res, StatusCodes.OK, true, message, result);
});

const assignUserAndAttendeeCount = catchAsync(async (req, res, next) => {
  const { userEmail } = req.user as JwtPayload;
  const { id } = req.params;
  const result = await EventService.assignUserAndAttendeeCountIntoDB(
    id,
    userEmail,
  );
  const message = 'Joined Successfully';
  sendResponse(res, StatusCodes.OK, true, message, result);
});

const updateEvent = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { userEmail } = req.user as JwtPayload;
  const result = await EventService.updateEventIntoDB(userEmail, id, req.body);
  const message = 'Updated Event Successfully';
  sendResponse(res, StatusCodes.OK, true, message, result);
});

const deleteEvent = catchAsync(async (req, res, next) => {
  const { userEmail } = req.user as JwtPayload;
  const { id } = req.params;
  const result = await EventService.deleteEventFromDB(userEmail, id);
  const message = 'Deleted Event Successfully';
  sendResponse(res, StatusCodes.OK, true, message, result ? null : result);
});

export const EventController = {
  createEvent,
  getAllEvents,
  getMyEvents,
  assignUserAndAttendeeCount,
  updateEvent,
  deleteEvent,
};

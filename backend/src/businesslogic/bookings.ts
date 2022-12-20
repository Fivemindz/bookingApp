import { BookingAccess } from '../dataLayer/bookingsAccess'
import * as uuid from 'uuid'
// import { getUserId } from '../lambda/utils'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { CreateBookingRequest } from '../lambda/requests/CreateBookingRequest'
import { UpdateBookingRequest } from '../lambda/requests/UpdateBookingRequest'
import { Booking } from '../models/bookingItem'
import { getUserId } from '../lambda/utils'

const bookingAccess = new BookingAccess

export async function getAllBookings(
  event: APIGatewayProxyEvent
): Promise<Booking[]> {
  const userId = getUserId(event)
  const todos = await bookingAccess.getAllBookings(userId)
  return todos
}

export async function createBooking(
  createBookingRequest: CreateBookingRequest,
  event: APIGatewayProxyEvent
): Promise<Booking> {
  
  console.log('Creating booking: ', event)
  
  const itemId = uuid.v4()
  const userId = getUserId(event)
  
  const booking = {
    bookingId: itemId,
    userId: userId,
    timestamp: new Date().toISOString(),
    address: createBookingRequest.address,
    city: createBookingRequest.city,
    zipcode: createBookingRequest.zipcode,
    confirmed: false
  }
  return await bookingAccess.createBooking(booking)
}

export async function updateBooking(
  event: APIGatewayProxyEvent
): Promise<Booking> {
  const updatedBooking: UpdateBookingRequest = JSON.parse(event.body)
  const bookingId = event.pathParameters.bookingId

  console.log('Updating booking: ', event)

  const itemId = bookingId
  const userId = getUserId(event)
  
  const booking = {
    bookingId: itemId,
    userId: userId,
    timestamp: new Date().toISOString(),
    address: updatedBooking.address,
    city: updatedBooking.city,
    zipcode: updatedBooking.zipcode,
    confirmed: updatedBooking.confirmed
  }
  return await bookingAccess.updateBooking(booking)
}

export async function deleteBooking(
  event: APIGatewayProxyEvent
): Promise<string> { 
  const bookingId = event.pathParameters.bookingId
  const userId = getUserId(event)
  return await bookingAccess.deleteBooking(bookingId, userId)
}

export async function getSignedUrl(
  event: APIGatewayProxyEvent
): Promise<string> {
  const bookingId = event.pathParameters.bookingId

  return bookingAccess.getUploadUrl(bookingId)
}

export async function updateBookingAttachment(
  event: APIGatewayProxyEvent
) {
  const userId = getUserId(event)
  const bookingId = event.pathParameters.bookingId
  
  return bookingAccess.updateBookingUrl(userId, bookingId)
}


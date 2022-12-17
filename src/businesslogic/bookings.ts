import { BookingAccess } from '../dataLayer/bookingsAccess'
import * as uuid from 'uuid'
// import { getUserId } from '../lambda/utils'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { CreateBookingRequest } from '../lambda/requests/CreateBookingRequest'
import { UpdateBookingRequest } from '../lambda/requests/UpdateBookingRequest'
import { Booking } from '../models/bookingItem'

const bookingAccess = new BookingAccess

export async function getAllBookings(){
  const todos = await bookingAccess.getAllBookings()
  return todos
}

export async function createBooking(
  createBookingRequest: CreateBookingRequest,
  event: APIGatewayProxyEvent
): Promise<Booking> {
  
  console.log('Creating booking: ', event)
  
  const itemId = uuid.v4()
  const userId = 'user'  //getUserId(event)
  
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
  updateBookingRequest: UpdateBookingRequest,
  bookingId: string,
  event: APIGatewayProxyEvent
): Promise<Booking> {
  
  console.log('Updating booking: ', event)

  const itemId = bookingId
  const userId = 'user'  //getUserId(event)
  
  const booking = {
    bookingId: itemId,
    userId: userId,
    timestamp: new Date().toISOString(),
    address: updateBookingRequest.address,
    city: updateBookingRequest.city,
    zipcode: updateBookingRequest.zipcode,
    confirmed: updateBookingRequest.confirmed
  }
  return await bookingAccess.updateBooking(booking)
}

export async function deleteBooking(
  bookingId: string,
  userId: string
): Promise<string> {
  
  
  return await bookingAccess.deleteBooking(bookingId, userId)
}


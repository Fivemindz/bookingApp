import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { updateBooking } from '../../businesslogic/bookings'
import { UpdateBookingRequest } from '../requests/UpdateBookingRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const updatedBooking: UpdateBookingRequest = JSON.parse(event.body)
  const bookingId = event.pathParameters.bookingId
  const response = await updateBooking(updatedBooking, bookingId, event)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: response
    }) 
  }
}
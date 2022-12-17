import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createBooking } from '../../businesslogic/bookings'
import { CreateBookingRequest } from '../requests/CreateBookingRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newBooking: CreateBookingRequest = JSON.parse(event.body)  
  const response = await createBooking(newBooking, event)

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
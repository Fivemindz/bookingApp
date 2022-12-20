import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getSignedUrl, updateBookingAttachment } from '../../businesslogic/bookings'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Getting all events', event)
    
  const signedUrl = await getSignedUrl(event)
  await updateBookingAttachment(event)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      message: signedUrl
    }) 
  }
}
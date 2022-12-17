import * as AWS  from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { Booking } from '../models/bookingItem'

export class BookingAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly bookingsTable = process.env.BOOKINGS_TABLE) {
  }

  async getAllBookings(): Promise<Booking[]> {
    console.log('Getting all bookings')

    const result = await this.docClient.scan({
      TableName: this.bookingsTable
    }).promise()

    const items = result.Items
    return items as Booking[]
  }

  async createBooking(booking: Booking): Promise<Booking> {
    await this.docClient.put({
      TableName: this.bookingsTable,
      Item: booking
    }).promise()

    return booking
  }

  async updateBooking(booking: Booking): Promise<Booking> {
    await this.docClient.update({
      TableName: this.bookingsTable,
      Key: {
        userId: booking.userId,
        bookingId: booking.bookingId
      },
      UpdateExpression: 'set confirmed = :s',
      ExpressionAttributeValues: {':s': booking.confirmed}

    }).promise()

    return booking
  }

  async deleteBooking(bookingId: string, userId: string): Promise<string> {
    await this.docClient.delete({
      TableName: this.bookingsTable,
      Key: {
        bookingId: bookingId,
        userId: userId
      }
    }).promise()

    return bookingId
  }

}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}

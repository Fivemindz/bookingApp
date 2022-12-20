import * as AWS  from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({signatureVersion: 'v4'})

import { Booking } from '../models/bookingItem'

export class BookingAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly bookingsTable = process.env.BOOKINGS_TABLE,
    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION) {
  }

  async getAllBookings(userId: string): Promise<Booking[]> {
      const result = await this.docClient.query({
      TableName: this.bookingsTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
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

  async getUploadUrl(bookingId: string){
    const urlInt = parseInt(this.urlExpiration)
    return s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: bookingId,
      Expires: urlInt
    })
  }

  async updateBookingUrl(userId: string, bookingId: string) {
    const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${bookingId}`
    await this.docClient.update({
      TableName: this.bookingsTable,
      Key: {
        userId: userId,
        bookingId: bookingId
      },
      UpdateExpression: 'set attachmentURL = :s',
      ExpressionAttributeValues: {':s': attachmentUrl}
    }).promise()
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

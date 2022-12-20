/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateBookingRequest {
  address: string
  city: string
  zipcode: string
  confirmed: boolean
}
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export type AWSGatewayProxyFunctionWithId = (
  event: APIGatewayProxyEvent,
  userId: string) => Promise<APIGatewayProxyResult>
export type AWSGatewayProxyFunction = (
  event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>

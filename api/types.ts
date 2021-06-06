import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export type AWSGatewayProxyFunction =
 (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>

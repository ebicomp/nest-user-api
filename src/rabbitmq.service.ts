// // src/rabbitmq.service.ts
// import { Injectable } from '@nestjs/common';
// // import { AmqpConnection } from '@nestjs/amqp';

// @Injectable()
// export class RabbitMQService {
//   constructor(private readonly amqpConnection: AmqpConnection) {}

//   async publish(eventName: string, payload: object) {
//     await this.amqpConnection.publish('exchange', 'routingKey', payload);
//   }
// }

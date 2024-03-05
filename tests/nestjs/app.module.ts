import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TrapdogMiddleware } from '../../dist/index';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TrapdogMiddleware)
      .forRoutes('*');
  }
}
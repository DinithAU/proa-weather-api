import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeatherController } from './controllers/weather.controller';
import { WeatherService } from './services/weather.service';
import { WeatherStation } from './models/weather-station.entity';
import { Variable } from './models/variable.entity';
import { Measurement } from './models/measurement.entity';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([WeatherStation, Variable, Measurement]),
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class AppModule { }
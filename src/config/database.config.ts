import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { WeatherStation } from '../models/weather-station.entity';
import { Variable } from '../models/variable.entity';
import { Measurement } from '../models/measurement.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export const databaseConfig: TypeOrmModuleOptions & DataSourceOptions = {
    type: 'mysql',
    host: process.env.DB_HOST || process.env.TYPEORM_HOST,
    port: parseInt(process.env.DB_PORT || process.env.TYPEORM_PORT || '3306'),
    username: process.env.DB_USERNAME || process.env.TYPEORM_USERNAME,
    password: process.env.DB_PASSWORD || process.env.TYPEORM_PASSWORD,
    database: process.env.DB_NAME || process.env.TYPEORM_DATABASE,
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    entities: [WeatherStation, Variable, Measurement],
};

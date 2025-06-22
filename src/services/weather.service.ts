import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeatherStation } from '../models/weather-station.entity';
import { Variable } from '../models/variable.entity';
import { Measurement } from 'src/models/measurement.entity';

@Injectable()
export class WeatherService {
    constructor(
        @InjectRepository(WeatherStation)
        private stationRepo: Repository<WeatherStation>,
        @InjectRepository(Variable)
        private variableRepo: Repository<Variable>,
        @InjectRepository(Measurement)
        private measurementRepo: Repository<Measurement>,
    ) { }

    async findAll(state?: string) {
        const where = state ? { state } : {};
        return this.stationRepo.find({ where });
    }

    async findOne(id: number) {
        const station = await this.stationRepo.findOne({ where: { id } });
        if (!station) return null;

        const variables = await this.variableRepo.find({ where: { weatherStation: { id } } });
        const result: any = {
            ...station,
            variables: [],
        };

        for (const variable of variables) {
            const latestMeasurement = await this.measurementRepo.findOne({
                where: { variable: { var_id: variable.var_id }, weatherStation: { id } },
                order: { timestamp: 'DESC' },
            });

            if (latestMeasurement) {
                result.variables.push({
                    name: variable.name,
                    long_name: variable.long_name,
                    unit: variable.unit,
                    value: latestMeasurement.value,
                    timestamp: latestMeasurement.timestamp,
                });
            }
        }

        return result;
    }
}

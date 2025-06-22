import { Controller, Get, Param, Query } from '@nestjs/common';
import { WeatherService } from '../services/weather.service';

@Controller('weather-stations')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) { }

    @Get()
    getAll(@Query('state') state?: string) {
        return this.weatherService.findAll(state);
    }

    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.weatherService.findOne(+id);
    }
}
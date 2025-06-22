import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { WeatherStation } from '../models/weather-station.entity';
import { Variable } from '../models/variable.entity';
import { Measurement } from '../models/measurement.entity';

const DATA_DIR = path.resolve(__dirname,  process.env.DATA_IMPORT_URL!);
const csvParser = require('csv-parser');

function parseTimestamp(input: string): Date | null {
    if (!input) return null;

    const direct = new Date(input);
    if (!isNaN(direct.getTime())) return direct;

    const asNumber = parseInt(input);
    if (!isNaN(asNumber)) {
        const isMilliseconds = asNumber > 1e12;
        const date = new Date(isMilliseconds ? asNumber : asNumber * 1000);
        return isNaN(date.getTime()) ? null : date;
    }

    return null;
}

export async function importCSVData(dataSource: DataSource) {
    const weatherStationRepo = dataSource.getRepository(WeatherStation);
    const variableRepo = dataSource.getRepository(Variable);
    const measurementRepo = dataSource.getRepository(Measurement);

    // 1. Import weather stations
    const weatherStationsPath = path.join(DATA_DIR, 'weather_stations.csv');
    await new Promise<void>((resolve) => {
        fs.createReadStream(weatherStationsPath)
            .pipe(csvParser())
            .on('data', async (data: any) => {
                const station = weatherStationRepo.create({
                    id: parseInt(data['id']),
                    ws_name: data['ws_name'],
                    site: data['site'],
                    portfolio: data['portfolio'],
                    state: data['state'],
                    latitude: parseFloat(data['latitude']),
                    longitude: parseFloat(data['longitude']),
                });
                await weatherStationRepo.save(station);
            })
            .on('end', () => {
                console.log('Imported weather stations');
                resolve();
            });
    });

    // 2. Import variables
    const variablesPath = path.join(DATA_DIR, 'variables.csv');
    await new Promise<void>((resolve) => {
        fs.createReadStream(variablesPath)
            .pipe(csvParser())
            .on('data', async (data: any) => {
                const station = await weatherStationRepo.findOneBy({ id: parseInt(data['id']) });
                if (station) {
                    const variable = variableRepo.create({
                        var_id: parseInt(data['var_id']),
                        name: data['name'],
                        unit: data['unit'],
                        long_name: data['long_name'],
                        weatherStation: station,
                    });
                    await variableRepo.save(variable);
                }
            })
            .on('end', () => {
                console.log('Imported variables');
                resolve();
            });
    });

    // 3. Import measurement files
    const files = fs.readdirSync(DATA_DIR).filter(file => /^data_\d+\.csv$/.test(file));

    for (const file of files) {
        const match = file.match(/^data_(\d+)\.csv$/);
        if (!match) {
            console.warn(`Skipping unrecognized file format: ${file}`);
            continue;
        }

        const stationId = parseInt(match[1]);
        const station = await weatherStationRepo.findOneBy({ id: stationId });
        if (!station) {
            console.warn(`No station found for id ${stationId} (file: ${file})`);
            continue;
        }

        const stationVariables = await variableRepo.find({ where: { weatherStation: { id: stationId } } });

        await new Promise<void>((resolve) => {
            fs.createReadStream(path.join(DATA_DIR, file))
                .pipe(csvParser())
                .on('data', async (row: any) => {
                    const rawTimestamp = row['timestamp'];
                    const timestamp = parseTimestamp(rawTimestamp);

                    if (!timestamp) {
                        console.warn(`Invalid timestamp "${rawTimestamp}" in ${file}, skipping row`);
                        return;
                    }

                    for (const key of Object.keys(row)) {
                        if (key === 'timestamp') continue;

                        const variable = stationVariables.find(v => v.name === key);
                        const value = parseFloat(row[key]);

                        if (variable && !isNaN(value)) {
                            const measurement = measurementRepo.create({
                                timestamp,
                                value,
                                weatherStation: station,
                                variable,
                            });
                            await measurementRepo.save(measurement);
                        }
                    }
                })
                .on('end', () => {
                    console.log(`Imported measurements from ${file}`);
                    resolve();
                });
        });
    }
}
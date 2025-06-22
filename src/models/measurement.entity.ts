import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { WeatherStation } from './weather-station.entity';
import { Variable } from './variable.entity';

@Entity()
export class Measurement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime')
    timestamp: Date;

    @Column('double')
    value: number;

    @ManyToOne(() => WeatherStation, station => station.measurements, { onDelete: 'CASCADE' })
    weatherStation: WeatherStation;

    @ManyToOne(() => Variable, variable => variable.measurements, { onDelete: 'CASCADE' })
    variable: Variable;
}
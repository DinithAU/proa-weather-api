import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { WeatherStation } from './weather-station.entity';
import { Measurement } from './measurement.entity';

@Entity()
export class Variable {
    @PrimaryGeneratedColumn()
    var_id: number;

    @Column()
    name: string;

    @Column()
    unit: string;

    @Column()
    long_name: string;

    @ManyToOne(() => WeatherStation, station => station.variables, { onDelete: 'CASCADE' })
    weatherStation: WeatherStation;

    @OneToMany(() => Measurement, measurement => measurement.variable)
    measurements: Measurement[];
}
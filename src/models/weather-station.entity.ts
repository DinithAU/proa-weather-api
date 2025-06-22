import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Variable } from './variable.entity';
import { Measurement } from './measurement.entity';

@Entity()
export class WeatherStation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ws_name: string;

    @Column()
    site: string;

    @Column()
    portfolio: string;

    @Column()
    state: string;

    @Column('double')
    latitude: number;

    @Column('double')
    longitude: number;

    @OneToMany(() => Variable, variable => variable.weatherStation)
    variables: Variable[];

    @OneToMany(() => Measurement, measurement => measurement.weatherStation)
    measurements: Measurement[];
}
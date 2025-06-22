import { AppDataSource } from '../data-source';
import { importCSVData } from '../utils/csv-import';

async function bootstrap() {
    try {
        await AppDataSource.initialize();
        await importCSVData(AppDataSource);
        console.log('Data import complete');
    } catch (error) {
        console.error('Failed to import CSV data:', error);
    }
}

bootstrap();
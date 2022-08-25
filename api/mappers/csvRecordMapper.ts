import { CSVRecord } from '../types/CSVRecord';
import { RestaurantToInsert } from '../types/Restaurant';
import { mapAllOpeningHoursIntoDaysWithOpeningHours } from './openingHoursMapper';

export const mapCSVRecordToRestaurant = (
    csvRecord: CSVRecord,
): RestaurantToInsert => {
    if (csvRecord.length !== 2) {
        throw new Error('Invalid input for mapping to a restaurant');
    }

    return {
        name: csvRecord[0],
        opening_hours: mapAllOpeningHoursIntoDaysWithOpeningHours(csvRecord[1]),
    };
};

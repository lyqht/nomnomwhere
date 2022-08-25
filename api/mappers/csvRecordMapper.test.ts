import { describe, expect, it } from 'vitest';
import { mapCSVRecordToRestaurant } from './csvRecordMapper';
import { RestaurantToInsert } from '../types/Restaurant';
import { CSVRecord } from '../types/CSVRecord';
describe('Restaurant Mapper', () => {
    it('should map csv record into a restaurant object', () => {
        const csvRecord: CSVRecord = ['EPIC Steak', 'Mon 6 am - 10:45 pm'];

        const expected: RestaurantToInsert = {
            name: csvRecord[0],
            opening_hours: [
                {
                    day: 'Mon',
                    openingTime: '6am',
                    closingTime: '10:45pm',
                },
            ],
        };
        expect(mapCSVRecordToRestaurant(csvRecord)).toStrictEqual(expected);
    });
});

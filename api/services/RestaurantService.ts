import { Restaurant, RestaurantToInsert } from '../types/Restaurant';
import { mapCSVRecordToRestaurant } from '../mappers/csvRecordMapper';
import { supabase } from '../db';
import { CSVRecord } from '../types/CSVRecord';

function spliceIntoChunks(arr: any[], chunkSize: number) {
    const res = [];
    while (arr.length > 0) {
        const chunk = arr.splice(
            0,
            arr.length < chunkSize ? arr.length : chunkSize,
        );
        res.push(chunk);
    }
    return res;
}

class RestaurantService {
    public async addRestaurantsFromCSVRecords(
        csvRecords: CSVRecord[],
    ): Promise<Restaurant[]> {
        console.log(`Adding ${csvRecords.length} restaurants...`);

        // There are 27514 restaurants in the sample demo, and processing them all at once may result in memory overflow.
        // Hence we split them up into multiple chunks before performing the operations to map and insert the restaurants.
        // Probably can add pooling to make this more efficient and parallelized

        const insertedRecords: Restaurant[] = [];
        const chunkedRecords = spliceIntoChunks(csvRecords, 100);
        const totalChunks = chunkedRecords.length;
        let currentChunkIndex = 1;

        try {
            console.log(
                `Split the data into ${totalChunks} chunks to be parsed and inserted into DB`,
            );
            for (const chunkedRecord of chunkedRecords) {
                const restaurantsToInsert: RestaurantToInsert[] = [];
                chunkedRecord.forEach((record) => {
                    restaurantsToInsert.push(mapCSVRecordToRestaurant(record));
                });

                console.log(`Inserting data for chunk ${currentChunkIndex}`);

                const { data, error } = await supabase
                    .from<Restaurant>('restaurants')
                    .insert(restaurantsToInsert);

                if (error) {
                    console.error(JSON.stringify(error));
                    throw new Error(JSON.stringify(error));
                }

                insertedRecords.push(...data);
                currentChunkIndex += 1;
            }
        } catch (error) {
            console.error('Met error inserting data into DB.');
        }
        console.log(`Number of Inserted Records: ${insertedRecords.length}`);

        return insertedRecords;
    }
}

export default new RestaurantService();

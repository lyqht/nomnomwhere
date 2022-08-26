import { v4 } from 'uuid';
import { supabase } from '../db';
import { Collection } from '../types/Collection';

class CollectionService {
    public async getCollections(): Promise<Collection[]> {
        const { data, error } = await supabase
            .from<Collection>('collections')
            .select();

        if (error) {
            console.error(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }

        return data ?? [];
    }

    public async addCollection(
        collection: Partial<Collection>,
    ): Promise<Collection> {
        const { data, error } = await supabase
            .from<Collection>('collections')
            .insert({ ...collection, id: v4() });

        if (error) {
            console.error(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }
        return data[0];
    }

    public async addRestaurantToCollection({
        restaurantId,
        collectionId,
    }: {
        restaurantId: string;
        collectionId: string;
    }): Promise<Collection> {
        const { data: foundCollections, error } = await supabase
            .from<Collection>('collections')
            .select()
            .eq('id', collectionId);

        if (error) {
            console.error(JSON.stringify(error));
            throw new Error(JSON.stringify(error));
        }

        const savedRestaurants = foundCollections[0].savedRestaurants;
        if (!savedRestaurants.includes(restaurantId)) {
            savedRestaurants.push(restaurantId);
            const { data, error: updateError } = await supabase
                .from<Collection>('collections')
                .update({ savedRestaurants })
                .eq('id', collectionId);

            if (updateError) {
                console.error(JSON.stringify(updateError));
                throw new Error(JSON.stringify(updateError));
            }
            return data[0];
        }

        return foundCollections[0];
    }
}

export default new CollectionService();

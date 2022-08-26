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
}

export default new CollectionService();

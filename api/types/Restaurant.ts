import { Database } from './DatabaseDefinitions';
import { DayWithOpeningHours } from './OpeningHours';

export type Restaurant = Database['public']['Tables']['restaurants']['Row'] & {
    opening_hours: DayWithOpeningHours[];
};
export type RestaurantToInsert =
    Database['public']['Tables']['restaurants']['Insert'] & {
        opening_hours: DayWithOpeningHours[];
    };

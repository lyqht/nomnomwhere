import { Database } from './DatabaseDefinitions';
import { DayWithOpeningHours } from './OpeningHours';

export type Restaurant = Database['public']['Tables']['restaurants']['Row'] & {
    opening_hours: DayWithOpeningHours[];
};
export type RestaurantToInsert = Partial<Restaurant>;

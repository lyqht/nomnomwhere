import { Database, Json } from './DatabaseDefinitions';

export type DayWithOpeningHours = Json & {
    day: string;
    openingTime: string | null;
    closingTime: string | null;
};

export type CSVRecord = [string, string];

export type Collection = Database['public']['Tables']['collections']['Row'];

export type Restaurant = Database['public']['Tables']['restaurants']['Row'] & {
    opening_hours: DayWithOpeningHours[];
};
export type RestaurantToInsert = Partial<Restaurant>;

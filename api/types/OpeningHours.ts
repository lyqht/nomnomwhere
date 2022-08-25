import { Json } from './DatabaseDefinitions';

export type DayWithOpeningHours = Json & {
    day: string;
    openingTime: string | null;
    closingTime: string | null;
};

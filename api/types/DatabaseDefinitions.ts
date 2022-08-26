export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[];

export interface Database {
    public: {
        Tables: {
            restaurants: {
                Row: {
                    created_at: string;
                    opening_hours: Json;
                    name: string;
                    id: string;
                };
                Insert: {
                    created_at?: string | null;
                    opening_hours: Json;
                    name: string;
                    id?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    opening_hours?: Json;
                    name?: string;
                    id?: string | null;
                };
            };
            collections: {
                Row: {
                    created_at: string | null;
                    userId: string | null;
                    savedRestaurants: string[];
                    name: string;
                    id: string;
                };
                Insert: {
                    created_at?: string | null;
                    userId?: string | null;
                    savedRestaurants: string[];
                    name: string;
                    id?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    userId?: string | null;
                    savedRestaurants?: string[];
                    name?: string;
                    id?: string | null;
                };
            };
        };
    };
}

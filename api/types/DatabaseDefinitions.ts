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
                    id: number;
                    created_at: string;
                    opening_hours: Json;
                    name: string;
                };
                Insert: {
                    id?: number;
                    created_at?: string | null;
                    opening_hours: Json;
                    name: string;
                };
                Update: {
                    id?: number;
                    created_at?: string | null;
                    opening_hours?: Json;
                    name?: string;
                };
            };
            collections: {
                Row: {
                    id: number;
                    created_at: string | null;
                    userId: string | null;
                    savedRestaurants: string[];
                    name: string;
                };
                Insert: {
                    id?: number;
                    created_at?: string | null;
                    userId?: string | null;
                    savedRestaurants: string[];
                    name: string;
                };
                Update: {
                    id?: number;
                    created_at?: string | null;
                    userId?: string | null;
                    savedRestaurants?: string[];
                    name?: string;
                };
            };
        };
    };
}

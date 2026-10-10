import type { JSONContent } from '@tiptap/core';
import type { Database as GeneratedDatabase } from './database.types';
import type { DBMedia } from './models/media';
import type { BadgeAvailability } from './models/profileBadge';

type Overlay<T, U> = Flatten<Omit<T, keyof U> & U>;
type Flatten<T> = { [K in keyof T]: T[K] };

type GeneratedSchema = GeneratedDatabase['public'];
type GeneratedTables = GeneratedSchema['Tables'];

type ColumnOverrides = {
  news: {
    content: JSONContent | null;
    hero_image: DBMedia | null;
  };
  profile_badges: {
    available_to: BadgeAvailability | null;
  };
};

type PublicTables = {
  [T in keyof GeneratedTables]: T extends keyof ColumnOverrides
    ? Overlay<
        GeneratedTables[T],
        {
          Row: Overlay<GeneratedTables[T]['Row'], ColumnOverrides[T]>;
          Insert: Overlay<GeneratedTables[T]['Insert'], Partial<ColumnOverrides[T]>>;
          Update: Overlay<GeneratedTables[T]['Update'], Partial<ColumnOverrides[T]>>;
        }
      >
    : GeneratedTables[T];
};

type PublicSchema = Overlay<GeneratedSchema, { Tables: PublicTables }>;

export type Database = Overlay<GeneratedDatabase, { public: PublicSchema }>;

export type Tables<T extends keyof PublicTables> = PublicTables[T]['Row'];
export type TablesInsert<T extends keyof PublicTables> = PublicTables[T]['Insert'];
export type TablesUpdate<T extends keyof PublicTables> = PublicTables[T]['Update'];
export type Enums<T extends keyof GeneratedSchema['Enums']> = GeneratedSchema['Enums'][T];
export type { Json } from './database.types';

import type { JSONContent } from '@tiptap/core';
import type { Database as GeneratedDatabase } from './database.types';
import type { DBAuthor } from './models/author';
import type { DBCategory } from './models/category';
import type { DifficultyLevel } from './models/library';
import type { DBMedia, IMediaFile } from './models/media';
import type { Moderation } from './models/moderation';
import type { BadgeAvailability } from './models/profileBadge';

type Overlay<T, U> = Flatten<Omit<T, keyof U> & U>;
type Flatten<T> = { [K in keyof T]: T[K] };

type GeneratedSchema = GeneratedDatabase['public'];
type GeneratedTables = GeneratedSchema['Tables'];
type GeneratedFunctions = GeneratedSchema['Functions'];

type ColumnOverrides = {
  news: {
    content: JSONContent | null;
    hero_image: DBMedia | null;
  };
  profile_badges: {
    available_to: BadgeAvailability | null;
  };
  questions: {
    images: DBMedia[] | null;
  };
  research: {
    image: DBMedia | null;
  };
  projects: {
    cover_image: DBMedia | null;
    files: IMediaFile[] | null;
    difficulty_level: DifficultyLevel | null;
    moderation: Moderation | null;
  };
  project_steps: {
    images: DBMedia[] | null;
  };
  research_updates: {
    images: DBMedia[] | null;
    files: IMediaFile[] | null;
  };
};

type ReturnOverrides = {
  get_questions: {
    author: DBAuthor | null;
    category: DBCategory | null;
    images: DBMedia[] | null;
  };
  get_user_questions: {
    images: DBMedia[] | null;
  };
  get_research: {
    author: DBAuthor | null;
    category: DBCategory | null;
    image: DBMedia | null;
  };
  get_user_research: {
    image: DBMedia | null;
  };
  get_projects: {
    author: DBAuthor | null;
    category: DBCategory | null;
    cover_image: DBMedia | null;
    moderation: Moderation;
  };
  get_user_projects: {
    cover_image: DBMedia | null;
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

type PublicFunctions = {
  [F in keyof GeneratedFunctions]: F extends keyof ReturnOverrides
    ? Overlay<
        GeneratedFunctions[F],
        { Returns: Overlay<GeneratedFunctions[F]['Returns'][number], ReturnOverrides[F]>[] }
      >
    : GeneratedFunctions[F];
};

type PublicSchema = Overlay<GeneratedSchema, { Tables: PublicTables; Functions: PublicFunctions }>;

export type Database = Overlay<GeneratedDatabase, { public: PublicSchema }>;

export type Tables<T extends keyof PublicTables> = PublicTables[T]['Row'];
export type TablesInsert<T extends keyof PublicTables> = PublicTables[T]['Insert'];
export type TablesUpdate<T extends keyof PublicTables> = PublicTables[T]['Update'];
export type Enums<T extends keyof GeneratedSchema['Enums']> = GeneratedSchema['Enums'][T];
export type { Json } from './database.types';

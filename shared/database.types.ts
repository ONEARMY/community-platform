export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      banners: {
        Row: {
          created_at: string;
          id: number;
          modified_at: string | null;
          tenant_id: string;
          text: string;
          url: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          modified_at?: string | null;
          tenant_id: string;
          text: string;
          url?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          modified_at?: string | null;
          tenant_id?: string;
          text?: string;
          url?: string | null;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: number;
          image_url: string | null;
          name: string;
          tenant_id: string;
          type: Database['public']['Enums']['content_types'] | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          name: string;
          tenant_id: string;
          type?: Database['public']['Enums']['content_types'] | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          name?: string;
          tenant_id?: string;
          type?: Database['public']['Enums']['content_types'] | null;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          comment: string;
          created_at: string;
          created_by: number | null;
          deleted: boolean | null;
          id: number;
          modified_at: string | null;
          parent_id: number | null;
          source_id: number | null;
          source_id_legacy: string | null;
          source_type: string;
          tenant_id: string;
        };
        Insert: {
          comment: string;
          created_at?: string;
          created_by?: number | null;
          deleted?: boolean | null;
          id?: number;
          modified_at?: string | null;
          parent_id?: number | null;
          source_id?: number | null;
          source_id_legacy?: string | null;
          source_type: string;
          tenant_id?: string;
        };
        Update: {
          comment?: string;
          created_at?: string;
          created_by?: number | null;
          deleted?: boolean | null;
          id?: number;
          modified_at?: string | null;
          parent_id?: number | null;
          source_id?: number | null;
          source_id_legacy?: string | null;
          source_type?: string;
          tenant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'comment_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      file_downloads: {
        Row: {
          content_id: number;
          content_type: string;
          downloaded_at: string | null;
          file_id: string;
          id: number;
          profile_id: number;
          tenant_id: string;
        };
        Insert: {
          content_id: number;
          content_type: string;
          downloaded_at?: string | null;
          file_id: string;
          id?: never;
          profile_id: number;
          tenant_id: string;
        };
        Update: {
          content_id?: number;
          content_type?: string;
          downloaded_at?: string | null;
          file_id?: string;
          id?: never;
          profile_id?: number;
          tenant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'file_downloads_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      map_pins: {
        Row: {
          administrative: string | null;
          country: string;
          country_code: string;
          created_at: string;
          id: number;
          lat: string;
          lng: string;
          moderation: string;
          moderation_feedback: string | null;
          name: string | null;
          post_code: string | null;
          profile_id: number;
          tenant_id: string;
        };
        Insert: {
          administrative?: string | null;
          country: string;
          country_code: string;
          created_at?: string;
          id?: number;
          lat: string;
          lng: string;
          moderation: string;
          moderation_feedback?: string | null;
          name?: string | null;
          post_code?: string | null;
          profile_id: number;
          tenant_id: string;
        };
        Update: {
          administrative?: string | null;
          country?: string;
          country_code?: string;
          created_at?: string;
          id?: number;
          lat?: string;
          lng?: string;
          moderation?: string;
          moderation_feedback?: string | null;
          name?: string | null;
          post_code?: string | null;
          profile_id?: number;
          tenant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'map_pins_user_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      map_settings: {
        Row: {
          default_type_filters: string[] | null;
          id: number;
          setting_filters: string[];
          tenant_id: string;
        };
        Insert: {
          default_type_filters?: string[] | null;
          id?: number;
          setting_filters: string[];
          tenant_id: string;
        };
        Update: {
          default_type_filters?: string[] | null;
          id?: number;
          setting_filters?: string[];
          tenant_id?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          created_at: string;
          id: number;
          message: string;
          receiver_id: number | null;
          sender_id: number;
          tenant_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          message: string;
          receiver_id?: number | null;
          sender_id: number;
          tenant_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          message?: string;
          receiver_id?: number | null;
          sender_id?: number;
          tenant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_receiver_fkey';
            columns: ['receiver_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_sender_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      news: {
        Row: {
          body: string;
          category: number | null;
          comment_count: number | null;
          content: Json | null;
          content_fts: unknown;
          content_reach: Database['public']['Enums']['content_reach'] | null;
          content_search_text: string | null;
          created_at: string;
          created_by: number | null;
          deleted: boolean | null;
          fts: unknown;
          hero_image: Json | null;
          id: number;
          is_draft: boolean;
          moderation: string | null;
          modified_at: string | null;
          poll: number | null;
          previous_slugs: string[] | null;
          published_at: string | null;
          slug: string;
          summary: string | null;
          tags: number[] | null;
          tenant_id: string;
          title: string;
          total_views: number | null;
          news_search_fields: string | null;
        };
        Insert: {
          body: string;
          category?: number | null;
          comment_count?: number | null;
          content?: Json | null;
          content_fts?: unknown;
          content_reach?: Database['public']['Enums']['content_reach'] | null;
          content_search_text?: string | null;
          created_at?: string;
          created_by?: number | null;
          deleted?: boolean | null;
          fts?: unknown;
          hero_image?: Json | null;
          id?: number;
          is_draft?: boolean;
          moderation?: string | null;
          modified_at?: string | null;
          poll?: number | null;
          previous_slugs?: string[] | null;
          published_at?: string | null;
          slug: string;
          summary?: string | null;
          tags?: number[] | null;
          tenant_id: string;
          title: string;
          total_views?: number | null;
        };
        Update: {
          body?: string;
          category?: number | null;
          comment_count?: number | null;
          content?: Json | null;
          content_fts?: unknown;
          content_reach?: Database['public']['Enums']['content_reach'] | null;
          content_search_text?: string | null;
          created_at?: string;
          created_by?: number | null;
          deleted?: boolean | null;
          fts?: unknown;
          hero_image?: Json | null;
          id?: number;
          is_draft?: boolean;
          moderation?: string | null;
          modified_at?: string | null;
          poll?: number | null;
          previous_slugs?: string[] | null;
          published_at?: string | null;
          slug?: string;
          summary?: string | null;
          tags?: number[] | null;
          tenant_id?: string;
          title?: string;
          total_views?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'news_category_fkey';
            columns: ['category'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'news_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'news_poll_fkey';
            columns: ['poll'];
            isOneToOne: true;
            referencedRelation: 'polls';
            referencedColumns: ['id'];
          },
        ];
      };
      news_badges_relations: {
        Row: {
          created_at: string;
          id: number;
          news_id: number;
          profile_badge_id: number;
          tenant_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          news_id: number;
          profile_badge_id: number;
          tenant_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          news_id?: number;
          profile_badge_id?: number;
          tenant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'news_badges_relations_news_id_fkey';
            columns: ['news_id'];
            isOneToOne: false;
            referencedRelation: 'news';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'news_badges_relations_profile_badge_id_fkey';
            columns: ['profile_badge_id'];
            isOneToOne: false;
            referencedRelation: 'profile_badges';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          action_type: Database['public']['Enums']['notification_action_types'];
          content_id: number;
          content_type: Database['public']['Enums']['notification_content_types'];
          created_at: string;
          id: number;
          is_read: boolean | null;
          modified_at: string | null;
          owned_by_id: number;
          parent_comment_id: number | null;
          parent_content_id: number | null;
          should_email: boolean | null;
          source_content_id: number | null;
          source_content_type: string | null;
          tenant_id: string;
          title: string | null;
          triggered_by_id: number | null;
        };
        Insert: {
          action_type: Database['public']['Enums']['notification_action_types'];
          content_id: number;
          content_type: Database['public']['Enums']['notification_content_types'];
          created_at?: string;
          id?: number;
          is_read?: boolean | null;
          modified_at?: string | null;
          owned_by_id: number;
          parent_comment_id?: number | null;
          parent_content_id?: number | null;
          should_email?: boolean | null;
          source_content_id?: number | null;
          source_content_type?: string | null;
          tenant_id: string;
          title?: string | null;
          triggered_by_id?: number | null;
        };
        Update: {
          action_type?: Database['public']['Enums']['notification_action_types'];
          content_id?: number;
          content_type?: Database['public']['Enums']['notification_content_types'];
          created_at?: string;
          id?: number;
          is_read?: boolean | null;
          modified_at?: string | null;
          owned_by_id?: number;
          parent_comment_id?: number | null;
          parent_content_id?: number | null;
          should_email?: boolean | null;
          source_content_id?: number | null;
          source_content_type?: string | null;
          tenant_id?: string;
          title?: string | null;
          triggered_by_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_owned_by_id_fkey';
            columns: ['owned_by_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_triggered_by_id_fkey';
            columns: ['triggered_by_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications_preferences: {
        Row: {
          comments: boolean;
          content_reach: Database['public']['Enums']['content_reach'] | null;
          id: number;
          is_unsubscribed: boolean;
          replies: boolean;
          research_updates: boolean;
          tenant_id: string;
          user_id: number;
        };
        Insert: {
          comments: boolean;
          content_reach?: Database['public']['Enums']['content_reach'] | null;
          id?: number;
          is_unsubscribed?: boolean;
          replies: boolean;
          research_updates: boolean;
          tenant_id: string;
          user_id: number;
        };
        Update: {
          comments?: boolean;
          content_reach?: Database['public']['Enums']['content_reach'] | null;
          id?: number;
          is_unsubscribed?: boolean;
          replies?: boolean;
          research_updates?: boolean;
          tenant_id?: string;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_preferences_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      organisation_applications: {
        Row: {
          auth_id: string;
          created_at: string;
          id: number;
          tenant_id: string;
        };
        Insert: {
          auth_id: string;
          created_at?: string;
          id?: number;
          tenant_id: string;
        };
        Update: {
          auth_id?: string;
          created_at?: string;
          id?: number;
          tenant_id?: string;
        };
        Relationships: [];
      };
      poll_options: {
        Row: {
          description: string;
          id: number;
          poll_id: number | null;
          tenant_id: string;
          vote_count: number;
        };
        Insert: {
          description: string;
          id?: number;
          poll_id?: number | null;
          tenant_id?: string;
          vote_count?: number;
        };
        Update: {
          description?: string;
          id?: number;
          poll_id?: number | null;
          tenant_id?: string;
          vote_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'poll_option_of_fkey';
            columns: ['poll_id'];
            isOneToOne: false;
            referencedRelation: 'polls';
            referencedColumns: ['id'];
          },
        ];
      };
      poll_votes: {
        Row: {
          id: number;
          poll_option_id: number | null;
          profile_id: number | null;
          tenant_id: string;
        };
        Insert: {
          id?: number;
          poll_option_id?: number | null;
          profile_id?: number | null;
          tenant_id?: string;
        };
        Update: {
          id?: number;
          poll_option_id?: number | null;
          profile_id?: number | null;
          tenant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'vote_for_fkey';
            columns: ['poll_option_id'];
            isOneToOne: false;
            referencedRelation: 'poll_options';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'voted_by_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      polls: {
        Row: {
          id: number;
          single_choice: boolean;
          tenant_id: string;
          title: string;
        };
        Insert: {
          id?: number;
          single_choice?: boolean;
          tenant_id?: string;
          title: string;
        };
        Update: {
          id?: number;
          single_choice?: boolean;
          tenant_id?: string;
          title?: string;
        };
        Relationships: [];
      };
      profile_badges: {
        Row: {
          action_label: string | null;
          action_url: string | null;
          available_to: string | null;
          display_name: string;
          grants_badge_id: number | null;
          id: number;
          image_url: string;
          is_audience: boolean;
          name: string;
          premium_tier: number | null;
          tenant_id: string;
        };
        Insert: {
          action_label?: string | null;
          action_url?: string | null;
          available_to?: string | null;
          display_name: string;
          grants_badge_id?: number | null;
          id?: number;
          image_url: string;
          is_audience?: boolean;
          name: string;
          premium_tier?: number | null;
          tenant_id: string;
        };
        Update: {
          action_label?: string | null;
          action_url?: string | null;
          available_to?: string | null;
          display_name?: string;
          grants_badge_id?: number | null;
          id?: number;
          image_url?: string;
          is_audience?: boolean;
          name?: string;
          premium_tier?: number | null;
          tenant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_badges_grants_badge_id_fkey';
            columns: ['grants_badge_id'];
            isOneToOne: false;
            referencedRelation: 'profile_badges';
            referencedColumns: ['id'];
          },
        ];
      };
      profile_badges_relations: {
        Row: {
          created_at: string;
          id: number;
          profile_badge_id: number;
          profile_id: number;
          tenant_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          profile_badge_id: number;
          profile_id: number;
          tenant_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          profile_badge_id?: number;
          profile_id?: number;
          tenant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_badges_relations_profile_badge_id_fkey';
            columns: ['profile_badge_id'];
            isOneToOne: false;
            referencedRelation: 'profile_badges';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profile_badges_relations_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profile_tags: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          profile_type: string | null;
          tenant_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
          profile_type?: string | null;
          tenant_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          profile_type?: string | null;
          tenant_id?: string;
        };
        Relationships: [];
      };
      profile_tags_relations: {
        Row: {
          created_at: string;
          id: number;
          profile_id: number;
          profile_tag_id: number;
          tenant_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          profile_id: number;
          profile_tag_id: number;
          tenant_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          profile_id?: number;
          profile_tag_id?: number;
          tenant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_tags_relations_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profile_tags_relations_profile_tag_id_fkey';
            columns: ['profile_tag_id'];
            isOneToOne: false;
            referencedRelation: 'profile_tags';
            referencedColumns: ['id'];
          },
        ];
      };
      profile_types: {
        Row: {
          description: string;
          display_name: string;
          id: number;
          image_url: string;
          is_space: boolean;
          map_pin_name: string;
          name: string;
          order: number;
          small_image_url: string;
          tenant_id: string;
        };
        Insert: {
          description: string;
          display_name: string;
          id?: number;
          image_url: string;
          is_space: boolean;
          map_pin_name: string;
          name: string;
          order: number;
          small_image_url: string;
          tenant_id: string;
        };
        Update: {
          description?: string;
          display_name?: string;
          id?: number;
          image_url?: string;
          is_space?: boolean;
          map_pin_name?: string;
          name?: string;
          order?: number;
          small_image_url?: string;
          tenant_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          about: string | null;
          auth_id: string | null;
          country: string | null;
          cover_images: Json[] | null;
          created_at: string;
          display_name: string;
          donations_enabled: boolean;
          firebase_auth_id: string | null;
          id: number;
          impact: Json | null;
          is_blocked_from_messaging: boolean | null;
          is_contactable: boolean | null;
          is_supporter: boolean | null;
          last_active: string | null;
          legacy_id: string | null;
          moderation: string | null;
          moderation_feedback: string | null;
          patreon: Json | null;
          photo: Json | null;
          profile_type: number | null;
          roles: string[] | null;
          signup_source: string;
          tenant_id: string;
          total_views: number | null;
          type: string | null;
          username: string | null;
          visitor_policy: Json | null;
          website: string | null;
        };
        Insert: {
          about?: string | null;
          auth_id?: string | null;
          country?: string | null;
          cover_images?: Json[] | null;
          created_at?: string;
          display_name: string;
          donations_enabled?: boolean;
          firebase_auth_id?: string | null;
          id?: number;
          impact?: Json | null;
          is_blocked_from_messaging?: boolean | null;
          is_contactable?: boolean | null;
          is_supporter?: boolean | null;
          last_active?: string | null;
          legacy_id?: string | null;
          moderation?: string | null;
          moderation_feedback?: string | null;
          patreon?: Json | null;
          photo?: Json | null;
          profile_type?: number | null;
          roles?: string[] | null;
          signup_source?: string;
          tenant_id: string;
          total_views?: number | null;
          type?: string | null;
          username?: string | null;
          visitor_policy?: Json | null;
          website?: string | null;
        };
        Update: {
          about?: string | null;
          auth_id?: string | null;
          country?: string | null;
          cover_images?: Json[] | null;
          created_at?: string;
          display_name?: string;
          donations_enabled?: boolean;
          firebase_auth_id?: string | null;
          id?: number;
          impact?: Json | null;
          is_blocked_from_messaging?: boolean | null;
          is_contactable?: boolean | null;
          is_supporter?: boolean | null;
          last_active?: string | null;
          legacy_id?: string | null;
          moderation?: string | null;
          moderation_feedback?: string | null;
          patreon?: Json | null;
          photo?: Json | null;
          profile_type?: number | null;
          roles?: string[] | null;
          signup_source?: string;
          tenant_id?: string;
          total_views?: number | null;
          type?: string | null;
          username?: string | null;
          visitor_policy?: Json | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_profile_type_fkey';
            columns: ['profile_type'];
            isOneToOne: false;
            referencedRelation: 'profile_types';
            referencedColumns: ['id'];
          },
        ];
      };
      project_steps: {
        Row: {
          created_at: string;
          description: string;
          id: number;
          images: Json | null;
          order: number | null;
          project_id: number;
          tenant_id: string;
          title: string;
          video_url: string | null;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: number;
          images?: Json | null;
          order?: number | null;
          project_id: number;
          tenant_id: string;
          title: string;
          video_url?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: number;
          images?: Json | null;
          order?: number | null;
          project_id?: number;
          tenant_id?: string;
          title?: string;
          video_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'project_steps_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      projects: {
        Row: {
          category: number | null;
          comment_count: number | null;
          cover_image: Json | null;
          created_at: string;
          created_by: number | null;
          deleted: boolean | null;
          description: string;
          difficulty_level: string | null;
          file_download_count: number | null;
          file_link: string | null;
          files: Json[] | null;
          fts: unknown;
          id: number;
          is_draft: boolean | null;
          moderation: string | null;
          moderation_feedback: string | null;
          modified_at: string | null;
          previous_slugs: string[] | null;
          published_at: string | null;
          slug: string;
          tags: string[] | null;
          tenant_id: string;
          time: string | null;
          title: string;
          total_views: number | null;
        };
        Insert: {
          category?: number | null;
          comment_count?: number | null;
          cover_image?: Json | null;
          created_at?: string;
          created_by?: number | null;
          deleted?: boolean | null;
          description: string;
          difficulty_level?: string | null;
          file_download_count?: number | null;
          file_link?: string | null;
          files?: Json[] | null;
          fts?: unknown;
          id?: number;
          is_draft?: boolean | null;
          moderation?: string | null;
          moderation_feedback?: string | null;
          modified_at?: string | null;
          previous_slugs?: string[] | null;
          published_at?: string | null;
          slug: string;
          tags?: string[] | null;
          tenant_id: string;
          time?: string | null;
          title: string;
          total_views?: number | null;
        };
        Update: {
          category?: number | null;
          comment_count?: number | null;
          cover_image?: Json | null;
          created_at?: string;
          created_by?: number | null;
          deleted?: boolean | null;
          description?: string;
          difficulty_level?: string | null;
          file_download_count?: number | null;
          file_link?: string | null;
          files?: Json[] | null;
          fts?: unknown;
          id?: number;
          is_draft?: boolean | null;
          moderation?: string | null;
          moderation_feedback?: string | null;
          modified_at?: string | null;
          previous_slugs?: string[] | null;
          published_at?: string | null;
          slug?: string;
          tags?: string[] | null;
          tenant_id?: string;
          time?: string | null;
          title?: string;
          total_views?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'projects_category_id_fkey';
            columns: ['category'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'projects_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      questions: {
        Row: {
          accepted_answer_date: string | null;
          accepted_answer_id: number | null;
          category: number | null;
          comment_count: number | null;
          created_at: string;
          created_by: number | null;
          deleted: boolean | null;
          description: string;
          fts: unknown;
          id: number;
          images: Json[] | null;
          is_draft: boolean;
          moderation: string | null;
          modified_at: string;
          previous_slugs: string[] | null;
          published_at: string | null;
          slug: string;
          tags: number[] | null;
          tenant_id: string;
          title: string;
          total_views: number | null;
          questions_search_fields: string | null;
        };
        Insert: {
          accepted_answer_date?: string | null;
          accepted_answer_id?: number | null;
          category?: number | null;
          comment_count?: number | null;
          created_at?: string;
          created_by?: number | null;
          deleted?: boolean | null;
          description: string;
          fts?: unknown;
          id?: number;
          images?: Json[] | null;
          is_draft?: boolean;
          moderation?: string | null;
          modified_at?: string;
          previous_slugs?: string[] | null;
          published_at?: string | null;
          slug: string;
          tags?: number[] | null;
          tenant_id: string;
          title: string;
          total_views?: number | null;
        };
        Update: {
          accepted_answer_date?: string | null;
          accepted_answer_id?: number | null;
          category?: number | null;
          comment_count?: number | null;
          created_at?: string;
          created_by?: number | null;
          deleted?: boolean | null;
          description?: string;
          fts?: unknown;
          id?: number;
          images?: Json[] | null;
          is_draft?: boolean;
          moderation?: string | null;
          modified_at?: string;
          previous_slugs?: string[] | null;
          published_at?: string | null;
          slug?: string;
          tags?: number[] | null;
          tenant_id?: string;
          title?: string;
          total_views?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'question_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'questions_accepted_answer_id_fkey';
            columns: ['accepted_answer_id'];
            isOneToOne: false;
            referencedRelation: 'comments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'questions_category_fkey';
            columns: ['category'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      remakes: {
        Row: {
          created_at: string;
          created_by: number;
          description: string | null;
          id: number;
          images: Json;
          modified_at: string | null;
          project_id: number;
          tenant_id: string;
        };
        Insert: {
          created_at?: string;
          created_by: number;
          description?: string | null;
          id?: number;
          images: Json;
          modified_at?: string | null;
          project_id: number;
          tenant_id: string;
        };
        Update: {
          created_at?: string;
          created_by?: number;
          description?: string | null;
          id?: number;
          images?: Json;
          modified_at?: string | null;
          project_id?: number;
          tenant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'remakes_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'remakes_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      research: {
        Row: {
          category: number | null;
          collaborators: string[] | null;
          created_at: string;
          created_by: number | null;
          deleted: boolean | null;
          description: string;
          fts: unknown;
          id: number;
          image: Json | null;
          is_draft: boolean | null;
          modified_at: string | null;
          previous_slugs: string[] | null;
          published_at: string | null;
          slug: string;
          status: Database['public']['Enums']['research_status'] | null;
          tags: string[] | null;
          tenant_id: string;
          title: string;
          total_useful: number | null;
          total_views: number | null;
        };
        Insert: {
          category?: number | null;
          collaborators?: string[] | null;
          created_at?: string;
          created_by?: number | null;
          deleted?: boolean | null;
          description: string;
          fts?: unknown;
          id?: number;
          image?: Json | null;
          is_draft?: boolean | null;
          modified_at?: string | null;
          previous_slugs?: string[] | null;
          published_at?: string | null;
          slug: string;
          status?: Database['public']['Enums']['research_status'] | null;
          tags?: string[] | null;
          tenant_id: string;
          title: string;
          total_useful?: number | null;
          total_views?: number | null;
        };
        Update: {
          category?: number | null;
          collaborators?: string[] | null;
          created_at?: string;
          created_by?: number | null;
          deleted?: boolean | null;
          description?: string;
          fts?: unknown;
          id?: number;
          image?: Json | null;
          is_draft?: boolean | null;
          modified_at?: string | null;
          previous_slugs?: string[] | null;
          published_at?: string | null;
          slug?: string;
          status?: Database['public']['Enums']['research_status'] | null;
          tags?: string[] | null;
          tenant_id?: string;
          title?: string;
          total_useful?: number | null;
          total_views?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'research_category_fkey';
            columns: ['category'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'research_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      research_updates: {
        Row: {
          comment_count: number | null;
          created_at: string;
          created_by: number | null;
          deleted: boolean | null;
          description: string;
          file_download_count: number | null;
          file_link: string | null;
          files: Json[] | null;
          id: number;
          images: Json[] | null;
          is_draft: boolean | null;
          modified_at: string | null;
          order: number | null;
          published_at: string | null;
          research_id: number;
          tenant_id: string;
          title: string;
          video_url: string | null;
        };
        Insert: {
          comment_count?: number | null;
          created_at?: string;
          created_by?: number | null;
          deleted?: boolean | null;
          description: string;
          file_download_count?: number | null;
          file_link?: string | null;
          files?: Json[] | null;
          id?: number;
          images?: Json[] | null;
          is_draft?: boolean | null;
          modified_at?: string | null;
          order?: number | null;
          published_at?: string | null;
          research_id: number;
          tenant_id: string;
          title: string;
          video_url?: string | null;
        };
        Update: {
          comment_count?: number | null;
          created_at?: string;
          created_by?: number | null;
          deleted?: boolean | null;
          description?: string;
          file_download_count?: number | null;
          file_link?: string | null;
          files?: Json[] | null;
          id?: number;
          images?: Json[] | null;
          is_draft?: boolean | null;
          modified_at?: string | null;
          order?: number | null;
          published_at?: string | null;
          research_id?: number;
          tenant_id?: string;
          title?: string;
          video_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'research_update_research_id_fkey';
            columns: ['research_id'];
            isOneToOne: false;
            referencedRelation: 'research';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'research_updates_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      stripe_badge_products: {
        Row: {
          badge_id: number;
          id: number;
          name: string;
          stripe_product_id: string;
          tenant_id: string;
        };
        Insert: {
          badge_id: number;
          id?: number;
          name?: string;
          stripe_product_id: string;
          tenant_id: string;
        };
        Update: {
          badge_id?: number;
          id?: number;
          name?: string;
          stripe_product_id?: string;
          tenant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'stripe_badge_products_badge_id_fkey';
            columns: ['badge_id'];
            isOneToOne: false;
            referencedRelation: 'profile_badges';
            referencedColumns: ['id'];
          },
        ];
      };
      stripe_customers: {
        Row: {
          auth_id: string;
          created_at: string;
          id: number;
          stripe_customer_id: string;
          tenant_id: string;
        };
        Insert: {
          auth_id: string;
          created_at?: string;
          id?: number;
          stripe_customer_id: string;
          tenant_id: string;
        };
        Update: {
          auth_id?: string;
          created_at?: string;
          id?: number;
          stripe_customer_id?: string;
          tenant_id?: string;
        };
        Relationships: [];
      };
      stripe_tier_config: {
        Row: {
          badge_id: number;
          color: string;
          description: string;
          id: number;
          tenant_id: string;
          thank_you_image_url: string | null;
        };
        Insert: {
          badge_id: number;
          color: string;
          description: string;
          id?: number;
          tenant_id: string;
          thank_you_image_url?: string | null;
        };
        Update: {
          badge_id?: number;
          color?: string;
          description?: string;
          id?: number;
          tenant_id?: string;
          thank_you_image_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'stripe_tier_config_badge_id_fkey';
            columns: ['badge_id'];
            isOneToOne: false;
            referencedRelation: 'profile_badges';
            referencedColumns: ['id'];
          },
        ];
      };
      subscribers: {
        Row: {
          content_id: number;
          content_type: string;
          created_at: string;
          id: number;
          tenant_id: string;
          user_id: number;
        };
        Insert: {
          content_id: number;
          content_type: string;
          created_at?: string;
          id?: number;
          tenant_id: string;
          user_id: number;
        };
        Update: {
          content_id?: number;
          content_type?: string;
          created_at?: string;
          id?: number;
          tenant_id?: string;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'subscribers_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      tags: {
        Row: {
          created_at: string;
          id: number;
          modified_at: string | null;
          name: string;
          tenant_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          modified_at?: string | null;
          name: string;
          tenant_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          modified_at?: string | null;
          name?: string;
          tenant_id?: string;
        };
        Relationships: [];
      };
      tenant_settings: {
        Row: {
          academy_resource: string | null;
          color_accent: string | null;
          color_accent_hover: string | null;
          color_primary: string | null;
          color_primary_hover: string | null;
          color_secondary: string | null;
          create_research_roles: string[] | null;
          created_at: string;
          donation_settings: Json | null;
          email_from: string | null;
          ga_tracking_id: string | null;
          hidden_modules: string | null;
          id: number;
          library_heading: string | null;
          membership_terms: string | null;
          message_sign_off: string | null;
          news_cta_body: string | null;
          news_cta_help_link: string | null;
          news_cta_image: string | null;
          news_cta_title: string | null;
          no_messaging: boolean;
          organisation_activity: string | null;
          organisation_signup_description: string | null;
          patreon_id: string | null;
          profile_guidelines: string | null;
          pwa_icons: Json | null;
          questions_guidelines: string | null;
          show_impact: boolean | null;
          site_description: string | null;
          site_favicon: string | null;
          site_image: string | null;
          site_name: string;
          site_name_short: string | null;
          site_url: string;
          supported_modules: string | null;
          tenant_id: string;
        };
        Insert: {
          academy_resource?: string | null;
          color_accent?: string | null;
          color_accent_hover?: string | null;
          color_primary?: string | null;
          color_primary_hover?: string | null;
          color_secondary?: string | null;
          create_research_roles?: string[] | null;
          created_at?: string;
          donation_settings?: Json | null;
          email_from?: string | null;
          ga_tracking_id?: string | null;
          hidden_modules?: string | null;
          id?: number;
          library_heading?: string | null;
          membership_terms?: string | null;
          message_sign_off?: string | null;
          news_cta_body?: string | null;
          news_cta_help_link?: string | null;
          news_cta_image?: string | null;
          news_cta_title?: string | null;
          no_messaging?: boolean;
          organisation_activity?: string | null;
          organisation_signup_description?: string | null;
          patreon_id?: string | null;
          profile_guidelines?: string | null;
          pwa_icons?: Json | null;
          questions_guidelines?: string | null;
          show_impact?: boolean | null;
          site_description?: string | null;
          site_favicon?: string | null;
          site_image?: string | null;
          site_name: string;
          site_name_short?: string | null;
          site_url: string;
          supported_modules?: string | null;
          tenant_id: string;
        };
        Update: {
          academy_resource?: string | null;
          color_accent?: string | null;
          color_accent_hover?: string | null;
          color_primary?: string | null;
          color_primary_hover?: string | null;
          color_secondary?: string | null;
          create_research_roles?: string[] | null;
          created_at?: string;
          donation_settings?: Json | null;
          email_from?: string | null;
          ga_tracking_id?: string | null;
          hidden_modules?: string | null;
          id?: number;
          library_heading?: string | null;
          membership_terms?: string | null;
          message_sign_off?: string | null;
          news_cta_body?: string | null;
          news_cta_help_link?: string | null;
          news_cta_image?: string | null;
          news_cta_title?: string | null;
          no_messaging?: boolean;
          organisation_activity?: string | null;
          organisation_signup_description?: string | null;
          patreon_id?: string | null;
          profile_guidelines?: string | null;
          pwa_icons?: Json | null;
          questions_guidelines?: string | null;
          show_impact?: boolean | null;
          site_description?: string | null;
          site_favicon?: string | null;
          site_image?: string | null;
          site_name?: string;
          site_name_short?: string | null;
          site_url?: string;
          supported_modules?: string | null;
          tenant_id?: string;
        };
        Relationships: [];
      };
      useful_votes: {
        Row: {
          content_id: number;
          content_type: Database['public']['Enums']['useful_content_types'];
          created_at: string;
          id: number;
          tenant_id: string;
          user_id: number;
        };
        Insert: {
          content_id: number;
          content_type: Database['public']['Enums']['useful_content_types'];
          created_at?: string;
          id?: number;
          tenant_id: string;
          user_id: number;
        };
        Update: {
          content_id?: number;
          content_type?: Database['public']['Enums']['useful_content_types'];
          created_at?: string;
          id?: number;
          tenant_id?: string;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'useful_votes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      combined_project_search_fields: {
        Args: { project_id_param: number };
        Returns: string;
      };
      combined_research_search_fields: {
        Args: { research_id_param: number };
        Returns: string;
      };
      comment_authors_by_source_id: {
        Args: { source_id_input: number };
        Returns: string[];
      };
      get_admin_comments: {
        Args: { p_limit: number; p_offset: number };
        Returns: {
          comment: string;
          created_at: string;
          deleted: boolean;
          display_name: string;
          id: number;
          notification_count: number;
          parent_id: number;
          source_id: number;
          source_slug: string;
          source_type: string;
          total_count: number;
          username: string;
        }[];
      };
      get_author_vote_counts: {
        Args: { author_id: number };
        Returns: {
          content_type: string;
          vote_count: number;
        }[];
      };
      get_comments_with_votes: {
        Args: {
          p_current_user_id?: number;
          p_source_id: number;
          p_source_type: string;
        };
        Returns: {
          comment: string;
          created_at: string;
          created_by: number;
          deleted: boolean;
          has_voted: boolean;
          id: number;
          modified_at: string;
          parent_id: number;
          profile: Json;
          source_id: number;
          source_type: string;
          vote_count: number;
        }[];
      };
      get_news_access: {
        Args: {
          p_is_admin?: boolean;
          p_news_id?: number;
          p_user_profile_id?: number;
        };
        Returns: {
          cta_badge_id: number;
          is_readable: boolean;
          news_id: number;
        }[];
      };
      get_news_feed_by_content: {
        Args: {
          p_include_locked?: boolean;
          p_is_admin?: boolean;
          p_limit?: number;
          p_search?: string;
          p_skip?: number;
          p_sort?: string;
          p_user_profile_id?: number;
        };
        Returns: {
          comment_count: number;
          content: Json;
          content_reach: Database['public']['Enums']['content_reach'];
          content_search_text: string;
          created_at: string;
          created_by: number;
          cta_badge_id: number;
          hero_image: Json;
          id: number;
          is_draft: boolean;
          is_locked: boolean;
          modified_at: string;
          profile_badges: Json;
          published_at: string;
          slug: string;
          summary: string;
          tags: number[];
          title: string;
          total_count: number;
          total_views: number;
        }[];
      };
      get_poll_with_permissions: {
        Args: { p_is_admin?: boolean; p_poll_id: number; p_profile_id?: number };
        Returns: Json;
      };
      get_profile_type_counts: {
        Args: { p_tenant_id: string };
        Returns: {
          display_name: string;
          name: string;
          profile_count: number;
          profile_type_id: number;
        }[];
      };
      get_profiles_by_badge_ids: {
        Args: { p_badge_ids: number[]; p_tenant_id: string };
        Returns: {
          badge_ids: number[];
          comments: boolean;
          content_reach: Database['public']['Enums']['content_reach'];
          display_name: string;
          email: string;
          is_unsubscribed: boolean;
          profile_created_at: string;
          profile_id: number;
          replies: boolean;
          research_updates: boolean;
          roles: string[];
          username: string;
        }[];
      };
      get_profiles_with_any_badge: {
        Args: { p_tenant_id: string };
        Returns: {
          badge_ids: number[];
          comments: boolean;
          content_reach: Database['public']['Enums']['content_reach'];
          display_name: string;
          email: string;
          is_unsubscribed: boolean;
          profile_created_at: string;
          profile_id: number;
          replies: boolean;
          research_updates: boolean;
          roles: string[];
          username: string;
        }[];
      };
      get_projects: {
        Args: {
          category_id?: number;
          current_username?: string;
          days_back?: number;
          limit_val?: number;
          offset_val?: number;
          search_query?: string;
          sort_by?: string;
        };
        Returns: {
          author: Json;
          category: Json;
          comment_count: number;
          cover_image: Json;
          created_at: string;
          created_by: number;
          description: string;
          id: number;
          moderation: string;
          modified_at: string;
          slug: string;
          tags: string[];
          title: string;
          total_views: number;
          useful_votes_last_week: number;
        }[];
      };
      get_projects_count: {
        Args: {
          category_id?: number;
          current_username?: string;
          search_query?: string;
        };
        Returns: number;
      };
      get_questions: {
        Args: {
          category_id?: number;
          limit_val?: number;
          offset_val?: number;
          search_query?: string;
          sort_by?: string;
        };
        Returns: {
          accepted_answer_date: string;
          accepted_answer_id: number;
          author: Json;
          category: Json;
          comment_count: number;
          created_at: string;
          created_by: number;
          description: string;
          id: number;
          images: Json[];
          is_draft: boolean;
          modified_at: string;
          published_at: string;
          slug: string;
          tags: number[];
          title: string;
          total_views: number;
        }[];
      };
      get_questions_count: {
        Args: { category_id?: number; search_query?: string };
        Returns: number;
      };
      get_research: {
        Args: {
          category_id?: number;
          days_back?: number;
          limit_val?: number;
          offset_val?: number;
          research_status?: Database['public']['Enums']['research_status'];
          search_query?: string;
          sort_by?: string;
        };
        Returns: {
          author: Json;
          category: Json;
          comment_count: number;
          created_at: string;
          created_by: number;
          description: string;
          id: number;
          image: Json;
          modified_at: string;
          slug: string;
          status: Database['public']['Enums']['research_status'];
          tags: string[];
          title: string;
          total_views: number;
          update_count: number;
          useful_votes_last_week: number;
        }[];
      };
      get_research_count: {
        Args: {
          category_id?: number;
          research_status?: Database['public']['Enums']['research_status'];
          search_query?: string;
        };
        Returns: number;
      };
      get_staff_profiles: {
        Args: { p_tenant_id: string };
        Returns: {
          badge_ids: number[];
          comments: boolean;
          content_reach: Database['public']['Enums']['content_reach'];
          display_name: string;
          email: string;
          is_unsubscribed: boolean;
          profile_created_at: string;
          profile_id: number;
          replies: boolean;
          research_updates: boolean;
          roles: string[];
          username: string;
        }[];
      };
      get_storage_object_path: {
        Args: { bucket_name: string; object_id: string };
        Returns: {
          bucket_id: string;
          id: string;
          name: string;
          path_tokens: string[];
        }[];
      };
      get_subscribed_users_emails_to_notify: {
        Args: { p_content_id: number; p_content_type: string };
        Returns: {
          comments: boolean;
          display_name: string;
          email: string;
          is_unsubscribed: boolean;
          profile_created_at: string;
          profile_id: number;
          replies: boolean;
          research_updates: boolean;
        }[];
      };
      get_supporter_badge_counts: {
        Args: { p_tenant_id: string };
        Returns: {
          badge_id: number;
          badge_name: string;
          supporter_count: number;
        }[];
      };
      get_supporters: {
        Args: { p_tenant_id: string };
        Returns: {
          display_name: string;
          email: string;
          profile_id: number;
          tier_name: string;
          username: string;
        }[];
      };
      get_useful_votes_count_by_content_id: {
        Args: {
          p_content_ids: number[];
          p_content_type: Database['public']['Enums']['useful_content_types'];
        };
        Returns: {
          content_id: number;
          count: number;
        }[];
      };
      get_user_email_by_id: {
        Args: { id: string };
        Returns: {
          email: string;
        }[];
      };
      get_user_email_by_profile_id: {
        Args: { id: number };
        Returns: {
          email: string;
        }[];
      };
      get_user_email_by_username: {
        Args: { username: string };
        Returns: {
          email: string;
        }[];
      };
      get_user_id_by_email: {
        Args: { email: string };
        Returns: {
          id: string;
        }[];
      };
      get_user_projects: {
        Args: { username_param: string };
        Returns: {
          comment_count: number;
          cover_image: Json;
          id: number;
          slug: string;
          title: string;
          total_useful: number;
        }[];
      };
      get_user_questions: {
        Args: { username_param: string };
        Returns: {
          comment_count: number;
          id: number;
          images: Json[];
          slug: string;
          title: string;
          total_useful: number;
        }[];
      };
      get_user_research: {
        Args: { username_param: string };
        Returns: {
          id: number;
          image: Json;
          slug: string;
          title: string;
          total_useful: number;
        }[];
      };
      is_poll_admin: { Args: never; Returns: boolean };
      is_username_available: {
        Args: { exclude_profile_id?: number; username: string };
        Returns: boolean;
      };
      news_search_fields: {
        Args: { '': Database['public']['Tables']['news']['Row'] };
        Returns: {
          error: true;
        } & 'the function public.news_search_fields with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache';
      };
      notify_all_profiles: {
        Args: {
          p_action_type: Database['public']['Enums']['notification_action_types'];
          p_content_id: number;
          p_content_type: Database['public']['Enums']['notification_content_types'];
          p_tenant_id: string;
          p_title: string;
          p_triggered_by_id: number;
        };
        Returns: undefined;
      };
      questions_search_fields: {
        Args: { '': Database['public']['Tables']['questions']['Row'] };
        Returns: {
          error: true;
        } & 'the function public.questions_search_fields with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache';
      };
      read_secret: { Args: { secret_name: string }; Returns: string };
    };
    Enums: {
      content_reach: 'all' | 'important';
      content_types: 'questions' | 'projects' | 'research' | 'news' | 'comments';
      notification_action_types: 'newComment' | 'newContent' | 'newReply' | 'newNews';
      notification_content_types:
        | 'news'
        | 'research'
        | 'researchUpdate'
        | 'library'
        | 'questions'
        | 'comment'
        | 'reply'
        | 'research_updates'
        | 'comments'
        | 'projects';
      notification_source_content_type:
        | 'news'
        | 'research'
        | 'researchUpdate'
        | 'library'
        | 'questions'
        | 'projects'
        | 'research_updates';
      research_status: 'in-progress' | 'complete' | 'archived';
      useful_content_types: 'questions' | 'projects' | 'research' | 'news' | 'comments';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      content_reach: ['all', 'important'],
      content_types: ['questions', 'projects', 'research', 'news', 'comments'],
      notification_action_types: ['newComment', 'newContent', 'newReply', 'newNews'],
      notification_content_types: [
        'news',
        'research',
        'researchUpdate',
        'library',
        'questions',
        'comment',
        'reply',
        'research_updates',
        'comments',
        'projects',
      ],
      notification_source_content_type: [
        'news',
        'research',
        'researchUpdate',
        'library',
        'questions',
        'projects',
        'research_updates',
      ],
      research_status: ['in-progress', 'complete', 'archived'],
      useful_content_types: ['questions', 'projects', 'research', 'news', 'comments'],
    },
  },
} as const;

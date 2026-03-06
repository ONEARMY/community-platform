export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      banners: {
        Row: {
          id: number;
          created_at: string;
          modified_at: string | null;
          text: string;
          url: string | null;
          tenant_id: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          modified_at?: string | null;
          text: string;
          url?: string | null;
          tenant_id: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          modified_at?: string | null;
          text?: string;
          url?: string | null;
          tenant_id?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: number;
          created_at: string;
          tenant_id: string;
          name: string;
          legacy_id: string | null;
          type: Database['public']['Enums']['content_types'] | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          tenant_id: string;
          name: string;
          legacy_id?: string | null;
          type?: Database['public']['Enums']['content_types'] | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          tenant_id?: string;
          name?: string;
          legacy_id?: string | null;
          type?: Database['public']['Enums']['content_types'] | null;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: number;
          created_at: string;
          comment: string;
          source_id: number | null;
          parent_id: number | null;
          tenant_id: string;
          created_by: number | null;
          source_type: string;
          modified_at: string | null;
          source_id_legacy: string | null;
          deleted: boolean | null;
          legacy_id: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          comment: string;
          source_id?: number | null;
          parent_id?: number | null;
          tenant_id?: string;
          created_by?: number | null;
          source_type: string;
          modified_at?: string | null;
          source_id_legacy?: string | null;
          deleted?: boolean | null;
          legacy_id?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          comment?: string;
          source_id?: number | null;
          parent_id?: number | null;
          tenant_id?: string;
          created_by?: number | null;
          source_type?: string;
          modified_at?: string | null;
          source_id_legacy?: string | null;
          deleted?: boolean | null;
          legacy_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'comments_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      map_pins: {
        Row: {
          id: number;
          created_at: string;
          profile_id: number;
          country: string;
          country_code: string;
          administrative: string | null;
          post_code: string | null;
          lat: string;
          lng: string;
          moderation: string;
          tenant_id: string;
          moderation_feedback: string | null;
          name: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          profile_id: number;
          country: string;
          country_code: string;
          administrative?: string | null;
          post_code?: string | null;
          lat: string;
          lng: string;
          moderation: string;
          tenant_id: string;
          moderation_feedback?: string | null;
          name?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          profile_id?: number;
          country?: string;
          country_code?: string;
          administrative?: string | null;
          post_code?: string | null;
          lat?: string;
          lng?: string;
          moderation?: string;
          tenant_id?: string;
          moderation_feedback?: string | null;
          name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'map_pins_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      map_settings: {
        Row: {
          id: number;
          default_type_filters: string[] | null;
          setting_filters: string[];
          tenant_id: string;
        };
        Insert: {
          id?: number;
          default_type_filters?: string[] | null;
          setting_filters: string[];
          tenant_id: string;
        };
        Update: {
          id?: number;
          default_type_filters?: string[] | null;
          setting_filters?: string[];
          tenant_id?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: number;
          created_at: string;
          message: string;
          sender_id: number;
          receiver_id: number | null;
          tenant_id: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          message: string;
          sender_id: number;
          receiver_id?: number | null;
          tenant_id: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          message?: string;
          sender_id?: number;
          receiver_id?: number | null;
          tenant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_receiver_id_fkey';
            columns: ['receiver_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      news: {
        Row: {
          id: number;
          created_at: string;
          created_by: number | null;
          deleted: boolean | null;
          modified_at: string | null;
          comment_count: number;
          body: string;
          moderation: string | null;
          slug: string;
          previous_slugs: string[] | null;
          category: number | null;
          tags: number[] | null;
          title: string;
          total_views: number | null;
          tenant_id: string;
          hero_image: Json | null;
          summary: string | null;
          is_draft: boolean;
          profile_badge: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          created_by?: number | null;
          deleted?: boolean | null;
          modified_at?: string | null;
          comment_count?: number;
          body: string;
          moderation?: string | null;
          slug: string;
          previous_slugs?: string[] | null;
          category?: number | null;
          tags?: number[] | null;
          title: string;
          total_views?: number | null;
          tenant_id: string;
          hero_image?: Json | null;
          summary?: string | null;
          is_draft?: boolean;
          profile_badge?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          created_by?: number | null;
          deleted?: boolean | null;
          modified_at?: string | null;
          comment_count?: number;
          body?: string;
          moderation?: string | null;
          slug?: string;
          previous_slugs?: string[] | null;
          category?: number | null;
          tags?: number[] | null;
          title?: string;
          total_views?: number | null;
          tenant_id?: string;
          hero_image?: Json | null;
          summary?: string | null;
          is_draft?: boolean;
          profile_badge?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'news_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'news_category_fkey';
            columns: ['category'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'news_profile_badge_fkey';
            columns: ['profile_badge'];
            isOneToOne: false;
            referencedRelation: 'profile_badges';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          id: number;
          created_at: string;
          modified_at: string;
          title: string | null;
          owned_by_id: number;
          triggered_by_id: number;
          content_type: Database['public']['Enums']['notification_content_types'];
          content_id: number;
          is_read: boolean;
          action_type: Database['public']['Enums']['notification_action_types'];
          tenant_id: string;
          source_content_type: string | null;
          source_content_id: number | null;
          parent_comment_id: number | null;
          parent_content_id: number | null;
          should_email: boolean | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          modified_at?: string;
          title?: string | null;
          owned_by_id: number;
          triggered_by_id: number;
          content_type: Database['public']['Enums']['notification_content_types'];
          content_id: number;
          is_read?: boolean;
          action_type: Database['public']['Enums']['notification_action_types'];
          tenant_id: string;
          source_content_type?: string | null;
          source_content_id?: number | null;
          parent_comment_id?: number | null;
          parent_content_id?: number | null;
          should_email?: boolean | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          modified_at?: string;
          title?: string | null;
          owned_by_id?: number;
          triggered_by_id?: number;
          content_type?: Database['public']['Enums']['notification_content_types'];
          content_id?: number;
          is_read?: boolean;
          action_type?: Database['public']['Enums']['notification_action_types'];
          tenant_id?: string;
          source_content_type?: string | null;
          source_content_id?: number | null;
          parent_comment_id?: number | null;
          parent_content_id?: number | null;
          should_email?: boolean | null;
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
          id: number;
          user_id: number;
          comments: boolean;
          replies: boolean;
          tenant_id: string;
          research_updates: boolean;
          is_unsubscribed: boolean;
        };
        Insert: {
          id?: number;
          user_id: number;
          comments: boolean;
          replies: boolean;
          tenant_id: string;
          research_updates: boolean;
          is_unsubscribed?: boolean;
        };
        Update: {
          id?: number;
          user_id?: number;
          comments?: boolean;
          replies?: boolean;
          tenant_id?: string;
          research_updates?: boolean;
          is_unsubscribed?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_preferences_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      patreon_settings: {
        Row: {
          id: number;
          created_at: string;
          tiers: Json | null;
          tenant_id: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          tiers?: Json | null;
          tenant_id?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          tiers?: Json | null;
          tenant_id?: string | null;
        };
        Relationships: [];
      };
      profile_badges: {
        Row: {
          id: number;
          name: string;
          display_name: string;
          image_url: string;
          action_url: string | null;
          tenant_id: string;
          premium_tier: number | null;
        };
        Insert: {
          id?: number;
          name: string;
          display_name: string;
          image_url: string;
          action_url?: string | null;
          tenant_id: string;
          premium_tier?: number | null;
        };
        Update: {
          id?: number;
          name?: string;
          display_name?: string;
          image_url?: string;
          action_url?: string | null;
          tenant_id?: string;
          premium_tier?: number | null;
        };
        Relationships: [];
      };
      profile_badges_relations: {
        Row: {
          id: number;
          profile_id: number;
          profile_badge_id: number;
          created_at: string;
          tenant_id: string;
        };
        Insert: {
          id?: number;
          profile_id: number;
          profile_badge_id: number;
          created_at?: string;
          tenant_id: string;
        };
        Update: {
          id?: number;
          profile_id?: number;
          profile_badge_id?: number;
          created_at?: string;
          tenant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_badges_relations_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profile_badges_relations_profile_badge_id_fkey';
            columns: ['profile_badge_id'];
            isOneToOne: false;
            referencedRelation: 'profile_badges';
            referencedColumns: ['id'];
          },
        ];
      };
      profile_tags: {
        Row: {
          id: number;
          created_at: string;
          name: string;
          tenant_id: string;
          profile_type: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          name: string;
          tenant_id: string;
          profile_type?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          name?: string;
          tenant_id?: string;
          profile_type?: string | null;
        };
        Relationships: [];
      };
      profile_tags_relations: {
        Row: {
          id: number;
          created_at: string;
          profile_id: number;
          profile_tag_id: number;
          tenant_id: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          profile_id: number;
          profile_tag_id: number;
          tenant_id: string;
        };
        Update: {
          id?: number;
          created_at?: string;
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
          id: number;
          name: string;
          display_name: string;
          order: number;
          image_url: string;
          small_image_url: string;
          description: string;
          map_pin_name: string;
          is_space: boolean;
          tenant_id: string;
        };
        Insert: {
          id?: number;
          name: string;
          display_name: string;
          order: number;
          image_url: string;
          small_image_url: string;
          description: string;
          map_pin_name: string;
          is_space: boolean;
          tenant_id: string;
        };
        Update: {
          id?: number;
          name?: string;
          display_name?: string;
          order?: number;
          image_url?: string;
          small_image_url?: string;
          description?: string;
          map_pin_name?: string;
          is_space?: boolean;
          tenant_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: number;
          created_at: string;
          firebase_auth_id: string | null;
          display_name: string;
          country: string | null;
          about: string | null;
          tenant_id: string;
          username: string;
          roles: string[] | null;
          impact: Json | null;
          is_blocked_from_messaging: boolean | null;
          is_contactable: boolean | null;
          is_supporter: boolean | null;
          patreon: Json | null;
          total_views: number | null;
          type: string | null;
          auth_id: string | null;
          legacy_id: string | null;
          cover_images: Json[] | null;
          last_active: string | null;
          photo: Json | null;
          visitor_policy: Json | null;
          website: string | null;
          profile_type: number | null;
          donations_enabled: boolean;
        };
        Insert: {
          id?: number;
          created_at?: string;
          firebase_auth_id?: string | null;
          display_name: string;
          country?: string | null;
          about?: string | null;
          tenant_id: string;
          username?: string;
          roles?: string[] | null;
          impact?: Json | null;
          is_blocked_from_messaging?: boolean | null;
          is_contactable?: boolean | null;
          is_supporter?: boolean | null;
          patreon?: Json | null;
          total_views?: number | null;
          type?: string | null;
          auth_id?: string | null;
          legacy_id?: string | null;
          cover_images?: Json[] | null;
          last_active?: string | null;
          photo?: Json | null;
          visitor_policy?: Json | null;
          website?: string | null;
          profile_type?: number | null;
          donations_enabled?: boolean;
        };
        Update: {
          id?: number;
          created_at?: string;
          firebase_auth_id?: string | null;
          display_name?: string;
          country?: string | null;
          about?: string | null;
          tenant_id?: string;
          username?: string;
          roles?: string[] | null;
          impact?: Json | null;
          is_blocked_from_messaging?: boolean | null;
          is_contactable?: boolean | null;
          is_supporter?: boolean | null;
          patreon?: Json | null;
          total_views?: number | null;
          type?: string | null;
          auth_id?: string | null;
          legacy_id?: string | null;
          cover_images?: Json[] | null;
          last_active?: string | null;
          photo?: Json | null;
          visitor_policy?: Json | null;
          website?: string | null;
          profile_type?: number | null;
          donations_enabled?: boolean;
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
      projects: {
        Row: {
          id: number;
          created_at: string;
          modified_at: string | null;
          title: string;
          slug: string;
          previous_slugs: string[] | null;
          description: string;
          created_by: number | null;
          deleted: boolean | null;
          category: number | null;
          difficulty_level: string | null;
          cover_image: Json | null;
          file_link: string | null;
          files: Json[] | null;
          tags: string[] | null;
          is_draft: boolean | null;
          time: string | null;
          file_download_count: number | null;
          moderation: string | null;
          moderation_feedback: string | null;
          tenant_id: string;
          total_views: number | null;
          comment_count: number | null;
          legacy_id: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          modified_at?: string | null;
          title: string;
          slug: string;
          previous_slugs?: string[] | null;
          description: string;
          created_by?: number | null;
          deleted?: boolean | null;
          category?: number | null;
          difficulty_level?: string | null;
          cover_image?: Json | null;
          file_link?: string | null;
          files?: Json[] | null;
          tags?: string[] | null;
          is_draft?: boolean | null;
          time?: string | null;
          file_download_count?: number | null;
          moderation?: string | null;
          moderation_feedback?: string | null;
          tenant_id: string;
          total_views?: number | null;
          comment_count?: number | null;
          legacy_id?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          modified_at?: string | null;
          title?: string;
          slug?: string;
          previous_slugs?: string[] | null;
          description?: string;
          created_by?: number | null;
          deleted?: boolean | null;
          category?: number | null;
          difficulty_level?: string | null;
          cover_image?: Json | null;
          file_link?: string | null;
          files?: Json[] | null;
          tags?: string[] | null;
          is_draft?: boolean | null;
          time?: string | null;
          file_download_count?: number | null;
          moderation?: string | null;
          moderation_feedback?: string | null;
          tenant_id?: string;
          total_views?: number | null;
          comment_count?: number | null;
          legacy_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'projects_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'projects_category_fkey';
            columns: ['category'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      project_steps: {
        Row: {
          id: number;
          created_at: string;
          project_id: number;
          title: string;
          description: string;
          images: Json | null;
          video_url: string | null;
          order: number | null;
          tenant_id: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          project_id: number;
          title: string;
          description: string;
          images?: Json | null;
          video_url?: string | null;
          order?: number | null;
          tenant_id: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          project_id?: number;
          title?: string;
          description?: string;
          images?: Json | null;
          video_url?: string | null;
          order?: number | null;
          tenant_id?: string;
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
      questions: {
        Row: {
          id: number;
          created_at: string;
          created_by: number | null;
          deleted: boolean | null;
          modified_at: string;
          comment_count: number;
          description: string;
          moderation: string | null;
          slug: string;
          previous_slugs: string[] | null;
          category: number | null;
          tags: number[] | null;
          title: string;
          total_views: number | null;
          tenant_id: string;
          images: Json[] | null;
          legacy_id: string | null;
          is_draft: boolean;
        };
        Insert: {
          id?: number;
          created_at?: string;
          created_by?: number | null;
          deleted?: boolean | null;
          modified_at?: string;
          comment_count?: number;
          description: string;
          moderation?: string | null;
          slug: string;
          previous_slugs?: string[] | null;
          category?: number | null;
          tags?: number[] | null;
          title: string;
          total_views?: number | null;
          tenant_id: string;
          images?: Json[] | null;
          legacy_id?: string | null;
          is_draft?: boolean;
        };
        Update: {
          id?: number;
          created_at?: string;
          created_by?: number | null;
          deleted?: boolean | null;
          modified_at?: string;
          comment_count?: number;
          description?: string;
          moderation?: string | null;
          slug?: string;
          previous_slugs?: string[] | null;
          category?: number | null;
          tags?: number[] | null;
          title?: string;
          total_views?: number | null;
          tenant_id?: string;
          images?: Json[] | null;
          legacy_id?: string | null;
          is_draft?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'questions_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
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
      research: {
        Row: {
          id: number;
          created_at: string;
          modified_at: string | null;
          title: string;
          slug: string;
          description: string;
          category: number | null;
          created_by: number | null;
          tags: string[] | null;
          deleted: boolean | null;
          total_views: number | null;
          total_useful: number | null;
          previous_slugs: string[] | null;
          status: Database['public']['Enums']['research_status'] | null;
          is_draft: boolean | null;
          tenant_id: string;
          collaborators: string[] | null;
          image: Json | null;
          legacy_id: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          modified_at?: string | null;
          title: string;
          slug: string;
          description: string;
          category?: number | null;
          created_by?: number | null;
          tags?: string[] | null;
          deleted?: boolean | null;
          total_views?: number | null;
          total_useful?: number | null;
          previous_slugs?: string[] | null;
          status?: Database['public']['Enums']['research_status'] | null;
          is_draft?: boolean | null;
          tenant_id: string;
          collaborators?: string[] | null;
          image?: Json | null;
          legacy_id?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          modified_at?: string | null;
          title?: string;
          slug?: string;
          description?: string;
          category?: number | null;
          created_by?: number | null;
          tags?: string[] | null;
          deleted?: boolean | null;
          total_views?: number | null;
          total_useful?: number | null;
          previous_slugs?: string[] | null;
          status?: Database['public']['Enums']['research_status'] | null;
          is_draft?: boolean | null;
          tenant_id?: string;
          collaborators?: string[] | null;
          image?: Json | null;
          legacy_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'research_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'research_category_fkey';
            columns: ['category'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      research_updates: {
        Row: {
          id: number;
          created_at: string;
          research_id: number;
          title: string;
          description: string;
          images: Json[] | null;
          files: Json[] | null;
          video_url: string | null;
          is_draft: boolean | null;
          comment_count: number | null;
          tenant_id: string;
          modified_at: string;
          deleted: boolean | null;
          file_link: string | null;
          file_download_count: number | null;
          created_by: number | null;
          legacy_id: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          research_id: number;
          title: string;
          description: string;
          images?: Json[] | null;
          files?: Json[] | null;
          video_url?: string | null;
          is_draft?: boolean | null;
          comment_count?: number | null;
          tenant_id: string;
          modified_at?: string;
          deleted?: boolean | null;
          file_link?: string | null;
          file_download_count?: number | null;
          created_by?: number | null;
          legacy_id?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          research_id?: number;
          title?: string;
          description?: string;
          images?: Json[] | null;
          files?: Json[] | null;
          video_url?: string | null;
          is_draft?: boolean | null;
          comment_count?: number | null;
          tenant_id?: string;
          modified_at?: string;
          deleted?: boolean | null;
          file_link?: string | null;
          file_download_count?: number | null;
          created_by?: number | null;
          legacy_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'research_updates_research_id_fkey';
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
      subscribers: {
        Row: {
          id: number;
          created_at: string;
          user_id: number;
          content_id: number;
          content_type: string;
          tenant_id: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          user_id: number;
          content_id: number;
          content_type: string;
          tenant_id: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          user_id?: number;
          content_id?: number;
          content_type?: string;
          tenant_id?: string;
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
          id: number;
          created_at: string;
          name: string;
          tenant_id: string;
          legacy_id: string | null;
          modified_at: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          name: string;
          tenant_id: string;
          legacy_id?: string | null;
          modified_at?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          name?: string;
          tenant_id?: string;
          legacy_id?: string | null;
          modified_at?: string | null;
        };
        Relationships: [];
      };
      tenant_settings: {
        Row: {
          id: number;
          created_at: string;
          site_name: string;
          site_description: string | null;
          site_url: string;
          message_sign_off: string | null;
          tenant_id: string;
          email_from: string | null;
          site_image: string | null;
          site_favicon: string | null;
          donation_settings: Json | null;
          no_messaging: boolean;
          library_heading: string | null;
          academy_resource: string | null;
          profile_guidelines: string | null;
          questions_guidelines: string | null;
          supported_modules: string | null;
          patreon_id: string | null;
          color_primary: string | null;
          color_primary_hover: string | null;
          color_accent: string | null;
          color_accent_hover: string | null;
          show_impact: boolean | null;
          create_research_roles: string[] | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          site_name: string;
          site_description?: string | null;
          site_url: string;
          message_sign_off?: string | null;
          tenant_id: string;
          email_from?: string | null;
          site_image?: string | null;
          site_favicon?: string | null;
          donation_settings?: Json | null;
          no_messaging?: boolean;
          library_heading?: string | null;
          academy_resource?: string | null;
          profile_guidelines?: string | null;
          questions_guidelines?: string | null;
          supported_modules?: string | null;
          patreon_id?: string | null;
          color_primary?: string | null;
          color_primary_hover?: string | null;
          color_accent?: string | null;
          color_accent_hover?: string | null;
          show_impact?: boolean | null;
          create_research_roles?: string[] | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          site_name?: string;
          site_description?: string | null;
          site_url?: string;
          message_sign_off?: string | null;
          tenant_id?: string;
          email_from?: string | null;
          site_image?: string | null;
          site_favicon?: string | null;
          donation_settings?: Json | null;
          no_messaging?: boolean;
          library_heading?: string | null;
          academy_resource?: string | null;
          profile_guidelines?: string | null;
          questions_guidelines?: string | null;
          supported_modules?: string | null;
          patreon_id?: string | null;
          color_primary?: string | null;
          color_primary_hover?: string | null;
          color_accent?: string | null;
          color_accent_hover?: string | null;
          show_impact?: boolean | null;
          create_research_roles?: string[] | null;
        };
        Relationships: [];
      };
      upgrade_badge: {
        Row: {
          id: number;
          action_label: string;
          badge_id: number;
          is_space: boolean;
          action_url: string;
          tenant_id: string;
        };
        Insert: {
          id?: number;
          action_label: string;
          badge_id: number;
          is_space: boolean;
          action_url: string;
          tenant_id: string;
        };
        Update: {
          id?: number;
          action_label?: string;
          badge_id?: number;
          is_space?: boolean;
          action_url?: string;
          tenant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'upgrade_badge_badge_id_fkey';
            columns: ['badge_id'];
            isOneToOne: false;
            referencedRelation: 'profile_badges';
            referencedColumns: ['id'];
          },
        ];
      };
      useful_votes: {
        Row: {
          id: number;
          created_at: string;
          content_id: number;
          content_type: Database['public']['Enums']['useful_content_types'];
          user_id: number;
          tenant_id: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          content_id: number;
          content_type: Database['public']['Enums']['useful_content_types'];
          user_id: number;
          tenant_id: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          content_id?: number;
          content_type?: Database['public']['Enums']['useful_content_types'];
          user_id?: number;
          tenant_id?: string;
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
      get_author_vote_counts: {
        Args: { author_id: number };
        Returns: { content_type: string; vote_count: number }[];
      };
      get_comments_with_votes: {
        Args: {
          p_source_type: string;
          p_source_id: number;
          p_current_user_id?: number | null;
        };
        Returns: {
          id: number;
          comment: string;
          created_at: string;
          modified_at: string | null;
          deleted: boolean | null;
          source_id: number | null;
          source_type: string;
          parent_id: number | null;
          created_by: number | null;
          profile: Json | null;
          vote_count: number;
          has_voted: boolean;
        }[];
      };
      get_projects: {
        Args: {
          search_query?: string | null;
          category_id?: number | null;
          sort_by?: string;
          limit_val?: number;
          offset_val?: number;
          current_username?: string | null;
          days_back?: number;
        };
        Returns: {
          id: number;
          created_at: string;
          created_by: number | null;
          modified_at: string | null;
          description: string;
          slug: string;
          cover_image: Json | null;
          category: Json | null;
          tags: string[] | null;
          title: string;
          moderation: string | null;
          total_views: number | null;
          author: Json | null;
          comment_count: number | null;
          useful_votes_last_week: number | null;
        }[];
      };
      get_projects_count: {
        Args: {
          search_query?: string | null;
          category_id?: number | null;
          current_username?: string | null;
        };
        Returns: number;
      };
      get_research: {
        Args: {
          search_query?: string | null;
          category_id?: number | null;
          research_status?: Database['public']['Enums']['research_status'] | null;
          sort_by?: string;
          limit_val?: number;
          offset_val?: number;
          days_back?: number;
        };
        Returns: {
          id: number;
          created_at: string;
          created_by: number | null;
          modified_at: string | null;
          description: string;
          slug: string;
          image: Json | null;
          status: Database['public']['Enums']['research_status'] | null;
          category: Json | null;
          tags: string[] | null;
          title: string;
          total_views: number | null;
          author: Json | null;
          update_count: number | null;
          comment_count: number | null;
          useful_votes_last_week: number | null;
        }[];
      };
      get_research_count: {
        Args: {
          search_query?: string | null;
          category_id?: number | null;
          research_status?: Database['public']['Enums']['research_status'] | null;
        };
        Returns: number;
      };
      get_subscribed_users_emails_to_notify: {
        Args: {
          p_content_id: number;
          p_content_type: string;
        };
        Returns: {
          email: string;
          profile_id: number;
          profile_created_at: string;
          display_name: string;
          comments: boolean;
          replies: boolean;
          research_updates: boolean;
          is_unsubscribed: boolean;
        }[];
      };
      get_useful_votes_count_by_content_id: {
        Args: {
          p_content_type: Database['public']['Enums']['useful_content_types'];
          p_content_ids: number[];
        };
        Returns: { content_id: number; count: number }[];
      };
      get_user_email_by_id: {
        Args: { id: string };
        Returns: { email: string }[];
      };
      get_user_email_by_username: {
        Args: { username: string };
        Returns: { email: string }[];
      };
      get_user_projects: {
        Args: { username_param: string };
        Returns: {
          id: number;
          comment_count: number | null;
          cover_image: Json | null;
          title: string;
          slug: string;
          total_useful: number | null;
        }[];
      };
      get_user_questions: {
        Args: { username_param: string };
        Returns: {
          id: number;
          comment_count: number | null;
          images: Json[] | null;
          title: string;
          slug: string;
          total_useful: number | null;
        }[];
      };
      get_user_research: {
        Args: { username_param: string };
        Returns: {
          id: number;
          image: Json | null;
          title: string;
          slug: string;
          total_useful: number | null;
        }[];
      };
      is_username_available: {
        Args: { username: string };
        Returns: boolean;
      };
    };
    Enums: {
      content_types: 'questions' | 'projects' | 'research' | 'news' | 'comments';
      useful_content_types: 'questions' | 'projects' | 'research' | 'news' | 'comments';
      research_status: 'in-progress' | 'complete' | 'archived';
      notification_action_types: 'newComment' | 'newContent';
      notification_content_types:
        | 'news'
        | 'research'
        | 'researchUpdate'
        | 'library'
        | 'questions'
        | 'comment'
        | 'reply';
      notification_source_content_type:
        | 'news'
        | 'research'
        | 'researchUpdate'
        | 'library'
        | 'questions';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

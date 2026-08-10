export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_sources: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          last_fetched_at: string | null
          name: string
          type: string
          url: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          last_fetched_at?: string | null
          name: string
          type?: string
          url: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          last_fetched_at?: string | null
          name?: string
          type?: string
          url?: string
        }
        Relationships: []
      }
      ai_updates: {
        Row: {
          approval_token: string
          category: string | null
          created_at: string
          dedup_hash: string | null
          expanded_html: string | null
          id: string
          published_at: string | null
          raw_excerpt: string | null
          relevance_score: number | null
          source: string | null
          source_url: string | null
          status: string
          summary_html: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approval_token?: string
          category?: string | null
          created_at?: string
          dedup_hash?: string | null
          expanded_html?: string | null
          id?: string
          published_at?: string | null
          raw_excerpt?: string | null
          relevance_score?: number | null
          source?: string | null
          source_url?: string | null
          status?: string
          summary_html?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          approval_token?: string
          category?: string | null
          created_at?: string
          dedup_hash?: string | null
          expanded_html?: string | null
          id?: string
          published_at?: string | null
          raw_excerpt?: string | null
          relevance_score?: number | null
          source?: string | null
          source_url?: string | null
          status?: string
          summary_html?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_post_tags: {
        Row: {
          created_at: string
          id: string
          post_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "published_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          category_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      content_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      content_items: {
        Row: {
          content_json: Json | null
          created_at: string | null
          description: string | null
          display_order: number | null
          duration_minutes: number | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          thumbnail_url: string | null
          title: string
          type: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          content_json?: Json | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_minutes?: number | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          thumbnail_url?: string | null
          title: string
          type: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          content_json?: Json | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_minutes?: number | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          thumbnail_url?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      content_services: {
        Row: {
          action_link: string | null
          additional_info: string | null
          content_structure: string | null
          content_type: string
          created_at: string
          detailed_description: string | null
          display_order: number | null
          duration: string | null
          id: string
          main_image_url: string | null
          name: string
          page_title: string | null
          prerequisites: string | null
          price: number | null
          search_tags: string | null
          short_description: string | null
          status: string
          suitable_for: string | null
          updated_at: string
          what_included: string | null
        }
        Insert: {
          action_link?: string | null
          additional_info?: string | null
          content_structure?: string | null
          content_type: string
          created_at?: string
          detailed_description?: string | null
          display_order?: number | null
          duration?: string | null
          id?: string
          main_image_url?: string | null
          name: string
          page_title?: string | null
          prerequisites?: string | null
          price?: number | null
          search_tags?: string | null
          short_description?: string | null
          status?: string
          suitable_for?: string | null
          updated_at?: string
          what_included?: string | null
        }
        Update: {
          action_link?: string | null
          additional_info?: string | null
          content_structure?: string | null
          content_type?: string
          created_at?: string
          detailed_description?: string | null
          display_order?: number | null
          duration?: string | null
          id?: string
          main_image_url?: string | null
          name?: string
          page_title?: string | null
          prerequisites?: string | null
          price?: number | null
          search_tags?: string | null
          short_description?: string | null
          status?: string
          suitable_for?: string | null
          updated_at?: string
          what_included?: string | null
        }
        Relationships: []
      }
      course_pages: {
        Row: {
          content: string | null
          course_id: string
          cover_url: string | null
          created_at: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_home: boolean | null
          parent_id: string | null
          published: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          course_id: string
          cover_url?: string | null
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_home?: boolean | null
          parent_id?: string | null
          published?: boolean | null
          slug?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string
          cover_url?: string | null
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_home?: boolean | null
          parent_id?: string | null
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_pages_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_pages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "course_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          access_type: string
          category: Database["public"]["Enums"]["course_category"]
          created_at: string
          currency: string
          description: string | null
          discount_price: number | null
          display_order: number | null
          duration: string | null
          enrollment_deadline: string | null
          enrollment_status: string
          has_certificate: boolean
          icount_page_url: string | null
          id: string
          instructor_name: string | null
          is_featured: boolean | null
          is_free: boolean
          language: string
          level: Database["public"]["Enums"]["course_level"]
          max_students: number | null
          price: number | null
          published: boolean
          requirements: string | null
          slug: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          trailer_url: string | null
          updated_at: string
          user_id: string
          what_you_learn: string | null
        }
        Insert: {
          access_type?: string
          category: Database["public"]["Enums"]["course_category"]
          created_at?: string
          currency?: string
          description?: string | null
          discount_price?: number | null
          display_order?: number | null
          duration?: string | null
          enrollment_deadline?: string | null
          enrollment_status?: string
          has_certificate?: boolean
          icount_page_url?: string | null
          id?: string
          instructor_name?: string | null
          is_featured?: boolean | null
          is_free?: boolean
          language?: string
          level: Database["public"]["Enums"]["course_level"]
          max_students?: number | null
          price?: number | null
          published?: boolean
          requirements?: string | null
          slug?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          trailer_url?: string | null
          updated_at?: string
          user_id: string
          what_you_learn?: string | null
        }
        Update: {
          access_type?: string
          category?: Database["public"]["Enums"]["course_category"]
          created_at?: string
          currency?: string
          description?: string | null
          discount_price?: number | null
          display_order?: number | null
          duration?: string | null
          enrollment_deadline?: string | null
          enrollment_status?: string
          has_certificate?: boolean
          icount_page_url?: string | null
          id?: string
          instructor_name?: string | null
          is_featured?: boolean | null
          is_free?: boolean
          language?: string
          level?: Database["public"]["Enums"]["course_level"]
          max_students?: number | null
          price?: number | null
          published?: boolean
          requirements?: string | null
          slug?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          trailer_url?: string | null
          updated_at?: string
          user_id?: string
          what_you_learn?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          amount_paid: number | null
          course_id: string
          created_at: string | null
          enrolled_at: string | null
          icount_confirmation_code: string | null
          icount_doc_number: string | null
          icount_doc_url: string | null
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          course_id: string
          created_at?: string | null
          enrolled_at?: string | null
          icount_confirmation_code?: string | null
          icount_doc_number?: string | null
          icount_doc_url?: string | null
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          course_id?: string
          created_at?: string | null
          enrolled_at?: string | null
          icount_confirmation_code?: string | null
          icount_doc_number?: string | null
          icount_doc_url?: string | null
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      entitlements: {
        Row: {
          amount_paid: number | null
          created_at: string
          granted_at: string | null
          icount_confirmation_code: string | null
          icount_doc_number: string | null
          icount_doc_url: string | null
          id: string
          product_id: string
          status: string
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          granted_at?: string | null
          icount_confirmation_code?: string | null
          icount_doc_number?: string | null
          icount_doc_url?: string | null
          id?: string
          product_id: string
          status?: string
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          granted_at?: string | null
          icount_confirmation_code?: string | null
          icount_doc_number?: string | null
          icount_doc_url?: string | null
          id?: string
          product_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entitlements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "published_products"
            referencedColumns: ["id"]
          },
        ]
      }
      guides: {
        Row: {
          category: string | null
          content: string | null
          cover_url: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          duration_minutes: number | null
          id: string
          is_free: boolean
          language: string
          level: string | null
          published: boolean | null
          slug: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean
          language?: string
          level?: string | null
          published?: boolean | null
          slug?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean
          language?: string
          level?: string | null
          published?: boolean | null
          slug?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      icount_webhook_log: {
        Row: {
          created_at: string | null
          id: string
          raw: Json | null
          result: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          raw?: Json | null
          result?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          raw?: Json | null
          result?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          follow_up_date: string | null
          id: string
          message: string | null
          name: string
          notes: string | null
          phone: string | null
          service_interest: string | null
          source: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          follow_up_date?: string | null
          id?: string
          message?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          service_interest?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          follow_up_date?: string | null
          id?: string
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          service_interest?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: string | null
          content_json: Json | null
          created_at: string
          duration: string | null
          duration_minutes: number | null
          extra_videos: Json
          id: string
          is_preview: boolean | null
          module_id: string
          position: number
          resources_json: Json | null
          title: string
          updated_at: string
          video_provider: string | null
          video_url: string | null
        }
        Insert: {
          content?: string | null
          content_json?: Json | null
          created_at?: string
          duration?: string | null
          duration_minutes?: number | null
          extra_videos?: Json
          id?: string
          is_preview?: boolean | null
          module_id: string
          position?: number
          resources_json?: Json | null
          title: string
          updated_at?: string
          video_provider?: string | null
          video_url?: string | null
        }
        Update: {
          content?: string | null
          content_json?: Json | null
          created_at?: string
          duration?: string | null
          duration_minutes?: number | null
          extra_videos?: Json
          id?: string
          is_preview?: boolean | null
          module_id?: string
          position?: number
          resources_json?: Json | null
          title?: string
          updated_at?: string
          video_provider?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      live_events: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_recorded: boolean | null
          meeting_url: string | null
          published: boolean | null
          recording_url: string | null
          scheduled_at: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_recorded?: boolean | null
          meeting_url?: string | null
          published?: boolean | null
          recording_url?: string | null
          scheduled_at: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_recorded?: boolean | null
          meeting_url?: string | null
          published?: boolean | null
          recording_url?: string | null
          scheduled_at?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          product_id: string
          status: Database["public"]["Enums"]["order_status"]
          stripe_session_id: string | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          status?: Database["public"]["Enums"]["order_status"]
          stripe_session_id?: string | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          stripe_session_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "published_products"
            referencedColumns: ["id"]
          },
        ]
      }
      password_resets: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          token: string
          used: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          token: string
          used?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          token?: string
          used?: boolean
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          order_id: string
          payment_method: string | null
          processed_at: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          order_id: string
          payment_method?: string | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          order_id?: string
          payment_method?: string | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_published: boolean
          project_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          project_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          project_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: Database["public"]["Enums"]["product_category"] | null
          course_id: string | null
          created_at: string
          description: string | null
          discount_price: number | null
          display_order: number
          duration: string | null
          external_url: string | null
          icount_page_url: string | null
          icount_paypage_id: string | null
          id: string
          is_featured: boolean
          is_free: boolean
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          persona: string | null
          price: number
          product_type: Database["public"]["Enums"]["product_type"]
          short_description: string | null
          slug: string
          thank_you_message: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_preview_url: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["product_category"] | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          discount_price?: number | null
          display_order?: number
          duration?: string | null
          external_url?: string | null
          icount_page_url?: string | null
          icount_paypage_id?: string | null
          id?: string
          is_featured?: boolean
          is_free?: boolean
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          persona?: string | null
          price?: number
          product_type?: Database["public"]["Enums"]["product_type"]
          short_description?: string | null
          slug: string
          thank_you_message?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_preview_url?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"] | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          discount_price?: number | null
          display_order?: number
          duration?: string | null
          external_url?: string | null
          icount_page_url?: string | null
          icount_paypage_id?: string | null
          id?: string
          is_featured?: boolean
          is_free?: boolean
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          persona?: string | null
          price?: number
          product_type?: Database["public"]["Enums"]["product_type"]
          short_description?: string | null
          slug?: string
          thank_you_message?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_preview_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      products_courses: {
        Row: {
          course_id: string
          created_at: string
          id: string
          product_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          product_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_courses_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_courses_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "published_products"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          author_bio: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          job_title: string | null
          updated_at: string
        }
        Insert: {
          author_bio?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          job_title?: string | null
          updated_at?: string
        }
        Update: {
          author_bio?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          job_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      prompt_pack_sections: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          product_id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          product_id: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          product_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_pack_sections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_pack_sections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "published_products"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_topics: {
        Row: {
          color: string | null
          created_at: string
          display_order: number
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          description: string | null
          display_order: number | null
          featured: boolean
          guide_id: string | null
          how_to_use: string | null
          id: string
          image_url: string | null
          is_sample: boolean
          pack_display_order: number
          pack_section_id: string | null
          parts: Json
          product_id: string | null
          published: boolean | null
          tags: string[]
          title: string
          topic_id: string | null
          topic_ids: string[]
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          featured?: boolean
          guide_id?: string | null
          how_to_use?: string | null
          id?: string
          image_url?: string | null
          is_sample?: boolean
          pack_display_order?: number
          pack_section_id?: string | null
          parts?: Json
          product_id?: string | null
          published?: boolean | null
          tags?: string[]
          title: string
          topic_id?: string | null
          topic_ids?: string[]
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          featured?: boolean
          guide_id?: string | null
          how_to_use?: string | null
          id?: string
          image_url?: string | null
          is_sample?: boolean
          pack_display_order?: number
          pack_section_id?: string | null
          parts?: Json
          product_id?: string | null
          published?: boolean | null
          tags?: string[]
          title?: string
          topic_id?: string | null
          topic_ids?: string[]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompts_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_pack_section_id_fkey"
            columns: ["pack_section_id"]
            isOneToOne: false
            referencedRelation: "prompt_pack_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "published_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "prompt_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          created_at: string
          id: string
          label: string | null
          lesson_id: string
          type: Database["public"]["Enums"]["resource_type"]
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          lesson_id: string
          type: Database["public"]["Enums"]["resource_type"]
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          lesson_id?: string
          type?: Database["public"]["Enums"]["resource_type"]
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          created_at: string
          currency: string | null
          description: string | null
          display_order: number | null
          duration: string | null
          features: string[] | null
          id: string
          is_featured: boolean | null
          name: string
          price: number | null
          short_description: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          display_order?: number | null
          duration?: string | null
          features?: string[] | null
          id?: string
          is_featured?: boolean | null
          name: string
          price?: number | null
          short_description?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          display_order?: number | null
          duration?: string | null
          features?: string[] | null
          id?: string
          is_featured?: boolean | null
          name?: string
          price?: number | null
          short_description?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tools: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          featured: boolean
          icon_url: string | null
          id: string
          is_free: boolean | null
          published: boolean | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          featured?: boolean
          icon_url?: string | null
          id?: string
          is_free?: boolean | null
          published?: boolean | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          featured?: boolean
          icon_url?: string | null
          id?: string
          is_free?: boolean | null
          published?: boolean | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      user_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmarks_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_course_access: {
        Row: {
          course_id: string
          expires_at: string | null
          granted_at: string
          id: string
          order_id: string
          product_id: string
          user_id: string
        }
        Insert: {
          course_id: string
          expires_at?: string | null
          granted_at?: string
          id?: string
          order_id: string
          product_id: string
          user_id: string
        }
        Update: {
          course_id?: string
          expires_at?: string | null
          granted_at?: string
          id?: string
          order_id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_course_access_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_access_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_access_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_access_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "published_products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          item_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          item_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string
          id: string
          lesson_id: string | null
          progress_percentage: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string
          id?: string
          lesson_id?: string | null
          progress_percentage?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string
          id?: string
          lesson_id?: string | null
          progress_percentage?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vibe_apps: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          emoji: string | null
          id: string
          published: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          emoji?: string | null
          id?: string
          published?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          emoji?: string | null
          id?: string
          published?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      webinars: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          duration_minutes: number | null
          id: string
          is_live: boolean | null
          published: boolean | null
          scheduled_at: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_minutes?: number | null
          id?: string
          is_live?: boolean | null
          published?: boolean | null
          scheduled_at?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_minutes?: number | null
          id?: string
          is_live?: boolean | null
          published?: boolean | null
          scheduled_at?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      live_events_public: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string | null
          is_recorded: boolean | null
          published: boolean | null
          recording_url: string | null
          scheduled_at: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string | null
          is_recorded?: boolean | null
          published?: boolean | null
          recording_url?: string | null
          scheduled_at?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string | null
          is_recorded?: boolean | null
          published?: boolean | null
          recording_url?: string | null
          scheduled_at?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      published_posts: {
        Row: {
          category_id: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string | null
          is_published: boolean | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string | null
          tags: string[] | null
          title: string | null
        }
        Insert: {
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string | null
          tags?: string[] | null
          title?: string | null
        }
        Update: {
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string | null
          tags?: string[] | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      published_products: {
        Row: {
          category: Database["public"]["Enums"]["product_category"] | null
          created_at: string | null
          description: string | null
          id: string | null
          is_featured: boolean | null
          meta_description: string | null
          meta_title: string | null
          price: number | null
          product_type: Database["public"]["Enums"]["product_type"] | null
          short_description: string | null
          slug: string | null
          thumbnail_url: string | null
          title: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["product_category"] | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          price?: number | null
          product_type?: Database["public"]["Enums"]["product_type"] | null
          short_description?: string | null
          slug?: string | null
          thumbnail_url?: string | null
          title?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"] | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          price?: number | null
          product_type?: Database["public"]["Enums"]["product_type"] | null
          short_description?: string | null
          slug?: string | null
          thumbnail_url?: string | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      course_curriculum: {
        Args: { p_course_id: string }
        Returns: {
          duration: string
          duration_minutes: number
          is_preview: boolean
          lesson_id: string
          lesson_position: number
          lesson_title: string
          module_description: string
          module_id: string
          module_position: number
          module_title: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      make_user_admin: { Args: { user_email: string }; Returns: undefined }
      pack_prompts: {
        Args: { p_pack_id: string }
        Returns: {
          description: string
          display_order: number
          guide_id: string
          id: string
          is_sample: boolean
          locked: boolean
          pack_display_order: number
          pack_section_id: string
          tags: string[]
          title: string
        }[]
      }
      prompt_content: { Args: { p_id: string }; Returns: string }
      prompt_full: { Args: { p_id: string }; Returns: Json }
      prompt_packs: {
        Args: { p_preview?: boolean }
        Returns: {
          description: string
          discount_price: number
          display_order: number
          icount_page_url: string
          id: string
          is_free: boolean
          is_published: boolean
          price: number
          prompt_count: number
          section_count: number
          short_description: string
          slug: string
          thumbnail_url: string
          title: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "instructor" | "student"
      course_category: "strategy" | "marketing" | "tech"
      course_level: "beginner" | "intermediate" | "advanced"
      order_status: "pending" | "completed" | "failed" | "refunded"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      product_category: "basic" | "advanced" | "business"
      product_type: "course" | "workshop" | "consultation" | "prompt_pack"
      resource_type: "video" | "pdf" | "slides" | "link"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "instructor", "student"],
      course_category: ["strategy", "marketing", "tech"],
      course_level: ["beginner", "intermediate", "advanced"],
      order_status: ["pending", "completed", "failed", "refunded"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      product_category: ["basic", "advanced", "business"],
      product_type: ["course", "workshop", "consultation", "prompt_pack"],
      resource_type: ["video", "pdf", "slides", "link"],
    },
  },
} as const

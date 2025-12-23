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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agencias: {
        Row: {
          creado_en: string
          id: string
          logo_url: string | null
          nombre: string
        }
        Insert: {
          creado_en?: string
          id?: string
          logo_url?: string | null
          nombre: string
        }
        Update: {
          creado_en?: string
          id?: string
          logo_url?: string | null
          nombre?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          creado_en: string | null
          creado_por: string | null
          email: string | null
          id: string
          nombre_completo: string
          telefono: string | null
        }
        Insert: {
          creado_en?: string | null
          creado_por?: string | null
          email?: string | null
          id?: string
          nombre_completo: string
          telefono?: string | null
        }
        Update: {
          creado_en?: string | null
          creado_por?: string | null
          email?: string | null
          id?: string
          nombre_completo?: string
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_calendario: {
        Row: {
          created_at: string | null
          descripcion: string | null
          end_time: string | null
          external_id: string | null
          id: string
          location: string | null
          metadata: Json | null
          profile_id: string | null
          start_time: string | null
          titulo: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          end_time?: string | null
          external_id?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          profile_id?: string | null
          start_time?: string | null
          titulo?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          end_time?: string | null
          external_id?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          profile_id?: string | null
          start_time?: string | null
          titulo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_calendario_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      integraciones: {
        Row: {
          created_at: string | null
          credentials: Json | null
          enabled: boolean | null
          id: string
          profile_id: string | null
          provider: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credentials?: Json | null
          enabled?: boolean | null
          id?: string
          profile_id?: string | null
          provider?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credentials?: Json | null
          enabled?: boolean | null
          id?: string
          profile_id?: string | null
          provider?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integraciones_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      multimedia: {
        Row: {
          creado_por: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          propiedad_id: string | null
          ruta: string | null
          tipo: string | null
        }
        Insert: {
          creado_por?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          propiedad_id?: string | null
          ruta?: string | null
          tipo?: string | null
        }
        Update: {
          creado_por?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          propiedad_id?: string | null
          ruta?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "multimedia_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "multimedia_propiedad_id_fkey"
            columns: ["propiedad_id"]
            isOneToOne: false
            referencedRelation: "propiedades"
            referencedColumns: ["id"]
          },
        ]
      }
      notas_oportunidades: {
        Row: {
          archivos: Json | null
          creado_por: string | null
          created_at: string | null
          id: string
          oportunidad_id: string | null
          texto: string | null
        }
        Insert: {
          archivos?: Json | null
          creado_por?: string | null
          created_at?: string | null
          id?: string
          oportunidad_id?: string | null
          texto?: string | null
        }
        Update: {
          archivos?: Json | null
          creado_por?: string | null
          created_at?: string | null
          id?: string
          oportunidad_id?: string | null
          texto?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notas_oportunidades_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_oportunidades_oportunidad_id_fkey"
            columns: ["oportunidad_id"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["id"]
          },
        ]
      }
      oportunidades: {
        Row: {
          asignado_a: string | null
          cliente_id: string | null
          created_at: string | null
          estado: string | null
          id: string
          metadata: Json | null
          notas: string | null
          oportunidad_id: string | null
          origen: string | null
          propiedad_id: string | null
          updated_at: string | null
          valor_estimado: number | null
        }
        Insert: {
          asignado_a?: string | null
          cliente_id?: string | null
          created_at?: string | null
          estado?: string | null
          id?: string
          metadata?: Json | null
          notas?: string | null
          oportunidad_id?: string | null
          origen?: string | null
          propiedad_id?: string | null
          updated_at?: string | null
          valor_estimado?: number | null
        }
        Update: {
          asignado_a?: string | null
          cliente_id?: string | null
          created_at?: string | null
          estado?: string | null
          id?: string
          metadata?: Json | null
          notas?: string | null
          oportunidad_id?: string | null
          origen?: string | null
          propiedad_id?: string | null
          updated_at?: string | null
          valor_estimado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "oportunidades_asignado_a_fkey"
            columns: ["asignado_a"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidades_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidades_propiedad_id_fkey"
            columns: ["propiedad_id"]
            isOneToOne: false
            referencedRelation: "propiedades"
            referencedColumns: ["id"]
          },
        ]
      }
      perfiles: {
        Row: {
          avatar_url: string | null
          creado_en: string | null
          email: string | null
          especialidad: string | null
          id: string
          id_agencia: string | null
          nombre_completo: string | null
          rol: Database["public"]["Enums"]["rol_usuario"] | null
          telefono: string | null
        }
        Insert: {
          avatar_url?: string | null
          creado_en?: string | null
          email?: string | null
          especialidad?: string | null
          id: string
          id_agencia?: string | null
          nombre_completo?: string | null
          rol?: Database["public"]["Enums"]["rol_usuario"] | null
          telefono?: string | null
        }
        Update: {
          avatar_url?: string | null
          creado_en?: string | null
          email?: string | null
          especialidad?: string | null
          id?: string
          id_agencia?: string | null
          nombre_completo?: string | null
          rol?: Database["public"]["Enums"]["rol_usuario"] | null
          telefono?: string | null
        }
        Relationships: []
      }
      pipeline: {
        Row: {
          creado_por: string | null
          created_at: string | null
          estado: string | null
          etapa: string | null
          etapa_porcentual: string | null
          fuente: string | null
          id: string
          observaciones: string | null
          oportunidad_id: string | null
          progreso_percent: number | null
          updated_at: string | null
        }
        Insert: {
          creado_por?: string | null
          created_at?: string | null
          estado?: string | null
          etapa?: string | null
          etapa_porcentual?: string | null
          fuente?: string | null
          id?: string
          observaciones?: string | null
          oportunidad_id?: string | null
          progreso_percent?: number | null
          updated_at?: string | null
        }
        Update: {
          creado_por?: string | null
          created_at?: string | null
          estado?: string | null
          etapa?: string | null
          etapa_porcentual?: string | null
          fuente?: string | null
          id?: string
          observaciones?: string | null
          oportunidad_id?: string | null
          progreso_percent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_oportunidad_id_fkey"
            columns: ["oportunidad_id"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["id"]
          },
        ]
      }
      propiedades: {
        Row: {
          caracteristicas: Json | null
          ciudad: string | null
          creado_en: string | null
          descripcion: string | null
          direccion: string | null
          estado: string | null
          id: string
          imagen_principal: string | null
          moneda: string | null
          operacion: Database["public"]["Enums"]["tipo_operacion"] | null
          precio: number | null
          propietario_id: string | null
          tipo: Database["public"]["Enums"]["tipo_propiedad"] | null
          titulo: string | null
          ubicacion: unknown | null
        }
        Insert: {
          caracteristicas?: Json | null
          ciudad?: string | null
          creado_en?: string | null
          descripcion?: string | null
          direccion?: string | null
          estado?: string | null
          id?: string
          imagen_principal?: string | null
          moneda?: string | null
          operacion?: Database["public"]["Enums"]["tipo_operacion"] | null
          precio?: number | null
          propietario_id?: string | null
          tipo?: Database["public"]["Enums"]["tipo_propiedad"] | null
          titulo?: string | null
          ubicacion?: unknown | null
        }
        Update: {
          caracteristicas?: Json | null
          ciudad?: string | null
          creado_en?: string | null
          descripcion?: string | null
          direccion?: string | null
          estado?: string | null
          id?: string
          imagen_principal?: string | null
          moneda?: string | null
          operacion?: Database["public"]["Enums"]["tipo_operacion"] | null
          precio?: number | null
          propietario_id?: string | null
          tipo?: Database["public"]["Enums"]["tipo_propiedad"] | null
          titulo?: string | null
          ubicacion?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_propiedad_propietario"
            columns: ["propietario_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      rol_usuario: "admin_agencia" | "agente" | "independiente"
      tipo_operacion: "venta" | "renta"
      tipo_propiedad:
      | "industrial"
      | "comercial"
      | "residencial"
      | "terreno"
      | "oficina"
      | "desarrollo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type SchemaName = Exclude<keyof Database, "__InternalSupabase">

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: SchemaName },
  TableName extends PublicTableNameOrOptions extends { schema: SchemaName }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: SchemaName }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
    PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
    PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: SchemaName },
  TableName extends PublicTableNameOrOptions extends { schema: SchemaName }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: SchemaName }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: SchemaName },
  TableName extends PublicTableNameOrOptions extends { schema: SchemaName }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: SchemaName }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema["Enums"]
  | { schema: SchemaName },
  EnumName extends PublicEnumNameOrOptions extends { schema: SchemaName }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: SchemaName }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof PublicSchema["CompositeTypes"]
  | { schema: SchemaName },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: SchemaName
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: SchemaName }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

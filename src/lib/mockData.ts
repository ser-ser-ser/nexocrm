// ==========================================
// MOCK DATA - NEXOCRM (Simulación de Base de Datos)
// ==========================================

export const mockUsers = [
    // CASO A: Dueña de Agencia (Admin)
    {
        id_ref: 1, // Reference ID for seeding logic
        email: "laura@grupomaster.com",
        password: "password123", // Default password for testing
        profile: {
            full_name: "Laura Dueña",
            email: "laura@grupomaster.com",
            avatar_url: "https://i.pravatar.cc/150?u=laura",
            role: "admin_agencia",
            agency_id: "00000000-0000-0000-0000-000000000100", // UUID format for 100
        }
    },
    // CASO B: Agente de Laura (Empleado)
    {
        id_ref: 2,
        email: "pedro@grupomaster.com",
        password: "password123",
        profile: {
            full_name: "Pedro Vendedor",
            email: "pedro@grupomaster.com",
            avatar_url: "https://i.pravatar.cc/150?u=pedro",
            role: "agente",
            agency_id: "00000000-0000-0000-0000-000000000100", // Matches Laura's agency
        }
    },
    // CASO C: Broker Independiente (Usuario Solitario)
    {
        id_ref: 3,
        email: "juan@independiente.com",
        password: "password123",
        profile: {
            full_name: "Juan Freelance",
            email: "juan@independiente.com",
            avatar_url: "https://i.pravatar.cc/150?u=juan",
            role: "independiente",
            agency_id: null,
        }
    }
];

// 2. PROPIEDADES (Polimorfismo: Residencial vs Industrial vs Comercial)
export const mockProperties = [
    // --- INDUSTRIAL (Logística) ---
    {
        owner_ref: 1, // Propiedad de Laura
        title: "Nave Logística Norte - Parque Seguro",
        price: 85000,
        currency: "MXN",
        operation_type: "renta",
        category: "industrial", // New column
        address: "Parque Industrial Querétaro, QRO",
        images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800"],
        availability_status: "disponible",
        // Datos de Captación (mapped to acquisition_data JSONB)
        acquisition_data: {
            tipo: "offline",
            detalle: "Recorrido en zona",
            fecha: "2024-01-15"
        },
        // DETALLES TÉCNICOS (mapped to specs JSONB)
        specs: {
            altura_libre: "10m",
            andenes_carga: 4,
            rampa_niveladora: true,
            resistencia_piso: "8 Ton/m2",
            kva_disponibles: 150,
            sistema_contra_incendio: "Mangueras",
            seguridad_parque: "24/7 con acceso controlado"
        }
    },

    // --- COMERCIAL (Site Selection / Retail) ---
    {
        owner_ref: 2, // Asignada a Pedro
        title: "Local Comercial Centro - Ideal Franquicia",
        price: 4500000,
        currency: "MXN",
        operation_type: "venta",
        category: "comercial",
        address: "Av. Reforma, CDMX",
        images: ["https://images.unsplash.com/photo-1519642918688-7e43b19245d8?auto=format&fit=crop&w=800"],
        availability_status: "negociacion",
        acquisition_data: {
            tipo: "online",
            detalle: "Campaña Facebook Ads - Inversionistas",
            fecha: "2024-02-10"
        },
        specs: {
            superficie_total: 120,
            frente_calle: "8m",
            flujo_peatonal: "Alto (Zona Bancaria)",
            ancla_cercana: "Starbucks, BBVA",
            uso_suelo: "Comercial Amplio",
            altura_techo: "4m"
        }
    },

    // --- RESIDENCIAL (Tradicional) ---
    {
        owner_ref: 3, // Juan Freelance
        title: "Casa en Condominio Privado",
        price: 18000,
        currency: "MXN",
        operation_type: "renta",
        category: "residencial",
        address: "Juriquilla, QRO",
        images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800"],
        availability_status: "disponible",
        acquisition_data: {
            tipo: "referido",
            detalle: "Cliente antiguo",
            fecha: "2024-03-01"
        },
        specs: {
            recamaras: 3,
            banos: 2.5,
            estacionamientos: 2,
            amenidades: ["Alberca", "Gimnasio"],
            mascotas: true
        }
    }
];

export const mockStats = {
    total_propiedades: 15,
    total_leads: 42,
    ventas_mes: 3,
    rendimiento_team: [
        { agente: "Pedro", ventas: 1, captaciones: 5 },
        { agente: "Laura", ventas: 2, captaciones: 2 }
    ]
};

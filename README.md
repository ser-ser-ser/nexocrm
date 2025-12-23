# NexoCRM 🏢🏭🏠

**ERP Inmobiliario Integral & Polimórfico**

NexoCRM es una plataforma de gestión inmobiliaria de próxima generación diseñada específicamente para el mercado mexicano. A diferencia de los CRM generalistas, NexoCRM entiende la naturaleza única de cada activo, diferenciando profundamente entre propiedades Industriales, Comerciales (Retail) y Residenciales.

## 🚀 Visión

Construir una alternativa robusta a Odoo/Salesforce, pero con una UX diseñada por y para brokers inmobiliarios.
- **Especialización:** Gestión nativa de naves industriales (andenes, KVAs, resistencia de piso) y locales comerciales (flujo peatonal, marcas ancla).
- **Simplicidad:** Potencia sin la complejidad de configuración de los ERPs tradicionales.
- **Tecnología:** Infraestructura serverless moderna para iteración rápida.

## 🛠 Stack Tecnológico

- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Backend/DB:** [Supabase](https://supabase.com/) (Auth, PostgreSQL, Storage, Realtime)
- **Infraestructura:** [Vercel](https://vercel.com/)
- **Lenguaje:** TypeScript

## ✨ Características Clave

1.  **Inventario Polimórfico:** Fichas de propiedad que mutan sus campos y validaciones según el tipo de inmueble.
2.  **Multitenancy Lógico:** Jerarquía clara entre Agencias, Agentes y Brokers Independientes.
3.  **Hub de Captación:** Centralización de leads desde portales, redes sociales y prospección offline ("lonas").
4.  **Gestión Financiera:** Cálculo automático de splits de comisiones y propiedades compartidas.

## 🏁 Comenzar

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/ser-ser-ser/nexocrm.git
    cd nexocrm
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Copia `.env.example` a `.env.local` y agrega tus credenciales de Supabase.

4.  **Correr el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

## 📄 Licencia

Este proyecto está bajo la Licencia [Apache 2.0](LICENSE).

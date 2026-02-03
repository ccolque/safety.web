export const SEVERITIES = [
    {
        "id": "bb9441ec-0eec-48ad-92eb-48530a156c9b",
        "name": "Alta"
    },
    {
        "id": "f0d2e302-61b9-4a47-bb53-d3b1da5608a9",
        "name": "Media"
    },
    {
        "id": "40ba24c5-3f66-4814-9bc1-19b08d707b80",
        "name": "Baja"
    }
]

export const STATUS = [
    {
        "id": "bb9441ec-0eec-48ad-92eb-48530a156c96",
        "name": "En Progreso"
    },
    {
        "id": "f0d2e302-61b9-4a47-bb53-d3b1da5608a95",
        "name": "Resuelto"
    },
    {
        "id": "40ba24c5-3f66-4814-9bc1-19b08d707b84",
        "name": "Baja"
    }
]

export const RESPONSIBLES:any = [
    {
        code: "code_security",
        en: {
            name: "Security"
        },
        es: {
            name: "Seguridad"
        },
        fr: {
            name: "Sécurité"
        }
    },
    {
        code: "code_engineering",
        en: {
            name: "Engineering"
        },
        es: {
            name: "Ingeniería"
        },
        fr: {
            name: "Ingénierie"
        }
    },
    {
        code: "code_operations",
        en: {
            name: "Operations"
        },
        es: {
            name: "Operaciones"
        },
        fr: {
            name: "Opérations"
        }
    },
    {
        code: "code_supervision",
        en: {
            name: "Supervision"
        },
        es: {
            name: "Supervisión"
        },
        fr: {
            name: "Surveillance"
        }
    },
    {
        code: "code_rr_hh",
        en: {
            name: "HR"
        },
        es: {
            name: "RR. HH."
        },
        fr: {
            name: "Surveillance"
        }
    },
    {
        code: "code_hse",
        en: {
            name: "HSE"
        },
        es: {
            name: "HSE"
        },
        fr: {
            name: "HSE"
        }
    },
]

export const EMOTIONS_COLOR: Record<
  string,
  { color: string }
> = {
  Preocupación: { color: "bg-yellow-400" },
  Alarma: { color: "bg-red-600" },
  Vulnerabilidad: { color: "bg-purple-400" },
  Urgencia: { color: "bg-orange-500" },
  Incertidumbre: { color: "bg-blue-400" }
};

export const LANGUAGES = ["en", "es", "fr"] as const;

export type Language = typeof LANGUAGES[number];
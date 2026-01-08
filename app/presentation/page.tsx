"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  ClipboardList,
  CheckCircle2,
  BarChart3,
  AlertTriangle,
  Camera,
  MapPin,
  Clock,
  FileText,
  Users,
  Search,
  Calendar,
  Mic,
  Navigation,
  AlertCircle,
  X,
  Eye,
  DollarSign,
  Package,
  Info,
  Sparkles,
  Brain,
  ListChecks,
  Building2,
  Code,
  Palette,
  CheckCircle,
  XCircle,
  Smartphone,
  Database,
  Upload,
  Globe,
  TestTube,
  Briefcase,
  GraduationCap,
} from "lucide-react"

// Updates: Added language state and translations
const translations = {
  es: {
    languageToggle: "EN",
    slides: {
      intro: {
        twoApps: "Sistema de Gestión de Incidencias",
        reporterApp: "App Móvil",
        reporterDesc: "Aplicación móvil para reportar incidencias en tiempo real",
        managerWeb: "Web de Administración",
        managerDesc: "Web de visualización de las incidencias reportadas y cierre de caso",
        dashboard: "Dashboard de Control",
        dashboardDesc: "Tablero de visualización de métricas y tendencias",
      },
      mobileHome: {
        title: "Página Principal - App Móvil",
        subtitle: "Opciones principales para gestión de incidencias",
        newIncident: "Nueva Incidencia",
        myIncidents: "Mis Incidencias",
      },
      mobileList: {
        title: "Mis Incidencias Reportadas",
        subtitle: "Lista de incidencias enviadas por el usuario",
        viewDetails: "Ver Detalles",
      },
      classification: {
        critical: "Crítico",
        high: "Alta",
        medium: "Media",
        low: "Baja",
      },
      incidentTypes: {
        safety: "Seguridad",
        equipment: "Equipo",
        quality: "Calidad",
        environment: "Ambiente",
      },
      status: {
        open: "Abierto",
        inProgress: "En Progreso",
        pending: "Pendiente",
        resolved: "Resuelto",
      },
      description: {
        dateTime: "Fecha y Hora",
        location: "Ubicación",
        locationValue: "Almacén Central - Zona A",
        coordinates: "Coordenadas GPS",
        useGPS: "Usar GPS",
        description: "Descripción",
        writeText: "Escribir Texto",
        recordAudio: "Grabar Audio",
        recording: "Grabando...",
        audioTime: "0:15",
        descriptionValue: "Se detectó una fuga de líquido cerca del equipo de almacenamiento refrigerado.",
        attachments: "Adjuntos",
        attachmentValue: "3 fotos adjuntas",
        continue: "Continuar",
      },
      mobileDetail: {
        title: "Vista de Incidencias - Móvil",
        subtitle: "Lista de incidencias y detalle individual",
        myIncidents: "Mis Incidencias",
        incidentDetail: "Detalle de Incidencia",
        description: "Descripción",
        actions: "Acciones",
        photos: "Fotos",
      },
      webTracking: {
        title: "Seguimiento Web - Gestión de Incidencias",
        subtitle: "Tabla de todas las incidencias reportadas",
        search: "Buscar incidencias...",
        view: "Ver",
        table: {
          id: "ID",
          type: "Tipo",
          title: "Título",
          severity: "Gravedad",
          status: "Estado",
        },
        stats: {
          total: "Total de Incidencias",
          resolved: "Resueltas",
          inProgress: "En Progreso",
          pending: "Pendientes",
        },
      },
      webIncidentViewer: {
        title: "Visor de Incidencia Web",
        subtitle: "Vista detallada de una incidencia específica",
        photos: "Fotos",
        title_field: "Título",
        description: "Descripción",
        severity: "Gravedad",
        user: "Usuario",
        location: "Ubicación",
        actions: "Acciones",
        aiAnalysis: "Análisis de IA",
        aiResults: {
          inconsistencies: "Inconsistencias",
          inconsistenciesDesc: "No se detectaron inconsistencias entre el texto/audio y la clasificación reportada",
          observations: "Observaciones",
          observationsDesc:
            "La ubicación reportada coincide con el área de alto riesgo. Se recomienda inspección inmediata.",
          recommendations: "Recomendaciones",
          recommendationsDesc:
            "Priorizar esta incidencia debido a la gravedad y ubicación. Coordinar con el equipo de seguridad.",
          correctiveActions: "Acciones Correctivas Sugeridas",
          correctiveActionsDesc:
            "1) Aislar el área afectada. 2) Evaluar daños estructurales. 3) Implementar medidas preventivas.",
        },
      },
      dashboard: {
        title: "Dashboard de Métricas",
        subtitle: "Visualización de indicadores clave de rendimiento",
        metrics: {
          total: "Total Incidencias",
          open: "Abiertas",
          resolved: "Resueltas",
          avgTime: "Tiempo Promedio",
          days: "días",
        },
        charts: {
          byType: "Incidencias por Tipo",
          bySeverity: "Distribución por Gravedad",
          trend: "Tendencia Mensual",
        },
        safetyPyramid: {
          title: "Pirámide de Seguridad",
          fatal: "Fatalidades",
          serious: "Lesiones Graves",
          minor: "Lesiones Menores",
          nearMiss: "Casi Accidentes",
          unsafe: "Condiciones Inseguras",
        },
        criticalAlerts: "Alertas Críticas",
        highSeverityPending: "Incidencia de Alta Severidad Pendiente",
        overdueActions: "Acciones Vencidas",
        requiresAttention: "Requieren atención inmediata",
        timeAgo: "hace",
        hours: "h",
        security: "Seguridad",
        equipment: "Equipo",
        inProgress: "En Progreso",
        high: "Alta",
        critical: "Crítica",
      },
      hoursAndCosts: {
        title: "Horas y Costos del Proyecto",
        totalCost: "Costo del Proyecto",
        discount: "Descuento",
        finalPrice: "Precio Final",
        resource1: "Recurso 1",
        resource1desc: "Desarrollo Móvil",
        resource2: "Recurso 2",
        resource2desc: "Desarrollo Web",
        resource3: "Recurso 3",
        resource3desc: "Tablero de Control",
        resource4: "Recurso 4",
        resource4desc: "Diseñador Gráfico",
        resource5: "Recurso 5",
        resource5desc: "Project Manager",
        resource6: "Recurso 6",
        resource6desc: "Tester",
        totalHours: "Total de Horas",
        notIncluded: "No Incluido",
        notIncludedItems: ["Pantallas para administrar usuarios, permisos, roles, catálogos y parámetros."],
      },
      implementationPlan: {
        title: "Plan de Implementación y Capacitación",
        totalTime: "Tiempo Total",
        fullDevelopment: "Desarrollo completo",
        developmentDetails: "Desarrollo full-time con entregas incrementales",
        specializedResources: "Recursos especializados",
        developmentTeamDetails: "2 desarrolladores senior por equipo, trabajando en paralelo full-time",
        maintenance: "Mantenimiento Incluido",
        postLaunchSupport: "Soporte post-lanzamiento",
        maintenanceDetails: "Corrección de errores y ajustes necesarios después del desarrollo",
        training: "Capacitación Incluida",
        writtenTutorials: "Tutoriales Escritos",
        writtenTutorialsDesc:
          "Documentación detallada paso a paso para cada módulo del sistema, con capturas de pantalla y ejemplos prácticos.",
        videoTutorials: "Video Tutoriales",
        videoTutorialsDesc:
          "Videos explicativos de alta calidad mostrando el uso de cada funcionalidad, disponibles 24/7 para consulta.",
        developmentTeams: "Equipos de Desarrollo",
        developers: "Desarrolladores",
        seniorDevelopersPerTeam: "desarrolladores senior por equipo",
        businessDays: "días hábiles",
        incrementalDeliveries: "entregas incrementales",
        totalTimeDesc: "Tiempo total estimado para la entrega del prototipo funcional.",
        workingInParallel: "trabajando en paralelo",
      },
      developmentTeam: {
        title: "Equipo de Desarrollo",
        developers: "Desarrolladores",
        resource1: "Recurso 1",
        resource2: "Recurso 2",
        resource3: "Recurso 3",
        resource4: "Recurso 4",
        resource5: "Recurso 5",
        resource6: "Recurso 6",
        experience1: "10 años de experiencia", // Specific experience for Resource 1
        experience2: "8 años de experiencia", // Specific experience for Resource 2
        experience3: "6 años de experiencia", // Specific experience for Resource 3
        experience4: "7 años de experiencia", // Specific experience for Resource 4
        experience5: "5 años de experiencia", // Specific experience for Resource 5
        experience6: "9 años de experiencia", // Specific experience for Resource 6
        mobileDeveloper: "Desarrollador Mobile Senior",
        webDeveloper: "Desarrollador Web Senior",
        dataAnalyst: "Analista de Datos",
        graphicDesigner: "Diseñador Gráfico",
        tester: "Tester e Implementador", // Changed from testerImplementer
        projectManager: "Project Manager",
        mobileSpec: "Especialidad: React Native y Flutter",
        webSpec: "Especialidad: Desarrollo Web Full-Stack y APIs REST",
        dataSpec: "Especialidad: Business Intelligence y Visualización de Datos",
        graphicDesignerExp: "Experto en UI/UX y Sistemas de Diseño",
        testerExp: "Experto en QA Automation y DevOps",
        pmExp: "Experto en Metodologías Ágiles y Gestión de Proyectos",
        totalProfessionals: "profesionales trabajando en tu proyecto",
        workingOnProject: "profesionales trabajando en tu proyecto",
        complementaryProfessionals: "Profesionales Complementarios", // Added for Development Team slide
        specialty1: "Especialidad: React Native, Flutter, UI/UX", // Specific specialty for Resource 1
        specialty2: "Especialidad: Node.js, React, REST APIs, Docker", // Specific specialty for Resource 2
        specialty3: "Especialidad: SQL, Python, Power BI, Tableau", // Specific specialty for Resource 3
        specialty4: "Especialidad: Diseño de interfaces, Prototipado", // Specific specialty for Resource 4
        specialty5: "Especialidad: Pruebas automatizadas, Jira", // Specific specialty for Resource 5
        specialty6: "Especialidad: Metodologías Ágiles, Scrum", // Specific specialty for Resource 6
      },
      scope: {
        title: "Alcance",
        subtitle: "Alcance Detallado del Prototipo de Análisis de Incidentes HSE",
        description:
          "Este demostrador se centra exclusivamente en la validación del valor del análisis asistido por IA, excluyendo la funcionalidad de gestión de incidentes completa.",

        // Slide 12: Requirements and Incident Loading
        requirements: {
          title: "Requisitos de la Solución y Carga de Incidentes",
          dualProduct: "Doble Producto Funcional",
          dualProductDesc:
            "El proyecto entregará una Aplicación (App) multiplataforma para la recopilación de datos y una Aplicación Web para el análisis.",
          deliveryTime: "Plazo de Entrega",
          deliveryTimeDesc: "El demostrador debe ser entregable en un plazo de 29 días calendario.",
          database: "Base de Datos (Requerida)",
          databaseDesc:
            "A diferencia de lo previsto inicialmente, esta versión sí debe incluir una base de datos para almacenar los incidentes cargados.",
          incidentLoading: "Carga de Incidentes",
          loadingByUser: "Carga por Usuario",
          loadingByUserDesc:
            "La carga de los incidentes se realizará directamente por el usuario a través de la App multiplataforma.",
          minimalData: "Datos Mínimos",
          minimalDataDesc:
            "La App solo manejará datos básicos del incidente, junto con audios, texto y archivos adjuntos.",
          dataPerIncident: "Datos por Incidente",
          dataPerIncidentDesc:
            "Cada incidente debe incluir una grabación de audio (descripción de voz), una descripción de texto (opcional) y una clasificación manual (tipo y gravedad).",
        },

        // Slide 13: AI Capabilities
        aiCapabilities: {
          title: "Capacidades Analíticas de la Inteligencia Artificial",
          subtitle: "La IA debe aplicar el siguiente flujo de procesamiento analítico:",
          transcription: "Transcripción",
          transcriptionDesc: "Conversión automática del audio del incidente a texto.",
          summary: "Resumen",
          summaryDesc: "Generación de un resumen corto y coherente (aprox. 4-5 líneas).",
          factExtraction: "Extracción de Hechos",
          factExtractionDesc: "Determinación de información estructurada, incluyendo:",
          factItems: [
            "Actores involucrados",
            "Ubicación, si está en la narrativa",
            "Equipo involucrado",
            "Pistas temporales o sello de tiempo",
            "Secuencia y eventos clave",
          ],
          chronology: "Cronología",
          chronologyDesc: "Extracción de una secuencia simple y ordenada de 'quién hizo qué, dónde, cuándo' del texto.",
          inconsistencies: "Detección de Inconsistencias",
          inconsistenciesDesc:
            "Identificación de contradicciones o campos críticos faltantes (ej: mención de lesión sin víctima).",
          causalStructure: "Estructura Causal Simplificada",
          causalStructureDesc:
            "Propuesta de un borrador de árbol de causas que vincule hechos observables con causas inmediatas y potenciales causas raíz.",
          correctiveActions: "Sugerencias de Acciones Correctivas",
          correctiveActionsDesc:
            "Propuesta de 3 a 5 acciones estándar basadas en las causas identificadas y modelos HSE genéricos.",
        },

        // Slide 14: Web Interface and Exclusions
        webInterface: {
          title: "Interfaz Web y Exclusiones Funcionales",
          webVisualization: "Visualización Centralizada",
          webVisualizationDesc:
            "Una interfaz web simple (una o varias secciones) que solo muestra los resultados del análisis de la IA: Transcripción, Resumen, Hechos, Cronología, Árbol de Causas y Acciones Recomendadas.",
          dashboard: "Dashboard Gerencial (Nuevo)",
          dashboardDesc: "Esta versión debe incluir un tablero de control gerencial básico.",
          noEditing: "Sin Edición de Datos",
          noEditingDesc: "El usuario de la web no puede introducir ni editar los datos del incidente.",
          exclusions: "Exclusiones Funcionales",
          exclusionsSubtitle: "Para mantener el bajo costo y la rapidez, se excluye lo siguiente:",
          workflows: "Flujos de Trabajo",
          workflowsDesc:
            "Sin ciclo de vida del incidente (triage, investigación, validación, cierre) ni seguimiento de acciones.",
          userManagement: "Gestión de Usuarios",
          userManagementDesc: "Sin sistema de autenticación, roles, permisos ni interfaces de administración.",
          scalability: "Funciones de Escalabilidad",
          scalabilityDesc: "Sin alojamiento a largo plazo, escalabilidad o parámetros configurables.",
        },
        included: "Incluye",
        notIncluded: "No Incluye",
        includedItems: [
          "Aplicación móvil multiplataforma para reportar incidencias.",
          "Aplicación web para visualización y análisis de resultados de IA.",
          "Base de datos para almacenar incidencias.",
          "Transcripción automática de audio a texto.",
          "Resumen generado por IA.",
          "Extracción de hechos clave y cronología.",
          "Detección de inconsistencias.",
          "Estructura causal simplificada y recomendaciones de acciones correctivas.",
          "Dashboard gerencial básico.",
        ],
        notIncludedItems: [
          "Funcionalidad completa de gestión de incidentes (ciclo de vida, flujos de trabajo, seguimiento de acciones).",
          "Sistema de gestión de usuarios, roles y permisos.",
          "Funciones avanzadas de escalabilidad y configuración.",
          "Mantenimiento a largo plazo o soporte post-lanzamiento extenso.",
        ],
      },
      team: {},
    },
  },
  en: {
    languageToggle: "ES",
    slides: {
      intro: {
        twoApps: "Incident Management System",
        reporterApp: "Mobile App",
        reporterDesc: "Mobile application to report incidents in real-time",
        managerWeb: "Admin Web",
        managerDesc: "Web platform for viewing reported incidents and case closure",
        dashboard: "Control Dashboard",
        dashboardDesc: "Metrics and trends visualization dashboard",
      },
      mobileHome: {
        title: "Home Page - Mobile App",
        subtitle: "Main options for incident management",
        newIncident: "New Incident",
        myIncidents: "My Incidents",
      },
      mobileList: {
        title: "My Reported Incidents",
        subtitle: "List of incidents submitted by the user",
        viewDetails: "View Details",
      },
      classification: {
        critical: "Critical",
        high: "High",
        medium: "Medium",
        low: "Low",
      },
      incidentTypes: {
        safety: "Safety",
        equipment: "Equipment",
        quality: "Quality",
        environment: "Environment",
      },
      status: {
        open: "Open",
        inProgress: "In Progress",
        pending: "Pending",
        resolved: "Resolved",
      },
      description: {
        dateTime: "Date and Time",
        location: "Location",
        locationValue: "Central Warehouse - Zone A",
        coordinates: "GPS Coordinates",
        useGPS: "Use GPS",
        description: "Description",
        writeText: "Write Text",
        recordAudio: "Record Audio",
        recording: "Recording...",
        audioTime: "0:15",
        descriptionValue: "Liquid leak detected near refrigerated storage equipment.",
        attachments: "Attachments",
        attachmentValue: "3 photos attached",
        continue: "Continue",
      },
      mobileDetail: {
        title: "Incidents View - Mobile",
        subtitle: "Incidents list and individual detail",
        myIncidents: "My Incidents",
        incidentDetail: "Incident Detail",
        description: "Description",
        actions: "Actions",
        photos: "Photos",
      },
      webTracking: {
        title: "Web Tracking - Incident Management",
        subtitle: "Table of all reported incidents",
        search: "Search incidents...",
        view: "View",
        table: {
          id: "ID",
          type: "Type",
          title: "Title",
          severity: "Severity",
          status: "Status",
        },
        stats: {
          total: "Total Incidents",
          resolved: "Resolved",
          inProgress: "In Progress",
          pending: "Pending",
        },
      },
      webIncidentViewer: {
        title: "Web Incident Viewer",
        subtitle: "Detailed view of a specific incident",
        photos: "Photos",
        title_field: "Title",
        description: "Description",
        severity: "Severity",
        user: "User",
        location: "Location",
        actions: "Actions",
        aiAnalysis: "AI Analysis",
        aiResults: {
          inconsistencies: "Inconsistencies",
          inconsistenciesDesc: "No inconsistencies detected between text/audio and reported classification",
          observations: "Observations",
          observationsDesc: "Reported location matches high-risk area. Immediate inspection recommended.",
          recommendations: "Recommendations",
          recommendationsDesc: "Prioritize this incident due to severity and location. Coordinate with safety team.",
          correctiveActions: "Suggested Corrective Actions",
          correctiveActionsDesc:
            "1) Isolate affected area. 2) Assess structural damage. 3) Implement preventive measures.",
        },
      },
      dashboard: {
        title: "Metrics Dashboard",
        subtitle: "Key performance indicators visualization",
        metrics: {
          total: "Total Incidents",
          open: "Open",
          resolved: "Resolved",
          avgTime: "Average Time",
          days: "days",
        },
        charts: {
          byType: "Incidents by Type",
          bySeverity: "Distribution by Severity",
          trend: "Monthly Trend",
        },
        safetyPyramid: {
          title: "Safety Pyramid",
          fatal: "Fatalities",
          serious: "Serious Injuries",
          minor: "Minor Injuries",
          nearMiss: "Near Misses",
          unsafe: "Unsafe Conditions",
        },
        criticalAlerts: "Critical Alerts",
        highSeverityPending: "High Severity Incident Pending",
        overdueActions: "Overdue Actions",
        requiresAttention: "Requires immediate attention",
        timeAgo: "ago",
        hours: "h",
        security: "Safety",
        equipment: "Equipment",
        inProgress: "In Progress",
        high: "High",
        critical: "Critical",
      },
      hoursAndCosts: {
        title: "Project Hours and Costs",
        totalCost: "Project Cost",
        discount: "Discount",
        finalPrice: "Final Price",
        resource1: "Resource 1",
        resource1desc: "Mobile Development",
        resource2: "Resource 2",
        resource2desc: "Web Development",
        resource3: "Resource 3",
        resource3desc: "Control Dashboard",
        resource4: "Resource 4",
        resource4desc: "Graphic Designer",
        resource5: "Resource 5",
        resource5desc: "Project Manager",
        resource6: "Resource 6",
        resource6desc: "Tester",
        totalHours: "Total Hours",
        notIncluded: "Not Included",
        notIncludedItems: ["Screens to manage users, permissions, roles, catalogs and parameters."],
      },
      implementationPlan: {
        title: "Implementation and Training Plan",
        totalTime: "Total Time",
        fullDevelopment: "Complete development",
        developmentDetails: "Full-time development with incremental deliveries",
        specializedResources: "Specialized resources",
        developmentTeamDetails: "2 senior developers per team, working in parallel full-time",
        maintenance: "Maintenance Included",
        postLaunchSupport: "Post-launch support",
        maintenanceDetails: "Bug fixes and necessary adjustments after development",
        training: "Training Included",
        writtenTutorials: "Written Tutorials",
        writtenTutorialsDesc:
          "Detailed step-by-step documentation for each system module, with screenshots and practical examples.",
        videoTutorials: "Video Tutorials",
        videoTutorialsDesc:
          "High-quality explanatory videos showing the use of each functionality, available 24/7 for consultation.",
        developmentTeams: "Development Teams",
        developers: "Developers",
        seniorDevelopersPerTeam: "senior developers per team",
        businessDays: "business days",
        incrementalDeliveries: "incremental deliveries",
        totalTimeDesc: "Total estimated time for the delivery of the functional prototype.",
        workingInParallel: "working in parallel",
      },
      developmentTeam: {
        title: "Development Team",
        developers: "Developers",
        resource1: "Resource 1",
        resource2: "Resource 2",
        resource3: "Resource 3",
        resource4: "Resource 4",
        resource5: "Resource 5",
        resource6: "Resource 6",
        experience1: "10 years of experience", // Specific experience for Resource 1
        experience2: "8 years of experience", // Specific experience for Resource 2
        experience3: "6 years of experience", // Specific experience for Resource 3
        experience4: "7 years of experience", // Specific experience for Resource 4
        experience5: "5 years of experience", // Specific experience for Resource 5
        experience6: "9 years of experience", // Specific experience for Resource 6
        mobileDeveloper: "Senior Mobile Developer",
        webDeveloper: "Senior Web Developer",
        dataAnalyst: "Data Analyst",
        graphicDesigner: "Graphic Designer",
        tester: "Tester and Implementer", // Changed from testerImplementer
        projectManager: "Project Manager",
        mobileSpec: "Specialty: React Native and Flutter",
        webSpec: "Especialidad: Full-Stack Web Development and REST APIs",
        dataSpec: "Especialidad: Business Intelligence and Data Visualization",
        graphicDesignerExp: "Expert in UI/UX and Design Systems",
        testerExp: "Expert in QA Automation and DevOps",
        pmExp: "Expert in Agile Methodologies and Project Management",
        totalProfessionals: "professionals working on your project",
        workingOnProject: "professionals working on your project",
        complementaryProfessionals: "Complementary Professionals", // Added for Development Team slide
        specialty1: "Specialty: React Native, Flutter, UI/UX", // Specific specialty for Resource 1
        specialty2: "Specialty: Node.js, React, REST APIs, Docker", // Specific specialty for Resource 2
        specialty3: "Specialty: SQL, Python, Power BI, Tableau", // Specific specialty for Resource 3
        specialty4: "Specialty: Interface Design, Prototyping", // Specific specialty for Resource 4
        specialty5: "Specialty: Automated Testing, Jira", // Specific specialty for Resource 5
        specialty6: "Specialty: Agile Methodologies, Scrum", // Specific specialty for Resource 6
      },
      scope: {
        title: "Scope",
        subtitle: "Detailed Scope of the HSE Incident Analysis Prototype",
        description:
          "This demonstrator focuses exclusively on validating the value of AI-assisted analysis, excluding complete incident management functionality.",

        // Slide 12: Requirements and Incident Loading
        requirements: {
          title: "Solution Requirements and Incident Loading",
          dualProduct: "Dual Functional Product",
          dualProductDesc:
            "The project will deliver a multiplatform Application (App) for data collection and a Web Application for analysis.",
          deliveryTime: "Delivery Timeline",
          deliveryTimeDesc: "The demonstrator must be deliverable within 29 days.",
          database: "Database (Required)",
          databaseDesc: "Unlike initially planned, this version must include a database to store loaded incidents.",
          incidentLoading: "Incident Loading",
          loadingByUser: "Loading by User",
          loadingByUserDesc: "Incidents will be loaded directly by the user through the multiplatform App.",
          minimalData: "Minimal Data",
          minimalDataDesc: "The App will only handle basic incident data, along with audio, text and attachments.",
          dataPerIncident: "Data per Incident",
          dataPerIncidentDesc:
            "Each incident must include an audio recording (voice description), a text description (optional) and a manual classification (type and severity).",
        },

        // Slide 13: AI Capabilities
        aiCapabilities: {
          title: "Artificial Intelligence Analytical Capabilities",
          subtitle: "The AI must apply the following analytical processing flow:",
          transcription: "Transcription",
          transcriptionDesc: "Automatic conversion of incident audio to text.",
          summary: "Summary",
          summaryDesc: "Generation of a short and coherent summary (approx. 4-5 lines).",
          factExtraction: "Fact Extraction",
          factExtractionDesc: "Determination of structured information, including:",
          factItems: [
            "Actors involved",
            "Location, if in the narrative",
            "Equipment involved",
            "Temporal clues or timestamp",
            "Sequence and key events",
          ],
          chronology: "Chronology",
          chronologyDesc: "Extraction of a simple and ordered sequence of 'who did what, where, when' from the text.",
          inconsistencies: "Inconsistency Detection",
          inconsistenciesDesc:
            "Identification of contradictions or missing critical fields (e.g., mention of injury without victim).",
          causalStructure: "Simplified Causal Structure",
          causalStructureDesc:
            "Proposal of a draft cause tree that links observable facts with immediate causes and potential root causes.",
          correctiveActions: "Corrective Action Suggestions",
          correctiveActionsDesc:
            "Proposal of 3 to 5 standard actions based on identified causes and generic HSE models.",
        },

        // Slide 14: Web Interface and Exclusions
        webInterface: {
          title: "Web Interface and Functional Exclusions",
          webVisualization: "Centralized Visualization",
          webVisualizationDesc:
            "A simple web interface (one or several sections) that only displays the results of AI analysis: Transcription, Summary, Facts, Chronology, Cause Tree and Recommended Actions.",
          dashboard: "Managerial Dashboard (New)",
          dashboardDesc: "This version must include a basic managerial control dashboard.",
          noEditing: "No Data Editing",
          noEditingDesc: "The web user cannot enter or edit incident data.",
          exclusions: "Functional Exclusions",
          exclusionsSubtitle: "To maintain low cost and speed, the following is excluded:",
          workflows: "Workflows",
          workflowsDesc: "No incident lifecycle (triage, investigation, validation, closure) or action tracking.",
          userManagement: "User Management",
          userManagementDesc: "No authentication system, roles, permissions or administration interfaces.",
          scalability: "Scalability Features",
          scalabilityDesc: "No long-term hosting, scalability or configurable parameters.",
        },
        included: "Includes",
        notIncluded: "Does Not Include",
        includedItems: [
          "Multiplatform mobile application for incident reporting.",
          "Web application for viewing and analyzing AI results.",
          "Database for storing incidents.",
          "Automatic audio-to-text transcription.",
          "AI-generated summary.",
          "Extraction of key facts and chronology.",
          "Inconsistency detection.",
          "Simplified causal structure and corrective action recommendations.",
          "Basic managerial dashboard.",
        ],
        notIncludedItems: [
          "Full incident management functionality (lifecycle, workflows, action tracking).",
          "User management system, roles, and permissions.",
          "Advanced scalability and configuration features.",
          "Long-term maintenance or extensive post-launch support.",
        ],
      },
      team: {},
    },
  },
}

export default function IncidentTrackingPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [language, setLanguage] = useState<"es" | "en">("es")
  const slideContainerRef = useRef<HTMLDivElement>(null)

  const totalSlides = 16

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es")
  }

  const t = translations[language]

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    if (slideContainerRef.current) {
      slideContainerRef.current.scrollTo({
        top: 0,
        behavior: "instant",
      })
    }
  }, [currentSlide])

  const renderSlideContent = () => {
    switch (currentSlide) {
      case 0:
        return (
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <div className="w-full max-w-2xl text-center space-y-6">
              <div className="flex justify-center gap-4 mb-8">
                <div className="bg-primary/10 p-6 rounded-2xl">
                  <Shield className="w-16 h-16 text-primary" />
                </div>
              </div>
              {/* Updated to show web administration and added dashboard */}
              <h3 className="text-3xl font-bold text-balance">{t.slides.intro.twoApps}</h3>

              <p className="text-lg text-primary font-semibold mt-2">Beta Version: 29 business days</p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {/* Reporter App */}
                <Card className="p-6 space-y-3 border-primary/30">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg">{t.slides.intro.reporterApp}</h4>
                  <p className="text-sm text-muted-foreground">{t.slides.intro.reporterDesc}</p>
                </Card>
                {/* Manager Web */}
                <Card className="p-6 space-y-3 border-accent/30">
                  <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-bold text-lg">{t.slides.intro.managerWeb}</h4>
                  {/* Updates: Updated description to remove "edición de datos y agregado de acciones" */}
                  <p className="text-sm text-muted-foreground">{t.slides.intro.managerDesc}</p>
                </Card>
                {/* Dashboard */}
                <Card className="p-6 space-y-3 border-chart-3/30">
                  <div className="bg-chart-3/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-chart-3" />
                  </div>
                  <h4 className="font-bold text-lg">{t.slides.intro.dashboard}</h4>
                  <p className="text-sm text-muted-foreground">{t.slides.intro.dashboardDesc}</p>
                </Card>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-md">
              <div className="bg-card border-8 border-foreground/20 rounded-[3rem] shadow-2xl overflow-hidden">
                <div className="bg-foreground/5 px-6 py-3 flex items-center justify-between">
                  <Clock className="w-4 h-4" />
                  <div className="bg-foreground rounded-full w-24 h-6" />
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-foreground rounded" />
                    <div className="w-1 h-4 bg-foreground rounded" />
                    <div className="w-1 h-4 bg-foreground rounded" />
                  </div>
                </div>
                <div className="bg-background p-6 space-y-6 max-h-[650px] overflow-y-auto">
                  <div className="text-center space-y-2">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{t.slides.mobileHome.subtitle}</h3>
                    <p className="text-sm text-muted-foreground">{t.slides.mobileHome.title}</p>
                  </div>

                  <div className="space-y-4">
                    {/* New Incident Button */}
                    <Card className="group cursor-pointer border-2 border-primary/20 p-6 transition-all hover:scale-105 hover:border-primary hover:shadow-lg">
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:bg-primary/20">
                          <ClipboardList className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h4 className="mb-1 text-lg font-bold text-foreground">{t.slides.mobileHome.newIncident}</h4>
                          <p className="text-sm text-muted-foreground">{t.slides.intro.reporterDesc}</p>
                        </div>
                        <Button size="default" className="w-full gap-2" onClick={() => setCurrentSlide(3)}>
                          <ClipboardList className="h-4 w-4" />
                          {t.slides.mobileHome.newIncident}
                        </Button>
                      </div>
                    </Card>

                    {/* My Incidents Button */}
                    <Card className="group cursor-pointer border-2 border-accent/20 p-6 transition-all hover:scale-105 hover:border-accent hover:shadow-lg">
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 transition-all group-hover:bg-accent/20">
                          <FileText className="h-8 w-8 text-accent" />
                        </div>
                        <div>
                          <h4 className="mb-1 text-lg font-bold text-foreground">{t.slides.mobileHome.myIncidents}</h4>
                          <p className="text-sm text-muted-foreground">{t.slides.mobileList.subtitle}</p>
                        </div>
                        <Button
                          size="default"
                          variant="outline"
                          className="w-full gap-2 bg-transparent"
                          onClick={() => setCurrentSlide(2)}
                        >
                          <FileText className="h-4 w-4" />
                          {t.slides.mobileHome.myIncidents}
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-md">
              <div className="bg-card border-8 border-foreground/20 rounded-[3rem] shadow-2xl overflow-hidden">
                <div className="bg-foreground/5 px-6 py-3 flex items-center justify-between">
                  <Clock className="w-4 h-4" />
                  <div className="bg-foreground rounded-full w-24 h-6" />
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-foreground rounded" />
                    <div className="w-1 h-4 bg-foreground rounded" />
                    <div className="w-1 h-4 bg-foreground rounded" />
                  </div>
                </div>
                <div className="bg-background p-6 space-y-4 max-h-[650px] overflow-y-auto">
                  <div className="text-center space-y-1 mb-4">
                    <h3 className="text-lg font-bold">{t.slides.mobileList.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {t.slides.webTracking.stats.total}: 3
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {/* Incident 1 */}
                    <Card className="border-l-4 border-l-warning p-3 transition-all hover:shadow-md">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-sm text-foreground">INC-2024-0234</h4>
                          <Badge variant="outline" className="border-warning text-warning text-xs">
                            {t.slides.status.inProgress}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{t.slides.incidentTypes.safety}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Jan 18, 2024
                          </div>
                          <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs">
                            <FileText className="h-3 w-3" />
                            {t.slides.mobileList.viewDetails}
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Incident 2 */}
                    <Card className="border-l-4 border-l-success p-3 transition-all hover:shadow-md">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-sm text-foreground">INC-2024-0198</h4>
                          <Badge variant="outline" className="border-success text-success text-xs">
                            {t.slides.status.resolved}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{t.slides.incidentTypes.equipment}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Jan 08, 2024
                          </div>
                          <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs">
                            <FileText className="h-3 w-3" />
                            {t.slides.mobileList.viewDetails}
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Incident 3 */}
                    <Card className="border-l-4 border-l-chart-3 p-3 transition-all hover:shadow-md">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-sm text-foreground">INC-2024-0156</h4>
                          <Badge variant="outline" className="border-chart-3 text-chart-3 text-xs">
                            {t.slides.status.pending}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{t.slides.incidentTypes.quality}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Dec 28, 2023
                          </div>
                          <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs">
                            <FileText className="h-3 w-3" />
                            {t.slides.mobileList.viewDetails}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3: // Slide 4: Categories (was slide 2)
        return (
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-md">
              <div className="bg-card border-8 border-foreground/20 rounded-[3rem] shadow-2xl overflow-hidden">
                <div className="bg-foreground/5 px-6 py-3 flex items-center justify-between">
                  <Clock className="w-4 h-4" />
                  <div className="bg-foreground rounded-full w-24 h-6" />
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-foreground rounded" />
                    <div className="w-1 h-4 bg-foreground rounded" />
                    <div className="w-1 h-4 bg-foreground rounded" />
                  </div>
                </div>
                <div className="bg-background p-6 space-y-6">
                  <div className="text-center space-y-2">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{t.slides.mobileHome.newIncident}</h3>
                    <p className="text-sm text-muted-foreground">{t.slides.intro.reporterDesc}</p>
                  </div>

                  <div className="space-y-3">
                    <Card className="p-4 hover:bg-accent/5 transition cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="bg-destructive/10 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{t.slides.incidentTypes.safety}</p>
                          <p className="text-xs text-muted-foreground">{t.slides.intro.reporterDesc}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-primary/5 border-primary border-2">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{t.slides.incidentTypes.equipment}</p>
                          <p className="text-xs text-muted-foreground">{t.slides.intro.reporterDesc}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 hover:bg-accent/5 transition cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="bg-warning/10 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{t.slides.incidentTypes.quality}</p>
                          <p className="text-xs text-muted-foreground">{t.slides.intro.reporterDesc}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 hover:bg-accent/5 transition cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="bg-emerald-100 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{t.slides.incidentTypes.environment}</p>
                          <p className="text-xs text-muted-foreground">{t.slides.intro.reporterDesc}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 4: // Slide 5: Description (was slide 3)
        return (
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-md">
              <div className="bg-card border-8 border-foreground/20 rounded-[3rem] shadow-2xl overflow-hidden">
                <div className="bg-foreground/5 px-6 py-3 flex items-center justify-between">
                  <Clock className="w-4 h-4" />
                  <div className="bg-foreground rounded-full w-24 h-6" />
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-foreground rounded" />
                    <div className="w-1 h-4 bg-foreground rounded" />
                    <div className="w-1 h-4 bg-foreground rounded" />
                  </div>
                </div>
                <div className="bg-background p-6 space-y-4 max-h-[600px] overflow-y-auto">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold">{t.slides.mobileDetail.description}</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">
                        {t.slides.description.dateTime}
                      </label>
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">2024-01-15 14:30</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">
                        {t.slides.description.location}
                      </label>
                      <div className="p-3 bg-muted rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{t.slides.description.locationValue}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-xs text-muted-foreground">{t.slides.description.coordinates}</span>
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 bg-transparent">
                            <Navigation className="w-3 h-3" />
                            {t.slides.description.useGPS}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">
                        {t.slides.description.description}
                      </label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 h-9 text-xs gap-1 bg-transparent">
                            <FileText className="w-3 h-3" />
                            {t.slides.description.writeText}
                          </Button>
                          <Button size="sm" variant="default" className="flex-1 h-9 text-xs gap-1 bg-primary">
                            <Mic className="w-3 h-3" />
                            {t.slides.description.recordAudio}
                          </Button>
                        </div>
                        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                            <span className="text-xs font-medium text-primary">{t.slides.description.recording}</span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {t.slides.description.audioTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 h-8">
                            {Array.from({ length: 30 }).map((_, i) => (
                              <div
                                key={i}
                                className="flex-1 bg-primary/30 rounded-full"
                                style={{ height: `${Math.random() * 100}%` }}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs p-3 bg-muted rounded-lg">{t.slides.description.descriptionValue}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">
                        {t.slides.description.attachments}
                      </label>
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <Camera className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{t.slides.description.attachmentValue}</span>
                      </div>
                    </div>

                    <Button className="w-full">{t.slides.description.continue}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 5: // Slide 6: Classification (was slide 4)
        return (
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-md">
              <div className="bg-card border-8 border-foreground/20 rounded-[3rem] shadow-2xl overflow-hidden">
                <div className="bg-foreground/5 px-6 py-3 flex items-center justify-between">
                  <Clock className="w-4 h-4" />
                  <div className="bg-foreground rounded-full w-24 h-6" />
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-foreground rounded" />
                    <div className="w-1 h-4 bg-foreground rounded" />
                    <div className="w-1 h-4 bg-foreground rounded" />
                  </div>
                </div>
                <div className="bg-background p-6 space-y-4 max-h-[600px] overflow-y-auto">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold">{t.slides.webIncidentViewer.severity}</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-2">
                        {t.slides.webIncidentViewer.title_field}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="default" size="sm" className="h-auto py-2 flex-col gap-1">
                          <Shield className="w-4 h-4" />
                          <span className="text-xs">{t.slides.incidentTypes.safety}</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-auto py-2 flex-col gap-1 bg-transparent">
                          <Building2 className="w-4 h-4" />
                          <span className="text-xs">{t.slides.incidentTypes.environment}</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-auto py-2 flex-col gap-1 bg-transparent">
                          <Package className="w-4 h-4" />
                          <span className="text-xs">{t.slides.incidentTypes.equipment}</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-auto py-2 flex-col gap-1 bg-transparent">
                          <ListChecks className="w-4 h-4" />
                          <span className="text-xs">{t.slides.incidentTypes.quality}</span>
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground block mb-2">
                        {t.slides.webIncidentViewer.severity}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="justify-start bg-transparent">
                          <div className="w-3 h-3 bg-success rounded-full mr-2" />
                          <span className="text-xs">{t.slides.classification.low}</span>
                        </Button>
                        <Button variant="default" size="sm" className="justify-start">
                          <div className="w-3 h-3 bg-warning rounded-full mr-2" />
                          <span className="text-xs">{t.slides.classification.medium}</span>
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start bg-transparent">
                          <div className="w-3 h-3 bg-destructive rounded-full mr-2" />
                          <span className="text-xs">{t.slides.classification.high}</span>
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start bg-transparent">
                          <div className="w-3 h-3 bg-destructive/70 rounded-full mr-2" />
                          <span className="text-xs">{t.slides.classification.critical}</span>
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">
                        {t.slides.webIncidentViewer.description}
                      </label>
                      <p className="text-xs p-3 bg-muted rounded-lg">
                        {t.slides.webIncidentViewer.aiResults.observationsDesc}
                      </p>
                    </div>

                    <Button className="w-full bg-primary">{t.slides.webTracking.view}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 6: // Slide 7: Dual Mobile View
        return (
          <div className="flex items-center justify-center h-full gap-8 px-6">
            {/* Left Phone - Incidents List */}
            <div className="w-full max-w-md">
              <div className="bg-card border-8 border-foreground/20 rounded-[3rem] shadow-2xl overflow-hidden">
                <div className="bg-foreground/5 px-6 py-3 flex items-center justify-between">
                  <Clock className="w-4 h-4" />
                  <div className="bg-foreground rounded-full w-24 h-6" />
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-foreground rounded" />
                    <div className="w-1 h-4 bg-foreground rounded" />
                    <div className="w-1 h-4 bg-foreground rounded" />
                  </div>
                </div>
                <div className="bg-background p-6 space-y-4 max-h-[600px] overflow-y-auto">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold">{t.slides.mobileList.title}</h3>
                    <p className="text-xs text-muted-foreground">{t.slides.mobileList.subtitle}</p>
                  </div>

                  <div className="space-y-3">
                    <Card className="p-4 bg-warning/5 border-warning cursor-pointer hover:bg-warning/10 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">INC-2024-0234</span>
                          <Badge className="bg-warning/10 text-warning border-warning/20">
                            {t.slides.status.inProgress}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{t.slides.incidentTypes.safety}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>Jan 18, 2024</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">INC-2024-0198</span>
                          <Badge className="bg-success/10 text-success border-success/20">
                            {t.slides.status.resolved}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{t.slides.incidentTypes.equipment}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>Jan 08, 2024</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">INC-2024-0156</span>
                          <Badge variant="outline">{t.slides.status.pending}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{t.slides.incidentTypes.quality}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>Dec 28, 2023</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Phone - Incident Detail */}
            <div className="w-full max-w-md">
              <div className="bg-card border-8 border-foreground/20 rounded-[3rem] shadow-2xl overflow-hidden">
                <div className="bg-foreground/5 px-6 py-3 flex items-center justify-between">
                  <Clock className="w-4 h-4" />
                  <div className="bg-foreground rounded-full w-24 h-6" />
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-foreground rounded" />
                    <div className="w-1 h-4 bg-foreground rounded" />
                    <div className="w-1 h-4 bg-foreground rounded" />
                  </div>
                </div>
                <div className="bg-background p-6 space-y-4 max-h-[600px] overflow-y-auto">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold">{t.slides.mobileDetail.title}</h3>
                    <Badge className="bg-warning/10 text-warning border-warning/20">INC-2024-0234</Badge>
                  </div>

                  <Card className="p-3 bg-primary/5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{t.slides.mobileDetail.description}</span>
                        <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">
                          {t.slides.status.inProgress}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{t.slides.mobileDetail.subtitle}</p>
                    </div>
                  </Card>

                  <div>
                    <label className="text-xs font-medium block mb-2">{t.slides.mobileDetail.actions}</label>
                    <div className="space-y-2">
                      <Card className="p-3 bg-success/5 border-success">
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Inspección del área</p>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-success" />
                            <span className="text-xs text-success">{t.slides.status.resolved}</span>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-3 bg-warning/5 border-warning/30">
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Coordinar limpieza</p>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-warning" />
                            <span className="text-xs text-warning">{t.slides.status.inProgress}</span>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-3">
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Notificar al supervisor</p>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{t.slides.status.pending}</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium block mb-2">{t.slides.mobileDetail.photos}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                        <Camera className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                        <Camera className="w-6 h-6 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-primary" size="sm">
                    {t.slides.mobileList.viewDetails}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case 7: // Slide 8: Web Tracking
        return (
          <div className="w-full h-full p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="text-center space-y-2 mb-6">
                <h3 className="text-2xl font-bold">{t.slides.webTracking.title}</h3>
                <p className="text-muted-foreground">{t.slides.webTracking.subtitle}</p>
              </div>

              <div className="flex gap-6">
                {/* Table Section */}
                <Card className="flex-1 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder={t.slides.webTracking.search}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-3 text-sm font-semibold">{t.slides.webTracking.table.id}</th>
                            <th className="text-left p-3 text-sm font-semibold">{t.slides.webTracking.table.type}</th>
                            <th className="text-left p-3 text-sm font-semibold">{t.slides.webTracking.table.title}</th>
                            <th className="text-left p-3 text-sm font-semibold">
                              {t.slides.webTracking.table.severity}
                            </th>
                            <th className="text-left p-3 text-sm font-semibold">{t.slides.webTracking.table.status}</th>
                            <th className="text-left p-3 text-sm font-semibold">{t.slides.webTracking.view}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {[
                            {
                              id: "25",
                              type: t.slides.incidentTypes.safety,
                              title: "Derrame de líquido en pasillo",
                              severity: t.slides.classification.high,
                              severityColor: "bg-destructive/10 text-destructive border-destructive/20",
                              status: t.slides.status.inProgress,
                              statusColor: "bg-primary/10 text-primary border-primary/20",
                            },
                            {
                              id: "24",
                              type: t.slides.incidentTypes.equipment,
                              title: "Fuga de aceite en compresor",
                              severity: t.slides.classification.medium,
                              severityColor: "bg-warning/10 text-warning border-warning/20",
                              status: t.slides.status.open,
                              statusColor: "bg-muted text-muted-foreground",
                            },
                            {
                              id: "23",
                              type: t.slides.incidentTypes.quality,
                              title: "Pieza defectuosa en línea de montaje",
                              severity: t.slides.classification.critical,
                              severityColor: "bg-destructive text-destructive-foreground",
                              status: t.slides.status.inProgress,
                              statusColor: "bg-primary/10 text-primary border-primary/20",
                            },
                            {
                              id: "22",
                              type: t.slides.incidentTypes.environment,
                              title: "Emisión de vapor no controlada",
                              severity: t.slides.classification.low,
                              severityColor: "bg-success/10 text-success border-success/20",
                              status: t.slides.status.resolved,
                              statusColor: "bg-success/10 text-success border-success/20",
                            },
                          ].map((incident) => (
                            <tr key={incident.id} className="hover:bg-muted/50">
                              <td className="p-3 font-mono font-semibold">#{incident.id}</td>
                              <td className="p-3">{incident.type}</td>
                              <td className="p-3">{incident.title}</td>
                              <td className="p-3">
                                <Badge className={incident.severityColor}>{incident.severity}</Badge>
                              </td>
                              <td className="p-3">
                                <Badge className={incident.statusColor}>{incident.status}</Badge>
                              </td>
                              <td className="p-3">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  {t.slides.webTracking.view}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card>

                {/* Stats Cards Section */}
                <div className="w-80 space-y-4">
                  <Card className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{t.slides.webTracking.stats.total}</p>
                      <AlertCircle className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold">24</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.slides.dashboard.metrics.days}</p>
                  </Card>

                  <Card className="p-5 bg-success/5 border-success/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{t.slides.webTracking.stats.resolved}</p>
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <p className="text-3xl font-bold text-success">18</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.slides.dashboard.metrics.days}</p>
                  </Card>

                  <Card className="p-5 bg-accent/5 border-accent/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{t.slides.webTracking.stats.inProgress}</p>
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <p className="text-3xl font-bold text-accent">4</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.slides.dashboard.metrics.days}</p>
                  </Card>

                  <Card className="p-5 bg-orange-50 border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{t.slides.webTracking.stats.pending}</p>
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-3xl font-bold text-orange-600">2</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.slides.dashboard.metrics.days}</p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )

      case 8: // Slide 9: Web Incident Viewer
        return (
          <div className="w-full h-full p-6 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="text-center space-y-2 mb-6">
                <h3 className="text-2xl font-bold">{t.slides.webIncidentViewer.title}</h3>
                <p className="text-muted-foreground">{t.slides.webIncidentViewer.subtitle}</p>
              </div>

              <Card className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <div className="flex items-center gap-4">
                    {/* Updates: Removed edit button (pencil) from incident number */}
                    <Badge variant="outline" className="text-lg px-4 py-1">
                      #25
                    </Badge>
                    <select className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md px-3 py-1 text-sm font-medium cursor-pointer">
                      <option>{t.slides.classification.high}</option>
                      <option>{t.slides.classification.critical}</option>
                      <option>{t.slides.classification.medium}</option>
                      <option>{t.slides.classification.low}</option>
                    </select>
                  </div>
                  <Button variant="ghost" size="icon">
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Images Section */}
                <div className="mb-6">
                  {/* Updates: Removed edit button (pencil) from photos section */}
                  <h4 className="font-semibold mb-3">{t.slides.webIncidentViewer.photos}</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                      <img
                        src="/warehouse-incident-floor.jpg"
                        alt="Incident photo 1"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                      <img
                        src="/safety-equipment-area.jpg"
                        alt="Incident photo 2"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                      <img
                        src="/workplace-incident-scene.jpg"
                        alt="Incident photo 3"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* Updates: Removed edit buttons (pencils) from all detail fields */}
                  <div>
                    <label className="text-sm text-muted-foreground">{t.slides.webIncidentViewer.title_field}</label>
                    <p className="font-medium">Derrame de líquido en pasillo principal</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">{t.slides.webIncidentViewer.severity}</label>
                    <select className="w-full bg-destructive/10 text-destructive border border-destructive/20 rounded-md px-3 py-2 text-sm font-medium cursor-pointer">
                      <option>{t.slides.classification.high}</option>
                      <option>{t.slides.classification.critical}</option>
                      <option>{t.slides.classification.medium}</option>
                      <option>{t.slides.classification.low}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Tipo</label>
                    <select className="w-full bg-orange-50 border border-orange-200 rounded-md px-3 py-2 text-sm font-medium cursor-pointer">
                      <option>{t.slides.incidentTypes.safety}</option>
                      <option>{t.slides.incidentTypes.equipment}</option>
                      <option>{t.slides.incidentTypes.quality}</option>
                      <option>{t.slides.incidentTypes.environment}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Estado</label>
                    <select className="w-full bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-sm font-medium cursor-pointer">
                      <option>{t.slides.status.open}</option>
                      <option>{t.slides.status.inProgress}</option>
                      <option>{t.slides.status.pending}</option>
                      <option>{t.slides.status.resolved}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">{t.slides.webIncidentViewer.user}</label>
                    <p className="font-medium">Juan Pérez</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Fecha</label>
                    <p className="font-medium">15 Dic 2024, 14:30</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-sm text-muted-foreground">{t.slides.webIncidentViewer.description}</label>
                  <p className="text-sm mt-1">
                    Se detectó derrame de líquido en el pasillo principal del área de producción. La superficie está
                    resbaladiza y representa un riesgo de caídas. Se requiere limpieza inmediata y señalización.
                  </p>
                </div>

                <div className="mb-6">
                  <label className="text-sm text-muted-foreground">{t.slides.webIncidentViewer.location}</label>
                  <p className="font-medium">Planta de Producción - Pasillo A3</p>
                </div>

                {/* Updates: Added AI Analysis Section */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-6 h-6 text-purple-600" />
                    <h4 className="font-bold text-lg text-purple-900">{t.slides.webIncidentViewer.aiAnalysis}</h4>
                    <Badge className="bg-purple-600 text-white">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {/* Inconsistencies */}
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="flex items-start gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-green-900">
                            {t.slides.webIncidentViewer.aiResults.inconsistencies}
                          </h5>
                          <p className="text-sm text-gray-700 mt-1">
                            {t.slides.webIncidentViewer.aiResults.inconsistenciesDesc}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Observations */}
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2 mb-2">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-blue-900">
                            {t.slides.webIncidentViewer.aiResults.observations}
                          </h5>
                          <p className="text-sm text-gray-700 mt-1">
                            {t.slides.webIncidentViewer.aiResults.observationsDesc}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white p-4 rounded-lg border border-orange-200">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-orange-900">
                            {t.slides.webIncidentViewer.aiResults.recommendations}
                          </h5>
                          <p className="text-sm text-gray-700 mt-1">
                            {t.slides.webIncidentViewer.aiResults.recommendationsDesc}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Corrective Actions */}
                    <div className="bg-white p-4 rounded-lg border border-purple-200">
                      <div className="flex items-start gap-2 mb-2">
                        <ListChecks className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-purple-900">
                            {t.slides.webIncidentViewer.aiResults.correctiveActions}
                          </h5>
                          <p className="text-sm text-gray-700 mt-1">
                            {t.slides.webIncidentViewer.aiResults.correctiveActionsDesc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Section - Moved to the end */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{t.slides.webIncidentViewer.actions}</h4>
                    {/* Updates: Removed "+ Agregar" button */}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Área señalizada</p>
                        <p className="text-xs text-muted-foreground">16 Dic 2024, 08:00</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Equipo de limpieza notificado</p>
                        <p className="text-xs text-muted-foreground">16 Dic 2024, 09:15</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Inspección programada</p>
                        <p className="text-xs text-muted-foreground">16 Dic 2024, 10:00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )

      case 9: // Slide 10: Dashboard
        return (
          <div className="h-full flex items-center justify-center p-8">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">{t.slides.dashboard.title}</h3>
                <p className="text-muted-foreground">{t.slides.dashboard.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{t.slides.dashboard.metrics.total}</p>
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  </div>
                  <p className="text-3xl font-bold">24</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.slides.dashboard.metrics.days}</p>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{t.slides.dashboard.metrics.open}</p>
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-primary">4</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.slides.dashboard.metrics.days}</p>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{t.slides.dashboard.metrics.resolved}</p>
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <p className="text-3xl font-bold text-success">18</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.slides.dashboard.metrics.days}</p>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{t.slides.dashboard.metrics.avgTime}</p>
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-3xl font-bold text-orange-600">3.5</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.slides.dashboard.metrics.days}</p>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-5">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    {t.slides.dashboard.charts.bySeverity}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.slides.classification.low}</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-success w-[65%]" />
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.slides.classification.medium}</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-warning w-[25%]" />
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.slides.classification.high}</span>
                      <span className="font-medium">8%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive w-[8%]" />
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.slides.classification.critical}</span>
                      <span className="font-medium">2%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive/70 w-[2%]" />
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    {t.slides.dashboard.safetyPyramid.title}
                  </h4>
                  <div className="space-y-2">
                    <div className="bg-destructive/10 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-destructive">0</p>
                      <p className="text-xs text-muted-foreground">{t.slides.dashboard.safetyPyramid.fatal}</p>
                    </div>
                    <div className="bg-destructive/10 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-destructive">1</p>
                      <p className="text-xs text-muted-foreground">{t.slides.dashboard.safetyPyramid.serious}</p>
                    </div>
                    <div className="bg-warning/10 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-warning">3</p>
                      <p className="text-xs text-muted-foreground">{t.slides.dashboard.safetyPyramid.minor}</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-orange-600">15</p>
                      <p className="text-xs text-muted-foreground">{t.slides.dashboard.safetyPyramid.nearMiss}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">45</p>
                      <p className="text-xs text-muted-foreground">{t.slides.dashboard.safetyPyramid.unsafe}</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Card className="p-5">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    {t.slides.dashboard.charts.trend}
                  </h4>
                  {/* Placeholder for trend chart */}
                  <div className="h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                    Chart Placeholder
                  </div>
                </Card>

                <Card className="p-5">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    {t.slides.dashboard.metrics.avgTime}
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{t.slides.dashboard.security}</p>
                        <Badge className="text-xs">2.1 {t.slides.dashboard.metrics.days}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          {t.slides.dashboard.inProgress}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{t.slides.dashboard.equipment}</p>
                        <Badge className="text-xs">4.5 {t.slides.dashboard.metrics.days}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          {t.slides.dashboard.inProgress}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    {t.slides.dashboard.criticalAlerts}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{t.slides.dashboard.highSeverityPending}</p>
                        <p className="text-xs text-muted-foreground">
                          INC-2024-0230 - {t.slides.dashboard.timeAgo} 6{t.slides.dashboard.hours}
                        </p>
                      </div>
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                        {t.slides.dashboard.high}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">3 {t.slides.dashboard.overdueActions}</p>
                        <p className="text-xs text-muted-foreground">{t.slides.dashboard.requiresAttention}</p>
                      </div>
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                        {t.slides.dashboard.critical}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )

      case 10: // Case 10: Hours and costs
        return (
          <div className="h-full flex items-center justify-center p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-6 py-6">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold mb-2">{t.slides.hoursAndCosts.title}</h3>
              </div>

              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-8">
                <div className="text-center">
                  <DollarSign className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xl font-semibold mb-3">{t.slides.hoursAndCosts.totalCost}</p>
                  <p className="text-5xl font-bold mb-4">USD 21,500</p>

                  <div className="border-t border-white/30 pt-4 mt-4">
                    <p className="text-lg mb-2">{t.slides.hoursAndCosts.discount} 20%</p>
                    <p className="text-2xl font-semibold mb-1">{t.slides.hoursAndCosts.finalPrice}</p>
                    <p className="text-5xl font-bold">USD 17,200</p>
                  </div>
                </div>
              </Card>

              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-green-50 border-green-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white">
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-bold text-green-900">{t.slides.hoursAndCosts.resource1}</p>
                      <p className="text-sm text-gray-600">{t.slides.hoursAndCosts.resource1desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-700" />
                    <p className="text-3xl font-bold text-green-700">
                      200 {t.slides.hoursAndCosts.totalHours.toLowerCase().includes("horas") ? "horas" : "hours"}
                    </p>
                  </div>
                </Card>

                <Card className="bg-blue-50 border-blue-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-900">{t.slides.hoursAndCosts.resource2}</p>
                      <p className="text-sm text-gray-600">{t.slides.hoursAndCosts.resource2desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-700" />
                    <p className="text-3xl font-bold text-blue-700">
                      272 {t.slides.hoursAndCosts.totalHours.toLowerCase().includes("horas") ? "horas" : "hours"}
                    </p>
                  </div>
                </Card>

                <Card className="bg-orange-50 border-orange-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white">
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-bold text-orange-900">{t.slides.hoursAndCosts.resource3}</p>
                      <p className="text-sm text-gray-600">{t.slides.hoursAndCosts.resource3desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-700" />
                    <p className="text-3xl font-bold text-orange-700">
                      40 {t.slides.hoursAndCosts.totalHours.toLowerCase().includes("horas") ? "horas" : "hours"}
                    </p>
                  </div>
                </Card>

                <Card className="bg-purple-50 border-purple-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white">
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-bold text-purple-900">{t.slides.hoursAndCosts.resource4}</p>
                      <p className="text-sm text-gray-600">{t.slides.hoursAndCosts.resource4desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-700" />
                    <p className="text-3xl font-bold text-purple-700">
                      16 {t.slides.hoursAndCosts.totalHours.toLowerCase().includes("horas") ? "horas" : "hours"}
                    </p>
                  </div>
                </Card>

                <Card className="bg-pink-50 border-pink-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center text-white">
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-bold text-pink-900">{t.slides.hoursAndCosts.resource5}</p>
                      <p className="text-sm text-gray-600">{t.slides.hoursAndCosts.resource5desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-pink-700" />
                    <p className="text-3xl font-bold text-pink-700">
                      58 {t.slides.hoursAndCosts.totalHours.toLowerCase().includes("horas") ? "horas" : "hours"}
                    </p>
                  </div>
                </Card>

                <Card className="bg-teal-50 border-teal-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white">
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-bold text-teal-900">{t.slides.hoursAndCosts.resource6}</p>
                      <p className="text-sm text-gray-600">{t.slides.hoursAndCosts.resource6desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-teal-700" />
                    <p className="text-3xl font-bold text-teal-700">
                      25 {t.slides.hoursAndCosts.totalHours.toLowerCase().includes("horas") ? "horas" : "hours"}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Total de Horas */}
              <Card className="bg-gray-100 border-gray-300 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-gray-700" />
                    <p className="text-xl font-bold text-gray-800">{t.slides.hoursAndCosts.totalHours}</p>
                  </div>
                  <p className="text-4xl font-bold text-gray-900">
                    611 {t.slides.hoursAndCosts.totalHours.toLowerCase().includes("horas") ? "horas" : "hours"}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )

      case 11: // Case 11: Scope
        return (
          <div className="h-full flex items-center justify-center p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6 py-6">
              <div className="text-center mb-8">
                <h3 className="text-4xl font-bold">{t.slides.scope.title}</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Incluye */}
                <Card className="bg-green-50 border-green-300 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <h4 className="text-2xl font-bold text-green-900">{t.slides.scope.included}</h4>
                  </div>
                  <ul className="space-y-4">
                    {t.slides.scope.includedItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* No Incluye */}
                <Card className="bg-red-50 border-red-300 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <XCircle className="w-8 h-8 text-red-600" />
                    <h4 className="text-2xl font-bold text-red-900">{t.slides.scope.notIncluded}</h4>
                  </div>
                  <ul className="space-y-4">
                    {t.slides.scope.notIncludedItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        )

      case 12: // Case 12: Requirements and Incident Loading
        return (
          <div className="h-full flex items-center justify-center p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-6 py-6">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold mb-4">{t.slides.scope.title}</h3>
                <h4 className="text-xl font-semibold text-gray-700 mb-2">{t.slides.scope.subtitle}</h4>
                <p className="text-gray-600">{t.slides.scope.description}</p>
              </div>

              <div className="space-y-6">
                <h4 className="text-2xl font-bold text-center mt-8 mb-4">{t.slides.scope.requirements.title}</h4>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Dual Product */}
                  <Card className="bg-blue-50 border-blue-200 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-bold text-blue-900">{t.slides.scope.requirements.dualProduct}</p>
                    </div>
                    <p className="text-sm text-gray-700">{t.slides.scope.requirements.dualProductDesc}</p>
                  </Card>

                  {/* Delivery Time */}
                  <Card className="bg-green-50 border-green-200 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-bold text-green-900">{t.slides.scope.requirements.deliveryTime}</p>
                    </div>
                    <p className="text-sm text-gray-700">{t.slides.scope.requirements.deliveryTimeDesc}</p>
                  </Card>

                  {/* Database */}
                  <Card className="bg-purple-50 border-purple-200 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                        <Database className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-bold text-purple-900">{t.slides.scope.requirements.database}</p>
                    </div>
                    <p className="text-sm text-gray-700">{t.slides.scope.requirements.databaseDesc}</p>
                  </Card>
                </div>

                <h5 className="text-xl font-bold text-center mt-8 mb-4">
                  {t.slides.scope.requirements.incidentLoading}
                </h5>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Loading by User */}
                  <Card className="bg-orange-50 border-orange-200 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-bold text-orange-900">{t.slides.scope.requirements.loadingByUser}</p>
                    </div>
                    <p className="text-sm text-gray-700">{t.slides.scope.requirements.loadingByUserDesc}</p>
                  </Card>

                  {/* Minimal Data */}
                  <Card className="bg-teal-50 border-teal-200 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-bold text-teal-900">{t.slides.scope.requirements.minimalData}</p>
                    </div>
                    <p className="text-sm text-gray-700">{t.slides.scope.requirements.minimalDataDesc}</p>
                  </Card>

                  {/* Data per Incident */}
                  <Card className="bg-pink-50 border-pink-200 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center">
                        <Mic className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-bold text-pink-900">{t.slides.scope.requirements.dataPerIncident}</p>
                    </div>
                    <p className="text-sm text-gray-700">{t.slides.scope.requirements.dataPerIncidentDesc}</p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )

      case 13: // Case 13: AI Capabilities
        return (
          <div className="h-full flex items-center justify-center p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-6 py-6">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold mb-4">{t.slides.scope.aiCapabilities.title}</h3>
                <p className="text-gray-600 text-lg">{t.slides.scope.aiCapabilities.subtitle}</p>
              </div>

              <div className="space-y-4">
                {/* Transcription */}
                <Card className="bg-blue-50 border-blue-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">1</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-lg mb-2">{t.slides.scope.aiCapabilities.transcription}</h5>
                      <p className="text-sm text-gray-700">{t.slides.scope.aiCapabilities.transcriptionDesc}</p>
                    </div>
                  </div>
                </Card>

                {/* Summary */}
                <Card className="bg-green-50 border-green-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">2</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-lg mb-2">{t.slides.scope.aiCapabilities.summary}</h5>
                      <p className="text-sm text-gray-700">{t.slides.scope.aiCapabilities.summaryDesc}</p>
                    </div>
                  </div>
                </Card>

                {/* Fact Extraction */}
                <Card className="bg-purple-50 border-purple-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-lg mb-2">{t.slides.scope.aiCapabilities.factExtraction}</h5>
                      <p className="text-sm text-gray-700 mb-2">{t.slides.scope.aiCapabilities.factExtractionDesc}</p>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                        {t.slides.scope.aiCapabilities.factItems.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Chronology */}
                <Card className="bg-orange-50 border-orange-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">4</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-lg mb-2">{t.slides.scope.aiCapabilities.chronology}</h5>
                      <p className="text-sm text-gray-700">{t.slides.scope.aiCapabilities.chronologyDesc}</p>
                    </div>
                  </div>
                </Card>

                {/* Inconsistencies */}
                <Card className="bg-red-50 border-red-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">5</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-lg mb-2">{t.slides.scope.aiCapabilities.inconsistencies}</h5>
                      <p className="text-sm text-gray-700">{t.slides.scope.aiCapabilities.inconsistenciesDesc}</p>
                    </div>
                  </div>
                </Card>

                {/* Causal Structure */}
                <Card className="bg-teal-50 border-teal-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">6</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-lg mb-2">{t.slides.scope.aiCapabilities.causalStructure}</h5>
                      <p className="text-sm text-gray-700">{t.slides.scope.aiCapabilities.causalStructureDesc}</p>
                    </div>
                  </div>
                </Card>

                {/* Corrective Actions */}
                <Card className="bg-indigo-50 border-indigo-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">7</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-lg mb-2">{t.slides.scope.aiCapabilities.correctiveActions}</h5>
                      <p className="text-sm text-gray-700">{t.slides.scope.aiCapabilities.correctiveActionsDesc}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )

      case 14: // Case 14: Web Interface and Exclusions
        return (
          <div className="h-full flex items-center justify-center p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-6 py-6">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold mb-4">{t.slides.scope.webInterface.title}</h3>
              </div>

              {/* Web Interface Section */}
              <div className="space-y-4 mb-8">
                <Card className="bg-blue-50 border-blue-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h5 className="font-bold text-lg mb-2">{t.slides.scope.webInterface.webVisualization}</h5>
                      <p className="text-sm text-gray-700">{t.slides.scope.webInterface.webVisualizationDesc}</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-green-50 border-green-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h5 className="font-bold text-lg mb-2">{t.slides.scope.webInterface.dashboard}</h5>
                      <p className="text-sm text-gray-700">{t.slides.scope.webInterface.dashboardDesc}</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-amber-50 border-amber-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h5 className="font-bold text-lg mb-2">{t.slides.scope.webInterface.noEditing}</h5>
                      <p className="text-sm text-gray-700">{t.slides.scope.webInterface.noEditingDesc}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Exclusions Section */}
              <div className="space-y-4">
                <h4 className="text-2xl font-bold text-center mb-2">{t.slides.scope.webInterface.exclusions}</h4>
                <p className="text-center text-gray-600 mb-4">{t.slides.scope.webInterface.exclusionsSubtitle}</p>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-red-50 border-red-200 p-6">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <h6 className="font-bold text-red-900 mb-2">{t.slides.scope.webInterface.workflows}</h6>
                        <p className="text-sm text-gray-700">{t.slides.scope.webInterface.workflowsDesc}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-red-50 border-red-200 p-6">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <h6 className="font-bold text-red-900 mb-2">{t.slides.scope.webInterface.userManagement}</h6>
                        <p className="text-sm text-gray-700">{t.slides.scope.webInterface.userManagementDesc}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-red-50 border-red-200 p-6">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <h6 className="font-bold text-red-900 mb-2">{t.slides.scope.webInterface.scalability}</h6>
                        <p className="text-sm text-gray-700">{t.slides.scope.webInterface.scalabilityDesc}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )

      case 15: // Case 15: Development Team
        return (
          <div className="h-full flex items-center justify-center p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-6 py-6">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold mb-2">{t.slides.developmentTeam.title}</h3>
              </div>

              <p className="text-center text-gray-600 mb-6">{t.slides.developmentTeam.developers}</p>

              {/* Main Development Team - 3 recursos in grid */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {/* Recurso 1 - Mobile Developer */}
                <Card className="bg-green-50 border-green-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-green-900">{t.slides.developmentTeam.resource1}</p>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="font-bold text-gray-900">{t.slides.developmentTeam.mobileDeveloper}</p>
                      <p className="text-sm text-gray-600">{t.slides.developmentTeam.experience1}</p>
                      <p className="text-sm text-gray-700 mt-1">{t.slides.developmentTeam.specialty1}</p>
                    </div>
                  </div>
                </Card>

                {/* Recurso 2 - Web Developer */}
                <Card className="bg-blue-50 border-blue-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-blue-900">{t.slides.developmentTeam.resource2}</p>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="font-bold text-gray-900">{t.slides.developmentTeam.webDeveloper}</p>
                      <p className="text-sm text-gray-600">{t.slides.developmentTeam.experience2}</p>
                      <p className="text-sm text-gray-700 mt-1">{t.slides.developmentTeam.specialty2}</p>
                    </div>
                  </div>
                </Card>

                {/* Recurso 3 - Data Analyst */}
                <Card className="bg-orange-50 border-orange-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-orange-900">{t.slides.developmentTeam.resource3}</p>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="font-bold text-gray-900">{t.slides.developmentTeam.dataAnalyst}</p>
                      <p className="text-sm text-gray-600">{t.slides.developmentTeam.experience3}</p>
                      <p className="text-sm text-gray-700 mt-1">{t.slides.developmentTeam.specialty3}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Complementary Roles - 3 profesionales complementarios */}
              <div className="mb-4">
                <h4 className="text-xl font-bold text-center mb-4">
                  {t.slides.developmentTeam.complementaryProfessionals}
                </h4>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Recurso 4 - Graphic Designer */}
                <Card className="bg-purple-50 border-purple-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-purple-900">{t.slides.developmentTeam.resource4}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{t.slides.developmentTeam.graphicDesigner}</p>
                    <p className="text-sm text-gray-600">{t.slides.developmentTeam.experience4}</p>
                    <p className="text-sm text-gray-700 mt-1">{t.slides.developmentTeam.specialty4}</p>
                  </div>
                </Card>

                {/* Recurso 5 - Tester */}
                <Card className="bg-pink-50 border-pink-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center">
                      <TestTube className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-pink-900">{t.slides.developmentTeam.resource5}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{t.slides.developmentTeam.tester}</p>
                    <p className="text-sm text-gray-600">{t.slides.developmentTeam.experience5}</p>
                    <p className="text-sm text-gray-700 mt-1">{t.slides.developmentTeam.specialty5}</p>
                  </div>
                </Card>

                {/* Recurso 6 - Project Manager */}
                <Card className="bg-teal-50 border-teal-200 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-teal-900">{t.slides.developmentTeam.resource6}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{t.slides.developmentTeam.projectManager}</p>
                    <p className="text-sm text-gray-600">{t.slides.developmentTeam.experience6}</p>
                    <p className="text-sm text-gray-700 mt-1">{t.slides.developmentTeam.specialty6}</p>
                  </div>
                </Card>
              </div>

              <Card className="bg-gray-100 border-gray-300 p-4 mt-6">
                <p className="text-center text-lg font-bold text-gray-800">
                  6 {t.slides.developmentTeam.workingOnProject}
                </p>
              </Card>
            </div>
          </div>
        )

      case 16: // Case 16: Implementation Plan
        return (
          <div className="h-full flex items-center justify-center p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6 py-6">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold">{t.slides.implementationPlan.title}</h3>
              </div>

              {/* Large Time Card */}
              <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-12 text-center">
                <Clock className="w-20 h-20 mx-auto mb-4" />
                <p className="text-xl mb-2">{t.slides.implementationPlan.totalTime}</p>
                <p className="text-7xl font-bold mb-2">29</p>
                <p className="text-lg">{t.slides.implementationPlan.businessDays}</p>
              </Card>

              {/* Four Main Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Complete Development */}
                <Card className="bg-blue-50 border-blue-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Code className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-blue-900 mb-2">
                        {t.slides.implementationPlan.fullDevelopment}
                      </h4>
                      <p className="text-sm text-gray-700">{t.slides.implementationPlan.developmentDetails}</p>
                    </div>
                  </div>
                </Card>

                {/* Specialized Resources */}
                <Card className="bg-orange-50 border-orange-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-orange-900 mb-2">
                        {t.slides.implementationPlan.specializedResources}
                      </h4>
                      <p className="text-sm text-gray-700">{t.slides.implementationPlan.developmentTeamDetails}</p>
                    </div>
                  </div>
                </Card>

                {/* Maintenance Included */}
                <Card className="bg-purple-50 border-purple-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-purple-900 mb-2">
                        {t.slides.implementationPlan.maintenance}
                      </h4>
                      <p className="text-sm text-gray-700">{t.slides.implementationPlan.postLaunchSupport}</p>
                    </div>
                  </div>
                </Card>

                {/* Training Included */}
                <Card className="bg-pink-50 border-pink-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-pink-600 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-pink-900 mb-2">{t.slides.implementationPlan.training}</h4>
                      <p className="text-sm text-gray-700">
                        {t.slides.implementationPlan.writtenTutorials} & {t.slides.implementationPlan.videoTutorials}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Detailed Training Sections */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Written Tutorials */}
                <Card className="bg-cyan-50 border-cyan-200 p-6">
                  <h4 className="text-xl font-bold text-cyan-900 mb-3">
                    {t.slides.implementationPlan.writtenTutorials}
                  </h4>
                  <p className="text-sm text-gray-700">{t.slides.implementationPlan.writtenTutorialsDesc}</p>
                </Card>

                {/* Video Tutorials */}
                <Card className="bg-cyan-50 border-cyan-200 p-6">
                  <h4 className="text-xl font-bold text-cyan-900 mb-3">{t.slides.implementationPlan.videoTutorials}</h4>
                  <p className="text-sm text-gray-700">{t.slides.implementationPlan.videoTutorialsDesc}</p>
                </Card>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t.slides.intro.twoApps}</h1>
              <p className="text-sm text-muted-foreground">Beta Version</p>
            </div>
          </div>
          {/* Updates: Added language toggle button */}
          <Button onClick={toggleLanguage} variant="outline" className="gap-2 bg-transparent">
            {t.languageToggle}
          </Button>
        </div>

        {/* Main Content */}
        <div
          ref={slideContainerRef}
          className="flex-1 relative bg-card rounded-xl shadow-lg border overflow-y-auto overflow-x-hidden scroll-smooth"
        >
          <div className="min-h-full">{renderSlideContent()}</div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button onClick={prevSlide} disabled={currentSlide === 0} variant="outline" size="lg">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index ? "bg-primary w-8" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          <Button onClick={nextSlide} disabled={currentSlide === totalSlides - 1} variant="outline" size="lg">
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Slide Counter */}
        <div className="text-center mt-4 text-sm text-muted-foreground">
          Slide {currentSlide + 1} of {totalSlides}
        </div>
      </div>
    </div>
  )
}

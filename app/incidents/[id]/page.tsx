"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  CheckCircle,
  Clock,
  Play,
  Pause,
  Users,
  GitBranch,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Share2,
  Mail,
  Brain,
  BarChart3,
  ListOrdered,
  FileText,
  Camera,
  AlertTriangle,
  Lightbulb,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { IIncident } from "@/models/incidents"
import { IMultimedia } from "@/models/multimedia"
import { getIncidentsById } from "@/services/incident-service"
import { Spinner } from "@/components/ui/spinner"
import { EMOTIONS_COLOR } from "@/lib/constants"

const translations = {
  en: {
    backButton: "Back to Incidents",
    shareButton: "Share",
    status: "Status",
    severity: "Severity",
    reportedBy: "Reported by",
    date: "Date",
    time: "Time",
    location: "Location",
    teamInvolved: "Team involved",
    description: "Description",
    aiAnalysis: "AI Analysis",
    summary: "Summary",
    title: "Title",
    audioReport: "Report Audio",
    inconsistencies: "Inconsistencies",
    recommendations: "AI-Generated Recommendations",
    keyEvents: "Key Events and Sequence",
    keyEventsDesc: "Chronological sequence of main events to make implicit information explicit and unambiguous.",
    causeTree: "Cause Tree",
    observedFacts: "Observable Facts",
    immediateFactors: "Immediate Contributing Factors",
    underlyingCauses: "Possible Underlying Causes",
    timeline: "Timeline",
    inProgress: "In progress",
    photos: "Photos",
    locationAndMap: "Location and Map",
    comparative: "Comparative Analysis",
    similarCases: "Similar Past Cases",
    case: "Case",
    caseNumber: "Case Number", // Added caseNumber
    equipmentFailure: "Equipment failure in production area",
    safetyProtocol: "Safety protocol violation",
    communicationBreakdown: "Communication breakdown during shift change",
    resolved: "Resolved",
    similarity: "Similarity",
    resolutionTime: "Resolution Time",
    hours: "hours",
    actionsTaken: "Actions Taken in Similar Cases",
    immediateIsolation: "Immediate Area Isolation",
    teamDebriefing: "Team Debriefing Session",
    equipmentInspection: "Full Equipment Inspection",
    procedureUpdate: "Procedure Documentation Update",
    effectivenessRate: "Effectiveness Rate",
    priorityAction: "Priority Action",
    conductSafetyAudit: "Conduct comprehensive safety audit of the affected area within 48 hours",
    preventiveMeasure: "Preventive Measure",
    implementTrainingProgram: "Implement refresher training program for all personnel involved in similar operations",
    followUp: "Follow-up Action",
    scheduleReview: "Schedule monthly safety reviews for the next quarter to monitor improvements",
    country: "Country",
    state: "State",
    involvedPeople: "Involved People",
    position: "Position",
    name: "Name",
    audioTranscription: "Audio Transcription",
    sentimentAnalysis: "AI Sentiment Analysis",
    overallSentiment: "Overall Sentiment",
    detectedEmotions: "Detected Emotions",
    tone: "Tone",
    confidence: "Confidence",
    shareModalTitle: "Share Incident Report",
    incidentSummary: "Incident Summary",
    selectContacts: "Select Contacts",
    sendViaWhatsApp: "Send via WhatsApp",
    sendViaEmail: "Send via Email", // Added sendViaEmail
    noContactsSelected: "Please select at least one contact",
    messageSent: "Message sent successfully!",
    incidentPhoto: "Incident Photo",
    peopleInvolved: "People Involved", // Added for modal
    selectWhatsAppContacts: "Select Contacts for WhatsApp", // Added for modal
    selectEmailContacts: "Select Contacts for Email", // Added for modal
    sendToSelected: "Send to Selected", // Added for modal
    keyEventsAndSequence: "Key Events and Sequence", // Added for keyEvents card header
    comparativeAnalysis: "Comparative Analysis", // Added for comparativeAnalysis card header
  },
  es: {
    backButton: "Volver a Incidentes",
    shareButton: "Compartir",
    status: "Estado",
    severity: "Gravedad",
    reportedBy: "Reportado por",
    date: "Fecha",
    time: "Hora",
    location: "Ubicación",
    teamInvolved: "Equipo involucrado",
    description: "Descripción",
    aiAnalysis: "Análisis de IA",
    summary: "Resumen",
    title: "Titulo",
    audioReport: "Audio del Reporte",
    inconsistencies: "Inconsistencias",
    recommendations: "Recomendaciones Generadas por IA",
    keyEvents: "Eventos Clave y su Secuencia",
    keyEventsDesc:
      "Secuencia cronológica de los eventos principales para hacer la información implícita explícita y unívoca.",
    causeTree: "Árbol de Causas",
    observedFacts: "Hechos Observables",
    immediateFactors: "Factores Contribuyentes Inmediatos",
    underlyingCauses: "Posibles Causas Subyacentes",
    timeline: "Cronología",
    inProgress: "En progreso",
    photos: "Fotos",
    locationAndMap: "Ubicación y Mapa",
    comparative: "Análisis Comparativo",
    similarCases: "Casos Similares Anteriores",
    case: "Caso",
    caseNumber: "Número de Caso", // Added caseNumber
    equipmentFailure: "Falla de equipo en área de producción",
    safetyProtocol: "Violación de protocolo de seguridad",
    communicationBreakdown: "Falla de comunicación durante cambio de turno",
    resolved: "Resuelto",
    similarity: "Similitud",
    resolutionTime: "Tiempo de Resolución",
    hours: "horas",
    actionsTaken: "Acciones Tomadas en Casos Similares",
    immediateIsolation: "Aislamiento Inmediato del Área",
    teamDebriefing: "Sesión de Análisis en Equipo",
    equipmentInspection: "Inspección Completa de Equipos",
    procedureUpdate: "Actualización de Documentación de Procedimientos",
    effectivenessRate: "Tasa de Efectividad",
    priorityAction: "Acción Prioritaria",
    conductSafetyAudit: "Realizar auditoría integral de seguridad del área afectada dentro de 48 horas",
    preventiveMeasure: "Medida Preventiva",
    implementTrainingProgram:
      "Implementar programa de capacitación de actualización para todo el personal involucrado en operaciones similares",
    followUp: "Acción de Seguimiento",
    scheduleReview: "Programar revisiones mensuales de seguridad para el próximo trimestre para monitorear mejoras",
    country: "País",
    state: "Estado",
    involvedPeople: "Personas Involucradas",
    position: "Cargo",
    name: "Nombre",
    audioTranscription: "Transcripción de Audio",
    sentimentAnalysis: "Análisis de Sentimiento IA",
    overallSentiment: "Sentimiento General",
    detectedEmotions: "Emociones Detectadas",
    tone: "Tono",
    confidence: "Confianza",
    shareModalTitle: "Compartir Reporte de Incidente",
    incidentSummary: "Resumen del Incidente",
    selectContacts: "Seleccionar Contactos",
    sendViaWhatsApp: "Enviar por WhatsApp",
    sendViaEmail: "Enviar por Correo Electrónico", // Added sendViaEmail
    noContactsSelected: "Por favor seleccione al menos un contacto",
    messageSent: "¡Mensaje enviado con éxito!",
    incidentPhoto: "Foto del Incidente",
    peopleInvolved: "Personas Involucradas", // Added for modal
    selectWhatsAppContacts: "Seleccionar Contactos para WhatsApp", // Added for modal
    selectEmailContacts: "Seleccionar Contactos para Correo Electrónico", // Added for modal
    sendToSelected: "Enviar a Seleccionados", // Added for modal
    keyEventsAndSequence: "Eventos Clave y Secuencia", // Added for keyEvents card header
    comparativeAnalysis: "Análisis Comparativo", // Added for comparativeAnalysis card header
  },
}

export default function IncidentDetailPage() {
  const router = useRouter()
  const urlSearchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false)
  const [incident, setIncident] = useState<IIncident|null>(null)
  const [audioFile, setAudioFile] = useState<IMultimedia | null>(null)
  const [photos, setPhotos] = useState<IMultimedia[]>([])
  const params = useParams<{id: string}>()
  const [language, setLanguage] = useState<"en" | "es">("en")
  const t = translations[language]
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const audioRef = useRef<any|null>(null)
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const GOOGLE_MAP_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    const lang = urlSearchParams.get("lang")
    if (lang == "en" || lang == "es")
      setLanguage(lang)
  }, [router, urlSearchParams]);

  useEffect(() => {
    const loadIncident = async () => {
      try {
        setIsLoading(true)
        const response = await getIncidentsById(params.id)
        if (response.data) {
          setIncident(response.data)
          const audios = response.data.multimedias.filter((m) => m.cod_tipo_multimedia === "COD_AUDIO")
          if (audios.length > 0) {
            setAudioFile(audios[0])
          }
          const photos = response.data.multimedias.filter((m) => m.cod_tipo_multimedia === "COD_IMAGEN")
          setPhotos(photos)
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error al cargar incident:', error)
        setIsLoading(false)
      }
    }
    if (params.id)
      loadIncident() 
  }, []);

  const getIncidentData = (id: string, language: "en" | "es") => {
    const baseIncident = {
      id: id,
      title: language === "en" ? "Water leak in main warehouse" : "Fuga de agua en almacén principal",
      status: language === "en" ? "In Progress" : "En Progreso",
      severity: language === "en" ? "Medium" : "Media",
      description:
        language === "en"
          ? "A water leak was detected in the main warehouse affecting the product storage area. Immediate intervention from the maintenance team is required."
          : "Se detectó una fuga de agua en el almacén principal que está afectando el área de almacenamiento de productos. Se requiere intervención inmediata del equipo de mantenimiento.",
      location: language === "en" ? "Main Warehouse - Sector B" : "Almacén Principal - Sector B",
      reporter: language === "en" ? "John Smith" : "Juan Pérez",
      date: "2025-01-15",
      time: "09:00 AM",
      team: language === "en" ? "Maintenance Team" : "Equipo de Mantenimiento",
      audioDuration: "2:34",
      photos: ["/warehouse-incident-floor.jpg", "/safety-equipment-area.jpg", "/workplace-incident-scene.jpg"],
      coordinates: { lat: 40.7128, lng: -74.006 },
      timeline: [
        {
          time: "09:00",
          action: language === "en" ? "Incident reported" : "Incidente reportado",
          status: "completed",
        },
        {
          time: "09:15",
          action: language === "en" ? "Maintenance team notified" : "Equipo de mantenimiento notificado",
          status: "completed",
        },
        {
          time: "09:30",
          action: language === "en" ? "Inspection in progress" : "Inspección en progreso",
          status: "in-progress",
        },
        {
          time: "10:00",
          action: language === "en" ? "Repair scheduled" : "Reparación programada",
          status: "pending",
        },
      ],
      keyEvents: [
        {
          time: "08:45",
          description:
            language === "en"
              ? "Worker detects moisture on warehouse floor"
              : "Trabajador detecta humedad en el piso del almacén",
        },
        {
          time: "08:50",
          description:
            language === "en"
              ? "Leak source identified in main pipe"
              : "Se identifica la fuente de la fuga en tubería principal",
        },
        {
          time: "09:00",
          description: language === "en" ? "Incident reported to supervisor" : "Se reporta el incidente al supervisor",
        },
        {
          time: "09:15",
          description: language === "en" ? "Maintenance team dispatched" : "Equipo de mantenimiento es despachado",
        },
      ],
      causeTree: {
        observedFacts:
          language === "en"
            ? ["Visible leak in water pipe", "Water accumulation in sector B", "Visible corrosion at connection joint"]
            : [
                "Fuga visible en tubería de agua",
                "Acumulación de agua en sector B",
                "Corrosión visible en la junta de conexión",
              ],
        immediateFactors:
          language === "en"
            ? ["Material wear due to age", "Excessive pipe pressure", "Lack of recent preventive maintenance"]
            : [
                "Desgaste de material por antigüedad",
                "Presión excesiva en tubería",
                "Falta de mantenimiento preventivo reciente",
              ],
        underlyingCauses:
          language === "en"
            ? [
                "Pipe system over 15 years old without renewal",
                "No regular inspection program",
                "Lack of budget for preventive maintenance",
              ]
            : [
                "Sistema de tuberías con más de 15 años sin renovación",
                "No hay programa de inspección regular",
                "Falta de presupuesto para mantenimiento preventivo",
              ],
      },
      aiAnalysis: {
        summary:
          language === "en"
            ? "Water leak detected in warehouse main pipe. Risk level: Medium. Immediate action recommended to avoid material damage."
            : "Fuga de agua detectada en tubería principal del almacén. Nivel de riesgo: Medio. Se recomienda acción inmediata para evitar daños materiales.",
        inconsistencies:
          language === "en" ? "No inconsistencies detected in report" : "Ninguna inconsistencia detectada en el reporte",
        recommendations: [
          language === "en"
            ? "Conduct comprehensive safety audit of the affected area within 48 hours"
            : "Realizar auditoría integral de seguridad del área afectada dentro de 48 horas",
          language === "en"
            ? "Implement refresher training program for all personnel involved in similar operations"
            : "Implementar programa de capacitación de actualización para todo el personal involucrado en operaciones similares",
          language === "en"
            ? "Schedule monthly safety reviews for the next quarter to monitor improvements"
            : "Programar revisiones mensuales de seguridad para el próximo trimestre para monitorear mejoras",
        ],
      },
      similarCases: [
        {
          id: "245",
          description:
            language === "en" ? "Equipment failure in production area" : "Falla de equipo en área de producción",
          similarity: "87%",
          resolutionTime: "4",
          status: language === "en" ? "Resolved" : "Resuelto",
        },
        {
          id: "198",
          description: language === "en" ? "Safety protocol violation" : "Violación de protocolo de seguridad",
          similarity: "72%",
          resolutionTime: "6",
          status: language === "en" ? "Resolved" : "Resuelto",
        },
        {
          id: "156",
          description:
            language === "en"
              ? "Communication breakdown during shift change"
              : "Falla de comunicación durante cambio de turno",
          similarity: "68%",
          resolutionTime: "5",
          status: language === "en" ? "Resolved" : "Resuelto",
        },
      ],
      actionsTaken: [
        {
          action: language === "en" ? "Immediate Area Isolation" : "Aislamiento Inmediato del Área",
          effectivenessRate: "94%",
        },
        {
          action: language === "en" ? "Team Debriefing Session" : "Sesión de Análisis en Equipo",
          effectivenessRate: "89%",
        },
        {
          action: language === "en" ? "Full Equipment Inspection" : "Inspección Completa de Equipos",
          effectivenessRate: "92%",
        },
        {
          action:
            language === "en" ? "Procedure Documentation Update" : "Actualización de Documentación de Procedimientos",
          effectivenessRate: "87%",
        },
      ],
      country: language === "en" ? "Argentina" : "Argentina",
      state: language === "en" ? "Buenos Aires" : "Buenos Aires",
      involvedPeople: [
        {
          name: "Juan Pérez",
          position: language === "en" ? "Warehouse Supervisor" : "Supervisor de Almacén",
        },
        {
          name: "María González",
          position: language === "en" ? "Safety Officer" : "Oficial de Seguridad",
        },
        {
          name: "Carlos Rodríguez",
          position: language === "en" ? "Maintenance Technician" : "Técnico de Mantenimiento",
        },
      ],
      // Dummy data for people to match the share modal logic
      people: [
        {
          firstName: "Juan",
          lastName: "Pérez",
          role: language === "en" ? "Warehouse Supervisor" : "Supervisor de Almacén",
        },
        { firstName: "María", lastName: "González", role: language === "en" ? "Safety Officer" : "Oficial de Seguridad" },
        {
          firstName: "Carlos",
          lastName: "Rodríguez",
          role: language === "en" ? "Maintenance Technician" : "Técnico de Mantenimiento",
        },
      ],
    }
    return baseIncident
  }

  const photoAnalysis = [
    {
      description:
        language === "es"
          ? "Vista general de la zona del incidente con equipo de seguridad visible"
          : "General view of the incident area with safety equipment visible",
      objects:
        language === "es"
          ? ["Equipo de protección", "Señalización de seguridad", "Área acordonada", "Vehículo de emergencia"]
          : ["Protective equipment", "Safety signage", "Cordoned area", "Emergency vehicle"],
      risks:
        language === "es"
          ? ["Riesgo de caída desde altura", "Exposición a materiales peligrosos"]
          : ["Risk of falling from height", "Exposure to hazardous materials"],
    },
    {
      description:
        language === "es"
          ? "Detalle del área afectada mostrando daños estructurales"
          : "Detail of affected area showing structural damage",
      objects:
        language === "es"
          ? ["Estructura dañada", "Escombros", "Herramientas de rescate", "Iluminación de emergencia"]
          : ["Damaged structure", "Debris", "Rescue tools", "Emergency lighting"],
      risks:
        language === "es"
          ? ["Colapso estructural inminente", "Obstrucción de vías de escape"]
          : ["Imminent structural collapse", "Escape route obstruction"],
    },
    {
      description:
        language === "es"
          ? "Personal de respuesta evaluando la situación en el sitio"
          : "Response personnel assessing the situation on site",
      objects:
        language === "es"
          ? ["Personal de emergencia", "Equipos de comunicación", "Botiquín de primeros auxilios", "Casco de seguridad"]
          : ["Emergency personnel", "Communication equipment", "First aid kit", "Safety helmet"],
      risks:
        language === "es"
          ? ["Posible contaminación del área", "Riesgo eléctrico"]
          : ["Possible area contamination", "Electrical hazard"],
    },
  ]

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const togglePlayAudio = () => {
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlayingAudio(!isPlayingAudio)
    }
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  // ⌛ Obtener duración cuando carga
  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  // 🎚️ Mover el audio
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (!audioRef.current) return;

    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };


  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const audioTranscription =
    language === "en"
      ? "I was working on the third floor when I heard a loud crash. The scaffolding started to shake violently. I immediately called for help and evacuated the area. There was debris falling everywhere and I could smell something burning. The emergency alarm started going off about a minute later."
      : "Estaba trabajando en el tercer piso cuando escuché un fuerte estruendo. El andamio comenzó a temblar violentamente. Inmediatamente pedí ayuda y evacuamos el área. Había escombros cayendo por todas partes y podía oler algo quemándose. La alarma de emergencia comenzó a sonar aproximadamente un minuto después."

  const sentimentAnalysis = {
    overall: language === "en" ? "Highly Concerned" : "Muy Preocupado",
    emotions: [
      { emotion: language === "en" ? "Fear" : "Miedo", percentage: 45, color: "bg-red-500" },
      { emotion: language === "en" ? "Urgency" : "Urgencia", percentage: 35, color: "bg-orange-500" },
      { emotion: language === "en" ? "Stress" : "Estrés", percentage: 20, color: "bg-yellow-500" },
    ],
    tone: language === "en" ? "Professional and Direct" : "Profesional y Directo",
    confidence: "92%",
  }

  const updatedTranslations = {
    ...t,
    audioTranscription: language === "en" ? "Audio Transcription" : "Transcripción de Audio",
    sentimentAnalysis: language === "en" ? "AI Sentiment Analysis" : "Análisis de Sentimiento IA",
    overallSentiment: language === "en" ? "Overall Sentiment" : "Sentimiento General",
    detectedEmotions: language === "en" ? "Detected Emotions" : "Emociones Detectadas",
    tone: language === "en" ? "Tone" : "Tono",
    confidence: language === "en" ? "Confidence" : "Confianza",
  }

  const handleShare = () => {
    setShareModalOpen(true)
  }

  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [contactSelectionOpen, setContactSelectionOpen] = useState(false) // Renamed from contactModalOpen
  const [shareMethod, setShareMethod] = useState<"whatsapp" | "email">("whatsapp") // Renamed from sendMethod
  const [selectedContacts, setSelectedContacts] = useState<string[]>(["1", "2", "3", "4", "5"])

  const contacts = [
    { id: "1", name: "John Smith", phone: "+1234567890", role: "Safety Manager" },
    { id: "2", name: "María González", phone: "+5491123456789", role: "Operations Director" },
    { id: "3", name: "David Chen", phone: "+8613800138000", role: "HR Manager" },
    { id: "4", name: "Sarah Johnson", phone: "+447700900123", role: "Site Supervisor" },
    { id: "5", name: "Carlos Rodríguez", phone: "+34612345678", role: "Quality Inspector" },
  ]

  const toggleContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    )
  }

  const handleOpenContactSelection = (method: "whatsapp" | "email") => {
    setShareMethod(method) // Updated state setter
    setShareModalOpen(false)
    setContactSelectionOpen(true) // Updated state setter
  }

  const handleSendWhatsApp = () => {
    if (selectedContacts.length === 0) {
      alert(t.noContactsSelected)
      return
    }

    // Generate summary message
    const summary = `
*${t.incidentSummary}*

📋 *${t.caseNumber || "Case Number"}:* #${incident?.id}
📋 *${t.title}:* ${incident?.title}
⚠️ *${t.severity}:* ${incident?.severity}
📍 *${t.location}:* ${incident?.location}, ${incident?.location.country}, ${incident?.location.city}
👥 *${t.involvedPeople}:* ${incident?.people?.map((p) => `${p.firstName} ${p.lastName} (${p.role})`).join(", ")}

*${t.recommendations}:*
${incident?.ai_analysis?.recommendations.map((r:any, i:any) => `${i + 1}. ${r}`).join("\n")}
    `.trim()

    // In a real app, this would send to WhatsApp API
    // For now, we simulate sending
    selectedContacts.forEach((contactId) => {
      const contact = contacts.find((c) => c.id === contactId)
      if (contact) {
        const whatsappUrl = `https://wa.me/${contact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(summary)}`
        window.open(whatsappUrl, "_blank")
      }
    })

    alert(t.messageSent)
    setContactSelectionOpen(false) // Updated state setter
    setSelectedContacts(["1", "2", "3", "4", "5"])
  }

  const handleSendEmail = () => {
    if (selectedContacts.length === 0) {
      alert(t.noContactsSelected)
      return
    }

    alert(`${t.messageSent} ${selectedContacts.length} ${t.selectContacts}`)
    setContactSelectionOpen(false) // Updated state setter
    setSelectedContacts(["1", "2", "3", "4", "5"])
  }

  const handleSendToContacts = () => {
    if (selectedContacts.length === 0) {
      alert(t.noContactsSelected)
      return
    }
    if (shareMethod === "whatsapp") {
      handleSendWhatsApp()
    } else {
      handleSendEmail()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-150">
          <Spinner className="w-12 h-12" />
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button type="button" variant="outline" onClick={() => router.push("/incidents")} className="gap-2 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            {t.backButton}
          </Button>
          <div className="flex items-center gap-3">
            {/* Share Button */}
            <Button variant="outline" onClick={handleShare} className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              {t.shareButton}
            </Button>
            {/* Language Flags */}
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage("en")}
                className={`text-2xl transition-opacity ${language === "en" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
                title="English"
              >
                🇺🇸
              </button>
              <button
                onClick={() => setLanguage("es")}
                className={`text-2xl transition-opacity ${language === "es" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
                title="Español"
              >
                🇪🇸
              </button>
            </div>
          </div>
        </div>

        {/* Combined Incident Info and Photo Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Incident Information Panel - 60% */}
          <Card className="bg-white/80 backdrop-blur-sm lg:col-span-3">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">#{incident?.id}</h1>
                    <Badge variant="secondary" className="text-sm">
                      {incident?.status}
                    </Badge>
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900 mb-4">{incident?.title}</h2>
                </div>
                <Badge
                  variant={
                    incident?.severity === "Alta" || incident?.severity === "High"
                      ? "destructive"
                      : incident?.severity === "Media" || incident?.severity === "Medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {t.severity}: {incident?.severity}
                </Badge>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-slate-600">
                  <User className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-slate-500">{t.reportedBy}</p>
                    <p className="text-sm font-medium">{incident?.reported_by?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-slate-500">{t.date}</p>
                    <p className="text-sm font-medium">{incident?.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Clock className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-slate-500">{t.time}</p>
                    <p className="text-sm font-medium">{incident?.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-slate-500">{t.location}</p>
                    <p className="text-sm font-medium">{incident?.location?.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600 md:col-span-2">
                  <Users className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-slate-500">{t.teamInvolved}</p>
                    <p className="text-sm font-medium">{incident?.ai_analysis?.aiHeader?.involved_equipment ? incident?.ai_analysis?.aiHeader?.involved_equipment[0] : ""}</p>
                  </div>
                </div>
              </div>

              {/* Involved People Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t.involvedPeople}
                </h3>
                <div className="space-y-2">
                  {incident?.ai_analysis?.aiHeader?.involved_people?.map((person:any, index:number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{person}</p>
                        {/* <p className="text-sm text-slate-600">{person.position}</p> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{t.description}</h3>
                <p className="text-slate-600 leading-relaxed">{incident?.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Photo Carousel - 40% */}
          {photos.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 gap-0">
              <CardTitle className="flex items-center gap-2 p-2">
                <ImageIcon className="h-5 w-5 text-blue-600" />
                {t.photos}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative">
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                  <img
                    src={photos[currentPhotoIndex].url || "/placeholder.svg"}
                    alt={`Incident photo ${currentPhotoIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={prevPhoto}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={nextPhoto}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentPhotoIndex ? "bg-white w-6" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* AI-extracted information below the photo */}
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-slate-700 italic">{photoAnalysis[currentPhotoIndex].description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {language === "es" ? "Objetos detectados:" : "Detected objects:"}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {photoAnalysis[currentPhotoIndex].objects.map((obj, idx) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-red-700 mb-1">
                    {language === "es" ? "Riesgos identificados:" : "Identified risks:"}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-red-600">
                    {photoAnalysis[currentPhotoIndex].risks.map((risk, idx) => (
                      <li key={idx}>{risk}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>)}
        </div>

        {/* Location and Map Section */}
        {incident?.location && (
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 gap-0">
            <CardTitle className="flex items-center gap-2 p-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              {t.locationAndMap}
            </CardTitle>
          </CardHeader>          
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">{t.location}</h4>
                  <p className="text-slate-600">{incident?.location?.address}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">{t.country}</h4>
                  <p className="text-slate-600">{incident?.location?.country}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">{t.state}</h4>
                  <p className="text-slate-600">{incident?.location?.city}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">
                    {language === "en" ? "Coordinates" : "Coordenadas"}
                  </h4>
                  <p className="text-sm text-slate-600">
                    Lat: {incident?.location?.lat.toFixed(6)}° N<br />
                    Lng: {incident?.location?.lng.toFixed(6)}° W
                  </p>
                </div>
              </div>
              <div className="w-full h-64 bg-slate-100 rounded-lg overflow-hidden relative">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAP_API_KEY}&q=${incident.location.lat},${incident.location.lng}&zoom=15`}
                />
              </div>
            </div>
          </CardContent>
        </Card>)}

        {/* AI Analysis */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              {t.aiAnalysis}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">{t.summary}</h4>
              <p className="text-slate-600">{incident?.ai_analysis?.aiHeader?.summary}</p>
            </div>

            <div>
              <h4 className="font-medium text-slate-900 mb-2">{t.audioReport}</h4>
              {audioFile && (
              <div className="bg-slate-50 rounded-lg p-4 flex items-center gap-4">
                {/* <Button
                  size="icon"
                  variant="outline"
                  onClick={toggleAudio}
                  className="h-10 w-10 rounded-full bg-transparent"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </Button>
                <div className="flex-1">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: isPlaying ? "45%" : "0%" }}
                    />
                  </div>
                </div>
                <span className="text-sm text-slate-600 font-medium">{incident?.audioDuration}</span> */}
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={togglePlayAudio}
                  className="flex-shrink-0"
                >
                  {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <audio
                  ref={audioRef}
                  src={audioFile?.url}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlayingAudio(false)}
                  className="hidden"
                />
                <div className="flex flex-1 items-center gap-4">
                  <span className="w-12 text-right text-sm tabular-nums">
                    {formatTime(currentTime)}
                  </span>

                  <input
                    type="range"
                    className="flex-1 rounded-full"
                    min={0}
                    max={duration || 0}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                  />

                  <span className="w-12 text-left text-sm tabular-nums">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>)}
            </div>

            <div>
              <h4 className="font-medium text-slate-900 mb-2">{t.inconsistencies}</h4>
              <p className="text-slate-600">{incident?.ai_analysis?.inconsistencies || (language === "en" ? "No inconsistencies detected in report" : "Ninguna inconsistencia detectada en el reporte")}</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">{t.recommendations}</h4>
              <ul className="space-y-2">
                {incident?.ai_analysis?.aiRecommendations?.map((rec:any, index:number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">{rec.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Audio Transcription Section */}
            <div>
              <h4 className="font-medium text-slate-900 mb-2">{updatedTranslations.audioTranscription}</h4>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700 italic leading-relaxed">&ldquo;{incident?.ai_analysis?.transcription}&rdquo;</p>
              </div>
            </div>

            {/* Sentiment Analysis Section */}
            <div>
              <h4 className="font-medium text-slate-900 mb-3">{updatedTranslations.sentimentAnalysis}</h4>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{updatedTranslations.overallSentiment}:</span>
                  <span className="font-semibold text-slate-900">{incident?.ai_analysis?.aiSentimentAnalysis?.overallSentiment}</span>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-2">{updatedTranslations.detectedEmotions}:</p>
                  <div className="space-y-2">
                    {incident?.ai_analysis?.aiSentimentAnalysis?.detectedEmotions.map((item:any, idx:number) => {
                      const color =
                        EMOTIONS_COLOR[item.emotion]?.color ?? "bg-slate-400";

                      return (
                        <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-700">{item.emotion}</span>
                          <span className="font-medium text-slate-900">{item.percentage}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${color} transition-all`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-sm text-slate-600">{updatedTranslations.tone}:</span>
                    <p className="font-medium text-slate-900">{incident?.ai_analysis?.aiSentimentAnalysis?.tone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">{updatedTranslations.confidence}:</span>
                    <p className="font-medium text-slate-900">{incident?.ai_analysis?.aiSentimentAnalysis?.confidence}%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Events section */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-teal-100 to-cyan-100">
            <CardTitle className="flex items-center gap-2">
              <ListOrdered className="h-5 w-5 text-teal-600" />
              {t.keyEventsAndSequence || (language === "en" ? "Key Events and Sequence" : "Eventos Clave y Secuencia")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600 mb-4">{t.keyEventsDesc}</p>
            <div className="space-y-3">
              {incident?.ai_analysis?.aiSequence?.events.map((event:any, index:number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="flex-shrink-0 w-16 text-sm font-semibold text-blue-600">#{index + 1}</div>
                  <div className="flex-1 text-slate-700">{event.event}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cause Tree section */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-amber-100 to-yellow-100">
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-amber-600" />
              {t.causeTree || (language === "en" ? "Cause Tree" : "Árbol de Causas")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Observable Facts */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                {t.observedFacts}
              </h4>
              <ul className="space-y-2 ml-4">
                {incident?.causeTree?.observedFacts?.map((fact:any, index:number) => (
                  <li key={index} className="flex items-start gap-2 text-slate-700">
                    <span className="text-red-500 font-bold mt-1">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Immediate Factors */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                {t.immediateFactors}
              </h4>
              <ul className="space-y-2 ml-4">
                {incident?.causeTree?.immediateFactors?.map((factor:any, index:number) => (
                  <li key={index} className="flex items-start gap-2 text-slate-700">
                    <span className="text-orange-500 font-bold mt-1">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Underlying Causes */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                {t.underlyingCauses}
              </h4>
              <ul className="space-y-2 ml-4">
                {incident?.causeTree?.underlyingCauses?.map((cause:any, index:number) => (
                  <li key={index} className="flex items-start gap-2 text-slate-700">
                    <span className="text-purple-500 font-bold mt-1">•</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Comparative Analysis */}
        <Card className="bg-white/80 backdrop-blur-sm mb-6">
          <CardHeader className="bg-gradient-to-r from-violet-100 to-purple-100">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-violet-600" />
              {t.comparativeAnalysis || (language === "en" ? "Comparative Analysis" : "Análisis Comparativo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Similar Cases */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{t.similarCases}</h3>
                <div className="space-y-4">
                  {incident?.similarCases?.map((caseItem, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-slate-900">
                            {t.case} #{caseItem.id}
                          </p>
                          <p className="text-sm text-slate-600">{caseItem.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {caseItem.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600">
                        <p className="mb-1">
                          <span className="font-medium">{t.similarity}:</span> {caseItem.similarity}%
                        </p>
                        <p>
                          <span className="font-medium">{t.resolutionTime}:</span> {caseItem.resolutionTime} {t.hours}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Taken in Similar Cases */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{t.actionsTaken}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {incident?.actionsTaken?.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-green-50/50 rounded-lg border border-green-200"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900">{action.action}</p>
                        <p className="text-sm text-slate-600">
                          {t.effectivenessRate}: {action.effectivenessRate}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-rose-100 to-red-100">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-rose-600" />
              {t.timeline}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {incident?.timeline?.map((event, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        event.status === "completed"
                          ? "bg-green-500"
                          : event.status === "in-progress"
                            ? "bg-blue-500"
                            : "bg-slate-300"
                      }`}
                    />
                    {index < (incident?.timeline?.length || 0) - 1 && <div className="w-0.5 h-12 bg-slate-200 my-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900">{event.time}</span>
                      {event.status === "in-progress" && (
                        <Badge variant="outline" className="text-xs">
                          {t.inProgress}
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-600">{event.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Share Summary Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0 flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="text-2xl font-bold">{t.shareModalTitle}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {/* CHANGE: Updated to subtle blue gradient */}
              <div className="pb-3">
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-gray-800 px-4 py-2 rounded-t-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="font-semibold">{t.caseNumber || "Case Number"}</span>
                </div>
                <div className="bg-white border border-t-0 rounded-b-lg p-4">
                  <p className="text-xl font-bold">
                    #{incident?.id}: {incident?.title}
                  </p>
                </div>
              </div>

              {/* CHANGE: Updated to subtle purple gradient */}
              {photos.length > 0 && (
              <div className="pb-3">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-gray-800 px-4 py-2 rounded-t-lg flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  <span className="font-semibold">{t.incidentPhoto || "Incident Photo"}</span>
                </div>
                <div className="bg-white border border-t-0 rounded-b-lg p-4">
                  <img
                    src={photos[0].url || "/placeholder.svg"}
                    alt={t.incidentPhoto || "Incident Photo"}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </div>)}

              {/* CHANGE: Updated to subtle indigo gradient */}
              <div className="pb-3">
                <div className="bg-gradient-to-r from-indigo-100 to-blue-100 text-gray-800 px-4 py-2 rounded-t-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">{t.severity}</span>
                </div>
                <div className="bg-white border border-t-0 rounded-b-lg p-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      incident?.severity === "Critical"
                        ? "bg-red-100 text-red-800"
                        : incident?.severity === "High"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {incident?.severity}
                  </span>
                </div>
              </div>

              {/* CHANGE: Updated to subtle blue-indigo gradient */}
              <div className="pb-3">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 px-4 py-2 rounded-t-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span className="font-semibold">{t.location}</span>
                </div>
                <div className="bg-white border border-t-0 rounded-b-lg p-4">
                  <p className="text-base">
                    {incident?.location?.address}, {incident?.location?.country}, {incident?.location?.city}
                  </p>
                </div>
              </div>

              {/* CHANGE: Updated to subtle cyan-indigo gradient */}
              <div className="pb-3">
                <div className="bg-gradient-to-r from-cyan-100 to-indigo-100 text-gray-800 px-4 py-2 rounded-t-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="font-semibold">{t.peopleInvolved}</span>
                </div>
                <div className="bg-white border border-t-0 rounded-b-lg p-4">
                  <ul className="space-y-1">
                    {incident?.people?.map((person, idx) => (
                      <li key={idx} className="text-sm">
                        <span className="font-medium">
                          {person.firstName} {person.lastName}
                        </span>{" "}
                        - {person.role}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CHANGE: Updated to subtle indigo-purple gradient */}
              <div>
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 text-gray-800 px-4 py-2 rounded-t-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  <span className="font-semibold">{t.recommendations}</span>
                </div>
                <div className="bg-white border border-t-0 rounded-b-lg p-4">
                  <ul className="space-y-1 list-disc list-inside">
                    {incident?.ai_analysis?.aiRecommendations?.map((rec:any, idx:number) => (
                      <li key={idx} className="text-sm">
                        {rec.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t p-6 bg-white flex gap-3">
            <Button
              onClick={() => handleOpenContactSelection("whatsapp")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t.sendToSelected || `Send to ${selectedContacts.length} contact(s)`}
            </Button>
            <Button
              onClick={() => handleOpenContactSelection("email")}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              <Mail className="h-5 w-5 mr-2" />
              {t.sendToSelected || `Send to ${selectedContacts.length} contact(s)`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Selection Modal */}
      <Dialog open={contactSelectionOpen} onOpenChange={setContactSelectionOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0 flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="text-xl font-bold">
              {shareMethod === "whatsapp" ? t.selectWhatsAppContacts : t.selectEmailContacts}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <Checkbox
                    id={`contact-${contact.id}`}
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={() => toggleContact(contact.id)}
                  />
                  <label htmlFor={`contact-${contact.id}`} className="flex-1 cursor-pointer">
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-gray-600">{contact.role}</div>
                    <div className="text-xs text-gray-500">{contact.phone}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t p-6 bg-white">
            <Button
              onClick={handleSendToContacts}
              disabled={selectedContacts.length === 0}
              className={`w-full ${
                shareMethod === "whatsapp" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              } text-white`}
              size="lg"
            >
              {shareMethod === "whatsapp" ? (
                <>
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t.sendToSelected || `Send to ${selectedContacts.length} contact(s)`}
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5 mr-2" />
                  {t.sendToSelected || `Send to ${selectedContacts.length} contact(s)`}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

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
  ChevronLeft,
  ChevronRight,
  Share2,
  Mail,
  FileText,
  Camera,
  AlertTriangle,
  Lightbulb,
  ZoomIn,
  ZoomOut,
  Save,
  Pencil,
  X,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { IIncident } from "@/models/incidents"
import { IMultimedia } from "@/models/multimedia"
import { getIncidentsById, updateIncident } from "@/services/incident-service"
import { Spinner } from "@/components/ui/spinner"
import { EMOTIONS_COLOR, Language, LANGUAGES } from "@/lib/constants"
import { CustomGoogleMap } from "@/components/custom-google-map"
import { useToast } from "@/hooks/use-toast"
import { CauseBranch } from "@/components/cause-tree"
import { CausalBranches } from "@/models/analyzeRootCauses"

const translations = {
  en: {
    fieldRequired: "The {field} field is required",
    fieldsRequired: "Complete all {field} fields",
    backButton: "Back to Incidents",
    noData: "No data",
    shareButton: "Share",
    status: "Status",
    severity: "Severity",
    reportedBy: "Reported by",
    date: "Date",
    time: "Time",
    location: "Location",
    teamInvolved: "Team involved",
    description: "Problem Description",
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
    peopleInvolved: "People Involved",
    selectWhatsAppContacts: "Select Contacts for WhatsApp",
    selectEmailContacts: "Select Contacts for Email",
    sendToSelected: "Send to Selected",
    keyEventsAndSequence: "Key Events and Sequence",
    comparativeAnalysis: "Comparative Analysis",
    detectedObjects: "Detected objects",
    identifiedRisks: "Identified risks",
    coordinates: "Coordinates",
    noInconsistenciesDetected: "No inconsistencies detected in report",
    severityCritical: "Critical",
    severityHigh: "High",
    severityMedium: "Medium",
    severityLow: "Low",
    //Tre
    type: "Type",
    level: "Level",

    status_pending_analysis: "Pending analysis",
    status_reprocessing: "Reprocessing",
    status_uploading_files: "Uploading files",
    status_transcribing_audio: "Transcribing audio",
    status_analyzing_ai: "Analyzing (AI)",
    status_analyzing_images: "Analyzing images",
    status_analysis_completed: "Completed",
    status_analysis_failed: "Failed",
  },
  es: {
    fieldRequired: "El campo {field} es obligatorio",
    fieldsRequired: "Completa todos los campos de {field}",
    backButton: "Volver a Incidentes",
    noData: "Sin datos",
    shareButton: "Compartir",
    status: "Estado",
    severity: "Gravedad",
    reportedBy: "Reportado por",
    date: "Fecha",
    time: "Hora",
    location: "Ubicación",
    teamInvolved: "Equipo involucrado",
    description: "Descripción del problema",
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
    detectedObjects: "Objetos detectados",
    identifiedRisks: "Riesgos identificados",
    coordinates: "Coordenadas",
    noInconsistenciesDetected: "Ninguna inconsistencia detectada en el reporte",
    severityCritical: "Crítica",
    severityHigh: "Alta",
    severityMedium: "Media",
    severityLow: "Baja",
    //Tree
    type: "Tipo",
    level: "Level",

    status_pending_analysis: "Pendiente de análisis",
    status_reprocessing: "Reprocesando",
    status_uploading_files: "Subiendo archivos",
    status_transcribing_audio: "Transcribiendo audio",
    status_analyzing_ai: "Analizando (IA)",
    status_analyzing_images: "Analizando imágenes",
    status_analysis_completed: "Completado",
    status_analysis_failed: "Fallido",
  },
  fr: {
    fieldRequired: "Le champ {field} est obligatoire.",
    fieldsRequired: "Remplissez tous les champs de {field}",
    backButton: "Retour aux Incidents",
    noData: "Aucune donnée",
    shareButton: "Partager",
    status: "Statut",
    severity: "Gravité",
    reportedBy: "Signalé par",
    date: "Date",
    time: "Heure",
    location: "Localisation",
    teamInvolved: "Équipe impliquée",
    description: "Description du problème",
    aiAnalysis: "Analyse IA",
    summary: "Résumé",
    title: "Titre",
    audioReport: "Audio du Rapport",
    inconsistencies: "Incohérences",
    recommendations: "Recommandations Générées par IA",
    keyEvents: "Événements Clés et Séquence",
    keyEventsDesc: "Séquence chronologique des événements principaux pour rendre l'information implicite explicite et sans ambiguïté.",
    causeTree: "Arbre des Causes",
    observedFacts: "Faits Observables",
    immediateFactors: "Facteurs Contributifs Immédiats",
    underlyingCauses: "Causes Sous-jacentes Possibles",
    timeline: "Chronologie",
    inProgress: "En cours",
    photos: "Photos",
    locationAndMap: "Localisation et Carte",
    comparative: "Analyse Comparative",
    similarCases: "Cas Similaires Antérieurs",
    case: "Cas",
    caseNumber: "Numéro de Cas",
    equipmentFailure: "Défaillance d'équipement dans la zone de production",
    safetyProtocol: "Violation du protocole de sécurité",
    communicationBreakdown: "Défaillance de communication lors du changement d'équipe",
    resolved: "Résolu",
    similarity: "Similarité",
    resolutionTime: "Temps de Résolution",
    hours: "heures",
    actionsTaken: "Actions Prises dans les Cas Similaires",
    immediateIsolation: "Isolement Immédiat de la Zone",
    teamDebriefing: "Séance d'Analyse en Équipe",
    equipmentInspection: "Inspection Complète des Équipements",
    procedureUpdate: "Mise à Jour de la Documentation des Procédures",
    effectivenessRate: "Taux d'Efficacité",
    priorityAction: "Action Prioritaire",
    conductSafetyAudit: "Mener un audit de sécurité complet de la zone affectée dans les 48 heures",
    preventiveMeasure: "Mesure Préventive",
    implementTrainingProgram: "Mettre en œuvre un programme de formation de mise à jour pour tout le personnel impliqué dans des opérations similaires",
    followUp: "Action de Suivi",
    scheduleReview: "Programmer des révisions de sécurité mensuelles pour le prochain trimestre afin de surveiller les améliorations",
    country: "Pays",
    state: "État",
    involvedPeople: "Personnes Impliquées",
    position: "Poste",
    name: "Nom",
    audioTranscription: "Transcription Audio",
    sentimentAnalysis: "Analyse des Sentiments IA",
    overallSentiment: "Sentiment Général",
    detectedEmotions: "Émotions Détectées",
    tone: "Ton",
    confidence: "Confiance",
    shareModalTitle: "Partager le Rapport d'Incident",
    incidentSummary: "Résumé de l'Incident",
    selectContacts: "Sélectionner les Contacts",
    sendViaWhatsApp: "Envoyer via WhatsApp",
    sendViaEmail: "Envoyer par E-mail",
    noContactsSelected: "Veuillez sélectionner au moins un contact",
    messageSent: "Message envoyé avec succès!",
    incidentPhoto: "Photo de l'Incident",
    peopleInvolved: "Personnes Impliquées",
    selectWhatsAppContacts: "Sélectionner les Contacts pour WhatsApp",
    selectEmailContacts: "Sélectionner les Contacts pour E-mail",
    sendToSelected: "Envoyer aux Sélectionnés",
    keyEventsAndSequence: "Événements Clés et Séquence",
    comparativeAnalysis: "Analyse Comparative",
    detectedObjects: "Objets détectés",
    identifiedRisks: "Risques identifiés",
    coordinates: "Coordonnées",
    noInconsistenciesDetected: "Aucune incohérence détectée dans le rapport",
    severityCritical: "Critique",
    severityHigh: "Élevée",
    severityMedium: "Moyen",
    severityLow: "Faible",
    //Tree
    type: "Type",
    level: "Level",

    status_pending_analysis: "Analyse en attente",
    status_reprocessing: "Relance en cours",
    status_uploading_files: "Téléversement des fichiers",
    status_transcribing_audio: "Transcription audio",
    status_analyzing_ai: "Analyse (IA)",
    status_analyzing_images: "Analyse d'images",
    status_analysis_completed: "Terminé",
    status_analysis_failed: "Échec",
  },
}

export default function IncidentDetailPage() {
  const router = useRouter()
  const urlSearchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false)
  const [incident, setIncident] = useState<IIncident | null>(null)
  const [audioFile, setAudioFile] = useState<IMultimedia | null>(null)
  const [photos, setPhotos] = useState<IMultimedia[]>([])
  const params = useParams<{ id: string }>()
  const [language, setLanguage] = useState<Language>("fr")
  const t = translations[language]
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isPhotoLoading, setIsPhotoLoading] = useState(true)
  const [isPhotoZoomOpen, setIsPhotoZoomOpen] = useState(false)
  const [photoZoom, setPhotoZoom] = useState(1)
  const [isZoomPhotoLoading, setIsZoomPhotoLoading] = useState(false)  
  const audioRef = useRef<any | null>(null)
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const GOOGLE_MAP_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  //Header
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editedDataHeader, setEditedDataHeader] = useState<any>(null);
  //Photo
  const [isEditingPhotoAnalisis, setIsEditingPhotoAnalisis] = useState(false);
  const [editingPhotoAnalisis, setEditingPhotoAnalisis] = useState<any>(null);
  //Analysis IA
  const [isEditingAnalisisIA, setIsEditingAnalisisIA] = useState(false);
  const [editingAnalisisIA, setEditingAnalisisIA] = useState<any>(null);
  //Events
  const [isEditingEvents, setIsEditingEvents] = useState(false);
  const [editingEvents, setEditingEvents] = useState<any>(null);
  //Cause tree
  const [isEditingTree, setIsEditingTree] = useState(false);
  const [editingCausesTree, setEditingCauseTree] = useState<any>(null);


  const { toast } = useToast()

  const getIncidentStatus = (it?: IIncident | null): string | undefined => {
    if (!it) return undefined
    return (it as any)?.detail?.status ?? (it as any)?.status
  }

  const getStatusLabel = (status?: string) => {
    if (!status) return "-"
    if (status === "pending_analysis") return (t as any).status_pending_analysis
    if (status === "reprocessing") return (t as any).status_reprocessing
    if (status === "uploading_files") return (t as any).status_uploading_files
    if (status === "transcribing_audio") return (t as any).status_transcribing_audio
    if (status === "analyzing_ai") return (t as any).status_analyzing_ai
    if (status === "analyzing_images") return (t as any).status_analyzing_images
    if (status === "analysis_completed") return (t as any).status_analysis_completed
    if (status === "analysis_failed") return (t as any).status_analysis_failed
    return status
  }

  const handleEdit = (data:any, card:string) => {
    if (card === "header"){      
      data.location = incident?.location
      setEditedDataHeader(data);
      setIsEditingHeader(true);
    }
    if (card === "photo"){
      setIsEditingPhotoAnalisis(true);
      setEditingPhotoAnalisis(data);
    }
    if (card === "analysis_ia"){
      setIsEditingAnalisisIA(true);
      setEditingAnalisisIA(data);
    }
    if (card === "events"){
      setIsEditingEvents(true);
      setEditingEvents(data);
    }
    if (card === "tree"){
      setIsEditingTree(true);
      setEditingCauseTree(data);
    }
  };

  const handleSave = async (card:string) => {
    if (!incident) return
    const incidentAux = JSON.parse(JSON.stringify(incident))

    if (card === "header"){
      if (!editedDataHeader.aiHeader.title.trim()) {
        toast({ title: "Error", description: `Error: ${t.fieldRequired.replace("{field}",t.title)}`, variant: "destructive", })
        return
      }
      if (!editedDataHeader.aiHeader.description.trim()) {
        toast({ title: "Error", description: `Error: ${t.fieldRequired.replace("{field}",t.description)}`, variant: "destructive", })
        return
      }
      if (!editedDataHeader.aiHeader.involved_equipment || !editedDataHeader.aiHeader.involved_equipment[0].trim()) {
        toast({ title: "Error", description: `Error: ${t.fieldRequired.replace("{field}",t.teamInvolved)}`, variant: "destructive", })
        return
      }
      incidentAux.location = editedDataHeader.location
      incidentAux.ai_analysis[`ai_analysis_${editedDataHeader.lang}`].aiHeader.title = editedDataHeader.aiHeader.title
      incidentAux.ai_analysis[`ai_analysis_${editedDataHeader.lang}`].aiHeader.description = editedDataHeader.aiHeader.description
      incidentAux.ai_analysis[`ai_analysis_${editedDataHeader.lang}`].aiHeader.involved_equipment = editedDataHeader.aiHeader.involved_equipment
      setIsEditingHeader(false);
    }

    if (card === "photo") {
      const validateObjects = validateArray(editingPhotoAnalisis.images_objects.detected_objects, "description")

      if (!validateObjects){
        toast({ title: "Error", description: `Error: ${t.fieldsRequired.replace("{field}",t.detectedObjects)}`, variant: "destructive", })
        return
      }

      const validateRisks = validateArray(editingPhotoAnalisis.images_risks.detected_risks, "description")

      if (!validateRisks){
        toast({ title: "Error", description: `Error: ${t.fieldsRequired.replace("{field}",t.identifiedRisks)}`, variant: "destructive", })
        return
      }

      const key = `image_analysis_${editingPhotoAnalisis.lang}`;
      const photoUrl = photos[currentPhotoIndex].url;

      const imgAnalysis = incidentAux.image_analysis[key];

      imgAnalysis.images_objects = imgAnalysis.images_objects.map((io: any) =>
        io.image_url === photoUrl
          ? editingPhotoAnalisis.images_objects
          : io
      );

      imgAnalysis.images_risks = imgAnalysis.images_risks.map((ir: any) =>
        ir.image_url === photoUrl
          ? editingPhotoAnalisis.images_risks
          : ir
      );

      setIsEditingPhotoAnalisis(false);
    }

    if (card === "analysis_ia"){
      const validateRecomendations = validateArray(editingAnalisisIA.aiRecommendations, "description")

      if (!validateRecomendations){
        toast({ title: "Error", description: `Error: ${t.fieldsRequired.replace("{field}",t.recommendations)}`, variant: "destructive", })
        return
      }

      if (!editingAnalisisIA.aiHeader.summary.trim()) {
        toast({ title: "Error", description: `Error: ${t.fieldRequired.replace("{field}",t.summary)}`, variant: "destructive", })
        return
      }

      if (!editingAnalisisIA.transcription.trim()) {
        toast({ title: "Error", description: `Error: ${t.fieldRequired.replace("{field}",t.audioTranscription)}`, variant: "destructive", })
        return
      }
      if (!editingAnalisisIA.aiSentimentAnalysis.overallSentiment.trim()) {
        toast({ title: "Error", description: `Error: ${t.fieldRequired.replace("{field}",t.overallSentiment)}`, variant: "destructive", })
        return
      }
      incidentAux.ai_analysis[`ai_analysis_${editingAnalisisIA.lang}`].aiRecommendations = editingAnalisisIA.aiRecommendations
      incidentAux.ai_analysis[`ai_analysis_${editingAnalisisIA.lang}`].aiHeader.summary = editingAnalisisIA.aiHeader.summary
      incidentAux.ai_analysis[`ai_analysis_${editingAnalisisIA.lang}`].transcription = editingAnalisisIA.transcription
      incidentAux.ai_analysis[`ai_analysis_${editingAnalisisIA.lang}`].aiSentimentAnalysis.overallSentiment = editingAnalisisIA.aiSentimentAnalysis.overallSentiment
      setIsEditingAnalisisIA(false);
    }

    if (card === "events"){
      const validateEvents = validateArray(editingEvents.aiSequence.events, "event")

      if (!validateEvents){
        toast({ title: "Error", description: `Error: ${t.fieldsRequired.replace("{field}",t.keyEvents)}`, variant: "destructive", })
        return
      }
      incidentAux.ai_analysis[`ai_analysis_${editingEvents.lang}`].aiSequence.events = editingEvents.aiSequence.events
      setIsEditingEvents(false);
    }

    if (card === "tree"){
      const validateMainCause = validateArray(editingCausesTree.aiAnalyzeRootCauses.causal_branches, "main_cause")

      const levels = editingCausesTree.aiAnalyzeRootCauses.causal_branches.flatMap((b: CausalBranches) => b.levels);

      const validateCause = validateArray(levels, "cause")
      const validateFactorType = validateArray(levels, "factor_type")
      const validateFactorQuestion = validateArray(levels, "question")

      if (!validateMainCause || !validateCause || !validateFactorType || !validateFactorQuestion){
        toast({ title: "Error", description: `Error: ${t.fieldsRequired.replace("{field}",t.causeTree)}`, variant: "destructive", })
        return
      }
      incidentAux.ai_analysis[`ai_analysis_${editingCausesTree.lang}`].aiAnalyzeRootCauses = editingCausesTree.aiAnalyzeRootCauses
      setIsEditingTree(false);
    }

    setIsLoading(true)
    const response = await updateIncident(incidentAux)
    if (response.data) {
      setIncident(response.data);
    }    
    setIsLoading(false)
  };

  const handleCancel = (card:string) => {
    if (card === "header"){
      setEditedDataHeader(null);
      setIsEditingHeader(false);
    }
    if (card === "photo"){
      setIsEditingPhotoAnalisis(false);
      setEditingPhotoAnalisis(null)
    }
    if (card === "analysis_ia"){
      setIsEditingAnalisisIA(false);
      setEditingAnalisisIA(null)
    }
    if (card === "events"){
      setIsEditingEvents(false);
      setEditingEvents(null)
    }
    if (card === "tree"){
      setIsEditingTree(false);
      setEditingCauseTree(null)
    }
  };

  const validateArray = (array:any, field:string) => {
    let validate= true
    array.map((a: any) => {
        if (!a[field].trim()) {          
          validate = false
        }
      });
    return validate
  };

  const handleChange = (
    field: string,
    value: any,
    card: "header" | "photo" | "analysis_ia" | "events" | "tree"
  ) => {
    console.log("field", field)
    console.log("value", value)
    console.log("card", card)
    const setters = {
      header: setEditedDataHeader,
      photo: setEditingPhotoAnalisis,
      analysis_ia: setEditingAnalisisIA,
      events: setEditingEvents,
      tree: setEditingCauseTree,
    } as const;
    
    const setter = setters[card];

    setter((prev: any) => {
      const newItem = structuredClone(prev);

      if (field.includes(".")) {
        const keys = field.split(".");
        let current = newItem;

        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] ??= {};
          current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;
      } else {
        newItem[field] =
          typeof value === "object"
            ? { ...newItem[field], ...value }
            : value;
      }

      return newItem;
    });
  };

  const getAIAnalysis = (inc: IIncident | null, lang: "en" | "es" | "fr") => {
    if (!inc?.ai_analysis) return null
    const analysisKey = `ai_analysis_${lang}` as keyof typeof inc.ai_analysis
    const analysis = (inc.ai_analysis as any)?.[analysisKey] || null
    if (analysis?.aiHeader && !analysis?.aiHeader.involved_equipment[0]){
      analysis.aiHeader.involved_equipment = ["-"]
    }
    analysis.lang = lang
    return analysis
  }

  const getSeverityLabel = (severity: string | undefined): string => {
    if (severity === "3") return t.severityHigh
    if (severity === "2") return t.severityMedium
    if (severity === "1") return t.severityLow
    return ""
  }

  const currentAIAnalysis = getAIAnalysis(incident, language)

  useEffect(() => {
    const lang = urlSearchParams.get("lang")
    if (LANGUAGES.includes(lang as Language)) {
      setLanguage(lang as Language);
    }
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

  const nextPhoto = () => {
    setIsPhotoLoading(true)
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setIsPhotoLoading(true)
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  useEffect(() => {
    if (photos.length === 0) return
  }, [currentPhotoIndex, photos.length])

  useEffect(() => {
    if (!isPhotoZoomOpen) return
    setIsZoomPhotoLoading(true)
    setPhotoZoom(1)
  }, [isPhotoZoomOpen, currentPhotoIndex])

  const openPhotoZoom = () => {
    setIsZoomPhotoLoading(true)
    setPhotoZoom(1)
    setIsPhotoZoomOpen(true)
  }

  const zoomInPhoto = () => setPhotoZoom((z) => Math.min(3, Math.round((z + 0.25) * 100) / 100))
  const zoomOutPhoto = () => setPhotoZoom((z) => Math.max(1, Math.round((z - 0.25) * 100) / 100))

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
${incident?.ai_analysis?.recommendations.map((r: any, i: any) => `${i + 1}. ${r}`).join("\n")}
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

  const getDetailAnalizeImage = () => {
    if (!incident?.image_analysis && photos.length <= 0) return null
    const key = `image_analysis_${language}`;
    const current_image_analysis = incident?.image_analysis?.[key] ?? null;
    let images_objects: any = null
    let images_risks: any = null

    if (current_image_analysis) {
      const indexOb = current_image_analysis?.images_objects?.findIndex((io: any) => io.image_url === photos[currentPhotoIndex].url)
      images_objects = indexOb >= 0 ? current_image_analysis?.images_objects[indexOb] : null

      const indexRisk = current_image_analysis?.images_risks?.findIndex((io: any) => io.image_url === photos[currentPhotoIndex].url)
      images_risks = indexRisk >= 0 ? current_image_analysis?.images_risks[indexRisk] : null
    }

    return {
      images_objects,
      images_risks,
      lang: language
    }
  }

  const current_image_analysis = getDetailAnalizeImage()

  return (
    <div
      className="relative min-h-screen bg-no-repeat p-4 md:p-8 font-montserrat overflow-x-hidden"
      style={{
        backgroundImage: 'url(/Bg_2.png)',
        backgroundAttachment: 'scroll',
        backgroundSize: 'auto',
        backgroundPosition: 'top',
        backgroundColor: '#303060'
      }}
    >
      <img
        src="/Top1.png"
        alt="Top gradient"
        className="absolute top-0 left-0 right-0 w-full h-auto"
        style={{ objectFit: 'cover' }}
      />
      <div className="absolute inset-0 bg-black/40"></div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-150">
          <Spinner className="w-12 h-12" />
        </div>
      )}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 sm:mt-8 mb-6 sm:mb-10">
          <Button type="button" variant="outline" onClick={() => router.push(`/incidents/?lang=${language}`)} className="gap-2 cursor-pointer text-white bg-transparent border-0 hover:bg-transparent font-medium justify-start">
            <ArrowLeft className="h-4 w-8 text-white" />
            {t.backButton}
          </Button>
          <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-6 flex-wrap w-full sm:w-auto">
            {/* Share Button */}
            <Button variant="outline" onClick={handleShare} className="gap-2 bg-[#FFCA00] border-0 hover:bg-[#FFCA00]">
              <Share2 className="h-4 w-4" />
              {t.shareButton}
            </Button>
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-white font-medium cursor-pointer appearance-none outline-none px-2 py-2 rounded text-sm md:text-base max-w-full"
              aria-label="Language"
            >
              <option value="en" className="bg-white text-slate-900 text-base">EN</option>
              <option value="es" className="bg-white text-slate-900 text-base">ES</option>
              <option value="fr" className="bg-white text-slate-900 text-base">FR</option>
            </select>
            <img
              src="/LogoIdiomas.png"
              alt="Language"
              className="h-5 w-5 md:h-6 md:w-6 shrink-0 cursor-pointer"
              onClick={() => document.querySelector('select')?.click()}
            />
            <img
              src="/Tick.png"
              alt="Dropdown"
              className="h-8 w-16 md:h-10 md:w-24 pointer-events-none md:-mr-30 md:mb-5 shrink-0"
            />
          </div>
        </div>

        {/* Combined Incident Info and Photo Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10 lg:mb-10">
          {/* Incident Information Panel - 60% */}
          <Card className={`bg-transparent !py-0 lg:max-h-[110vh] !pt-[1.45rem] border-transparent h-full ${photos.length > 0 ? "lg:col-span-3 " : "lg:col-span-5"
            } flex flex-col`}>
            <div>
              {/* Summary Bar */}
              <div className="bg-[#303060] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between -mt-4 sm:-mt-6 gap-4 sm:gap-6">
                <div className="flex items-center gap-6">
                  <div className="border-b sm:border-b-0 sm:border-r border-slate-500 pb-3 sm:pb-0 pr-0 sm:pr-6 flex flex-col">
                    <div>
                      <p className="text-xs text-white mb-2 mt-0 lg:-mt-14 uppercase font-bold">ID</p>
                    </div>
                    <p className="text-lg font-bold text-white">#{incident?.id.substring(0, 5)}</p>
                  </div>
                  <div className="flex flex-col">
                    <div>
                      <p className="text-xs text-white mb-2 mt-0 lg:-mt-14 uppercase font-bold">{t.status}</p>
                    </div>
                    <p className="text-lg font-bold text-white">{getStatusLabel(getIncidentStatus(incident))}</p>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end">
                  <div>
                    <p className="text-xs text-white mb-2 mt-0 lg:-mt-12 uppercase font-bold">{t.severity}</p>
                  </div>
                  <div className={`w-full sm:w-48 px-3 sm:px-4 text-center py-2 rounded-sm text-xl sm:text-2xl font-bold text-white ${currentAIAnalysis?.aiHeader?.severity === "3"
                      ? "bg-red-600"
                        : currentAIAnalysis?.aiHeader?.severity === "1"
                          ? "bg-green-600"
                          : "bg-yellow-400"
                    }`}>
                    {getSeverityLabel(currentAIAnalysis?.aiHeader?.severity)}
                  </div>
                </div>
              </div>
            </div>
              {/* Info Grid*/}
              <div className="bg-[#6A6A6A] rounded-lg p-4 flex flex-col gap-4 relative z-10 -mb-6">
                <div className="absolute top-3 right-3">
                  <div className="flex gap-2">
                    {!isEditingHeader ? (
                      <button
                        onClick={() => handleEdit(currentAIAnalysis, "header")}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-lg transition-all duration-200 group"
                        title="Editar"
                      >
                        <Pencil className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSave("header")}
                          className="bg-green-500 hover:bg-green-600 p-2 rounded-lg transition-all duration-200 group"
                          title="Guardar"
                        >
                          <Save className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() =>handleCancel("header")}
                          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-all duration-200 group"
                          title="Cancelar"
                        >
                          <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row w-full gap-6 mt-4">
                  <div className="flex flex-1 items-center gap-3 sm:basis-[55%] sm:flex-none">
                    <User className="h-5 w-5 text-slate-300" />
                    <div>
                      <p className="text-xs text-slate-300 mb-1">{t.reportedBy}</p>
                      <p className="text-sm font-medium text-white">
                        {incident?.reported_by?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-1 items-center gap-3">
                    <Calendar className="h-5 w-5 text-slate-300" />
                    <div>
                      <p className="text-xs text-slate-300 mb-1">{t.date}</p>
                      <p className="text-sm font-medium text-white">{incident?.date}</p>
                    </div>
                  </div>

                  <div className="flex flex-1 items-center gap-3">
                    <Clock className="h-5 w-5 text-slate-300" />
                    <div>
                      <p className="text-xs text-slate-300 mb-1">{t.time}</p>
                      <p className="text-sm font-medium text-white">{incident?.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            <CardContent className="p-0 bg-white rounded-lg relative -mt-2 sm:-mt-4 flex-1 min-h-0 lg:overflow-y-auto">
              {/* Content Below Summary */}
              <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-6">
                {/* Title Section */}
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                    {isEditingHeader ? (
                      <input
                        type="text"
                        value={editedDataHeader?.aiHeader?.title}
                        onChange={(e) => handleChange('aiHeader.title', e.target.value, "header")}
                        className="w-full border-2 border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                      />
                    ) : (
                      currentAIAnalysis?.aiHeader?.title || incident?.title
                    )}
                  </h2>
                </div>

                {/* Description Section */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase">{t.description}</h3>
                  <div className="flex items-start justify-between mb-6">
                    <p className="text-slate-600 leading-relaxed flex-1">
                      {isEditingHeader ? (
                        <input
                          type="text"
                          value={editedDataHeader?.aiHeader?.description}
                          onChange={(e) => handleChange('aiHeader.description', e.target.value, "header")}
                          className="w-full border-2 border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                        />
                      ) : (
                        currentAIAnalysis?.aiHeader?.description
                      )}
                    </p>
                  </div>
                </div>
                <div className="bg-black w-full h-px my-8"></div>

                {/* Location and Team Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <img src="/location.png" alt="Location" className="h-10 w-8" />
                      <div>
                        <p className="text-lg text-slate-500">{t.location}</p>
                        <p className="text-sm font-bold text-slate-900">{!isEditingHeader ? incident?.location?.address : editedDataHeader?.location?.address}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-10 w-10 text-slate-700" />
                      <div>
                        <p className="text-lg text-slate-500">{t.teamInvolved}</p>
                        <p className="text-sm font-bold text-black">
                          {isEditingHeader ? (
                            <input
                              type="text"
                              value={editedDataHeader?.aiHeader?.involved_equipment[0]}
                              onChange={(e) => handleChange('aiHeader.involved_equipment.0', e.target.value, "header")}
                              className="w-full border-2 border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                            />
                          ) : (
                            currentAIAnalysis?.aiHeader?.involved_equipment ? currentAIAnalysis?.aiHeader?.involved_equipment[0] : "-"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map and Details Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-8 mb-8">
                  {/* Left: Coordinates and Details - 40% */}
                  <div className="sm:col-span-2 space-y-2">
                    <div>
                      <p className="text-xs text-slate-500 mb-2">{t.state}</p>
                      <p className="text-base sm:text-lg font-bold text-slate-900">{!isEditingHeader ? incident?.location?.city : editedDataHeader?.location?.city}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-2">{t.country}</p>
                      <p className="text-base sm:text-lg font-bold text-slate-900">{!isEditingHeader ? incident?.location?.country : editedDataHeader?.location?.country}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-2">{t.coordinates}</p>
                      <p className="text-base sm:text-lg font-bold text-slate-900">Lat: {!isEditingHeader ? incident?.location?.lat.toFixed(4) : editedDataHeader?.location?.lat.toFixed(4)}</p>
                      <p className="text-base sm:text-lg font-bold text-slate-900">Lng: {!isEditingHeader ? incident?.location?.lng.toFixed(4) : editedDataHeader?.location?.lng.toFixed(4)}</p>
                    </div>
                  </div>

                  {/* Right: Map - 60% */}
                  <div className="sm:col-span-3 h-64 bg-slate-200 rounded-lg overflow-hidden">
                    {(incident?.location && GOOGLE_MAP_API_KEY) && (
                      <CustomGoogleMap
                        lat={!isEditingHeader ? incident.location.lat : editedDataHeader.location.lat}
                        lng={!isEditingHeader ? incident.location.lng : editedDataHeader.location.lng}
                        apiKey={GOOGLE_MAP_API_KEY || ""}
                        lang={language}
                        edit={isEditingHeader}
                        onLocationChange={(location) => {
                          handleChange('location', location, "header")
                        }}
                        />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Carousel - 40% */}
          {photos.length > 0 && (
            <Card className="bg-white backdrop-blur-sm lg:max-h-[110vh] lg:col-span-2 overflow-hidden flex flex-col h-full">
              <CardContent className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
                <div className="sticky top-0 z-10 bg-white">
                  <div className="flex flex-row text-right">
                    <div className="flex gap-2 ml-auto mb-1 p-2">
                      {!isEditingPhotoAnalisis ? (
                        <button
                          onClick={() => handleEdit(current_image_analysis, "photo")}
                          className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50
                            p-2 rounded-lg shadow-sm transition-all duration-200 group"
                          title="Editar"
                        >
                          <Pencil className="w-5 h-5 text-slate-600 group-hover:scale-110 transition-transform" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleSave("photo")}
                            className="bg-green-500 hover:bg-green-600 p-2 rounded-lg transition-all duration-200 group"
                            title="Guardar"
                          >
                            <Save className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleCancel("photo")}
                            className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-all duration-200 group"
                            title="Cancelar"
                          >
                            <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden relative">
                    {isPhotoLoading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                        <Spinner className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <img
                      src={photos[currentPhotoIndex].url || "/placeholder.svg"}
                      alt={`Incident photo ${currentPhotoIndex + 1}`}
                      className="w-full h-full object-cover cursor-zoom-in"
                      draggable={false}
                      onClick={openPhotoZoom}
                      onLoad={() => setIsPhotoLoading(false)}
                      onError={() => setIsPhotoLoading(false)}
                    />
                  </div>

                  {photos.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={isEditingPhotoAnalisis}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={prevPhoto}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={isEditingPhotoAnalisis}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={nextPhoto}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {photos.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setIsPhotoLoading(true)
                              setCurrentPhotoIndex(index)
                            }}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentPhotoIndex ? "bg-white w-6" : "bg-white/50"
                              }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* AI-extracted information below the photo */}
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      {language === "es" ? "Objetos detectados:" : "Detected objects:"}
                    </h4>
                    <ul className="list-none space-y-1 text-slate-600">
                      {current_image_analysis?.images_objects?.detected_objects?.map((obj: any, idx: number) => (
                        isEditingPhotoAnalisis ? (
                                <input
                                  key={idx}
                                  type="text"
                                  value={editingPhotoAnalisis?.images_objects?.detected_objects[idx].description}
                                  onChange={(e) => handleChange(`images_objects.detected_objects.${idx}.description`, e.target.value, "photo")}
                                  className="w-full border-2 border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                                />
                              ) : (
                                <li key={idx}>- {obj.description}</li>
                              )
                      ))}
                    </ul>
                  </div>

                  <div className="flex w-full h-px bg-[#707070] mt-8"></div>

                  <div>
                    <img src="/warning.png" alt="Warning" className="h-11 w-12 my-6" />
                    <h4 className="font-semibold text-[#D84B00] my-4 text-2xl uppercase">
                      {t.identifiedRisks}:
                    </h4>
                    <ul className="list-none space-y-1 text-[#D84B00]">
                      {current_image_analysis?.images_risks?.detected_risks?.map((risk: any, idx: number) => (
                        isEditingPhotoAnalisis ? (
                                <input
                                  key={idx}
                                  type="text"
                                  value={editingPhotoAnalisis?.images_risks?.detected_risks[idx].description}
                                  onChange={(e) => handleChange(`images_risks.detected_risks.${idx}.description`, e.target.value, "photo")}
                                  className="w-full border-2 border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                                />
                              ) : (
                                <li key={idx}>
                                  <b>- {risk.name ? risk.name + ": " : ""} </b>{risk.description}
                                </li>
                              )
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>


        {/* AI Analysis and Key Events + Cause Tree Layout */}
        {/* <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 lg:h-350 ${photos.length > 0 ? "lg:col-span-3 " : "mt-10 lg:mt-40 lg:col-span-5"}`}> */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 lg:mb-10 ${photos.length > 0 ? "lg:col-span-3 " : "mt-10 lg:mt-40 lg:col-span-5"}`}>
          {/* Left Column: AI Analysis */}
          <Card className="bg-transparent border-transparent lg:max-h-[224vh] h-full flex flex-col min-h-0">
          <div>
              {/* Title AI_ANALYSIS Grid*/}
              <div className="bg-[#303060] w-full h-16 rounded-lg p-4 flex items-center justify-between relative z-10 -mt-6">
                <div className="flex justify-between items-center gap-4 w-full">
                  <p className="text-xl font-medium text-white">{t.aiAnalysis}</p>
                  <div className="flex gap-2 ml-auto p-2">
                    {!isEditingAnalisisIA ? (
                        <button
                          onClick={() => handleEdit(currentAIAnalysis, "analysis_ia")}
                          className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 p-2 rounded-lg
                            shadow-sm transition-all duration-200 group"
                          title="Editar"
                        >
                          <Pencil className="w-5 h-5 text-slate-600 group-hover:scale-110 transition-transform" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleSave("analysis_ia")}
                            className="bg-green-500 hover:bg-green-600 p-2 rounded-lg transition-all duration-200 group"
                            title="Guardar"
                          >
                            <Save className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleCancel("analysis_ia")}
                            className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-all duration-200 group"
                            title="Cancelar"
                          >
                            <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                          </button>
                        </>
                      )}
                    </div>
                </div>
              </div>
          </div>
            <CardContent className="space-y-4 pt-2 bg-white rounded-lg -mt-8 sm:-mt-12 lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
              <div>
                <h4 className="font-medium text-slate-900 mb-2 mt-6">{t.summary}</h4>
                {isEditingAnalisisIA ? (
                  <textarea
                    rows={4}
                    value={editingAnalisisIA?.aiHeader?.summary}
                    onChange={(e) => handleChange('aiHeader.summary', e.target.value, "analysis_ia")}
                    className="w-full border-2 border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-black">{currentAIAnalysis?.aiHeader?.summary}</p>
                )}                
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-2">{t.audioReport}</h4>
                {audioFile && (
                  <div className="bg-slate-50 rounded-lg p-4 flex items-center gap-4">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={togglePlayAudio}
                      className="shrink-0"
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

                <div className="bg-black w-full h-px my-8"></div>

              {/* Audio Transcription Section */}
              <div>
                <h4 className="font-medium text-slate-900 mb-2">{t.audioTranscription}</h4>
                <div className="bg-white rounded-lg">
                  {isEditingAnalisisIA ? (
                    <textarea
                      rows={4}
                      value={editingAnalisisIA?.transcription}
                      onChange={(e) => handleChange('transcription', e.target.value, "analysis_ia")}
                      className="w-full border-2 border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                    />
                  ) : (
                    <p className="text-slate-700 italic leading-relaxed mb-8">&ldquo;{currentAIAnalysis?.transcription}&rdquo;</p>
                  )}                  
                </div>
              </div>

              {/* Recommendations Section */}
              <div className="rounded-lg bg-[#6A6A6A] p-8">
                <h4 className="font-bold text-[#FFCA00] mb-2 inline-block">{t.recommendations}</h4>
                <ul className="space-y-2">
                  {!currentAIAnalysis?.aiRecommendations.error ? currentAIAnalysis?.aiRecommendations?.map((rec: any, index: number) => (
                    isEditingAnalisisIA ? (
                        <input
                          key={index}
                          type="text"
                          value={editingAnalisisIA?.aiRecommendations[index].description}
                          onChange={(e) => handleChange(`aiRecommendations.${index}.description`, e.target.value, "analysis_ia")}
                          className="w-full border-2 text-white border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                        />
                      ) : (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-white font-bold">- {typeof rec === 'string' ? rec : rec?.description}</span>
                        </li>
                      )
                  )) : null}
                </ul>
              </div>
              
                <div className="bg-black w-full h-px my-8"></div>

              {/* Sentiment Analysis Section */}
              <div>
                <h4 className="font-bold text-xl text-[#303060] mb-3">{t.sentimentAnalysis}</h4>
                <div className="bg-white rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between bg-[#E2E2E2] rounded-sm p-4">
                    <span className="text-sm text-black">{t.overallSentiment}:</span>
                    {isEditingAnalisisIA ? (
                      <input
                        type="text"
                        value={editingAnalisisIA?.aiSentimentAnalysis?.overallSentiment}
                        onChange={(e) => handleChange('aiSentimentAnalysis.overallSentiment', e.target.value, "analysis_ia")}
                        className="border-2 border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                      />
                    ) : (
                      <span className="font-semibold text-[#303060]">{currentAIAnalysis?.aiSentimentAnalysis?.overallSentiment}</span>
                    )}
                  </div>

                  <div>
                    {/* <p className="text-sm text-slate-600 mb-2">{t.detectedEmotions}:</p> */}
                    <div className="space-y-2">
                      {currentAIAnalysis?.aiSentimentAnalysis?.detectedEmotions?.map((item: any, idx: number) => {
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

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <span className="text-sm text-slate-600">{t.tone}:</span>
                      <p className="font-medium text-slate-900">{currentAIAnalysis?.aiSentimentAnalysis?.tone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-600">{t.confidence}:</span>
                      <p className="font-medium text-slate-900">{currentAIAnalysis?.aiSentimentAnalysis?.confidence}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Key Events + Cause Tree */}
          <div className="flex flex-col gap-3 sm:gap-6 h-full lg:grid lg:grid-rows-2 lg:gap-6 lg:min-h-0">
            {/* Key Events section */}
            <Card className="bg-transparent border-transparent h-fit lg:h-full lg:max-h-[110vh] flex flex-col min-h-0">
          <div>
              {/* Title key_events Grid*/}
              <div className="bg-[#303060] w-full h-16 rounded-lg p-4 flex items-center justify-between relative z-10 -mt-6">
                <div className="flex items-center gap-4 w-full">
                  <p className="text-xl font-medium text-white">{t.keyEvents}</p>
                  <div className="flex gap-2 ml-auto p-2">
                  {!isEditingEvents ? (
                      <button
                        onClick={() => handleEdit(currentAIAnalysis, "events")}
                        className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 p-2 rounded-lg
                          shadow-sm transition-all duration-200 group"
                        title="Editar"
                      >
                        <Pencil className="w-5 h-5 text-slate-600 group-hover:scale-110 transition-transform" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSave("events")}
                          className="bg-green-500 hover:bg-green-600 p-2 rounded-lg transition-all duration-200 group"
                          title="Guardar"
                        >
                          <Save className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleCancel("events")}
                          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-all duration-200 group"
                          title="Cancelar"
                        >
                          <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
          </div>
              <CardContent className="pt-16 bg-white rounded-xl -mt-14 sm:-mt-14 lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
                <p className="text-sm text-slate-600 mb-4">{t.keyEventsDesc}</p>
                <div className="space-y-0">
                  {currentAIAnalysis?.aiSequence?.events?.map((event: any, index: number) => (
                    <div key={index}>
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg mb-2">
                        <div className="shrink-0 w-10 text-2xl font-semibold text-[#F88D00]">{index + 1}</div>
                        <div className="flex-1 text-slate-700">
                          {isEditingEvents ? (
                            <input
                              key={"input"+index}
                              type="text"
                              value={editingEvents?.aiSequence?.events[index].event}
                              onChange={(e) => handleChange(`aiSequence.events.${index}.event`, e.target.value, "events")}
                              className="w-full border-2 border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                            />
                          ) : (
                            event.event
                          )}
                        </div>
                      </div>
                      {index < currentAIAnalysis?.aiSequence?.events?.length - 1 && (
                        <div className="h-px bg-[#F88D00] "></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cause Tree section */}
            <Card className="bg-transparent border-transparent h-fit lg:h-full lg:max-h-[110vh] flex flex-col min-h-0">
              <div>
              <div className="bg-[#303060] w-full h-16 rounded-lg p-4 flex items-center justify-between relative z-10 -mt-6">
                  <div className="flex items-center gap-4 w-full">
                      <p className="text-xl font-medium text-white">{t.causeTree}</p>
                      <div className="flex gap-2 ml-auto p-2">
                        {!isEditingTree ? (
                            <button
                              onClick={() => handleEdit(currentAIAnalysis, "tree")}
                              className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 p-2 rounded-lg
                                shadow-sm transition-all duration-200 group"
                              title="Editar"
                            >
                              <Pencil className="w-5 h-5 text-slate-600 group-hover:scale-110 transition-transform" />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleSave("tree")}
                                className="bg-green-500 hover:bg-green-600 p-2 rounded-lg transition-all duration-200 group"
                                title="Guardar"
                              >
                                <Save className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                              </button>
                              <button
                                onClick={() => handleCancel("tree")}
                                className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-all duration-200 group"
                                title="Cancelar"
                              >
                                <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                              </button>
                            </>
                          )}
                        </div>
                  </div>
              </div>
              </div>

              <CardContent className="space-y-6 pt-12 bg-white rounded-xl -mt-14 sm:-mt-14 lg:flex-1 lg:min-h-0 lg:overflow-y-auto">

                {/* Cause Tree Branches */}
                {currentAIAnalysis?.aiAnalyzeRootCauses?.causal_branches ? (
                  (isEditingTree 
                    ? editingCausesTree.aiAnalyzeRootCauses?.causal_branches 
                    : currentAIAnalysis?.aiAnalyzeRootCauses?.causal_branches
                  )?.map((branch: any, index: number) => (
                    <CauseBranch 
                      key={branch.branch_id} 
                      edit={isEditingTree} 
                      branch={branch} 
                      index={index} 
                      handleChange={handleChange}
                      translation={t}
                    />
                  ))
                ) : (
                  <div className="flex flex-1 items-center justify-center min-h-[200px]">
                    <span>{t.noData}</span>
                  </div>
                )}
              </CardContent>
          </Card>
          </div>
        </div>

        {/* Comparative Analysis */}
        {currentAIAnalysis?.aiHeader?.similar_cases && (
          <Card className="bg-transparent border-transparent lg:h-175 flex flex-col min-h-0">
          <div>
              {/* Title AI_ANALYSIS Grid*/}
              <div className="bg-[#303060] w-full h-16 rounded-lg p-4 flex items-center justify-between relative z-10 -mt-6">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xl font-medium text-white">{t.similarCases}</p>
                  </div>
                </div>
              </div>
          </div>
            <CardContent className="pt-6 bg-white rounded-xl -mt-10 sm:-mt-14 lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
              <div className="space-y-6">
                {/* Similar Cases */}
                <div className="pt-8">
                  <div className="space-y-4">
                    {currentAIAnalysis?.aiHeader?.similar_cases?.map((caseItem: any, index: any) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-slate-900">
                              {t.case} #{caseItem.id.substring(0, 10)}
                            </p>
                            <p className="text-sm text-slate-600"><b> {caseItem.title ? caseItem.title + ": " : ""} </b>{caseItem.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {caseItem.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-600">
                          <p className="mb-1">
                            <span className="font-medium">{t.similarity}:</span> {caseItem.similarity}%
                          </p>
                          {caseItem.average_resolution_time_days && (
                            <p>
                              <span className="font-medium">{t.resolutionTime}:</span> {caseItem.average_resolution_time_days} {t.hours}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions Taken in Similar Cases */}
                <div className="hidden">
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
          </Card>)}

        {/* Timeline */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm hidden">
          <CardHeader className="bg-linear-to-r from-rose-100 to-red-100 gap-0">
            <CardTitle className="flex items-center gap-2 p-2">
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
                      className={`w-3 h-3 rounded-full ${event.status === "completed"
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

      {/* Photo Zoom Modal */}
      <Dialog
        open={isPhotoZoomOpen}
        onOpenChange={(open) => {
          setIsPhotoZoomOpen(open)
          if (!open) {
            setIsZoomPhotoLoading(false)
            setPhotoZoom(1)
            setIsPhotoLoading(false)
          }
        }}
      >
        <DialogContent
          className="max-w-[95vw] w-[95vw] sm:max-w-5xl max-h-[90vh] p-0 overflow-hidden bg-black/90 border-white/10 flex flex-col **:data-[slot=dialog-close]:text-white **:data-[slot=dialog-close]:hover:text-white"
        >
          <DialogHeader className="px-4 py-3 pr-14 border-b border-white/10 bg-black/40">
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="text-white text-base sm:text-lg">
                {t.incidentPhoto}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                  onClick={zoomOutPhoto}
                  disabled={photoZoom <= 1}
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-white text-sm font-medium min-w-[3rem] text-center">
                  {Math.round(photoZoom * 100)}%
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                  onClick={zoomInPhoto}
                  disabled={photoZoom >= 3}
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="relative flex-1 overflow-auto">
            {isZoomPhotoLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <Spinner className="w-10 h-10 text-white" />
              </div>
            )}

            <div className="min-h-full min-w-full flex items-center justify-center p-4 sm:p-6">
              <img
                src={photos[currentPhotoIndex]?.url || "/placeholder.svg"}
                alt={`Incident photo ${currentPhotoIndex + 1}`}
                className="select-none"
                draggable={false}
                style={{ 
                  transform: `scale(${photoZoom})`, 
                  transformOrigin: "center",
                  maxWidth: "100%",
                  maxHeight: "calc(85vh - 80px)",
                  width: "100%",
                  height: "auto",
                  objectFit: "contain"
                }}
                onLoad={() => setIsZoomPhotoLoading(false)}
                onError={() => setIsZoomPhotoLoading(false)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                <div className="bg-linear-to-r from-blue-100 to-indigo-100 text-gray-800 px-4 py-2 rounded-t-lg flex items-center gap-2">
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
                  <div className="bg-linear-to-r from-purple-100 to-pink-100 text-gray-800 px-4 py-2 rounded-t-lg flex items-center gap-2">
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
                <div className="bg-linear-to-r from-indigo-100 to-blue-100 text-gray-800 px-4 py-2 rounded-t-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">{t.severity}</span>
                </div>
                <div className="bg-white border border-t-0 rounded-b-lg p-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${currentAIAnalysis?.aiHeader?.severity === "3"
                        ? "bg-red-100 text-red-800"
                        : currentAIAnalysis?.aiHeader?.severity === "1"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {getSeverityLabel(currentAIAnalysis?.aiHeader?.severity)}
                  </span>
                </div>
              </div>

              {/* CHANGE: Updated to subtle blue-indigo gradient */}
              <div className="pb-3">
                <div className="bg-linear-to-r from-blue-100 to-purple-100 text-gray-800 px-4 py-2 rounded-t-lg flex items-center gap-2">
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
                <div className="bg-linear-to-r from-cyan-100 to-indigo-100 text-gray-800 px-4 py-2 rounded-t-lg flex items-center gap-2">
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
                <div className="bg-linear-to-r from-indigo-100 to-purple-100 text-gray-800 px-4 py-2 rounded-t-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  <span className="font-semibold">{t.recommendations}</span>
                </div>
                <div className="bg-white border border-t-0 rounded-b-lg p-4">
                  <ul className="space-y-1 list-disc list-inside">
                    {!currentAIAnalysis?.aiRecommendations.error ? currentAIAnalysis?.aiRecommendations?.map((rec: any, idx: number) => (
                      <li key={idx} className="text-sm">
                        {typeof rec === 'string' ? rec : rec?.description}
                      </li>
                    )) : null}
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
              className={`w-full ${shareMethod === "whatsapp" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
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

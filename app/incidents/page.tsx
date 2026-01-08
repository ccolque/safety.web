"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Mail, Plus, Upload, Mic, MapPin, X, Pause, Play, Square, Video, Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { getSeveritiesAll } from "@/services/severity-service"
import { ISeverity } from "@/models/severity"
import { IIncident } from "@/models/incidents"
import { createIncident, getIncidentsAll } from "@/services/incident-service"
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import { IMultimedia, Multimedia } from "@/models/multimedia"
import { useToast } from "@/hooks/use-toast"
import { getStatusAll } from "@/services/status-service"
import { IStatus } from "@/models/status"

const translations = {
  en: {
    title: "Incidents",
    subtitle: "Incident management and tracking system",
    tableId: "ID",
    tableTitle: "Title",
    tableSeverity: "Severity",
    tableAction: "Action",
    buttonView: "View",
    buttonNew: "New Incident",
    modalTitle: "Create New Incident",
    fieldTitle: "Title",
    fieldDescription: "Description",
    fieldDate: "Date",
    fieldTime: "Time",
    fieldAudio: "Audio",
    fieldVideo: "Video",
    fieldPhotos: "Photos",
    fieldLocation: "Location",
    uploadAudio: "Upload audio",
    uploadVideo: "Upload video",
    record: "Record",
    stop: "Stop",
    uploadPhotos: "Upload photos",
    selectLocation: "Select on map",
    confirmLocation: "Confirm Location",
    selectedLocation: "Selected Location",
    cancel: "Cancel",
    create: "Create Incident",
    required: "required",
    titlePlaceholder: "Enter incident title",
    descriptionPlaceholder: "Describe the incident in detail",
    high: "High",
    medium: "Medium",
    low: "Low",
    titleSucces: "Success",
    success: "Data saved successfully"
  },
  es: {
    title: "Incidentes",
    subtitle: "Sistema de gestión y seguimiento de incidentes",
    tableId: "ID",
    tableTitle: "Título",
    tableSeverity: "Gravedad",
    tableAction: "Acción",
    buttonView: "Ver",
    buttonNew: "Nuevo Incidente",
    modalTitle: "Crear Nuevo Incidente",
    fieldTitle: "Título",
    fieldDescription: "Descripción",
    fieldDate: "Fecha",
    fieldTime: "Hora",
    fieldAudio: "Audio",
    fieldVideo: "Video",
    fieldPhotos: "Fotos",
    fieldLocation: "Ubicación",
    uploadAudio: "Subir audio",
    uploadVideo: "Subir video",
    record: "Grabar",
    stop: "Detener",
    uploadPhotos: "Subir fotos",
    selectLocation: "Seleccionar en el mapa",
    confirmLocation: "Confirmar Ubicación",
    selectedLocation: "Ubicación seleccionada",
    cancel: "Cancelar",
    create: "Crear Incidente",
    required: "obligatorio",
    titlePlaceholder: "Ingrese el título del incidente",
    descriptionPlaceholder: "Describe el incidente en detalle",
    high: "Alta",
    medium: "Media",
    low: "Baja",
    titleSucces: "Éxito",
    success: "Datos guardados correctamente"
  },
}

export default function IncidentsPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<"en" | "es">("en")
  const t = translations[language]
  const { toast } = useToast()

  // const incidents = getIncidentData(language)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  //Form
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState<any>(null)
  //
  const [severities, setSeverities] = useState<ISeverity[]>([])
  const [status, setStatus] = useState<IStatus[]>([])
  const [incidents, setIncidents] = useState<IIncident[]>([])

  // Audio
  const [isRecording, setIsRecording] = useState(false)
  const [audioFile, setAudioFile] = useState<IMultimedia | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<any>(null)
  const audioChunksRef = useRef<any>([])
  const audioRef = useRef<any>(null)
  const recordingIntervalRef = useRef<any>(null)
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Imágenes
  const [photos, setPhotos] = useState<IMultimedia[]>([])
  const photoInputRef = useRef<any>(null)

  // Video
  const [video, setVideo] = useState<IMultimedia|null>(null)
  const videoInputRef = useRef<any>(null)

  // Ubicación
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null)
  const [showMapModal, setShowMapModal] = useState(false)
  const center = {
    lat: -34.6037,
    lng: -58.3816
  }
  const [markerPosition, setMarkerPosition] = useState(center)
  const [map, setMap] = useState<any>(null)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  })

  const onLoad = useCallback((map:any) => {
    setMap(map)
    setGeocoder(new window.google.maps.Geocoder())
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const loadIncidents = async () => {
    try {
      const response = await getIncidentsAll()
      if (response.data) {
        setIncidents(response.data)
      }
    } catch (error) {
      console.error('Error al cargar incidents:', error)
    }
  }

  useEffect(() => {
  const loadData = async () => {
    setIsLoading(true)

    const loadSeverities = async () => {
      try {
        const response = await getSeveritiesAll()
        if (response.data) {
          setSeverities(response.data)
        }
      } catch (error) {
        console.error('Error al cargar severities:', error)
      }
    }

    const loadStatus = async () => {
      try {
        const response = await getStatusAll()
        if (response.data) {
          setStatus(response.data)
        }
      } catch (error) {
        console.error('Error al cargar severities:', error)
      }
    }

    await Promise.all([
      loadSeverities(),
      loadStatus(),
      loadIncidents()
    ])

    setIsLoading(false)
  }

  loadData()
}, [])


  useEffect(() => {
    if (!isModalOpen){
      resetForm()
    }      
  }, [isModalOpen])

  const newMultimedia = (item: IMultimedia | null, file: File, codTipoMultimedia: "COD_AUDIO" | "COD_IMAGEN" | "COD_VIDEO") => {
    let itemF: IMultimedia = item ? JSON.parse(JSON.stringify(item)) : new Multimedia()
    itemF.cod_tipo_multimedia = codTipoMultimedia
    itemF.file = file
    itemF.file_name = file.name
    itemF.url = URL.createObjectURL(file)
    return itemF
  }
// FUNCIONES DE AUDIO
 const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event:any) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const file = new File([blob], "audio", {
          type: blob.type,
          lastModified: Date.now(),
        });
        const audioF = newMultimedia(audioFile, file, "COD_AUDIO")
        setAudioFile(audioF)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error al acceder al micrófono:", error)
      alert("No se pudo acceder al micrófono. Por favor, verifica los permisos.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
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

  const deleteAudio = () => {
    setAudioFile(null)
    setIsPlayingAudio(false)
    setRecordingTime(0)
    setCurrentTime(0)
    setDuration(0)
    if (audioRef.current) {
      audioRef.current.value = ""
    }
  }

  const uploadAudioFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files    
    if (files && files.length > 0) {
      const file = files[0]
      const audioF = newMultimedia(audioFile, file, "COD_AUDIO")
      setAudioFile(audioF)
    } else {
      console.log("No se seleccionó ningún archivo")
    }
  }

   // ⏱️ Actualizar tiempo mientras reproduce
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


  // FUNCIONES DE VIDEO
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const videoF = newMultimedia(video, file, "COD_VIDEO")
      setVideo(videoF)
    } else {
      console.log("No se seleccionó ningún archivo")
    }
  }

  const removeVideo = () => {
    setVideo(null)
    if (videoInputRef.current) {
      videoInputRef.current.value = ""
    }
  }

  // FUNCIONES DE FOTOS
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      const file = files[0]
      const imagenF = newMultimedia(null, file, "COD_IMAGEN")
      const newPhotos = [...photos, ...[imagenF]]
      setPhotos(newPhotos)
    }
  }

  const removePhoto = (index:number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    setPhotos(newPhotos)
  }

  // FUNCIONES DE UBICACIÓN
  const handleMapClick = (event:any) => {
    const lat = event.latLng.lat()
    const lng = event.latLng.lng()
    setMarkerPosition({ lat, lng })
  }

  const openMapModal = () => {
    if (location) {
      setMarkerPosition(location)
    }      
    setShowMapModal(true)
  }

  const confirmLocation = () => {
    getAddressFromLatLng(markerPosition.lat, markerPosition.lng)
    setShowMapModal(false)
  }

  const getAddressFromLatLng = (lat: number, lng: number) => {
    if (!geocoder) return
    geocoder.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === "OK" && results && results[0]) {
          const addressComponents = results[0].address_components
          const getComponent = (type: string) =>
            addressComponents.find(c => c.types.includes(type))?.long_name || ""

          const data = {
            country: getComponent("country"),
            province: getComponent("administrative_area_level_1"),
            city: getComponent("locality"),
            address: results[0].formatted_address,
            lat: lat,
            lng: lng
          }
          setLocation(data)
        }
      }
    )
  }

  const handleCreateIncident = async () => {    
    if (!title.trim()) {
      alert(language === "en" ? "Title is required" : "El título es obligatorio")
      return
    }

    if (!description.trim()) {      
      toast({ title: "Error", description: `Error: ${language === "en" ? "Description is required" : "La descripción es obligatoria"}`, variant: "destructive", })
      return
    }

    if (!date.trim()) {
      toast({ title: "Error", description: `Error: ${language === "en" ? "Date is required" : "Seleccione una fecha"}`, variant: "destructive", })
      return
    }

    if (!time.trim()) {
      toast({ title: "Error", description: `Error: ${language === "en" ? "Time is required" : "Seleccione una hora"}`, variant: "destructive", })
      return
    }

    if (!audioFile) {
      toast({ title: "Error", description: `Error: ${language === "en" ? "Audio file is required" : "Debe ingresar un archivo de audio"}`, variant: "destructive", })
      return
    }

    if (!location) {
      toast({ title: "Error", description: `Error: ${language === "en" ? "Select a location" : "Debe seleccionar una ubicación"}`, variant: "destructive", })
      return
    }

    setIsLoading(true)
    let multimedias: IMultimedia[] = []

    multimedias = [...multimedias, ...[audioFile]]
    if (video) {
      multimedias = [...multimedias, ...[video]]
    }      
    multimedias = [...multimedias, ...photos]    

    const incident: IIncident = {
      id: "",
      title: title,
      description: description,
      date: date,
      time: time,
      multimedias: multimedias,
      location: location,
      //Test fields
      // severity: severities[2],
      // status: status[0],
      reported_by: {
        id: "asd6664-sdasd-asd-asdsa-d",
        name: "John Smith"
      },
      // team: language === "en" ? "Maintenance Team" : "Equipo de Mantenimiento",
      // timeline: [
      //   {
      //     time: "09:00",
      //     action: language === "en" ? "Incident reported" : "Incidente reportado",
      //     status: "completed",
      //   },
      //   {
      //     time: "09:15",
      //     action: language === "en" ? "Maintenance team notified" : "Equipo de mantenimiento notificado",
      //     status: "completed",
      //   },
      //   {
      //     time: "09:30",
      //     action: language === "en" ? "Inspection in progress" : "Inspección en progreso",
      //     status: "in-progress",
      //   },
      //   {
      //     time: "10:00",
      //     action: language === "en" ? "Repair scheduled" : "Reparación programada",
      //     status: "pending",
      //   },
      // ],
      // keyEvents: [
      //   {
      //     time: "08:45",
      //     description:
      //       language === "en"
      //         ? "Worker detects moisture on warehouse floor"
      //         : "Trabajador detecta humedad en el piso del almacén",
      //   },
      //   {
      //     time: "08:50",
      //     description:
      //       language === "en"
      //         ? "Leak source identified in main pipe"
      //         : "Se identifica la fuente de la fuga en tubería principal",
      //   },
      //   {
      //     time: "09:00",
      //     description: language === "en" ? "Incident reported to supervisor" : "Se reporta el incidente al supervisor",
      //   },
      //   {
      //     time: "09:15",
      //     description: language === "en" ? "Maintenance team dispatched" : "Equipo de mantenimiento es despachado",
      //   },
      // ],
      // causeTree: {
      //   observedFacts:
      //     language === "en"
      //       ? ["Visible leak in water pipe", "Water accumulation in sector B", "Visible corrosion at connection joint"]
      //       : [
      //           "Fuga visible en tubería de agua",
      //           "Acumulación de agua en sector B",
      //           "Corrosión visible en la junta de conexión",
      //         ],
      //   immediateFactors:
      //     language === "en"
      //       ? ["Material wear due to age", "Excessive pipe pressure", "Lack of recent preventive maintenance"]
      //       : [
      //           "Desgaste de material por antigüedad",
      //           "Presión excesiva en tubería",
      //           "Falta de mantenimiento preventivo reciente",
      //         ],
      //   underlyingCauses:
      //     language === "en"
      //       ? [
      //           "Pipe system over 15 years old without renewal",
      //           "No regular inspection program",
      //           "Lack of budget for preventive maintenance",
      //         ]
      //       : [
      //           "Sistema de tuberías con más de 15 años sin renovación",
      //           "No hay programa de inspección regular",
      //           "Falta de presupuesto para mantenimiento preventivo",
      //         ],
      // },
      // aiAnalysis: {
      //   summary:
      //     language === "en"
      //       ? "Water leak detected in warehouse main pipe. Risk level: Medium. Immediate action recommended to avoid material damage."
      //       : "Fuga de agua detectada en tubería principal del almacén. Nivel de riesgo: Medio. Se recomienda acción inmediata para evitar daños materiales.",
      //   inconsistencies:
      //     language === "en" ? "No inconsistencies detected in report" : "Ninguna inconsistencia detectada en el reporte",
      //   recommendations: [
      //     language === "en"
      //       ? "Conduct comprehensive safety audit of the affected area within 48 hours"
      //       : "Realizar auditoría integral de seguridad del área afectada dentro de 48 horas",
      //     language === "en"
      //       ? "Implement refresher training program for all personnel involved in similar operations"
      //       : "Implementar programa de capacitación de actualización para todo el personal involucrado en operaciones similares",
      //     language === "en"
      //       ? "Schedule monthly safety reviews for the next quarter to monitor improvements"
      //       : "Programar revisiones mensuales de seguridad para el próximo trimestre para monitorear mejoras",
      //   ],
      // },
      // similarCases: [
      //   {
      //     id: "245",
      //     description:
      //       language === "en" ? "Equipment failure in production area" : "Falla de equipo en área de producción",
      //     similarity: "87%",
      //     resolutionTime: "4",
      //     status: language === "en" ? "Resolved" : "Resuelto",
      //   },
      //   {
      //     id: "198",
      //     description: language === "en" ? "Safety protocol violation" : "Violación de protocolo de seguridad",
      //     similarity: "72%",
      //     resolutionTime: "6",
      //     status: language === "en" ? "Resolved" : "Resuelto",
      //   },
      //   {
      //     id: "156",
      //     description:
      //       language === "en"
      //         ? "Communication breakdown during shift change"
      //         : "Falla de comunicación durante cambio de turno",
      //     similarity: "68%",
      //     resolutionTime: "5",
      //     status: language === "en" ? "Resolved" : "Resuelto",
      //   },
      // ],
      // actionsTaken: [
      //   {
      //     action: language === "en" ? "Immediate Area Isolation" : "Aislamiento Inmediato del Área",
      //     effectivenessRate: "94%",
      //   },
      //   {
      //     action: language === "en" ? "Team Debriefing Session" : "Sesión de Análisis en Equipo",
      //     effectivenessRate: "89%",
      //   },
      //   {
      //     action: language === "en" ? "Full Equipment Inspection" : "Inspección Completa de Equipos",
      //     effectivenessRate: "92%",
      //   },
      //   {
      //     action:
      //       language === "en" ? "Procedure Documentation Update" : "Actualización de Documentación de Procedimientos",
      //     effectivenessRate: "87%",
      //   },
      // ],
      // involvedPeople: [
      //   {
      //     name: "Juan Pérez",
      //     position: language === "en" ? "Warehouse Supervisor" : "Supervisor de Almacén",
      //   },
      //   {
      //     name: "María González",
      //     position: language === "en" ? "Safety Officer" : "Oficial de Seguridad",
      //   },
      //   {
      //     name: "Carlos Rodríguez",
      //     position: language === "en" ? "Maintenance Technician" : "Técnico de Mantenimiento",
      //   },
      // ],
      // people: [
      //   {
      //     firstName: "Juan",
      //     lastName: "Pérez",
      //     role: language === "en" ? "Warehouse Supervisor" : "Supervisor de Almacén",
      //   },
      //   { firstName: "María", lastName: "González", role: language === "en" ? "Safety Officer" : "Oficial de Seguridad" },
      //   {
      //     firstName: "Carlos",
      //     lastName: "Rodríguez",
      //     role: language === "en" ? "Maintenance Technician" : "Técnico de Mantenimiento",
      //   },
      // ],
    }

    const response = await createIncident(incident)

    if (response.data) {
      toast({ title: t.titleSucces, description: t.success, variant: "default"})
      resetForm()
      loadIncidents()
      setIsModalOpen(false)
      setIsLoading(false)
    } else {
      toast({ title: "Error", description: `Error: ${response.error}`, variant: "destructive", })
      setIsLoading(false)
    }   
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDate("")
    setTime("")
    deleteAudio()
    removeVideo()
    setPhotos([])
    setLocation(null)
    setMarkerPosition(center)
  }

  const handleViewIncident = (id: string) => {
    router.push(`/incidents/${id}?lang=${language}`)
  }

  const handleSendNotification = (id: string) => {
    alert(
      language === "en" ? `Sending notification for incident #${id}` : `Enviando notificación para incidente #${id}`,
    )
  }

  const getSeverityVariant = (severity: string): "destructive" | "default" | "secondary" => {
    if (severity === "high") return "destructive"
    if (severity === "medium") return "default"
    return "secondary"
  }

  const getSeverityLabel = (severity: string) => {
    if (severity === "high") return t.high
    if (severity === "medium") return t.medium
    return t.low
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">    
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-150">
          <Spinner className="w-12 h-12" />
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{t.title}</h1>
            <p className="text-slate-600">{t.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage("en")}
              className={`text-2xl transition-opacity cursor-pointer ${language === "en" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
              title="English"
            >
              🇺🇸
            </button>
            <button
              onClick={() => setLanguage("es")}
              className={`text-2xl transition-opacity cursor-pointer ${language === "es" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
              title="Español"
            >
              🇪🇸
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-100 to-indigo-100">
                <TableHead className="font-semibold text-slate-900 w-24">{t.tableId}</TableHead>
                <TableHead className="font-semibold text-slate-900">{t.tableTitle}</TableHead>
                <TableHead className="font-semibold text-slate-900 w-32">{t.tableSeverity}</TableHead>
                <TableHead className="font-semibold text-slate-900 w-32 text-right">{t.tableAction}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow
                  key={incident.id}
                  className="hover:bg-slate-50 cursor-pointer"
                  onClick={() => handleViewIncident(incident.id)}
                >
                  <TableCell className="font-medium text-slate-900 py-4">#{incident.id}</TableCell>
                  <TableCell className="text-slate-700 py-4">{incident.title}</TableCell>
                  <TableCell className="py-4">
                    <Badge variant={getSeverityVariant(incident.severity || "medium")}>{getSeverityLabel(incident.severity || "medium")}</Badge>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSendNotification(incident.id)
                        }}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {incidents.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-sm text-gray-400"
                    >
                      No se encontraron resultados
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 w-full md:w-auto">
              <Plus className="h-5 w-5" />
              {t.buttonNew}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.modalTitle}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  {t.fieldTitle} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder={t.titlePlaceholder}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  {t.fieldDescription} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder={t.descriptionPlaceholder}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium">
                    {t.fieldDate} <span className="text-red-500">*</span>
                  </Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium">
                    {t.fieldTime} <span className="text-red-500">*</span>
                  </Label>
                  <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required/>
                </div>
              </div>

              {/* Audio */}
              <div>
                <Label>Audio <span className="text-red-500">*</span></Label>
                <div className="mt-2 space-y-3">
                  <div className="flex gap-2">
                    {!audioFile && !isRecording && (
                      <>
                        <Button type="button" onClick={startRecording} className="flex-1" variant="outline">
                          <Mic className="h-4 w-4 mr-2" />
                          {t.record}
                        </Button>
                        <Button
                          type="button"
                          onClick={() => document.getElementById("audio-upload")?.click()}
                          className="flex-1"
                          variant="outline"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {t.uploadAudio}
                        </Button>
                        <input
                          id="audio-upload"
                          type="file"
                          accept="audio/*"
                          onChange={uploadAudioFile}
                          className="hidden"
                        />
                      </>
                    )}
                    {isRecording && (
                      <Button type="button" onClick={stopRecording} className="flex-1 bg-red-600 hover:bg-red-700">
                        <Square className="h-4 w-4 mr-2" />
                        Detener ({formatTime(recordingTime)})
                      </Button>
                    )}
                  </div>

                  {audioFile && (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Audio grabado</span>
                        <Button type="button" size="icon" variant="ghost" onClick={deleteAudio}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
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
                          src={audioFile.url}
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
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Video */}
              {/* <div>
                <Label>Video</Label>
                <div className="mt-2">
                  {!video && (
                    <Button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="w-full"
                      variant="outline"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      {t.uploadVideo}
                    </Button>
                  )}
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />

                  {video && (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{video.fileName}</span>
                        <Button type="button" size="icon" variant="ghost" onClick={removeVideo}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <video src={video.url} controls className="w-full rounded-lg max-h-64" />
                    </div>
                  )}
                </div>
              </div> */}

              {/* Fotos */}
              <div>
                <Label>Fotos</Label>
                <div className="mt-2">
                  <Button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="w-full"
                    variant="outline"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {t.uploadPhotos} ({photos.length})
                  </Button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  {photos.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {photos.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img src={preview.url} alt={`Foto ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                          <Button
                            type="button"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 bg-red-600 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Ubicación */}
              <div>
                <Label>{t.fieldLocation}</Label>
                <div className="mt-2 space-y-2">
                  <Button type="button" onClick={openMapModal} className="gap-2 w-full bg-transparent" variant="outline">
                    <MapPin className="h-4 w-4" />
                    {t.selectLocation}
                  </Button>

                  {location && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        <strong>{t.selectedLocation}:</strong>
                        <br />
                        Lat: {location.lat.toFixed(6)}° | Lng: {location.lng.toFixed(6)}°
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" disabled={isLoading} onClick={() => setIsModalOpen(false)} className="flex-1">
                  {t.cancel}
                </Button>
                <Button type="button" disabled={isLoading} onClick={handleCreateIncident} className="flex-1">
                  {t.create}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Mapa */}

        <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
          <DialogContent className="min-w-[70vw] sm:min-w-[70vw] lg:w-[70vw] max-w-[90vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.selectLocation}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 p-4">
              <div className="w-full h-96 bg-slate-100 rounded-lg overflow-hidden mb-4">
                {isLoaded && (
                  <GoogleMap
                    mapContainerStyle={{width: '100%',height: '100%'}}
                    center={markerPosition}
                    zoom={10}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onClick={handleMapClick}
                    options={{
                      streetViewControl: false,
                      mapTypeControl: true,
                    }}
                  >
                    <Marker
                      position={markerPosition}
                      draggable={true}
                      onDragEnd={handleMapClick}
                      animation={window.google?.maps?.Animation?.DROP}
                    />
                  </GoogleMap>
                )}
              </div>
              <div className="text-sm text-slate-600 mb-4">
                <p>
                  <strong>{t.selectedLocation}:</strong>
                </p>
                <p>Lat: {markerPosition?.lat.toFixed(6)}°</p>
                <p>Lng: {markerPosition?.lng.toFixed(6)}°</p>
              </div>
            </div>

            <div className="p-4 border-t flex gap-2">
              <Button variant="outline" disabled={isLoading} onClick={() => setShowMapModal(false)} className="flex-1">
                {t.cancel}
              </Button>
              <Button onClick={confirmLocation} disabled={isLoading} className="flex-1">
                {t.confirmLocation}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

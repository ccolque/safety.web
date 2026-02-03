"use client"

import type React from "react"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { RefreshCcw, Plus, Upload, Mic, MapPin, X, Pause, Play, Square, Video, Camera } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { getSeveritiesAll } from "@/services/severity-service"
import { ISeverity } from "@/models/severity"
import { IIncident } from "@/models/incidents"
import { createIncident, getIncidentByIdApi, getIncidentStatusApi, getIncidentsAll, reprocessIncident } from "@/services/incident-service"
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import { IMultimedia, Multimedia } from "@/models/multimedia"
import { useToast } from "@/hooks/use-toast"
import { getStatusAll } from "@/services/status-service"
import { IStatus } from "@/models/status"
import { Language, LANGUAGES } from "@/lib/constants"

const translations = {
  en: {
    title: "Incidents",
    subtitle: "Incident management and tracking system",
    tableId: "ID",
    tableTitle: "Title",
    location: "Location",
    tableSeverity: "Severity",
    tableAction: "Action",
    buttonView: "View",
    buttonNew: "New Incident",
    buttonNewShort: "New",
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
    success: "Data saved successfully",
    severityHigh: "High",
    severityMedium: "Medium",
    severityLow: "Low",
    paginationPrevious: "Previous",
    paginationNext: "Next",
    currentLocationTaken: "Current location used",
    fieldReportedBy: "Reported by",
    reporterPlaceholder: "Enter reporter name",
    reporterRequired: "Reporter name is required",
    reprocess: "Reprocess AI",
    reprocessing: "Reprocessing…",
    reprocessStarted: "Reprocess started",
    reprocessCompleted: "AI analysis updated",
    reprocessFailed: "Reprocess failed",
  },
  es: {
    title: "Incidentes",
    subtitle: "Sistema de gestión y seguimiento de incidentes",
    tableId: "ID",
    tableTitle: "Título",
    location: "Ubicación",
    tableSeverity: "Gravedad",
    tableAction: "Acción",
    buttonView: "Ver",
    buttonNew: "Nuevo Incidente",
    buttonNewShort: "Nuevo",
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
    success: "Datos guardados correctamente",
    severityHigh: "Alta",
    severityMedium: "Media",
    severityLow: "Baja",
    paginationPrevious: "Anterior",
    paginationNext: "Siguiente",
    currentLocationTaken: "Ubicación actual tomada",
    fieldReportedBy: "Reportado por",
    reporterPlaceholder: "Ingrese el nombre de quien reporta",
    reporterRequired: "El nombre de quien reporta es obligatorio",
    reprocess: "Reprocesar IA",
    reprocessing: "Reprocesando…",
    reprocessStarted: "Reproceso iniciado",
    reprocessCompleted: "Análisis de IA actualizado",
    reprocessFailed: "Falló el reproceso",
  },
  fr: {
    title: "Incidents",
    subtitle: "Système de gestion et de suivi des incidents",
    tableId: "ID",
    tableTitle: "Titre",
    location: "Localisation",
    tableSeverity: "Gravité",
    tableAction: "Action",
    buttonView: "Voir",
    buttonNew: "Nouvel Incident",
    buttonNewShort: "Nouveau",
    modalTitle: "Créer un Nouvel Incident",
    fieldTitle: "Titre",
    fieldDescription: "Description",
    fieldDate: "Date",
    fieldTime: "Heure",
    fieldAudio: "Audio",
    fieldVideo: "Vidéo",
    fieldPhotos: "Photos",
    fieldLocation: "Localisation",
    uploadAudio: "Télécharger l'audio",
    uploadVideo: "Télécharger la vidéo",
    record: "Enregistrer",
    stop: "Arrêter",
    uploadPhotos: "Télécharger les photos",
    selectLocation: "Sélectionner sur la carte",
    confirmLocation: "Confirmer la Localisation",
    selectedLocation: "Localisation Sélectionnée",
    cancel: "Annuler",
    create: "Créer Incident",
    required: "obligatoire",
    titlePlaceholder: "Entrez le titre de l'incident",
    descriptionPlaceholder: "Décrivez l'incident en détail",
    high: "Élevée",
    medium: "Moyen",
    low: "Faible",
    titleSucces: "Succès",
    success: "Données enregistrées avec succès",
    severityHigh: "Élevée",
    severityMedium: "Moyen",
    severityLow: "Faible",
    paginationPrevious: "Précédent",
    paginationNext: "Suivant",
    currentLocationTaken: "Localisation actuelle utilisée",
    fieldReportedBy: "Signalé par",
    reporterPlaceholder: "Entrez le nom du déclarant",
    reporterRequired: "Le nom du déclarant est obligatoire",
    reprocess: "Relancer l'IA",
    reprocessing: "Relance…",
    reprocessStarted: "Relance démarrée",
    reprocessCompleted: "Analyse IA mise à jour",
    reprocessFailed: "Échec de la relance",
  },
}

export default function IncidentsPage() {
  const router = useRouter()
  const urlSearchParams = useSearchParams();
  const [language, setLanguage] = useState<Language>("en")
  const t = translations[language]
  const { toast } = useToast()

  const REPROCESS_STORAGE_KEY = "horus.reprocess.activeById"
  type ReprocessStorage = Record<string, number>

  const readReprocessStorage = (): ReprocessStorage => {
    if (typeof window === "undefined") return {}
    try {
      const raw = window.localStorage.getItem(REPROCESS_STORAGE_KEY)
      const parsed = raw ? (JSON.parse(raw) as unknown) : {}
      if (!parsed || typeof parsed !== "object") return {}
      return parsed as ReprocessStorage
    } catch {
      return {}
    }
  }

  const writeReprocessStorage = (next: ReprocessStorage) => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(REPROCESS_STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore storage errors (private mode, quota, etc.)
    }
  }

  const markReprocessActive = (id: string, startedAt = Date.now()) => {
    const store = readReprocessStorage()
    store[id] = startedAt
    writeReprocessStorage(store)
  }

  const unmarkReprocessActive = (id: string) => {
    const store = readReprocessStorage()
    if (id in store) {
      delete store[id]
      writeReprocessStorage(store)
    }
  }

  // const incidents = getIncidentData(language)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  //Form
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [reportedByName, setReportedByName] = useState("")
  const [location, setLocation] = useState<any>(null)
  const [locationSource, setLocationSource] = useState<"current" | "selected" | null>(null)
  const [mapZoom, setMapZoom] = useState(15)
  //
  const [severities, setSeverities] = useState<ISeverity[]>([])
  const [status, setStatus] = useState<IStatus[]>([])
  const [incidents, setIncidents] = useState<IIncident[]>([])
  const [reprocessLoadingById, setReprocessLoadingById] = useState<Record<string, boolean>>({})
  const [reprocessStartedAtById, setReprocessStartedAtById] = useState<Record<string, number>>({})
  const isMountedRef = useRef(true)
  const sseByIncidentIdRef = useRef<Record<string, EventSource>>({})
  const watchingReprocessByIdRef = useRef<Record<string, boolean>>({})
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const itemsPerPage = 5

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

  useEffect(() => {
    const lang = urlSearchParams.get("lang")
    if (LANGUAGES.includes(lang as Language)) {
      setLanguage(lang as Language);
    }
  }, [router, urlSearchParams]);

  const loadIncidents = async (page: number = 1) => {
    try {
      const skip = (page - 1) * itemsPerPage
      // Fetch one extra item to reliably determine if there's a next page.
      const response = await getIncidentsAll(skip, itemsPerPage + 1)
      if (response.data) {
        setHasNextPage(response.data.length > itemsPerPage)
        setIncidents(response.data.slice(0, itemsPerPage))
        setCurrentPage(page)
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
    // In dev (React StrictMode), effects mount/unmount twice.
    // Ensure we reset the flag on mount so state updates (e.g. clearing loaders)
    // are not accidentally skipped.
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
      Object.values(sseByIncidentIdRef.current).forEach((es) => {
        try { es.close() } catch { /* noop */ }
      })
      sseByIncidentIdRef.current = {}
    }
  }, [])

  const clearReprocessUiState = (id: string) => {
    setReprocessLoadingById((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setReprocessStartedAtById((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    unmarkReprocessActive(id)
    delete watchingReprocessByIdRef.current[id]
  }

  const watchReprocessUntilDone = async (
    id: string,
    opts?: {
      showProgressToasts?: boolean
      showCompletionToast?: boolean
      preferSSE?: boolean
      sseGraceMs?: number
    }
  ) => {
    const showProgressToasts = opts?.showProgressToasts ?? true
    const showCompletionToast = opts?.showCompletionToast ?? true
    const preferSSE = opts?.preferSSE ?? true
    const sseGraceMs = opts?.sseGraceMs ?? 25_000

    if (watchingReprocessByIdRef.current[id]) return
    watchingReprocessByIdRef.current[id] = true

    setReprocessLoadingById((prev) => ({ ...prev, [id]: true }))
    markReprocessActive(id)

    try {
      // 1) Chequeo rápido: si ya terminó (p.ej. el usuario navegó y volvió),
      // limpiamos el loading inmediatamente sin depender del SSE.
      const initial = await getIncidentStatusApi(id)
      if (initial.data?.status === "analysis_failed") {
        if (showCompletionToast) {
          toast({
            title: t.reprocessFailed,
            description: initial.data?.status_message,
            variant: "destructive",
          })
        }
        // Intentamos refrescar el incidente para que el status visible deje de ser "reprocessing".
        const updated = await getIncidentByIdApi(id)
        if (updated.data) updateIncidentInList(updated.data)
        else await loadIncidents(currentPage)
        clearReprocessUiState(id)
        return
      }
      if (initial.data?.status === "analysis_completed") {
        const updated = await getIncidentByIdApi(id)
        if (updated.data) updateIncidentInList(updated.data)
        else await loadIncidents(currentPage)
        if (showCompletionToast) toast({ title: t.reprocessCompleted })
        clearReprocessUiState(id)
        return
      }

      // 2) Preferimos SSE, pero con "grace timeout" para no quedar colgados
      // si el EventSource no recibe eventos (o se corta al navegar).
      if (preferSSE) {
        try {
          await Promise.race([
            waitForReprocessDoneSSE(id),
            sleep(sseGraceMs).then(() => {
              throw new Error("SSE grace exceeded")
            }),
          ])

          const updated = await getIncidentByIdApi(id)
          if (updated.data) updateIncidentInList(updated.data)
          else await loadIncidents(currentPage)
          if (showCompletionToast) toast({ title: t.reprocessCompleted })
          clearReprocessUiState(id)
          return
        } catch {
          // fallback a polling liviano
        }
      }

      const pollIntervalMs = 2500
      const maxTotalMs = 10 * 60 * 1000
      const startedAt = Date.now()
      let lastStep: string | undefined
      let transientErrors = 0

      while (isMountedRef.current && Date.now() - startedAt < maxTotalMs) {
        await sleep(pollIntervalMs)
        if (!isMountedRef.current) return

        const st = await getIncidentStatusApi(id)
        if (st.error) {
          transientErrors++
          if (transientErrors >= 6) return
          continue
        }
        transientErrors = 0

        const status = st.data?.status
        const step = st.data?.status_step
        const message = st.data?.status_message

        if (showProgressToasts && step && step !== lastStep) {
          lastStep = step
          if (message) toast({ title: t.reprocessing, description: message })
        }

        if (status === "analysis_failed") {
          if (showCompletionToast) {
            toast({ title: t.reprocessFailed, description: message, variant: "destructive" })
          }
          const updated = await getIncidentByIdApi(id)
          if (updated.data) updateIncidentInList(updated.data)
          else await loadIncidents(currentPage)
          clearReprocessUiState(id)
          return
        }

        if (status === "analysis_completed") {
          const updated = await getIncidentByIdApi(id)
          if (updated.data) updateIncidentInList(updated.data)
          else await loadIncidents(currentPage)
          if (showCompletionToast) toast({ title: t.reprocessCompleted })
          clearReprocessUiState(id)
          return
        }
      }

      // Si se sigue procesando, dejamos el estado activo para reintentar al volver/focus.
    } finally {
      delete watchingReprocessByIdRef.current[id]
    }
  }

  const resumeReprocessWatchers = () => {
    const stored = readReprocessStorage()
    const idsFromStorage = Object.keys(stored)
    const idsFromList = incidents
      .filter((it) => isReprocessInProgressStatus(getIncidentStatus(it)))
      .map((it) => it.id)
    const ids = Array.from(new Set([...idsFromStorage, ...idsFromList]))

    if (ids.length === 0) return

    setReprocessStartedAtById((prev) => {
      const next = { ...prev }
      for (const id of ids) {
        next[id] = stored[id] ?? next[id] ?? Date.now()
      }
      return next
    })
    setReprocessLoadingById((prev) => {
      const next = { ...prev }
      for (const id of ids) next[id] = true
      return next
    })

    for (const id of ids) {
      // Al reanudar, evitamos spamear toasts de progreso.
      void watchReprocessUntilDone(id, {
        showProgressToasts: false,
        showCompletionToast: true,
        preferSSE: false,
      })
    }
  }

  useEffect(() => {
    // Reengancha watchers cuando hay incidents en pantalla.
    resumeReprocessWatchers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incidents.length])

  useEffect(() => {
    const onFocus = () => resumeReprocessWatchers()
    const onVisibility = () => {
      if (document.visibilityState === "visible") resumeReprocessWatchers()
    }
    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      window.removeEventListener("focus", onFocus)
      document.removeEventListener("visibilitychange", onVisibility)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incidents.length])

  const getIncidentStatus = (incident: IIncident): string | undefined => {
    return (incident as any)?.detail?.status ?? (incident as any)?.status
  }

  const getIncidentAIAnalysis = (incident: IIncident): any => {
    return (incident as any)?.ai_analysis ?? (incident as any)?.detail?.ai_analysis
  }


  const getTodayDate = (): string => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getCurrentTime = (): string => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const getCurrentLocation = (): Promise<void> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.error("Geolocation no soportada")
        resolve()
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setMarkerPosition({ lat: latitude, lng: longitude })
          
          const waitForGeocoder = setInterval(() => {
            if (geocoder) {
              clearInterval(waitForGeocoder)
              geocoder.geocode(
                { location: { lat: latitude, lng: longitude } },
                (results, status) => {
                  if (status === "OK" && results && results[0]) {
                    const addressComponents = results[0].address_components
                    const getComponent = (type: string) =>
                      addressComponents.find(c => c.types.includes(type))?.long_name || ""

                    const data = {
                      country: getComponent("country"),
                      city: getComponent("locality"),
                      address: results[0].formatted_address,
                      lat: latitude,
                      lng: longitude
                    }
                    setLocation(data)
                    setLocationSource("current")
                  }
                  resolve()
                }
              )
            }
          }, 100)

          setTimeout(() => {
            clearInterval(waitForGeocoder)
            resolve()
          }, 5000)
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error)
          resolve()
        }
      )
    })
  }

  useEffect(() => {
    if (isModalOpen){
      setLocationSource(null)
      setDate(getTodayDate())
      setTime(getCurrentTime())
      getCurrentLocation()
    } else {
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
    if (location?.lat != null && location?.lng != null) {
      setMarkerPosition({ lat: location.lat, lng: location.lng })
      setMapZoom(16)
    } else {
      setMapZoom(15)
    }
    setShowMapModal(true)
  }

  const confirmLocation = () => {
    getAddressFromLatLng(markerPosition.lat, markerPosition.lng)
    setLocationSource("selected")
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

    if (!reportedByName.trim()) {
      toast({ title: "Error", description: `Error: ${t.reporterRequired}`, variant: "destructive", })
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
    multimedias = [...multimedias, ...photos]

    // Preparar multimedias manteniendo el archivo pero sin otros campos auxiliares
    const processedMultimedias = multimedias.map(m => {
      const processed: any = {
        id: "",
        cod_tipo_multimedia: m.cod_tipo_multimedia,
        file_name: m.file_name,
        url: "",
        file: m.file // Mantener el archivo para que se suba en FormData
      }
      return processed
    })

    const reporterId = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `rep-${Date.now()}-${Math.random().toString(16).slice(2)}`

    const incident: IIncident = {
      id: "",
      title: title,
      description: description,
      date: date,
      time: time,
      multimedias: processedMultimedias as any,
      location: location,
      //Test fields
      // severity: severities[2],
      // status: status[0],
      reported_by: {
        id: reporterId,
        name: reportedByName.trim(),
      },
    }

    const response = await createIncident(incident)

    if (response.data) {
      toast({ title: t.titleSucces, description: t.success, variant: "default"})
      resetForm()
      loadIncidents(1)
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
    setReportedByName("")
    deleteAudio()
    setPhotos([])
    setLocation(null)
    setLocationSource(null)
    setMarkerPosition(center)
    setMapZoom(15)
  }

  const handleViewIncident = (id: string) => {
    router.push(`/incidents/${id}?lang=${language}`)
  }

  const isReprocessInProgressStatus = (st?: string) => {
    if (!st) return false
    return (
      st === "pending_analysis" ||
      st === "reprocessing" ||
      st === "uploading_files" ||
      st === "transcribing_audio" ||
      st === "analyzing_ai" ||
      st === "analyzing_images"
    )
  }

  const isIncidentDisabled = (incident: IIncident) => {
    const st = getIncidentStatus(incident)
    return !!reprocessLoadingById[incident.id] || isReprocessInProgressStatus(st)
  }

  const tryViewIncident = (incident: IIncident) => {
    if (isIncidentDisabled(incident)) {
      const msg =
        language === "en"
          ? "This incident is being reprocessed"
          : language === "fr"
            ? "Cet incident est en cours de relance"
            : "Este incidente se está reprocesando"
      toast({ title: t.reprocessing, description: msg })
      return
    }
    handleViewIncident(incident.id)
  }

  const updateIncidentInList = (updated: IIncident) => {
    setIncidents((prev) => prev.map((it) => (it.id === updated.id ? updated : it)))
  }

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const getApiBaseUrl = () => {
    const raw = process.env.NEXT_PUBLIC_API_BASE_URL || ""
    return raw.replace(/\/+$/, "")
  }

  const buildReprocessEventsUrl = (incidentId: string) => {
    const base = getApiBaseUrl()
    const path = `/incidents/reprocess/events/${encodeURIComponent(incidentId)}`
    return base ? `${base}${path}` : path
  }

  const waitForReprocessDoneSSE = (incidentId: string, timeoutMs = 10 * 60 * 1000) => {
    return new Promise<void>((resolve, reject) => {
      const existing = sseByIncidentIdRef.current[incidentId]
      if (existing) {
        try { existing.close() } catch { /* noop */ }
        delete sseByIncidentIdRef.current[incidentId]
      }

      const url = buildReprocessEventsUrl(incidentId)
      const es = new EventSource(url)
      sseByIncidentIdRef.current[incidentId] = es

      const timeoutId = window.setTimeout(() => {
        try { es.close() } catch { /* noop */ }
        delete sseByIncidentIdRef.current[incidentId]
        reject(new Error("SSE timeout"))
      }, timeoutMs)

      const cleanup = () => {
        window.clearTimeout(timeoutId)
        try { es.close() } catch { /* noop */ }
        delete sseByIncidentIdRef.current[incidentId]
      }

      es.addEventListener("reprocess_done", (_event) => {
        cleanup()
        resolve()
      })

      es.onerror = () => {
        cleanup()
        reject(new Error("SSE error"))
      }
    })
  }

  const handleReprocessIncident = async (id: string) => {
    if (reprocessLoadingById[id]) return

    setReprocessLoadingById((prev) => ({ ...prev, [id]: true }))
    try {
      // Orden requerido: primero POST /reprocess, luego polling al /status.
      const response = await reprocessIncident(id)
      if (response.error) {
        toast({ title: "Error", description: response.error, variant: "destructive" })
        clearReprocessUiState(id)
        return
      }
      const startedAt = Date.now()
      setReprocessStartedAtById((prev) => ({ ...prev, [id]: startedAt }))
      markReprocessActive(id, startedAt)
      toast({ title: t.reprocessStarted, description: t.reprocessing })

      // Escuchamos completion (SSE con fallback polling). Si el usuario navega y vuelve,
      // se reanuda desde localStorage.
      await watchReprocessUntilDone(id, {
        showProgressToasts: true,
        showCompletionToast: true,
        preferSSE: true,
      })
    } catch (error) {
      console.error("Error reprocesando incidente:", error)
      toast({ title: t.reprocessFailed, description: "Error inesperado", variant: "destructive" })
      clearReprocessUiState(id)
    }
  }

  const getSeverityVariant = (severity: string): "success" | "destructive" | "default" | "secondary" => {
    if (severity === "3") return "destructive"
    if (severity === "2" || severity === "medium") return "default"
    if (severity === "1" || severity === "low") return "success"
    return "secondary"
  }

  const getSeverityLabel = (severity: string) => {
    if (severity === "3" || severity === "high") return t.severityHigh
    if (severity === "2" || severity === "medium") return t.severityMedium
    if (severity === "1" || severity === "low") return t.severityLow
    return t.severityMedium
  }

  const getAIAnalysisSeverity = (incident: IIncident): string => {
    const aiAnalysis = getIncidentAIAnalysis(incident)
    if (!aiAnalysis) return "medium"
    const analysisKey = `ai_analysis_${language}` as keyof typeof aiAnalysis
    const analysis = (aiAnalysis as any)?.[analysisKey]
    return analysis?.aiHeader?.severity || "medium"
  }

  const sortedIncidents = useMemo(() => {
    const getTs = (incident: IIncident) => {
      const d = (incident as any)?.date as string | undefined
      const t = ((incident as any)?.time as string | undefined) || "00:00"
      if (!d) return 0
      const parsed = new Date(`${d}T${t}:00`)
      const ms = parsed.getTime()
      return Number.isFinite(ms) ? ms : 0
    }

    return [...incidents].sort((a, b) => getTs(b) - getTs(a))
  }, [incidents])

  return (
    <div 
      className="relative min-h-screen bg-cover bg-center bg-fixed p-4 md:p-8 overflow-x-hidden"
      style={{ backgroundImage: 'url(/Bg_1.png)' }}
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
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto">
        <div className="mb-6 md:mb-8 mt-6 md:mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3 md:items-center md:gap-4 min-w-0">
            <img 
              src="/IncidentesLogo.png" 
              alt="Incidentes Logo" 
              className="h-12 w-auto md:h-16 lg:h-20 shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2 break-words">
                {t.title}
              </h1>
              <p className="text-gray-100 text-sm md:text-base break-words">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 md:gap-6 flex-wrap">
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
              className="h-5 w-5 md:h-6 md:w-6 shrink-0"
            />
            <img 
              src="/Tick.png" 
              alt="Dropdown" 
              className="h-8 w-16 md:h-10 md:w-24 pointer-events-none md:-mr-30 md:mb-5 shrink-0"
            />
          </div>
        </div>

        {/* Mobile: cards */}
        <div className="md:hidden space-y-3 mb-6">
          {sortedIncidents.map((incident) => {
            const computedTitle = (() => {
              const aiAnalysis = getIncidentAIAnalysis(incident)
              if (aiAnalysis) {
                const analysisKey = `ai_analysis_${language}`;
                const analysis = (aiAnalysis as any)?.[analysisKey];
                if (analysis?.aiHeader?.title) return analysis.aiHeader.title;
              }
              return incident.title;
            })();

            const sev = getAIAnalysisSeverity(incident)
            const disabled = isIncidentDisabled(incident)

            return (
              <div
                key={incident.id}
                className={
                  "bg-white/95 backdrop-blur rounded-xl shadow-sm border border-white/20 p-4 " +
                  (disabled ? "opacity-60 cursor-not-allowed" : "")
                }
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-disabled={disabled}
                onClick={() => tryViewIncident(incident)}
                onKeyDown={(e) => {
                  if (disabled) return
                  if (e.key === "Enter" || e.key === " ") tryViewIncident(incident)
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500">#{incident.id.substring(0, 10)}</div>
                    <div className="text-base font-semibold text-slate-900 break-words line-clamp-2">
                      {computedTitle}
                    </div>
                  </div>

                  <Button
                    size="icon"
                    className="rounded-sm h-10 w-10 p-0 shrink-0"
                    style={{ backgroundColor: '#2d3561' }}
                    disabled={!!reprocessLoadingById[incident.id]}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReprocessIncident(incident.id)
                    }}
                    aria-label={t.reprocess}
                    title={t.reprocess}
                  >
                    {reprocessLoadingById[incident.id] ? (
                      <Spinner className="w-5 h-5 text-white" />
                    ) : (
                      <RefreshCcw className="h-5 w-5 text-white" />
                    )}
                  </Button>
                </div>

                <div className="mt-2 text-xs text-slate-500 flex flex-wrap gap-x-2 gap-y-1">
                  <span>{t.fieldDate}: {incident.date || "-"}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.fieldTime}: {incident.time || "-"}</span>
                </div>

                <div className="mt-3 text-sm text-slate-700 break-words">
                  <span className="font-medium">{t.location}:</span> {incident.location?.address || '-'}
                </div>

                <div className="mt-3">
                  <div className="flex w-full gap-0">
                    <div 
                      className="h-2 flex-1 rounded-l-full"
                      style={{ backgroundColor: sev === 'low' || sev === '1' ? '#7A75B5' : '#d1d5db' }}
                    />
                    <div 
                      className="h-2 flex-1"
                      style={{ backgroundColor: sev === 'medium' || sev === '2' ? '#DFA226' : '#d1d5db' }}
                    />
                    <div 
                      className="h-2 flex-1 rounded-r-full"
                      style={{ backgroundColor: sev === 'high' || sev === '3' ? '#D84B00' : '#d1d5db' }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{getSeverityLabel(sev)}</div>
                </div>
              </div>
            )
          })}

          {sortedIncidents.length === 0 && (
            <div className="bg-white/90 rounded-xl p-6 text-center text-sm text-slate-500">
              No se encontraron resultados
            </div>
          )}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block bg-transparent rounded-lg shadow-md overflow-hidden mb-6 mt-12">
          <Table style={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
            <TableHeader>
              <TableRow data-header="true">
                <TableHead className="font-semibold text-white w-24 uppercase text-xs">{t.tableId}</TableHead>
                <TableHead className="font-semibold text-white uppercase text-xs">{t.tableTitle}</TableHead>
                <TableHead className="font-semibold text-white uppercase text-xs">{t.location}</TableHead>
                <TableHead className="font-semibold text-white w-36 uppercase text-xs">{t.fieldDate}</TableHead>
                <TableHead className="font-semibold text-white w-28 uppercase text-xs">{t.fieldTime}</TableHead>
                <TableHead className="font-semibold text-white w-32 uppercase text-xs">{t.tableSeverity}</TableHead>
                <TableHead className="font-semibold text-white w-32 text-right uppercase text-xs">{t.tableAction}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {sortedIncidents.map((incident) => {
                const disabled = isIncidentDisabled(incident)

                return (
                  <TableRow
                  key={incident.id}
                  className={
                    (disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-slate-50 cursor-pointer")
                  }
                  style={{ borderRadius: '12px', overflow: 'hidden' }}
                  onClick={() => tryViewIncident(incident)}
                >
                  <TableCell className="font-medium text-slate-900 py-6 px-4" style={{ borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>#{incident.id.substring(0,10)}</TableCell>
                  <TableCell className="text-slate-700 py-6 px-4">
                    {(() => {
                      const aiAnalysis = getIncidentAIAnalysis(incident)
                      if (aiAnalysis) {
                        const analysisKey = `ai_analysis_${language}`;
                        const analysis = (aiAnalysis as any)?.[analysisKey];
                        if (analysis && analysis.aiHeader && analysis.aiHeader.title) {
                          return analysis.aiHeader.title;
                        }
                      }
                      return incident.title;
                    })()}
                  </TableCell>
                  <TableCell className="text-slate-700 py-6 px-4">
                    {incident.location?.address || '-'}
                  </TableCell>
                  <TableCell className="text-slate-700 py-6 px-4">
                    {incident.date || "-"}                  </TableCell>
                  <TableCell className="text-slate-700 py-6 px-4">
                    {incident.time || "-"}
                  </TableCell>
                  <TableCell className="py-6 px-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex w-full gap-0">
                        <div 
                          className="h-3 flex-1 rounded-l-full"
                          style={{ backgroundColor: getAIAnalysisSeverity(incident) === 'low' || getAIAnalysisSeverity(incident) === '1' ? '#7A75B5' : '#d1d5db' }}
                        ></div>
                        <div 
                          className="h-3 flex-1"
                          style={{ backgroundColor: getAIAnalysisSeverity(incident) === 'medium' || getAIAnalysisSeverity(incident) === '2' ? '#DFA226' : '#d1d5db' }}
                        ></div>
                        <div 
                          className="h-3 flex-1 rounded-r-full"
                          style={{ backgroundColor: getAIAnalysisSeverity(incident) === 'high' || getAIAnalysisSeverity(incident) === '3' ? '#D84B00' : '#d1d5db' }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{getSeverityLabel(getAIAnalysisSeverity(incident))}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-6 px-4" style={{ borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        className="rounded-sm h-10 w-10 p-0"
                        style={{ backgroundColor: '#2d3561' }}
                        disabled={!!reprocessLoadingById[incident.id]}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReprocessIncident(incident.id)
                        }}
                        aria-label={t.reprocess}
                        title={t.reprocess}
                      >
                        {reprocessLoadingById[incident.id] ? (
                          <Spinner className="w-5 h-5 text-white" />
                        ) : (
                          <RefreshCcw className="h-5 w-5 text-white" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                )
              })}
              {sortedIncidents.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-sm text-gray-400"
                    >
                      No se encontraron resultados
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>

        {sortedIncidents.length > 0 && (
          <div className="flex justify-center mb-24 md:mb-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && loadIncidents(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50 text-white" : "cursor-pointer text-white"}
                  >
                    {t.paginationPrevious}
                  </PaginationPrevious>
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm text-white px-4 py-2">
                    {currentPage}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => hasNextPage && loadIncidents(currentPage + 1)}
                    className={!hasNextPage ? "pointer-events-none opacity-50 text-white" : "cursor-pointer text-white"}
                  >
                    {t.paginationNext}
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Desktop button (original placement near bottom) */}
        <div className="hidden md:flex justify-start">
          <Button
            size="lg"
            onClick={() => setIsModalOpen(true)}
            className="gap-2 w-full md:w-auto bg-[#FFCA00] text-black hover:bg-[#FFCA00]/90"
          >
            <Plus className="h-5 w-5 bg-black text-[#FFCA00] rounded-2xl" />
            {t.buttonNew}
          </Button>
        </div>

        {/* Mobile floating action button (original bottom-right placement) */}
        <Button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="md:hidden fixed bottom-6 right-6 z-[60] h-12 px-5 rounded-xl bg-[#FFCA00] text-black shadow-lg hover:bg-[#FFCA00]/90 font-semibold"
          aria-label={t.buttonNew}
        >
          {t.buttonNewShort}
        </Button>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="p-0 overflow-hidden w-[calc(100vw-2rem)] sm:w-full max-w-none md:max-w-2xl max-h-[calc(100vh-6rem)] md:max-h-[90vh] bg-white/95 backdrop-blur border border-white/30 shadow-2xl rounded-2xl **:data-[slot=dialog-close]:text-white **:data-[slot=dialog-close]:hover:text-white">
            {/* Header */}
            <div className="bg-[#2d3561] px-5 sm:px-6 py-5">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-white">{t.modalTitle}</DialogTitle>
                <p className="text-white/80 text-sm">{t.subtitle}</p>
              </DialogHeader>
            </div>

            {/* Body */}
            <div className="px-4 sm:px-6 py-5 bg-white/95 max-h-[calc(100vh-18rem)] md:max-h-[calc(90vh-14rem)] overflow-y-auto">
              <div className="space-y-5">
                {/* Details */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
                  <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase mb-4">
                    {t.fieldTitle} / {t.fieldDescription}
                  </div>

                  <div className="space-y-4">
                    {/* Reported by */}
                    <div className="space-y-2">
                      <Label htmlFor="reportedBy" className="text-sm font-medium text-slate-800">
                        {t.fieldReportedBy} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="reportedBy"
                        placeholder={t.reporterPlaceholder}
                        value={reportedByName}
                        onChange={(e) => setReportedByName(e.target.value)}
                        required
                        className="bg-white border-slate-200 rounded-xl focus-visible:ring-[#FFCA00]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium text-slate-800">
                        {t.fieldTitle} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        placeholder={t.titlePlaceholder}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="bg-white border-slate-200 rounded-xl focus-visible:ring-[#FFCA00]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-slate-800">
                        {t.fieldDescription} <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder={t.descriptionPlaceholder}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        required
                        className="bg-white border-slate-200 rounded-xl focus-visible:ring-[#FFCA00]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-sm font-medium text-slate-800">
                          {t.fieldDate} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                          className="bg-white border-slate-200 rounded-xl focus-visible:ring-[#FFCA00]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time" className="text-sm font-medium text-slate-800">
                          {t.fieldTime} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="time"
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          required
                          className="bg-white border-slate-200 rounded-xl focus-visible:ring-[#FFCA00]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audio */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
                  <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase mb-4">
                    {t.fieldAudio}
                  </div>

                  <Label className="text-slate-800">Audio <span className="text-red-500">*</span></Label>
                  <div className="mt-2 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      {!audioFile && !isRecording && (
                        <>
                          <Button type="button" onClick={startRecording} className="flex-1 rounded-xl" variant="outline">
                            <Mic className="h-4 w-4 mr-2" />
                            {t.record}
                          </Button>
                          <Button
                            type="button"
                            onClick={() => document.getElementById("audio-upload")?.click()}
                            className="flex-1 rounded-xl"
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
                        <Button type="button" onClick={stopRecording} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl">
                          <Square className="h-4 w-4 mr-2" />
                          Detener ({formatTime(recordingTime)})
                        </Button>
                      )}
                    </div>

                    {audioFile && (
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 overflow-hidden">
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <span className="text-sm font-medium text-slate-800">Audio</span>
                          <Button type="button" size="icon" variant="ghost" onClick={deleteAudio} className="text-slate-700 shrink-0">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={togglePlayAudio}
                            className="shrink-0 rounded-xl"
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

                          <div className="w-full sm:flex-1 min-w-0">
                            <div className="flex items-center gap-3 w-full min-w-0">
                              <span className="w-10 sm:w-12 text-right text-xs sm:text-sm tabular-nums text-slate-700 shrink-0">
                                {formatTime(currentTime)}
                              </span>

                              <input
                                type="range"
                                className="w-full sm:flex-1 min-w-0 rounded-full"
                                min={0}
                                max={duration || 0}
                                step="0.1"
                                value={currentTime}
                                onChange={handleSeek}
                              />

                              <span className="w-10 sm:w-12 text-left text-xs sm:text-sm tabular-nums text-slate-700 shrink-0">
                                {formatTime(duration)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Photos */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
                  <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase mb-4">
                    {t.fieldPhotos}
                  </div>

                  <Label className="text-slate-800">{t.fieldPhotos}</Label>
                  <div className="mt-2">
                    <Button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="w-full rounded-xl"
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
                            <img src={preview.url} alt={`Foto ${index + 1}`} className="w-full h-32 object-cover rounded-xl" />
                            <Button
                              type="button"
                              size="icon"
                              className="absolute top-1 right-1 h-7 w-7 bg-red-600 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
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

                {/* Location */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
                  <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase mb-4">
                    {t.fieldLocation}
                  </div>

                  <Label className="text-slate-800">{t.fieldLocation}</Label>
                  <div className="mt-2 space-y-2">
                    <Button type="button" onClick={openMapModal} className="gap-2 w-full rounded-xl" variant="outline">
                      <MapPin className="h-4 w-4" />
                      {t.selectLocation}
                    </Button>

                    {location && locationSource === "current" && (
                      <p className="text-xs text-slate-500">{t.currentLocationTaken}</p>
                    )}

                    {location && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <p className="text-sm text-slate-800">
                          <strong className="text-slate-900">{t.selectedLocation}:</strong>
                          <br />
                          Lat: {location.lat.toFixed(6)}° | Lng: {location.lng.toFixed(6)}°
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 py-4 bg-white/95 border-t border-slate-200/60">
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl"
                >
                  {t.cancel}
                </Button>
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={handleCreateIncident}
                  className="flex-1 bg-[#FFCA00] text-black hover:bg-[#FFCA00]/90 rounded-xl"
                >
                  {t.create}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Mapa */}

        <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
          <DialogContent className="p-0 overflow-hidden w-[calc(100vw-2rem)] sm:w-full max-w-none lg:w-[70vw] bg-white/95 backdrop-blur border border-white/30 shadow-2xl rounded-2xl max-h-[calc(100vh-2rem)] lg:max-h-[90vh]">
            <div className="bg-[#2d3561] px-5 sm:px-6 py-5">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-white">{t.selectLocation}</DialogTitle>
                <p className="text-white/80 text-sm">{t.confirmLocation}</p>
              </DialogHeader>
            </div>

            <div className="flex-1 px-4 sm:px-6 py-5 overflow-y-auto max-h-[calc(100vh-14rem)] lg:max-h-[calc(90vh-14rem)]">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3 sm:p-4">
                <div className="w-full h-72 sm:h-96 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                  {isLoaded && (
                    <GoogleMap
                      mapContainerStyle={{width: '100%',height: '100%'}}
                      center={markerPosition}
                      zoom={mapZoom}
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

                <div className="mt-4 text-sm text-slate-700">
                  <p>
                    <strong className="text-slate-900">{t.selectedLocation}:</strong>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    <p className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">Lat: {markerPosition?.lat.toFixed(6)}°</p>
                    <p className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">Lng: {markerPosition?.lng.toFixed(6)}°</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-4 bg-white/95 border-t border-slate-200/60">
              <div className="flex flex-col-reverse sm:flex-row gap-2">
                <Button variant="outline" disabled={isLoading} onClick={() => setShowMapModal(false)} className="flex-1 rounded-xl">
                  {t.cancel}
                </Button>
                <Button onClick={confirmLocation} disabled={isLoading} className="flex-1 bg-[#FFCA00] text-black hover:bg-[#FFCA00]/90 rounded-xl">
                  {t.confirmLocation}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

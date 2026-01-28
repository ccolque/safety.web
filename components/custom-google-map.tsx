import { useEffect, useRef, useState } from 'react';

type Lang = "en" | "es" | "fr";

interface MapProps {
    lat: number;
    lng: number;
    apiKey: string;
    lang: Lang;
    edit?: boolean;
    onLocationChange?: (data:any) => void;
}

const translations = {
    es: { 
        message: "Haz clic o arrastra el marcador",
        satelite: "Satélite",
        mapa: "Mapa",
        hibrido: "Híbrido"
    },
    en: { 
        message: "Click or drag the marker",
        satelite: "Satellite",
        mapa: "Map",
        hibrido: "Hybrid"
    },
    fr: { 
        message: "Cliquez ou faites glisser le marqueur",
        satelite: "Satellite",
        mapa: "Carte",
        hibrido: "Hybride"
    }
} as const;

// Variable global para rastrear si el script ya está cargado
let isGoogleMapsScriptLoading = false;
let isGoogleMapsScriptLoaded = false;
const loadPromises: Array<(value: boolean) => void> = [];

const loadGoogleMapsScript = (apiKey: string): Promise<boolean> => {
    if (isGoogleMapsScriptLoaded && window.google && window.google.maps) {
        return Promise.resolve(true);
    }

    if (isGoogleMapsScriptLoading) {
        return new Promise((resolve) => {
            loadPromises.push(resolve);
        });
    }

    const existingScript = document.querySelector(
        `script[src*="maps.googleapis.com/maps/api/js"]`
    );

    if (existingScript) {
        if (window.google && window.google.maps) {
            isGoogleMapsScriptLoaded = true;
            return Promise.resolve(true);
        }
        
        return new Promise((resolve) => {
            loadPromises.push(resolve);
            existingScript.addEventListener('load', () => {
                isGoogleMapsScriptLoaded = true;
                loadPromises.forEach(r => r(true));
                loadPromises.length = 0;
                resolve(true);
            });
        });
    }

    isGoogleMapsScriptLoading = true;

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
            isGoogleMapsScriptLoaded = true;
            isGoogleMapsScriptLoading = false;
            loadPromises.forEach(r => r(true));
            loadPromises.length = 0;
            resolve(true);
        };

        script.onerror = () => {
            isGoogleMapsScriptLoading = false;
            loadPromises.forEach(r => r(false));
            loadPromises.length = 0;
            reject(new Error('Error al cargar Google Maps'));
        };

        document.head.appendChild(script);
    });
};

const CustomGoogleMap = ({ 
    lat, 
    lng, 
    apiKey, 
    edit = false,
    lang,
    onLocationChange 
}: MapProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const listenersRef = useRef<google.maps.MapsEventListener[]>([]); // ← Nuevo: guardar listeners
    const [mapType, setMapType] = useState('satellite');
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPosition, setCurrentPosition] = useState({ lat, lng });
    const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null)
    const t = translations[lang]
    // Cargar el script de Google Maps
    useEffect(() => {
        loadGoogleMapsScript(apiKey)
            .then(() => {
                setIsLoaded(true)
                setGeocoder(new window.google.maps.Geocoder())
            })
            .catch((err) => {
                console.error('Error loading Google Maps:', err);
                setError('Error al cargar Google Maps');
            });
    }, [apiKey]);

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
                    if (onLocationChange)
                        onLocationChange(data);
                }
            }
        )
    }

    // Inicializar el mapa (solo una vez)
    useEffect(() => {
        if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

        try {
            const mapOptions: google.maps.MapOptions = {
                center: { lat, lng },
                zoom: 15,
                mapTypeId: mapType as google.maps.MapTypeId,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoomControl: true,
                zoomControlOptions: {
                    position: window.google.maps.ControlPosition.RIGHT_BOTTOM
                },
                gestureHandling: 'greedy',
            };

            mapInstanceRef.current = new window.google.maps.Map(
                mapRef.current,
                mapOptions
            );

            // Agregar marcador
            markerRef.current = new window.google.maps.Marker({
                position: { lat, lng },
                map: mapInstanceRef.current,
                title: 'Ubicación del incidente',
                draggable: edit, // Inicialmente según el prop
            });

        } catch (err) {
            console.error('Error initializing map:', err);
            setError('Error al inicializar el mapa');
        }
    }, [isLoaded, lat, lng]);

    useEffect(() => {
        if (!mapInstanceRef.current || !markerRef.current) return;

        // Limpiar listeners anteriores
        listenersRef.current.forEach(listener => {
            google.maps.event.removeListener(listener);
        });
        listenersRef.current = [];

        // Actualizar draggable del marcador
        markerRef.current.setDraggable(edit);

        if (edit) {
            // Animación de rebote al activar edición
            markerRef.current.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(() => {
                markerRef.current?.setAnimation(null);
            }, 750);

            // Agregar listener para arrastrar
            const dragListener = markerRef.current.addListener(
                'dragend', 
                (event: google.maps.MapMouseEvent) => {
                    console.log("Marcador arrastrado", event);
                    if (event.latLng) {
                        const newLat = event.latLng.lat();
                        const newLng = event.latLng.lng();
                        setCurrentPosition({ lat: newLat, lng: newLng });
                        
                        if (onLocationChange) {
                            getAddressFromLatLng(newLat, newLng)
                        }
                    }
                }
            );

            // Agregar listener para clic en el mapa
            const clickListener = mapInstanceRef.current.addListener(
                'click', 
                (event: google.maps.MapMouseEvent) => {
                    console.log("Clic en mapa", event);
                    if (event.latLng && markerRef.current) {
                        const newLat = event.latLng.lat();
                        const newLng = event.latLng.lng();
                        
                        markerRef.current.setPosition(event.latLng);
                        setCurrentPosition({ lat: newLat, lng: newLng });
                        
                        if (onLocationChange) {
                            getAddressFromLatLng(newLat, newLng)
                        }
                    }
                }
            );

            // Guardar referencias a los listeners
            listenersRef.current = [dragListener, clickListener];
        }

        if (mapInstanceRef.current && markerRef.current) {
            const newPosition = { lat, lng };
            mapInstanceRef.current.setCenter(newPosition);
            markerRef.current.setPosition(newPosition);
            setCurrentPosition(newPosition);
        }

        // Cleanup: remover listeners cuando el componente se desmonte o edit cambie
        return () => {
            listenersRef.current.forEach(listener => {
                google.maps.event.removeListener(listener);
            });
            listenersRef.current = [];
        };
    }, [edit]); // ← Dependencias: edit y onLocationChange

    // Actualizar ubicación si cambian las coordenadas desde props
    // useEffect(() => {
    //     if (mapInstanceRef.current && markerRef.current) {
    //         const newPosition = { lat, lng };
    //         mapInstanceRef.current.setCenter(newPosition);
    //         markerRef.current.setPosition(newPosition);
    //         setCurrentPosition(newPosition);
    //     }
    // }, [lat, lng]);

    // Cambiar tipo de mapa
    useEffect(() => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setMapTypeId(mapType as google.maps.MapTypeId);
        }
    }, [mapType]);

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center p-6">
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center p-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando mapa...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            <div ref={mapRef} className="w-full h-full" />
            
            {/* Control personalizado de tipo de mapa */}
            <div className="absolute top-4 right-4 z-10">
                <select
                    value={mapType}
                    onChange={(e) => setMapType(e.target.value)}
                    className="px-4 py-2.5 bg-white rounded-lg shadow-lg text-sm font-medium text-gray-700 cursor-pointer border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 transition-colors"
                    aria-label="Tipo de mapa"
                >
                    <option value="satellite">🛰️ {t.satelite}</option>
                    <option value="roadmap">🗺️ {t.mapa}</option>
                    <option value="hybrid">🌐 {t.hibrido}</option>
                </select>
            </div>

            {/* Indicador de modo edición */}
            {edit && (
                <div className="absolute top-4 left-4 z-10 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    {t.message}
                </div>
            )}

            {/* Mostrar coordenadas actuales cuando está en modo edición */}
            {/* {edit && (
                <div className="absolute bottom-4 left-4 z-10 bg-white px-4 py-2 rounded-lg shadow-lg text-xs font-mono">
                    <div className="font-semibold text-gray-700 mb-1">Ubicación actual:</div>
                    <div className="text-gray-600">
                        Lat: {currentPosition.lat.toFixed(6)}
                    </div>
                    <div className="text-gray-600">
                        Lng: {currentPosition.lng.toFixed(6)}
                    </div>
                </div>
            )} */}
        </div>
    );
};

export { CustomGoogleMap };
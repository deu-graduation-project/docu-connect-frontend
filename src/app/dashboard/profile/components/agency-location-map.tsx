"use client"

import React, { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapPin, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

interface AgencyLocationMapProps {
  agencyName: string
  province: string
  district: string
  addressExtra?: string
}

const AgencyLocationMap: React.FC<AgencyLocationMapProps> = ({
  agencyName,
  province,
  district,
  addressExtra,
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [currentZoom, setCurrentZoom] = useState(10)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  )

  // Custom map control for zoom and fullscreen
  const CustomMapControls = () => {
    const zoomIn = () => {
      mapInstance.current?.zoomIn()
    }

    const zoomOut = () => {
      mapInstance.current?.zoomOut()
    }

    const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        mapRef.current?.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }

    return (
      <div className="absolute right-4 top-4 z-[1000] flex flex-col space-y-2">
        <button
          onClick={zoomIn}
          className="rounded-full bg-secondary p-2 shadow-md transition-all hover:bg-secondary/70"
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={zoomOut}
          className="rounded-full bg-secondary p-2 shadow-md transition-all hover:bg-secondary/70"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={toggleFullScreen}
          className="rounded-full bg-secondary p-2 shadow-md transition-all hover:bg-secondary/70"
        >
          <Maximize2 size={20} />
        </button>
      </div>
    )
  }

  useEffect(() => {
    if (!province || !district || !mapRef.current) return

    // Create a custom icon using Lucide's MapPin
    const createCustomIcon = () => {
      // Create a div to hold the SVG
      const div = document.createElement("div")
      div.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="#000" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      `
      return L.divIcon({
        html: div.innerHTML,
        className: "custom-map-pin",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48],
      })
    }

    mapInstance.current = L.map(mapRef.current, {
      center: [41.0, 29.0],
      zoom: 15,
      minZoom: 3,
      maxZoom: 22,

      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      dragging: true,
      worldCopyJump: true, // Allows continuous panning across the antimeridian
    })

    // Add standard OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstance.current)

    // Add zoom and events listeners
    mapInstance.current.on("zoomend", () => {
      setCurrentZoom(mapInstance.current?.getZoom() || 10)
    })

    // Geocode using Nominatim
    const geocodeAddress = async () => {
      const query = `${district}, ${province}, Turkey${addressExtra ? `, ${addressExtra}` : ""}`
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        )
        const data = await response.json()

        if (data.length > 0) {
          const { lat, lon } = data[0]
          setLocation({ lat: Number(lat), lon: Number(lon) })

          // Center and zoom to location
          mapInstance.current?.setView([Number(lat), Number(lon)], 15)

          // Add marker with custom icon and detailed popup
          const marker = L.marker([Number(lat), Number(lon)], {
            icon: createCustomIcon(),
          }).addTo(mapInstance.current!)

          marker
            .bindPopup(
              `
            <div>
              <h3 class="font-bold text-lg">${agencyName}</h3>
              <p class="text-sm">${district}, ${province}</p>
              ${addressExtra ? `<p class="text-xs italic">${addressExtra}</p>` : ""}
            </div>
          `,
              {
                maxWidth: 300,
              }
            )
            .openPopup()

          setMapLoaded(true)
        }
      } catch (error) {
        console.error("Geocoding error:", error)
      }
    }

    geocodeAddress()

    return () => {
      mapInstance.current?.remove()
    }
  }, [agencyName, province, district, addressExtra])

  if (!province || !district) {
    return (
      <div className="mt-4 text-sm text-muted-foreground">
        Location information not available
      </div>
    )
  }

  return (
    <div className="relative z-20 mx-auto mt-4 w-full max-w-7xl">
      <div
        ref={mapRef}
        className="h-[700px] w-full rounded-lg border shadow-lg"
        style={{ minHeight: "500px" }}
      >
        {mapLoaded && <CustomMapControls />}
      </div>

      {location && (
        <div className="mt-2 text-center text-sm text-muted-foreground">
          <p>
            {district}, {province}
          </p>
        </div>
      )}
    </div>
  )
}

export default AgencyLocationMap

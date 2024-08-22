"use client"

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { memo, useState } from "react"

const GoogleMaps = () => {
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
  })

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY as string,
  })

  const getUserLocation = () => {
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          const { latitude, longitude } = coords
          setLocation({ lat: latitude, lng: longitude })
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    isLoaded && (
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "30vh",
          borderRadius: "0.5rem",
        }}
        center={location}
        zoom={15}
        onLoad={() => {
          // const bounds = new window.google.maps.LatLngBounds()
          // map.fitBounds(bounds)
          getUserLocation()
        }}
        onUnmount={() => {
          setLocation({ lat: 0, lng: 0 })
        }}
      >
        <Marker position={location} />
      </GoogleMap>
    )
  )
}

export default memo(GoogleMaps)

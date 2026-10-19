'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface PropertyMapProps {
  properties: any[];
  draggable?: boolean;
  onPositionChange?: (lat: number, lng: number) => void;
}

export default function PropertyMap({ properties, draggable = false, onPositionChange }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const centerLat = properties[0]?.lat || 17.9892;
  const centerLng = properties[0]?.lng || -92.9283;

  useEffect(() => {
    if (!mapRef.current) return;

    // Inicializar mapa si no existe
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([centerLat, centerLng], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Icono personalizado
    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    // Actualizar o crear marcador principal
    if (markerRef.current) {
      markerRef.current.setLatLng([centerLat, centerLng]);
    } else {
      const marker = L.marker([centerLat, centerLng], {
        icon: customIcon,
        draggable: draggable
      }).addTo(map);

      if (draggable && onPositionChange) {
        marker.on('dragend', (e: any) => {
          const pos = e.target.getLatLng();
          onPositionChange(pos.lat, pos.lng);
        });
      }

      markerRef.current = marker;
    }

    // Evento de clic en el mapa para mover el pin si es draggable
    if (draggable && onPositionChange) {
      map.off('click');
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        markerRef.current.setLatLng([lat, lng]);
        onPositionChange(lat, lng);
      });
    }

    // Invalidar tamaño para evitar problemas de renderizado visual
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [centerLat, centerLng, draggable]);

  return (
    <div 
      ref={mapRef} 
      style={{ height: '100%', width: '100%', zIndex: 0, minHeight: '250px' }} 
    />
  );
}
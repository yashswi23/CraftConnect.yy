import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const LocationMarker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
};

const LocationPicker = ({ onSelect }) => {
  const [position, setPosition] = useState(null);

  return (
    <div>
      <MapContainer
        center={[28.6139, 77.2090]}
        zoom={13}
        className="h-96 w-full rounded-md border"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker setPosition={setPosition} />
        {position && <Marker position={position}></Marker>}
      </MapContainer>

      <button
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => onSelect(position)}
      >
        Save Location
      </button>
    </div>
  );
};

export default LocationPicker;

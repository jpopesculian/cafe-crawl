import React, { useRef, useState, useEffect } from "react";
import "./Map.css";
import MapContext from "./MapContext";
import * as mapbox from "mapbox-gl";

interface Props {
  children?: React.ReactNode;
  styleUrl?: string;
  accessToken?: string;
  zoom?: number;
  center?: mapbox.LngLatLike;
}

function Map({ children, styleUrl, ...options }: Props) {
  const mapRef = useRef(null);
  const [map, setMap] = useState<mapbox.Map | null>(null);

  useEffect(() => {
    if (map) {
      return;
    }
    if (!mapRef.current) {
      return;
    }
    const newMap = new mapbox.Map({
      container: mapRef.current,
      style: styleUrl,
      ...options,
    });
    newMap.on("styledata", () => {
      setMap(newMap);
    });
  }, [mapRef, map, styleUrl, options]);

  return (
    <MapContext.Provider value={map}>
      <div ref={mapRef} className="Map">
        {children}
      </div>
    </MapContext.Provider>
  );
}

export default Map;

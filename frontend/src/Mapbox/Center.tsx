import { useContext, useState, useEffect } from "react";
import MapContext from "./MapContext";

interface Props {
  lat_lng: [number, number];
}

const Center = ({ lat_lng }: Props) => {
  const map = useContext(MapContext);
  const [isAuto, setIsAuto] = useState(true);

  useEffect(() => {
    if (!map) return;
    if (!isAuto) return;
    map.easeTo({ center: lat_lng });
  }, [map, lat_lng]);

  useEffect(() => {
    if (!map) return;
    map.on("dragend", () => {
      setIsAuto(false);
    });
  }, [map]);

  return null;
};

export default Center;

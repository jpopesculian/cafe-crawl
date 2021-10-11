import { useContext, useEffect } from "react";
import MapContext from "./MapContext";

interface Props {}

const TileLayer = ({}: Props) => {
  const map = useContext(MapContext);

  useEffect(() => {
    if (!map) return;
  }, [map]);

  return null;
};

export default TileLayer;

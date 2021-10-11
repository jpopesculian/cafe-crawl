import React from "react";
import * as mapbox from "mapbox-gl";

const MapContext = React.createContext<mapbox.Map | null>(null);

export default MapContext;

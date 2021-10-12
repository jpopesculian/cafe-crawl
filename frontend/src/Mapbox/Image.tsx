import { useContext, useEffect, useRef } from "react";
import MapContext from "./MapContext";
import { GeoJSONSource } from "mapbox-gl";

interface Props {
  img_id: string;
  src: string;
  lat_lng: [number, number];
}

const Image = ({ src, img_id, lat_lng }: Props) => {
  const map = useContext(MapContext);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!map) return;
    if (!imgRef.current) return;
    if (!map.hasImage(img_id)) {
      map.addImage(img_id, imgRef.current);
      map.addSource(`${img_id}-point`, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: lat_lng,
              },
              properties: {
                title: img_id,
              },
            },
          ],
        },
      });
      map.addLayer({
        id: `${img_id}-layer`,
        type: "symbol",
        source: `${img_id}-point`, // reference the data source
        layout: {
          "icon-image": img_id, // reference the image
        },
      });
    }
    map.updateImage(img_id, imgRef.current);
    let source = map.getSource(`${img_id}-point`);
    if (source) {
      (source as GeoJSONSource).setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: lat_lng,
            },
            properties: {
              title: img_id,
            },
          },
        ],
      });
    }
  }, [map, src, img_id, lat_lng, imgRef]);

  return <img src={src} ref={imgRef} alt="map icon" />;
};

export default Image;

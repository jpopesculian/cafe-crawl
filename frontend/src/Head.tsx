import React, { useContext, useEffect, useState } from "react";
import StateContext from "./StateContext";
import Image from "./Mapbox/Image";
import Center from "./Mapbox/Center";

function blobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

function Head() {
  const [img, setImg] = useState<string | null>(null);
  const state = useContext(StateContext);

  useEffect(() => {
    fetch(`./head${state.value}.png`)
      .then((res) => res.blob())
      .then((blob) => blobToBase64(blob))
      .then((base64) => {
        setImg(base64 as string);
      });
  }, [state]);

  let lat_lng = state.stop?.lat_lng || [16.373599444210306, 48.208540078045324];

  return (
    <>
      {img ? <Image img_id="head" src={img} lat_lng={lat_lng} /> : null}
      <Center lat_lng={lat_lng} />
    </>
  );
}

export default Head;

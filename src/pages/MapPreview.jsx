import React, { useEffect, useRef } from "react";

function MapPreview({ startLat, startLng, destLat, destLng }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("Kakao Maps API not loaded yet");
      return;
    }

    const mapContainer = mapRef.current;
    const mapOption = {
      center: new window.kakao.maps.LatLng(startLat, startLng),
      level: 5,
    };

    const map = new window.kakao.maps.Map(mapContainer, mapOption);


    const startMarker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(startLat, startLng),
      title: "출발지",
    });
    startMarker.setMap(map);

  
    const destMarker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(destLat, destLng),
      title: "도착지",
    });
    destMarker.setMap(map);


    const bounds = new window.kakao.maps.LatLngBounds();
    bounds.extend(new window.kakao.maps.LatLng(startLat, startLng));
    bounds.extend(new window.kakao.maps.LatLng(destLat, destLng));
    map.setBounds(bounds);
  }, [startLat, startLng, destLat, destLng]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "180px",
        borderRadius: "10px",
        marginTop: "10px",
      }}
    ></div>
  );
}

export default MapPreview;

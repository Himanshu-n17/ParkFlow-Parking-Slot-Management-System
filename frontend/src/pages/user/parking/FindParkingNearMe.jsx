import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import DashboardLayout from "../../../components/layout/DashboardLayout";

const userLocationIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:18px;
      height:18px;
      background:#007bff;
      border-radius:50%;
      border:3px solid white;
      box-shadow:0 0 10px rgba(0,123,255,0.8);
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});
const parkingIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  shadowUrl: markerShadow,

  iconSize: [38, 45],
  iconAnchor: [22, 45],
  popupAnchor: [-3, -40],
});
const nearestParkingIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",

  shadowUrl: markerShadow,

  iconSize: [40, 46],
  iconAnchor: [20, 46],
  popupAnchor: [0, -40],

  className: "red-marker",
});

const FindParkingNearMe = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [nearestParking, setNearestParking] = useState(null);
  const [nearestDistance, setNearestDistance] = useState(null);

  const parkingLocations = [
    {
      name: "ParkFlow ITER Parking",
      lat: 20.2488,
      lng: 85.8006,
    },
    {
      name: "ParkFlow Nexus Esplande Parking",
      lat: 20.2934081327004,
      lng: 85.85557847851179,
    },
    {
      name: "ParkFlow Patia Parking",
      lat: 20.3535,
      lng: 85.8196,
    },
  ];

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(userLoc);

        // auto detect nearest parking
        let nearest = null;
        let minDistance = Infinity;

        parkingLocations.forEach((parking) => {
          const distance = getDistanceKm(
            userLoc.lat,
            userLoc.lng,
            parking.lat,
            parking.lng,
          );

          if (distance < minDistance) {
            minDistance = distance;
            nearest = parking;
          }
        });

        setNearestParking(nearest);
        setNearestDistance(minDistance.toFixed(2));
      },
      () => {
        setError("Unable to retrieve location");
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDirections = (parkingLat, parkingLng) => {
    window.open(
      `https://www.openstreetmap.org/directions?from=${location.lat},${location.lng}&to=${parkingLat},${parkingLng}`,
      "_blank",
    );
  };
  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const findNearestParking = () => {
    if (!location) return;

    let nearest = null;
    let minDistance = Infinity;

    parkingLocations.forEach((parking) => {
      const distance = getDistanceKm(
        location.lat,
        location.lng,
        parking.lat,
        parking.lng,
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearest = parking;
      }
    });

    if (nearest) {
      setNearestParking(nearest);
      setNearestDistance(minDistance.toFixed(2));

      openDirections(nearest.lat, nearest.lng);
    }
  };

  if (error) return <p>{error}</p>;
  if (!location) return <p>Fetching your location...</p>;

  return (
    <DashboardLayout>
      <div style={{ height: "90vh", width: "100%", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "30px",
            zIndex: 1000,
          }}
        >
          <button
            onClick={findNearestParking}
            style={{
              padding: "10px 16px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            📍 Find Nearest Parking
          </button>
        </div>
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          style={{ height: "80vh", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={[location.lat, location.lng]}
            icon={userLocationIcon}
          >
            <Popup>You are here 📍</Popup>
          </Marker>

          {/* PARKFLOW PARKING LOCATIONS */}
          {parkingLocations.map((parking, index) => (
            <Marker
              key={index}
              position={[parking.lat, parking.lng]}
              icon={
                nearestParking?.name === parking.name
                  ? nearestParkingIcon
                  : parkingIcon
              }
            >
              <Popup>
                <strong>{parking.name}</strong>
                {nearestParking?.name === parking.name && (
                  <div style={{ color: "green", fontWeight: "bold" }}>
                    Nearest Parking 🟢
                    <br />
                    {nearestDistance} km away
                  </div>
                )}
                <br />
                <button
                  onClick={() => openDirections(parking.lat, parking.lng)}
                  style={{
                    marginTop: "5px",
                    padding: "6px 10px",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Get Directions 🧭
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </DashboardLayout>
  );
};

export default FindParkingNearMe;

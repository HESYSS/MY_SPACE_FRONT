// Map component code
interface MapProps {
  lat: number;
  lng: number;
}

const Map: React.FC<MapProps> = ({ lat, lng }) => {
  // component logic using lat and lng
  return (
    <div>
      {/* map rendering */}
      <p>
        Latitude: {lat}, Longitude: {lng}
      </p>
    </div>
  );
};

export default Map;

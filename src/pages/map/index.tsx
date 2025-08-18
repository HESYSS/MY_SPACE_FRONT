export default function Map({
  lat = 50.4501,
  lng = 30.5234,
}: {
  lat?: number;
  lng?: number;
}) {
  return (
    <div style={{ width: "100%", height: "300px", backgroundColor: "#ddd" }}>
      Мапа (lat: {lat}, lng: {lng})
    </div>
  );
}

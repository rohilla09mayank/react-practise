import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
function Map() {
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();

  const lat = search.get("lat");
  const lng = search.get("lng");

  return (
    <div className={styles.mapContainer} onClick={() => navigate("form")}>
      <h1>Map</h1>
      <h3>
        Position : {lat} : {lng}
      </h3>
    </div>
  );
}

export default Map;

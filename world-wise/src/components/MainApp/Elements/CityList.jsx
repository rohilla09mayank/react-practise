import Spinner from "../../UI/Spinner";
import styles from "./CityList.module.css";
import Message from "./Message";
import CityItem from "./CityItem";
import { useCities } from "../../../contexts/CitiesContext";

function CityList() {
  const { isLoading, cities } = useCities();

  if (isLoading) return <Spinner />;

  if (cities.length === 0)
    return <Message message="Click on map to add your first city" />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem key={city.country} city={city} />
      ))}
    </ul>
  );
}

export default CityList;

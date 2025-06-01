import Spinner from "../../UI/Spinner";
import styles from "./CityList.module.css";
import Message from "./Message";
import CityItem from "./CityItem";

function CityList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  if (cities.length === 0)
    return <Message message="Click on map to add your first city" />;

  console.log(cities);

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem key={city.country} city={city} />
      ))}
    </ul>
  );
}

export default CityList;

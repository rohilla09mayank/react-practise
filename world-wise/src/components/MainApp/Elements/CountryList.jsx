import Spinner from "../../UI/Spinner";
import styles from "./CountryList.module.css";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCities } from "../../../contexts/CitiesContext";

function CountryList() {
  const { isLoading, cities } = useCities();

  if (isLoading) return <Spinner />;

  const countries = cities.reduce((acc, city) => {
    if (!acc.map((el) => el.country).includes(city.country)) {
      return [
        ...acc,
        { country: city.country, emoji: city.emoji, flag: city.flag },
      ];
    } else {
      return acc;
    }
  }, []);

  if (countries.length === 0)
    return <Message message="Click on map to add your first city" />;

  console.log(countries);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.country} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;

// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../UI/Button";
import styles from "./Form.module.css";
import Spinner from "../../UI/Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";
import { useCities } from "../../../contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeoLocation, setIsLoadingGeoLocation] = useState(false);
  const [geoLocationError, setGeoLocationError] = useState("");

  const lat = search.get("lat");
  const lng = search.get("lng");

  useEffect(
    function () {
      async function fetchGeoCity() {
        try {
          setIsLoadingGeoLocation(true);
          setGeoLocationError("");
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          console.log(data);
          if (data.countryCode === "")
            throw new Error("Unknow location. please click somewhere else");

          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          setGeoLocationError(err.message);
        } finally {
          setIsLoadingGeoLocation(false);
        }
      }
      fetchGeoCity();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    console.log(newCity);
    await createCity(newCity);
    navigate("/app/cities");
  }

  if (isLoadingGeoLocation) return <Spinner />;

  if (geoLocationError) return <Message message={geoLocationError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;

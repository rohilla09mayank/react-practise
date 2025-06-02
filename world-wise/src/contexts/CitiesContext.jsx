import { createContext, useContext, useEffect, useReducer } from "react";

const CitiesContext = createContext();

const initialState = { currentCity: {}, cities: [], isLoading: false };

function reducer(state, action) {
  switch (action.type) {
    case "cities/loaded":
      return { ...state, cities: action.payload };
    case "loading/toggle":
      return { ...state, isLoading: !state.isLoading };
    case "city/loaded":
      return { ...state, currentCity: action.payload };
    case "cities/added":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "cities/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    default:
      throw new Error("Unknown action");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loading/toggle" });
        const res = await fetch("http://localhost:8000/cities");
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        alert(err.message);
      } finally {
        dispatch({ type: "loading/toggle" });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    try {
      dispatch({ type: "loading/toggle" });
      const res = await fetch(`http://localhost:8000/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (err) {
      alert(err.message);
    } finally {
      dispatch({ type: "loading/toggle" });
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading/toggle" });
      const res = await fetch(`http://localhost:8000/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "cities/added", payload: data });
    } catch (err) {
      alert("Error creating new city");
    } finally {
      dispatch({ type: "loading/toggle" });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading/toggle" });
      await fetch(`http://localhost:8000/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "cities/deleted", payload: id });
    } catch (err) {
      alert("Error creating new city");
    } finally {
      dispatch({ type: "loading/toggle" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  return context;
}

export { CitiesProvider, useCities };

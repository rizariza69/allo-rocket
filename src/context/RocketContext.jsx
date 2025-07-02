import { createContext, useContext, useEffect, useState } from "react";
import { getRockets } from "../services/api";
import { getLocalRockets, addLocalRocket } from "../utils/localStorage";
import { message } from "antd";

const RocketContext = createContext();

export const useRocket = () => useContext(RocketContext);

export const RocketProvider = ({ children }) => {
  const [rockets, setRockets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedName, setSelectedName] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [names, setNames] = useState([]);
  const [countries, setCountries] = useState([]);

  const fetchRockets = async () => {
    try {
      setLoading(true);
      const res = await getRockets();
      const local = getLocalRockets();
      const all = [...res.data, ...local];
      setRockets(all);
      setFiltered(all);
      setNames([...new Set(all.map((value) => value.name).filter(Boolean))]);
      setCountries([
        ...new Set(all.map((value) => value.country).filter(Boolean)),
      ]);
      setError(false);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const addRocket = (rocket) => {
    const newRocket = {
      ...rocket,
      id: `local-${Date.now()}`,
      flickr_images: [rocket.image],
    };
    addLocalRocket(newRocket);
    message.success("✅ Roket berhasil ditambahkan!");
    fetchRockets();
  };

  const filterRockets = () => {
    let result = rockets;

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter((value) =>
        value.name?.toLowerCase().includes(keyword)
      );
    }
    if (selectedName) {
      result = result.filter((value) => value.name === selectedName);
    }
    if (selectedCountry) {
      result = result.filter((value) => value.country === selectedCountry);
    }

    setFiltered(result);
  };

  useEffect(() => {
    fetchRockets();
  }, []);

  useEffect(() => {
    filterRockets();
  }, [searchKeyword, selectedName, selectedCountry, rockets]);

  return (
    <RocketContext.Provider
      value={{
        rockets,
        filtered,
        loading,
        error,
        names,
        countries,
        searchKeyword,
        setSearchKeyword,
        selectedName,
        setSelectedName,
        selectedCountry,
        setSelectedCountry,
        fetchRockets,
        addRocket,
      }}
    >
      {children}
    </RocketContext.Provider>
  );
};

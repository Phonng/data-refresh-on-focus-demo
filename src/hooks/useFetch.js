import { useState, useEffect, useCallback, useRef } from "react";
const useFetch = ({ link }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const lastFetchTimeRef = useRef(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      lastFetchTimeRef.current = Date.now();
      setData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const handleRefetch = () => {
      const currentTime = Date.now();
      if (
        lastFetchTimeRef.current &&
        currentTime - lastFetchTimeRef.current <= 5000
      )
        return;
      // Check if 5 seconds have passed
      fetchData();
    };
    window.addEventListener("focus", handleRefetch);

    return () => {
      window.addEventListener("blur", handleRefetch);
    };
  }, []);
  return { data, loading, error };
};

export default useFetch;

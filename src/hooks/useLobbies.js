import {useState, useEffect} from 'react';

export function useLobbies() {
  const [lobbies, setLobbies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLobbies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/lobby/list`);
      const data = await response.json();
      setLobbies(data);
    } catch (error) {
      console.error('Failed to fetch lobbies', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLobbies();
  }, []);

  return {lobbies, loading, fetchLobbies};
}


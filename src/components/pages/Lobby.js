import {useLobbies} from '../../hooks/useLobbies';
import {authorizedFetch} from '../../utils/authorizedFetch';

export default function Lobby() {
  const {lobbies, loading, fetchLobbies} = useLobbies();

  const joinLobby = async (id) => {
    try {
      const response = await authorizedFetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/lobby/join`, {
            method: 'POST',
            body: {id: id},
          });
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Chyba: ${errorData.message || response.statusText}`);
        return;
      }
      fetchLobbies();
    } catch (error) {
      alert('Chyba při připojování do lobby');
      console.error(error);
    }
  };

  const createLobby = async () => {
    try {
      const response = await authorizedFetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/lobby/create`, {
            method: 'POST',
          });
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Chyba: ${errorData.message || response.statusText}`);
        return;
      }
      fetchLobbies();
    } catch (error) {
      alert('Chyba při vytváření lobby');
      console.error(error);
    }
  };

  if (loading) return <div>Načítám lobby...</div>;
  return (
      <div>
        <button onClick={createLobby}>Vytvořit novou lobby</button>
        <ul>
          {lobbies.map(({id, players, isMember}) => (
              <li key={id}>
                {players.join(', ')}
                {!isMember && (
                    <button onClick={() => joinLobby(id)}>Připojit se</button>
                )}
              </li>
          ))}
        </ul>
      </div>
  );
}

import React, { useEffect, useState } from "react";
import "../index.css";
import PokemonCards from "./PokemonCards";

const Pokemon = () => {
  const [Pokemon, setPokemon] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const Api = "https://pokeapi.co/api/v2/pokemon?limit=24";

  const fetchPokemon = async () => {
    try {
      const response = await fetch(Api);
      const data = await response.json();
      // console.log(data);

      const detailedPokemonData = data.results.map(async (currPokemon) => {
        const response = await fetch(currPokemon.url);
        const data = await response.json();
        // console.log(data);
        return data;
      });

      const detailedResponses = await Promise.all(detailedPokemonData);

      setPokemon(detailedResponses);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  if (isLoading)
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );

  if (error) {
    return (
      <div>
        <h1>{error.message}</h1>
      </div>
    );
  }

  const filteredPokemon = Pokemon.filter((elem) =>
    elem.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <section className="container">
        <header>
          <h1>Let's Catch Pokemon</h1>
        </header>
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <ul className="cards">
            {filteredPokemon.map((currPokemon) => {
              return (
                <PokemonCards key={currPokemon.id} pokemonData={currPokemon} />
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Pokemon;

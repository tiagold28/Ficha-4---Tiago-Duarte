import Card from "./Card.jsx";
import { useState, useEffect } from "react";
 
function App() {
  const [cards, setCards] = useState([]);
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [randomCard, setRandomCard] = useState(null);
  const [sorted, setSorted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("Criatura");
  const [attack, setAttack] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
  e.preventDefault();

  async function handleSubmit(e) {
  e.preventDefault();

  setError("");

  try {
    const response = await fetch("http://localhost:3000/api/cartas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        type,
        attack: Number(attack)
      })
    });

    if (!response.ok) {
      setError(`HTTP ${response.status}`);
      return;
    }

    const card = await response.json();

    setCards([...cards, card]);

    setName("");
    setType("Criatura");
    setAttack("");

  } catch (err) {
    setError("Erro ao comunicar com o servidor");
  }
}

  const card = {
    name: name,
    type: type,
    attack: Number(attack),
    defense: 0
  };

  setCards([...cards, card]);

  setName("");
  setType("Criatura");
  setAttack("");

  <form onSubmit={handleSubmit}>

  <input
    type="text"
    placeholder="Nome da carta"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />

  <select
    value={type}
    onChange={(e) => setType(e.target.value)}
  >
    <option value="Criatura">Criatura</option>
    <option value="Feitiço">Feitiço</option>
  </select>

  <input
    type="number"
    placeholder="Ataque"
    value={attack}
    onChange={(e) => setAttack(e.target.value)}
  />

  <button type="submit">
    Adicionar carta
  </button>

</form>

{error && <p>{error}</p>}

}
 
useEffect(() => {
  setLoading(true);
  setError("");

  const url = filter === "Todas"
    ? "http://localhost:3000/api/cartas"
    : `http://localhost:3000/api/cartas?tipo=${encodeURIComponent(filter)}`;

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      return res.json();
    })
    .then((data) => {
      setCards(data);
    })
    .catch((err) => {
      setError(err.message);
    })
    .finally(() => {
      setLoading(false);
    });
}, [filter]);
 

if (loading) {

  return <p>A carregar...</p>;

}
 
if (error) {

  return <p>Erro ao carregar as cartas: {error}</p>;

}
 
let visible = cards.filter((card) =>
  card.name.toLowerCase().includes(search.toLowerCase())
);

  if (sorted) {
    visible = [...visible].sort((a, b) => b.attack - a.attack);
  }
 
function pickRandom() {
  fetch("http://localhost:3000/api/cartas/aleatoria")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
 
      return res.json();
    })
    .then((data) => {
      setRandomCard(data);
    })
    .catch((err) => {
      console.error("Erro ao obter carta aleatória:", err);
    });
}
 
  return (
<main>
<h1>A minha coleção</h1>
 
      <p>
        Tenho {cards.length} cartas · a mostrar {visible.length}
</p>
 
      <div>
<button onClick={() => setFilter("Todas")}>Todas</button>
<button onClick={() => setFilter("Criatura")}>Só criaturas</button>
<button onClick={() => setFilter("Feitiço")}>Só feitiços</button>
<button onClick={() => setSorted(!sorted)}>
          {sorted ? "Ordem original" : "Ordenar por ataque"}
</button>
</div>
 
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Procurar pelo nome…"
      />
 
      {visible.length === 0 ? (
<p>Nenhuma carta corresponde.</p>
      ) : (
<ul>
          {visible.map((card) => (
<Card key={card.name} {...card} />
          ))}
</ul>
      )}
 
      <h2>Carta à sorte</h2>
<button onClick={pickRandom}>Escolher outra</button>
      {randomCard && (
<p>
<b>{randomCard.name}</b> — {randomCard.type} · ataque {randomCard.attack} ·
          defesa {randomCard.defense}
</p>
      )}
</main>
  );
}
 
export default App;
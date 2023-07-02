import React, { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [gridSize, setGridSize] = useState({width: 0, height: 0});
  const [zombie, setZombie] = useState({x: 0, y: 0});
  const [creatures, setCreatures] = useState([]);
  const [commands, setCommands] = useState("");
  const [result, setResult] = useState({zombies: [], creatures: []});

  const handleCreatureChange = (index, event) => {
    const newCreatures = [...creatures];
    newCreatures[index][event.target.name] = Math.max(0, Number(event.target.value));
    setCreatures(newCreatures);
  };

  const handleAddCreature = () => {
    setCreatures([...creatures, {x: 0, y: 0}]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/simulate', { gridSize, zombie, creatures, commands });
      setResult(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='container'>
      <h1>Zombie Apocalypse Simulation</h1>

      <form onSubmit={handleSubmit}>
        <label >
          Grid Size:
          <input type="number" placeholder="0" value={gridSize.width} onChange={(e) => setGridSize({...gridSize, width: Math.max(0, Number(e.target.value))})} />
          <input type="number" placeholder="0" value={gridSize.height} onChange={(e) => setGridSize({...gridSize, height: Math.max(0, Number(e.target.value))})} />
        </label>
        <label>
          Zombie Position:
          <input type="number" name="x" value={zombie.x} onChange={(e) => setZombie({...zombie, x: Math.max(0, Number(e.target.value))})} />
          <input type="number" name="y" value={zombie.y} onChange={(e) => setZombie({...zombie, y: Math.max(0, Number(e.target.value))})} />
        </label>
        {creatures.map((creature, index) => (
          <label key={index}>
            Creature {index + 1} Position:
            <input type="number" name="x" value={creature.x} onChange={(e) => handleCreatureChange(index, e)} />
            <input type="number" name="y" value={creature.y} onChange={(e) => handleCreatureChange(index, e)} />
          </label>
        ))}
        <button className="button" type="button" onClick={handleAddCreature}>Add Creature</button>
        <label>
          Commands:
          <input type="text" value={commands} onChange={(e) => setCommands(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>

      <h2>Results</h2>
      <div className='zombie'>
      <h3>Zombies</h3>
      <ul>
        {result.zombies.map((zombie, index) => <li key={index}>Zombie {index + 1}: ({zombie.x}, {zombie.y})</li>)}
      </ul>
      </div>
      <div className='creature'>
      <h3>Creatures</h3>
      <ul>
        {result.creatures.map((creature, index) => <li key={index}>Creature {index + 1}: ({creature.x}, {creature.y})</li>)}
      </ul></div>
    </div>
  );
}

export default App;

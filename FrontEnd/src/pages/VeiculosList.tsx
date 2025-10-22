import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Veiculo {
  id: number;
  placa: string;
  modelo: string;
  vagaId: number;
}

function VeiculosList() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  useEffect(() => {
    axios.get<Veiculo[]>('http://localhost:5000/api/veiculos')
      .then(response => setVeiculos(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Veículos</h1>
      <Link to="/novo">Cadastrar Novo</Link>
      <ul>
        {veiculos.map(v => (
          <li key={v.id}>{v.placa} - {v.modelo} (Vaga {v.vagaId})</li>
        ))}
      </ul>
    </div>
  );
}

export default VeiculosList;

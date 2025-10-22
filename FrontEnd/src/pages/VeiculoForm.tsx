import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function VeiculoForm() {
  const [placa, setPlaca] = useState<string>('');
  const [modelo, setModelo] = useState<string>('');
  const [vagaId, setVagaId] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/veiculos', {
      placa,
      modelo,
      vagaId: parseInt(vagaId)
    })
      .then(() => navigate('/'))
      .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastrar Veículo</h2>
      <input type="text" placeholder="Placa" value={placa} onChange={e => setPlaca(e.target.value)} required />
      <input type="text" placeholder="Modelo" value={modelo} onChange={e => setModelo(e.target.value)} required />
      <input type="number" placeholder="ID da Vaga" value={vagaId} onChange={e => setVagaId(e.target.value)} required />
      <button type="submit">Salvar</button>
    </form>
  );
}

export default VeiculoForm;

import React, { useState, useEffect } from 'react';
import api from '../services/api';

function VotacaoPanel() {
  const [candidatos, setCandidatos] = useState([]);
  const [cpf, setCpf] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [votoRegistrado, setVotoRegistrado] = useState(false);

  useEffect(() => {
    carregarCandidatos();
  }, []);

  const carregarCandidatos = async () => {
    try {
      const response = await api.listarCandidatos();
      setCandidatos(response.data);
    } catch (error) {
      console.error('Erro ao carregar candidatos:', error);
    }
  };

const handleVotar = async (candidatoId) => {
    try {
        if (!cpf || cpf.length !== 11) {
            setMensagem('CPF inválido! Digite os 11 números');
            return;
        }
        
        await api.votar(candidatoId, cpf);
        setMensagem('Voto registrado com sucesso!');
        setVotoRegistrado(true);
    } catch (error) {
        setMensagem(error.response?.data?.message || 'Erro ao registrar voto');
    }
};

  if (votoRegistrado) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Obrigado por votar!</h2>
        <p>{mensagem}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Votação</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Digite seu CPF: </label>
        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="000.000.000-00"
        />
      </div>
      
      {mensagem && <div style={{ color: 'red', margin: '10px 0' }}>{mensagem}</div>}
      
      <h3>Selecione seu candidato:</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {candidatos.map(candidato => (
          <div 
            key={candidato.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              cursor: 'pointer',
              width: '150px'
            }}
            onClick={() => handleVotar(candidato.id)}
          >
            <h4>{candidato.nome}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VotacaoPanel;
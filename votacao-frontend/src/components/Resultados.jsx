import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Resultados() {
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    carregarResultados();
  }, []);

  const carregarResultados = async () => {
    try {
      const response = await api.resultados();
      setResultados(response.data);
    } catch (error) {
      console.error('Erro ao carregar resultados:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Resultados da Votação</h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Posição</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Candidato</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Votos</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((candidato, index) => (
            <tr key={candidato.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{index + 1}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{candidato.nome}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{candidato.votos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Resultados;
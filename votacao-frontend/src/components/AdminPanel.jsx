import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminPanel({ onLogout }) {
  const [votacaoAtiva, setVotacaoAtiva] = useState(false);
  const [candidatos, setCandidatos] = useState([]);
  const [votantes, setVotantes] = useState([]);
  const [novoCandidato, setNovoCandidato] = useState('');
  const [novoVotante, setNovoVotante] = useState({ nome: '', cpf: '' });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authData, setAuthData] = useState({ login: '', senha: '' });
  const navigate = useNavigate();

  useEffect(() => {
    carregarDados();
    verificarStatusVotacao();
  }, []);

  const carregarDados = async () => {
    try {
      const [cands, vots] = await Promise.all([
        api.listarCandidatos(),
        api.listarVotantes()
      ]);
      setCandidatos(cands.data);
      setVotantes(vots.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const verificarStatusVotacao = async () => {
    try {
      const response = await api.statusVotacao();
      setVotacaoAtiva(response.data);
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
  };

  const handleIniciarVotacao = async () => {
    try {
      await api.iniciarVotacao();
      setVotacaoAtiva(true);
    } catch (error) {
      console.error('Erro ao iniciar votação:', error);
    }
  };

  const handleFinalizarVotacao = async () => {
    try {
      await api.encerrarVotacao();
      setVotacaoAtiva(false);
      navigate('/resultados'); 
    } catch (error) {
      console.error('Erro ao encerrar votação:', error);
    }
  };

 

  const handleAddCandidato = async () => {
    try {
      await api.criarCandidato({ nome: novoCandidato });
      setNovoCandidato('');
      carregarDados();
    } catch (error) {
      console.error('Erro ao adicionar candidato:', error);
    }
  };

  const handleAddVotante = async () => {
    try {
      await api.criarVotante(novoVotante);
      setNovoVotante({ nome: '', cpf: '' });
      carregarDados();
    } catch (error) {
      console.error('Erro ao adicionar votante:', error);
    }
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <button
        onClick={onLogout}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '5px 10px',
          background: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Sair
      </button>

      <h2>Painel de Administração</h2>

      <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Controle de Votação</h3>
        <p>Status: {votacaoAtiva ? 'Ativa' : 'Inativa'}</p>
        {!votacaoAtiva ? (
          <button onClick={handleIniciarVotacao}>Iniciar Votação</button>
        ) : (
          <button onClick={handleFinalizarVotacao}>Finalizar Votação</button>
        )}
        {votacaoAtiva && (
          <button onClick={() => navigate('/votacao')}>Ir para Votação</button>
        )}
      </div>

      {/* Modal de autenticação para finalizar votação */}
      {showAuthModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '300px'
          }}>
            <h3>Autenticação Requerida</h3>
            <form onSubmit={handleAuthSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label>Login:</label>
                <input
                  type="text"
                  value={authData.login}
                  onChange={(e) => setAuthData({ ...authData, login: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Senha:</label>
                <input
                  type="password"
                  value={authData.senha}
                  onChange={(e) => setAuthData({ ...authData, senha: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit">Confirmar</button>
                <button type="button" onClick={() => setShowAuthModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restante do seu código permanece igual */}
      <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Cadastrar Candidato</h3>
        <input
          type="text"
          value={novoCandidato}
          onChange={(e) => setNovoCandidato(e.target.value)}
          placeholder="Nome do candidato"
        />
        <button onClick={handleAddCandidato}>Adicionar</button>

        <h4>Candidatos Cadastrados</h4>
        <ul>
          {candidatos.map(c => (
            <li key={c.id}>{c.nome}</li>
          ))}
        </ul>
      </div>

      <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Cadastrar Votante</h3>
        <input
          type="text"
          value={novoVotante.nome}
          onChange={(e) => setNovoVotante({ ...novoVotante, nome: e.target.value })}
          placeholder="Nome"
        />
        <input
          type="text"
          value={novoVotante.cpf}
          onChange={(e) => setNovoVotante({ ...novoVotante, cpf: e.target.value })}
          placeholder="CPF"
        />
        <button onClick={handleAddVotante}>Adicionar</button>

        <h4>Votantes Cadastrados</h4>
        <ul>
          {votantes.map(v => (
            <li key={v.id}>{v.nome} - {v.cpf} - {v.votou ? 'Já votou' : 'Não votou'}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPanel;
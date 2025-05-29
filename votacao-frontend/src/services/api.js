import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

export default {
  // Auth
  login(credenciais) {
    return api.post('/auth/login', credenciais);
  },

  // Votação
  iniciarVotacao() {
    return api.post('/votacao/iniciar');
  },

  encerrarVotacao() {
    return api.post('/votacao/encerrar');
  },

  statusVotacao() {
    return api.get('/votacao/status');
  },

  votar(candidatoId, cpf) {
    return api.post(`/votacao/votar/${candidatoId}?cpfVotante=${cpf}`);
  },

  resultados() {
    return api.get('/votacao/resultados');
  },

  listarCandidatos() {
    return api.get('/votacao/candidatos');
  },

  // Admin
  criarCandidato(formData) {
    return api.post('/admin/candidatos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  criarVotante(votante) {
    return api.post('/admin/votantes', votante);
  },

  listarVotantes() {
    return api.get('/admin/votantes');
  },
  //PRA VOTAÇAO rever depois
  verificarAdmin(login, senha) {
    return api.post('/auth/verify-admin', { login, senha });
  },

};
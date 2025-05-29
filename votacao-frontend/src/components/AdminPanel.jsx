import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper
} from '@mui/material';
import {
  LockOpen,
  HowToVote,
  PersonAdd,
  Person,
  HowToReg,
  Login,
  Logout,
  PhotoCamera
} from '@mui/icons-material';

function AdminPanel({ onLogout }) {
  const [votacaoAtiva, setVotacaoAtiva] = useState(false);
  const [candidatos, setCandidatos] = useState([]);
  const [votantes, setVotantes] = useState([]);
  const [novoCandidato, setNovoCandidato] = useState({
    nome: '',
    foto: null,
    fotoPreview: ''
  });
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
      const formData = new FormData();
      formData.append('nome', novoCandidato.nome); // Aqui estava o problema
      if (novoCandidato.foto) {
        formData.append('foto', novoCandidato.foto);
      }

      // Debug: Verifique o que está sendo enviado
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await api.criarCandidato(formData);
      setNovoCandidato({
        nome: '',
        foto: null,
        fotoPreview: ''
      });
      carregarDados();
    } catch (error) {
      console.error('Erro ao adicionar candidato:', error);
      alert('Erro ao adicionar candidato: ' + error.message);
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

  const handleFotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNovoCandidato({
        ...novoCandidato,
        foto: file,
        fotoPreview: URL.createObjectURL(file)
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      <Button
        variant="contained"
        color="error"
        startIcon={<Logout />}
        onClick={onLogout}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
        }}
      >
        Sair
      </Button>

      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        <LockOpen sx={{ verticalAlign: 'middle', mr: 1 }} />
        Painel de Administração
      </Typography>

      {/* Controle de Votação */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <HowToVote sx={{ mr: 1 }} />
            Controle de Votação
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Status:
            </Typography>
            <Chip
              label={votacaoAtiva ? 'Ativa' : 'Inativa'}
              color={votacaoAtiva ? 'success' : 'error'}
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {!votacaoAtiva ? (
              <Button
                variant="contained"
                startIcon={<HowToVote />}
                onClick={handleIniciarVotacao}
              >
                Iniciar Votação
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleFinalizarVotacao}
              >
                Finalizar Votação
              </Button>
            )}
            {votacaoAtiva && (
              <Button
                variant="outlined"
                startIcon={<Login />}
                onClick={() => navigate('/votacao')}
              >
                Ir para Votação
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Modal de autenticação */}
      <Dialog open={showAuthModal} onClose={() => setShowAuthModal(false)}>
        <DialogTitle>Autenticação Requerida</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Login"
            value={authData.login}
            onChange={(e) => setAuthData({ ...authData, login: e.target.value })}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            label="Senha"
            type="password"
            value={authData.senha}
            onChange={(e) => setAuthData({ ...authData, senha: e.target.value })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAuthModal(false)}>Cancelar</Button>
          <Button type="submit" variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>

      {/* Cadastro de Candidatos */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Person sx={{ mr: 1 }} />
            Cadastrar Candidato
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={novoCandidato.nome}
              onChange={(e) => setNovoCandidato({ ...novoCandidato, nome: e.target.value })}
              placeholder="Nome do candidato"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
            >
              Adicionar Foto
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFotoChange}
              />
            </Button>

            {novoCandidato.fotoPreview && (
              <Avatar
                src={novoCandidato.fotoPreview}
                sx={{ width: 56, height: 56 }}
              />
            )}
          </Box>

          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleAddCandidato}
            disabled={!novoCandidato.nome}
          >
            Adicionar Candidato
          </Button>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Candidatos Cadastrados ({candidatos.length})
          </Typography>

          <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
            <List dense>
              {candidatos.map(c => (
                <ListItem key={c.id}>
                  <ListItemAvatar>
                    {c.fotoUrl ? (
                      <Avatar
                        src={c.fotoUrl}  
                        sx={{
                          width: 56,
                          height: 56,
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Avatar>
                        <Person />
                      </Avatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText primary={c.nome} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </CardContent>
      </Card>

      {/* Cadastro de Votantes */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <HowToReg sx={{ mr: 1 }} />
            Cadastrar Votante
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={novoVotante.nome}
              onChange={(e) => setNovoVotante({ ...novoVotante, nome: e.target.value })}
              placeholder="Nome"
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={novoVotante.cpf}
              onChange={(e) => setNovoVotante({ ...novoVotante, cpf: e.target.value })}
              placeholder="CPF"
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={handleAddVotante}
              sx={{ minWidth: '120px' }}
            >
              Adicionar
            </Button>
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Votantes Cadastrados ({votantes.length})
          </Typography>

          <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
            <List dense>
              {votantes.map(v => (
                <ListItem key={v.id}>
                  <ListItemText
                    primary={`${v.nome} - ${v.cpf}`}
                    secondary={v.votou ? 'Já votou' : 'Não votou'}
                    secondaryTypographyProps={{
                      color: v.votou ? 'success.main' : 'error.main',
                      fontSize: '0.75rem'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </CardContent>
      </Card>
    </Container>
  );
}

export default AdminPanel;
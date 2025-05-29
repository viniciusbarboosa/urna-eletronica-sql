import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  LinearProgress,
  TextField,
  Typography,
  Avatar,
  Chip,
  Alert,
  Paper
} from '@mui/material';
import {
  HowToVote,
  Person,
  CheckCircle,
  ArrowBack
} from '@mui/icons-material';

function VotacaoPanel() {
  const [candidatos, setCandidatos] = useState([]);
  const [cpf, setCpf] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [votoRegistrado, setVotoRegistrado] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarCandidatos();
  }, []);

  const carregarCandidatos = async () => {
    try {
      setLoading(true);
      const response = await api.listarCandidatos();
      setCandidatos(response.data);
    } catch (error) {
      console.error('Erro ao carregar candidatos:', error);
      setMensagem('Erro ao carregar candidatos');
    } finally {
      setLoading(false);
    }
  };

  const handleVotar = async (candidatoId) => {
    try {
      const cpfNumerico = cpf.replace(/\D/g, '');

      if (!cpfNumerico || cpfNumerico.length !== 11) {
        setMensagem('CPF inválido! Digite os 11 números');
        return;
      }

      setLoading(true);
      await api.votar(candidatoId, cpfNumerico);
      setMensagem('Voto registrado com sucesso!');
      setVotoRegistrado(true);
    } catch (error) {
      let mensagemErro = 'Erro ao registrar voto';

      if (error.response) {
        mensagemErro = error.response.data || mensagemErro;
      }

      setMensagem(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  if (votoRegistrado) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Obrigado por votar!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Seu voto foi registrado com sucesso.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => {
              setVotoRegistrado(false);
              setCpf('');
              setMensagem('');
            }}
          >
            Voltar
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {loading && <LinearProgress />}

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 4,
        gap: 2
      }}>
        <HowToVote color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Votação Eletrônica
        </Typography>
      </Box>

      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Identificação do Eleitor
          </Typography>

          <TextField
            fullWidth
            label="Digite seu CPF (apenas números)"
            variant="outlined"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="Digite os 11 números do CPF"
            inputProps={{
              maxLength: 11,
              inputMode: 'numeric',
              pattern: '[0-9]*'
            }}
            sx={{ mb: 2 }}
          />

          {mensagem && (
            <Alert severity={mensagem.includes('sucesso') ? 'success' : 'error'} sx={{ mb: 2 }}>
              {mensagem}
            </Alert>
          )}
        </CardContent>
      </Card>

      <Typography variant="h5" component="h2" gutterBottom sx={{
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 3
      }}>
        <Person fontSize="large" />
        Selecione seu candidato:
      </Typography>

      {candidatos.length === 0 && !loading && (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Nenhum candidato disponível para votação
          </Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {candidatos.map(candidato => (
          <Grid item xs={12} sm={6} md={4} key={candidato.id}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 6
                }
              }}
              onClick={() => handleVotar(candidato.id)}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                {candidato.fotoUrl ? (
                  <Box
                    component="img"
                    src={candidato.fotoUrl}
                    alt={candidato.nome}
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      margin: '0 auto 16px',
                      border: '3px solid #1976d2'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                    }}
                  />
                ) : (
                  <Avatar sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto 16px',
                    bgcolor: 'primary.main',
                    fontSize: '2rem'
                  }}>
                    {candidato.nome.charAt(0)}
                  </Avatar>
                )}

                <Typography variant="h6" component="h3" gutterBottom>
                  {candidato.nome}
                </Typography>

                <Chip
                  icon={<HowToVote fontSize="small" />}
                  label="Votar neste candidato"
                  color="primary"
                  variant="outlined"
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default VotacaoPanel;
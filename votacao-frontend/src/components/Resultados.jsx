import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip,
  Avatar
} from '@mui/material';
import {
  EmojiEvents,
  Person,
  Equalizer,
  MilitaryTech
} from '@mui/icons-material';

function Resultados() {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarResultados();
  }, []);

  const carregarResultados = async () => {
    try {
      setLoading(true);
      const response = await api.resultados();
      setResultados(response.data);
    } catch (error) {
      console.error('Erro ao carregar resultados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular total de votos para porcentagem
  const totalVotos = resultados.reduce((total, candidato) => total + candidato.votos, 0);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {loading && <LinearProgress />}
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        justifyContent: 'space-between'
      }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Equalizer fontSize="large" color="primary" />
          Resultados da Votação
        </Typography>
        
        <Chip 
          avatar={<Avatar>{totalVotos}</Avatar>}
          label="Total de votos"
          color="primary"
          variant="outlined"
        />
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Posição</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Candidato</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Votos</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Porcentagem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resultados.map((candidato, index) => {
              const porcentagem = totalVotos > 0 ? (candidato.votos / totalVotos * 100) : 0;
              
              return (
                <TableRow key={candidato.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {index === 0 ? (
                        <EmojiEvents fontSize="small" color="warning" />
                      ) : index === 1 ? (
                        <MilitaryTech fontSize="small" color="action" />
                      ) : (
                        <Person fontSize="small" color="action" />
                      )}
                      {index + 1}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: index < 3 ? 'bold' : 'normal' }}>
                    {candidato.nome}
                  </TableCell>
                  <TableCell align="right">{candidato.votos}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={porcentagem} 
                        sx={{ 
                          height: 8,
                          borderRadius: 4,
                          flexGrow: 1,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: index < 3 ? 'primary.main' : 'grey.500'
                          }
                        }} 
                      />
                      <Typography variant="body2" color="text.secondary">
                        {porcentagem.toFixed(1)}%
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {resultados.length === 0 && !loading && (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Nenhum resultado disponível ainda
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

export default Resultados;
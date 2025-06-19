import React from 'react';
import { createUseStyles } from 'react-jss';
import { useGetPokemons } from '../../hooks/useGetPokemons';
import {
  useNavigate,
  useLocation,
  useParams,
  useMatch,
} from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useGetPokemonDetails } from 'src/hooks/useGetPokemonDetails';

export const PokemonList = () => {
  const classes = useStyles();
  const { pokemons, loading } = useGetPokemons();
  const [search, setSearch] = React.useState('');
  const navigate = useNavigate();

  const match = useMatch('/pokemon/:pokemonId');
  const pokemonId = match?.params.pokemonId;

  const { pokemon: selectedPokemon, loading: detailedPokemonLoading } =
    useGetPokemonDetails(pokemonId);

  const filteredPokemons = pokemons.filter((pkmn) =>
    pkmn.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (pkmn: (typeof pokemons)[0]) => {
    navigate(`/pokemon/${pkmn.id}`);
  };

  const handleCloseDialog = () => {
    navigate('/pokemon', { replace: true });
  };

  return (
    <div className={classes.root}>
      <input
        type="text"
        placeholder="Search Pokémon"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={classes.input}
      />
      {loading && <div>Loading...</div>}
      {filteredPokemons.map((pkmn) => (
        <div
          key={pkmn.id}
          className={classes.btnTxt}
          onClick={() => handleOpenDialog(pkmn)}
        >
          <img src={pkmn.image} alt={pkmn.name} className={classes.image} />
          {pkmn.id + ' - ' + pkmn.number + ' Types: ' + pkmn.types.join(', ')}
        </div>
      ))}
      <Dialog
        open={!!pokemonId}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        className={classes.popup}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: '#171E2b', // Couldn't find a way to set this via JSS
            },
          },
        }}
      >
        <DialogTitle>
          {detailedPokemonLoading || selectedPokemon === undefined
            ? 'Loading...'
            : selectedPokemon.name}
        </DialogTitle>
        <DialogContent dividers>
          {detailedPokemonLoading && <div>Loading details...</div>}
          {selectedPokemon && (
            <div>
              <img
                src={selectedPokemon.image}
                alt={selectedPokemon.name}
                className={classes.image}
              />
              <p>
                <strong>Number:</strong> {selectedPokemon.number}
              </p>
              <p>
                <strong>Classification:</strong>{' '}
                {selectedPokemon.classification}
              </p>
              <p>
                <strong>Types:</strong> {selectedPokemon.types.join(', ')}
              </p>
              <p>
                <strong>Resistant:</strong>{' '}
                {selectedPokemon.resistant.join(', ')}
              </p>
              <p>
                <strong>Weaknesses:</strong>{' '}
                {selectedPokemon.weaknesses.join(', ')}
              </p>
              <p>
                <strong>Height:</strong> {selectedPokemon.height.minimum} -{' '}
                {selectedPokemon.height.maximum}
              </p>
              <p>
                <strong>Weight:</strong> {selectedPokemon.weight.minimum} -{' '}
                {selectedPokemon.weight.maximum}
              </p>
              <p>
                <strong>Flee Rate:</strong> {selectedPokemon.fleeRate}
              </p>
              <p>
                <strong>Max CP:</strong> {selectedPokemon.maxCP}
              </p>
              <p>
                <strong>Max HP:</strong> {selectedPokemon.maxHP}
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const useStyles = createUseStyles(
  {
    root: {
      width: '100%',
      textAlign: 'center',
      padding: '32px',
      boxSizing: 'border-box',
    },
    btnTxt: {
      width: '100%',
      padding: '8px',
      boxSizing: 'border-box',
      borderRadius: '4px',
      backgroundColor: '#171E2b',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#202634',
      },
      cursor: 'pointer',
    },
    input: {
      width: '300px',
      padding: '8px',
      marginBottom: '16px',
      boxSizing: 'border-box',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '16px',
      color: '#333',
    },
    image: {
      height: 48,
      marginRight: 8,
      verticalAlign: 'middle',
    },
    popup: {
      padding: '16px',
      borderRadius: '8px',
    },
  },
  { name: 'PokemonList' }
);

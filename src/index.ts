import express from 'express';
import { mongoConnection } from './infra/database/mongodb/mongoConnection';
import { DatabaseClientSingleton } from './infra/database/databaseClientSingleton';
const cors = require('cors');
import 'dotenv/config';
import { redisConnection } from './infra/cacheDatabase/redis/redisConnection';
import { DatabaseCacheClientSingleton } from './infra/cacheDatabase/databaseCacheClientSingleton';

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Conecta com os bancos antes de configurar o servidor
    const client = await mongoConnection();
    DatabaseClientSingleton.setInstance(client);
    const cachedClient = await redisConnection();
    DatabaseCacheClientSingleton.setInstance(cachedClient);

    // Inicializa o Express apenas depois da conexão
    const app: express.Application = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Importa dinamicamente os módulos que dependem do banco ou das rotas
    const { SpotifyService } = await import('./infra/musicAPI/spotify/spotifyService');
    const { SpotifyDto } = await import('./infra/musicAPI/spotify/spotifyDto');
    const { MusicRepository } = await import('./infra/musicAPI/musicRepository');
    const { DeezerDto } = await import('./infra/musicAPI/deezer/deezerDto');
    const { MusicController } = await import('./useCase/controllers/musicController');
    const { GameController } = await import('./useCase/controllers/gameController');

    // Rotas corrigidas com `next(error)`
    app.get('/callback', (req, res, next) => {
      const { code } = req.query;
      const spotifyService = new SpotifyService();
      spotifyService.getAccessToken(code as string)
        .then((token) => res.send(token))
        .catch(next);
    });

    app.get('/refresh', (req, res, next) => {
      const { refreshToken } = req.query;
      const spotifyService = new SpotifyService();
      spotifyService.getRefreshToken(refreshToken as string)
        .then((token) => res.send(token))
        .catch(next);
    });

    app.get('/playlist', (req, res, next) => {
      const { accessToken } = req.query;
      const musicRepository = new MusicRepository(new SpotifyDto(), new DeezerDto());
      musicRepository.getAllPlaylists(accessToken as string)
        .then((playlists) => res.send(playlists))
        .catch(next);
    });

    app.get('/playlist/:id', (req, res, next) => {
      const { accessToken } = req.query;
      const { id } = req.params;
      const musicRepository = new MusicRepository(new SpotifyDto(), new DeezerDto());
      musicRepository.getPlaylistTrack(accessToken as string, id)
        .then((tracks) => res.send(tracks))
        .catch(next);
    });

    app.get('/track/:name/:artist', (req, res, next) => {
      const { name, artist } = req.params;
      const musicController = new MusicController();
      musicController.getSongsPreviewByName(name, artist)
        .then((tracks) => res.send(tracks))
        .catch(next);
    });

    app.post('/createRoom', (req, res, next) => {
      const { playlists_id, owner_id, players, round, max_round, accessToken } = req.body;
      const gameController = new GameController();
      gameController.createRoom(playlists_id, owner_id, players, round, max_round, accessToken)
        .then((roomInfo) => {
          const room = roomInfo.room_info;
          const songs = roomInfo.songs;
          const result = {
            playlists_id: room.playlists_id,
            status: room.status,
            owner_id: room.owner_id,
            players: room.players,
            round: room.round,
            max_round: room.max_round,
            songs,
          };
          res.status(201).send(result);
        })
        .catch(next);
    });

    app.get('/room/:id', (req, res, next) => {
      const { id } = req.params;
      const gameController = new GameController();
      gameController.getRoomStatus(id)
        .then((room) => res.status(200).send(room))
        .catch(next);
    });

    app.post('/startRound', (req, res, next) => {
      const { room_id } = req.body;
      const gameController = new GameController();
      gameController.startRound(room_id)
        .then((room) => res.status(200).send(room))
        .catch(next);
    });

    app.get('/getAllRoom', (req, res, next) => {
      const gameController = new GameController();
      gameController.getAllRoomsId()
        .then((rooms) => res.status(200).send(rooms))
        .catch(next);
    });

    app.delete('/deleteAllRooms/', (req, res, next) => {
      const gameController = new GameController();
      gameController.deleteAllRooms()
        .then(() => res.status(200).send('All rooms deleted'))
        .catch(next);
    });

    // Inicia o servidor somente depois que tudo estiver configurado
    app.listen(PORT, () => {
      console.log(`Server is running on LINK: http://${process.env.DOMAIN}:${PORT}`);
    });


  } catch (error) {
    console.error('Erro ao iniciar a aplicação:', error);
    process.exit(1);
  }
})();

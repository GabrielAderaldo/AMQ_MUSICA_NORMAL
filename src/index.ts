import express from 'express';
import { SpotifyService } from './infra/musicAPI/spotify/spotifyService';
import { SpotifyDto } from './infra/musicAPI/spotify/spotifyDto';
import { MusicRepository } from './infra/musicAPI/musicRepository';
import { DeezerDto } from './infra/musicAPI/deezer/deezerDto';
import { MusicController } from './useCase/controllers/musicController';

const app: express.Application = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/callback', (req, res) => {
  const { code } = req.query;
  const spotifyService = new SpotifyService();
  spotifyService.getAccessToken(code as string)
    .then((token) => {
      res.send(token);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
})

app.get('/refresh', (req, res) => {
  const { refreshToken } = req.query;
  const spotifyService = new SpotifyService();
  spotifyService.getRefreshToken(refreshToken as string)
    .then((token) => {
      res.send(token);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
})

app.get('/playlist', (req, res) => {
  const { accessToken } = req.query;
  const musicInfomationRepository = new MusicRepository(new SpotifyDto(),new DeezerDto());
  musicInfomationRepository.getAllPlaylists(accessToken as string)
    .then((playlists) => {
      res.send(playlists);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
  
})


app.get('/playlist/:id', (req, res) => {
  const { accessToken } = req.query;
  const { id } = req.params;
  const musicInfomationRepository = new MusicRepository(new SpotifyDto(),new DeezerDto());
  musicInfomationRepository.getPlaylistTrack(accessToken as string, id)
    .then((tracks) => {
      res.send(tracks);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
})

app.get('/track/:name/:artist', (req, res) => {
  const { name,artist } = req.params;
  const musicController = new MusicController();
  musicController.getSongsPreviewByName(name, artist)
    .then((tracks) => {
      res.send(tracks);
    })
    .catch((error) => {
      console.log(error);
      res.status(500)
    });

})



app.listen(PORT, () => {
  console.log(`Server is running on LINK: http://${process.env.DOMAIN}:${PORT}`);
});
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {ohmRepository} = require('./di');
app.use(bodyParser.json());


function serve() {
  app.get('/ohms/:id', async (req, res) => {
    const ohm = await ohmRepository.getOhmById(req.params.id);
    res.send(ohm);
  });

  app.get('/ohms/search-tracking-id/:trackingId', async (req, res) => {
    const ohm = await ohmRepository.getOhmByTrackingId(req.params.trackingId);
    if(ohm){
      res.send(ohm);
      return;
    }
    res.sendStatus(404);
  });

  app.listen(3000, () => console.log('listening on port 3000'));
}

serve();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const useCase = require('./useCase');
const {ohmRepository} = require('./di');
app.use(bodyParser.json());

/**
 * 
 * @param {import("./domain/ohm/Ohm").Ohm}ohm
 */
const serializeOhm = (ohm) => {
  const snapshot = ohm.toSnapshot();
  return {
    id: snapshot.id,
    trackingId: snapshot.trackingId,
    status: snapshot.status,
    comment: snapshot.comment,
    description: snapshot.description,
    volts: snapshot.volts,
    emperes: snapshot.emperes,
    client: snapshot.client,
    history: snapshot.history,
    canBeFinalized: ohm.canBeFinalized(),
  }
}

function serve() {
  app.get('/ohms/:id', async (req, res) => {
    const ohm = await ohmRepository.getOhmById(req.params.id);
    res.send(serializeOhm(ohm));
  });

  app.get('/ohms/search-tracking-id/:trackingId', async (req, res) => {
    const ohm = await ohmRepository.getOhmByTrackingId(req.params.trackingId);
    if(ohm){
      res.send(serializeOhm(ohm));
      return;
    }
    res.sendStatus(404);
  });

  app.post('/ohms/search-tracking-id/:trackingId/delivered', async (req, res) => {
    try {
      const {ohm, error} = await useCase.markOhmAsDelivered({trackingId:req.params.trackingId});
      if (error) {
        if (ohm) {
          return res.status(400).send({error});
        }
        return res.sendStatus(404);
      }
      res.send(serializeOhm(ohm));
    } catch (e) {
      console.error('Not able to mark ohm as delivered', e);
      return res.status(500).send({error:'Ooops! Something went wrong'});
    }
  });

  app.post('/ohms/search-tracking-id/:trackingId/refused', async (req, res) => {
    try {
      const {ohm, error} = await useCase.markOhmAsRefused({trackingId:req.params.trackingId, reason: req.body.reason});
      if (error) {
        if (ohm) {
          return res.status(400).send({error});
        }
        return res.sendStatus(404);
      }
      res.send(serializeOhm(ohm));
    } catch (e) {
      console.error('Not able to mark ohm as refused', e);
      return res.status(500).send({error:'Ooops! Something went wrong'});
    }
  });

  app.listen(3000, () => console.log('listening on port 3000'));
}

serve();

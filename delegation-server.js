// delegation-server.js
const express = require('express');
const fs = require('fs');
const { create } = require('@web3-storage/w3up-client');

const app = express();
const PORT = 3001; // You can change this if needed

// Load your space DID from env
const SPACE_DID = process.env.VITE_STORACHA_SPACE_DID;

app.get('/delegation', async (req, res) => {
  const agentDid = req.query.agentDid;
  if (!agentDid) {
    return res.status(400).send('Missing agentDid');
  }
  try {
    const client = await create();
    await client.setCurrentSpace(SPACE_DID);
    const abilities = ['space/blob/add', 'space/index/add', 'filecoin/offer', 'upload/add'];
    const expiration = Math.floor(Date.now() / 1000) + (60 * 60 * 24); // 24 hours
    const delegation = await client.createDelegation(agentDid, abilities, { expiration });
    const archive = await delegation.archive();
    res.setHeader('Content-Type', 'application/car');
    res.send(Buffer.from(archive.ok));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create delegation');
  }
});

app.listen(PORT, () => {
  console.log(`Delegation server running on http://localhost:${PORT}`);
}); 
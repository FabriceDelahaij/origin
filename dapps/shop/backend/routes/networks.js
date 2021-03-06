const { authSuperUser } = require('./_auth')
const { Network } = require('../models')
const { getConfig, setConfig } = require('../utils/encryptedConfig')
const startListener = require('../listener')

module.exports = function(app) {
  app.post('/networks', authSuperUser, async (req, res) => {
    const networkObj = {
      networkId: req.body.netId,
      provider: req.body.provider,
      providerWs: req.body.providerWs,
      ipfs: req.body.ipfs,
      ipfsApi: req.body.ipfsApi,
      marketplaceContract: req.body.marketplaceContract,
      marketplaceVersion: req.body.marketplaceVersion,
      active: true,
      config: setConfig({
        pinataKey: req.body.pinataKey,
        pinataSecret: req.body.pinataSecret,
        cloudflareEmail: req.body.cloudflareEmail,
        cloudflareApiKey: req.body.cloudflareApiKey,
        domain: req.body.domain
      })
    }

    const existing = await Network.findOne({
      where: { networkId: req.body.netId }
    })
    if (existing) {
      await Network.update(networkObj, {
        where: { networkId: networkObj.networkId }
      })
    } else {
      await Network.create(networkObj)
    }

    startListener()

    res.json({ success: true })
  })

  app.get('/networks/:netId', authSuperUser, async (req, res) => {
    const network = await Network.findOne({
      where: { networkId: req.params.netId }
    })
    if (!network) {
      return res.json({ success: false, reason: 'no-network' })
    }
    console.log(network)
    if (!network.config) {
      return res.json({ success: false, reason: 'no-network-config' })
    }

    const config = getConfig(network.config)
    res.json({ network, config })
  })
}

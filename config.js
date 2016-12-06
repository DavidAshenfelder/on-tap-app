module.exports = {
  database: process.env.MONGO_URI || 'localhost/boomtap',
  port: process.env.PORT || 3000,
  clientId: process.env.CLIENT_ID || '71fb40b84a5c2abb0dc3019872414e7c',
  clientSecret: process.env.CLIENT_SECRET || '59b634e2c247c98b353fa2098133956c',
  // beerbotToken: 'xoxb-86166028993-oDGzwQK7QY99GjKaPOcTyynp',
  // beerbotName: 'beer_bot',
  // beerbotParams: { icon_emoji: ':beer:' },
  // beerbotChannels: {
  //   beerbarons: 'beerbarons',
  //   boomtap: 'boomtap',
  //   general: 'general'
  // },
  adminPassword: process.env.ADMIN_PASSWORD
};

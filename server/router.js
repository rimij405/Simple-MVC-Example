const controllers = require('./controllers');

const router = (app) => {
  // GET requests.
  // Pages.
  app.get('/page1', controllers.page1);
  app.get('/page2', controllers.page2);
  app.get('/page3', controllers.page3);
  app.get('/page4', controllers.page4);

  // READ
  app.get('/getName', controllers.getCatName);
  app.get('/getDogName', controllers.getDogName);
  app.get('/findByName', controllers.searchCatName);
  app.post('/findDogByName', controllers.searchDogName);

  // POST requests.

  // CREATE
  app.post('/setName', controllers.setCatName);
  app.post('/setDogName', controllers.setDogName);

  // UPDATE
  app.post('/updateLast', controllers.updateLastCat);
  app.post('/updateAge', controllers.updateLastDog);
  
  // Index.
  app.get('/', controllers.index);
  app.get('/*', controllers.notFound);
};

// export the router function
module.exports = router;

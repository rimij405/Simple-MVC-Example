// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

// reference for cat and dog models.
const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;

// default fake data so that we have something to work with until we make a real Cat
const defaultData = {
  cat: {
    name: 'unknown',
    bedsOwned: 0,
  },
  dog: {
    name: 'unknown',
    breed: 'unknown',
    age: 0,
  },
};

// object for us to keep track of the last Cat we made and dynamically update it sometimes
const lastAdded = {
  cat: new Cat(defaultData.cat),
  dog: new Dog(defaultData.dog)
};

// READ methods.
// READ ALL
// CATS
const readAllCats = (req, res, callback) => {
  Cat.find(callback);
};
// DOGS
const readAllDogs = (req, res, callback) => {
  Dog.find(callback);
};
// READ ONE
// CAT
const readCat = (req, res) => {
  const name = req.query.name;
  const callback = (err, doc) => {
    if (err) {
      return res.json({ err });
    }
    return res.json(doc);
  };
  Cat.findByName(name, callback);
};
// DOG
const readDog = (req, res) => {
  const name = req.query.name;
  const callback = (err, doc) => {
    if (err) {
      return res.json({ err });
    }
    return res.json(doc);
  };
  Dog.findByName(name, callback);
};

// GET NAME
// CAT
const getCatName = (req, res) => {
  res.json({ name: lastAdded.cat.name });
};
// DOG
const getDogName = (req, res) => {
  res.json({ name: lastAdded.dog.name });
};

// SET NAME
// CAT
const setCatName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname, lastname, and beds are all required.' });
  }

  const name = `${req.body.firstname} ${req.body.lastname}`;

  // dummy JSON to insert into database
  const catData = {
    name,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);

  const savePromise = newCat.save();

  savePromise.then(() => {
    lastAdded.cat = newCat;
    res.json({ name: lastAdded.cat.name, beds: lastAdded.cat.bedsOwned });
  });

  savePromise.catch(err => res.json({ err }));

  return res;
};
// DOG
const setDogName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.age || !req.body.breed) {
    return res.status(400).json({ error: 'firstname, lastname, breed, and age are all required.' });
  }

  const name = `${req.body.firstname} ${req.body.lastname}`;

  const dogData = {
    name,
    breed: req.body.breed,
    age: req.body.age,
  };

  const newDog = new Dog(dogData);

  const savePromise = newDog.save();

  savePromise.then(() => {
    // lastAdded.dog = newDog;
    // res.json({ name: lastAdded.dog.name, breed: lastAdded.dog.breed, age: lastAdded.dog.age });
    res.json({ name: newDog.name, breed: newDog.breed, age: newDog.age });
  });

  savePromise.catch(err => res.json({ err }));

  return res;
};

// SEARCH NAME
// CAT
const searchCatName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }

  return Cat.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    if (!doc) {
      return res.json({ error: 'No cats with name `' + req.query.name + '` found' });
    }

    return res.json({ name: doc.name, beds: doc.bedsOwned });
  });
};
// DOG
const searchDogName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }

  return Dog.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.json({ err });
    }

    if (!doc) {
      return res.json({ error: 'No dogs with name `' + req.query.name + '` found' });
    }

    return res.json({ name: doc.name, breed: doc.breed, age: doc.age });
  });
};

// UPDATE
// CAT
const updateLastCat = (req, res) => {
  if(lastAdded.cat.name === "unknown") {
    return res.status(400).json({ error: 'Last updated cat is unknown.' });
  }

  lastAdded.cat.bedsOwned++;

  const savePromise = lastAdded.cat.save();

  savePromise.then(() => res.json({
    name: lastAdded.cat.name,
    beds: lastAdded.cat.bedsOwned,
  }));

  savePromise.catch(err => res.json({ err }));
};
// DOG
const searchByNameAndUpdateAge = (req, res) => {
  // Missing search query error.
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is a required field.' });
  }

  const update = (req, res, dog) => {
    if(!dog) {
      return res.json({ error: 'No dog passed.' });
    }

    dog.age++;

    const savePromise = dog.save();

    savePromise.then(() => res.json({
      name: dog.name,
      breed: dog.breed,
      age: dog.age
    }));

    savePromise.catch(err => res.json({ err }));
  };

  const callback = (err, doc) => {
    if(err) {
      return res.json({ err }); // if error, return it.
    };

    if(!doc) {
      return res.json({ error: 'No dogs with name `' + req.body.name + '` found' });
    };
    
    return update(req, res, doc);
  };

  Dog.findByName(req.body.name, callback);
};

// NOT FOUND.
const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

// GET pages.
// INDEX
const hostIndex = (req, res) => {
  res.render('index', {
    currentCatName: lastAdded.cat.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};
// PAGE 1 - Show all cats.
const hostPage1 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }
    return res.render('page1', { cats: docs });
  };
  readAllCats(req, res, callback);
};
// PAGE 2
const hostPage2 = (req, res) => {
  res.render('page2');
};
// PAGE 3
const hostPage3 = (req, res) => {
  res.render('page3');
};
// PAGE 4 - Show all dogs.
const hostPage4 = (req, res) => {
  const callback = (err, docs) => {
    if(err) {
      return res.json({ err }); // if error, return it.
    };
    return res.render('page4', { dogs: docs }); // Set the dogs as the response from the readAllDogs method.
  };
  readAllDogs(req, res, callback);
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  readAllCats,
  readAllDogs,
  readCat,
  readDog,
  getCatName,
  getDogName,
  setCatName,
  setDogName,
  updateLastCat,
  searchByNameAndUpdateAge,
  searchCatName,
  searchDogName,
  notFound,
};

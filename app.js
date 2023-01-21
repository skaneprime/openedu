import mongoose from 'mongoose';

export default (express, bodyParser, createReadStream, crypto, http) => {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.text());
  
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
    next();
  });

  app.all('/login/', (req, res) => res.send('itmo336261'));
  
  app.all('/code/', (req, res) => {
    const filePath = import.meta.url.substring(7);

    createReadStream(filePath).pipe(res);
  });
  
  app.all('/sha1/:input', (req, res) => {
    const hash = crypto.createHash('sha1').update(req.params.input).digest('hex');
    
    res.send(hash);
  });

  app.all('/req/', async (req, res) => {
    http.get(`${req.query.addr}`, (resp) => {
      let data = '';

      resp.on('data', (chunk) => data += chunk);

      resp.on('end', () => res.send(data));
    })
  });

  app.all('*', (req, res) => res.send('itmo336261'));

  const User = mongoose.model('User', { login: String, password: String }, 'users');

  app.post('/insert/', async (req, res) => {
    const { connection } = await mongoose.connect(req.body.URL);

    await new User({ login: req.body.login, password: req.body.password }).save();

    connection.close();
    res.send('done');
  });

  return app;
}

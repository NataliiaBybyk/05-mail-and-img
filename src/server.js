import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';


const app=express();

//Використовуємо значення з .env або дефолтний порт 3000
const PORT = process.env.PORT ?? 3000;



//Middleware дозволяє обробляти дані у форматі JSON, які надходять у body запиту:
app.use(express.json());

// Middleware дозволяє робити запити з інших доменів;
app.use(cors());

//Middleware для логування:
app.use(pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
      messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
    },
  },
}),
);


//Mаршрут, який буде повертати всі нотатки:
app.get('/notes', (req, res)=>{
  //Відповідь сервера має бути зі статусом 200 та містити наступний об'єкт:
  res.status(200).json({message: "Retrieved all notes"});
});



//Mаршрут, який буде повертати одну нотатку за її ідентифікатором:
app.get('/notes/:noteId', (req, res)=>{
  const {noteId}=req.params;
  res.status(200).json({message: `Retrieved note with ID: ${noteId}`});
});



// //Маршрут для тестування імітації виникнення помилки:
app.get('/test-error', (req, res)=>{
  //Штучна помилка для прикладу
  throw new Error('Simulated server error');
});

//Middleware 404(після всіх маршрутів) для обробки всіх запитів, що не відповідають жодному наявному маршруту.
app.use((req, res)=>{
  res.status(404).json({message: 'Route not found'});
});

//Middleware для обробки помилок
app.use((err, req, res, next)=>{
  console.error(err);

  const isProd = process.env.NODE_ENV === "production";

  res.status(500).json({
    message: isProd
    ? 'Something went wrong. Please try again later.'
    : err.message,
  });
});



//Запуск сервера
app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`);
});

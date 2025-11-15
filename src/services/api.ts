
// import axios from 'axios';


// const $api = axios.create({

//   withCredentials: true, 
// });

// export default $api;












// import axios from 'axios';

// // Skillbox Cinema API - публичное API без ключей
// const API_URL = 'https://cinemaguide.skillbox.cc';

// const $api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // Для работы с cookies (авторизация)
// });

// export default $api;








// --- Файл: src/services/api.ts (ВОЗВРАЩАЕМ /api) ---
import axios from 'axios';

const $api = axios.create({
  // Для production (Vercel/Netlify) - /api проксируется на реальный API
  // Для development - можно настроить прокси в vite.config.ts
  baseURL: '/api', 
  withCredentials: true,
});

export default $api;
# Notes

- `__dirname` gives the absolute path of the folder where the current file exists. Not the file itself, but its directory.
- The router reads db.json and automatically exposes CRUD REST APIs, so there’s no need to manually write CRUD operations.
- `jsonServer.defaults()` - Give me all the common, useful middlewares a basic API needs. `defaults() ` includes Logger -> Logs requests in terminal: `GET /api/products 200 `
- `server.use(cors())` allows the frontend (different origin) to access the backend APIs.

- `server.use()` tells the server to run something for every incoming request

- `server.use('/images', jsonServer.defaults({static:path.join(__dirname,'images')}));` 
    - Static => serving existing files(product images here) directly, without any logic or processing.
    - The `/images` route makes those URLs work.
    - `path.join(__dirname,'images'` tell the location of the images. The images are located in the `images` folder inside the same directory as `server.js`.
    - 
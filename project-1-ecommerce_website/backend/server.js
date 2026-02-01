const jsonServer=require ('json-server');
const path= require ('path');
const cors=require ('cors')


const server=jsonServer.create();

const router=jsonServer.router(path.join(__dirname,'db.json'))

server.use(cors());

const middleware=jsonServer.defaults();
server.use(middleware);


server.use('/images', jsonServer.defaults({static:path.join(__dirname,'images')}))

server.use('/api',router)

const PORT=process.env.PORT || 3050;
server.listen(PORT,()=>{
    console.log(` The backend port is running on  ${PORT}`)
})
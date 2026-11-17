require('dotenv').config();
const express=require('express'),http=require('http');
const {Server}=require('socket.io');
const app=express();app.disable('x-powered-by');
app.get('/health',(_req,res)=>res.json({ok:true,service:'LYNXIEE Global Chat'}));
const server=http.createServer(app);
const origin=(process.env.ALLOWED_ORIGIN||'http://localhost:3000').replace(/\/$/,'');
const io=new Server(server,{cors:{origin,methods:['GET','POST']},maxHttpBufferSize:16384,transports:['websocket','polling']});
const max=Math.max(20,Math.min(300,Number(process.env.MAX_MESSAGES||100)));
const history=[],lastSent=new Map();
io.on('connection',socket=>{
 socket.on('chat:history',()=>socket.emit('chat:history',history));
 socket.on('chat:message',payload=>{
  const now=Date.now();if(now-(lastSent.get(socket.id)||0)<1200)return;lastSent.set(socket.id,now);
  const name=String(payload?.name||'Guest').replace(/[<>]/g,'').trim().slice(0,24)||'Guest';
  const text=String(payload?.text||'').replace(/\\u0000/g,'').trim().slice(0,500);if(!text)return;
  const item={name,text,at:now};history.push(item);if(history.length>max)history.shift();io.emit('chat:message',item);
 });
 socket.on('disconnect',()=>lastSent.delete(socket.id));
});
const port=Number(process.env.PORT||3100);
server.listen(port,'0.0.0.0',()=>console.log(`LYNXIEE Global Chat listening on :${port}; allowed origin ${origin}`));
                          

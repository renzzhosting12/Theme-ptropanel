(() => {
  if (window.__LYNXIEE_CHAT_LOADED__) return;
  window.__LYNXIEE_CHAT_LOADED__ = true;
  const chatUrl = window.LYNXIEE_CHAT_URL || window.location.origin;
  const root = document.createElement('div');
  root.id = 'lynxiee-chat-root';
  root.innerHTML = '<section id="lynxiee-chat-panel" aria-label="Global chat"><header class="lx-chat-head"><span>🌙 LYNXIEE GLOBAL CHAT</span><span class="lx-chat-status" id="lx-chat-status">Connecting…</span></header><div id="lx-chat-messages" aria-live="polite"></div><form class="lx-chat-form" id="lx-chat-form"><input id="lx-chat-input" maxlength="500" autocomplete="off" placeholder="Ketik pesan global…" aria-label="Pesan"><button type="submit">Kirim</button></form></section><button id="lynxiee-chat-toggle" type="button">💬 Global Chat</button>';
  document.body.appendChild(root);
  const panel=root.querySelector('#lynxiee-chat-panel'), toggle=root.querySelector('#lynxiee-chat-toggle');
  const messages=root.querySelector('#lx-chat-messages'), status=root.querySelector('#lx-chat-status');
  const form=root.querySelector('#lx-chat-form'), input=root.querySelector('#lx-chat-input');
  toggle.addEventListener('click',()=>panel.classList.toggle('open'));
  const nick=(sessionStorage.getItem('lx-chat-nick')||window.prompt('Pilih nickname publik untuk Global Chat:')||'Guest').replace(/[<>]/g,'').trim().slice(0,24)||'Guest';
  sessionStorage.setItem('lx-chat-nick',nick);
  function addMessage(item){
    const wrap=document.createElement('div');wrap.className='lx-chat-msg';
    const name=document.createElement('div');name.className='lx-chat-name';name.textContent=item.name||'Guest';
    const body=document.createElement('div');body.textContent=item.text||'';wrap.append(name,body);messages.appendChild(wrap);
    messages.scrollTop=messages.scrollHeight;while(messages.children.length>100)messages.removeChild(messages.firstChild);
  }
  const script=document.createElement('script');script.src=chatUrl.replace(/\/$/,'')+'/socket.io/socket.io.js';
  script.onload=()=>{
    const socket=window.io(chatUrl,{transports:['websocket','polling'],timeout:8000});
    socket.on('connect',()=>{status.textContent='● Online';socket.emit('chat:history')});
    socket.on('disconnect',()=>{status.textContent='● Offline'});
    socket.on('connect_error',()=>{status.textContent='Connection error'});
    socket.on('chat:history',list=>{messages.replaceChildren();(list||[]).forEach(addMessage)});
    socket.on('chat:message',addMessage);
    form.addEventListener('submit',e=>{e.preventDefault();const text=input.value.trim();if(!text)return;socket.emit('chat:message',{name:nick,text});input.value=''});
  };
  script.onerror=()=>{status.textContent='Chat service unavailable'};
  document.head.appendChild(script);
})();

(() => {
  const KEY='tikAlexDemoAccountsV1', SESSION='tikAlexDemoSessionV1';
  const CREATOR='lenerarmando192@gmail.com';
  const $=id=>document.getElementById(id);
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
  const hash=async s=>{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')};
  const session=()=>{try{return JSON.parse(sessionStorage.getItem(SESSION)||'null')}catch{return null}};
  const setSession=x=>x?sessionStorage.setItem(SESSION,JSON.stringify(x)):sessionStorage.removeItem(SESSION);
  const msg=(s,ok=false)=>{const e=$('accountMsg');if(e){e.textContent=s;e.style.color=ok?'#78f0b0':'#ffc96b'}};
  const paint=()=>{
    const s=session(), box=$('accountState'), form=$('accountForm'), logout=$('logoutBtn');
    const creatorButton=$('creatorPlayButton');
    if(creatorButton) creatorButton.hidden=!(s && s.email===CREATOR);
    if(box) box.textContent=s?`Conectado: ${s.email} · ${s.role==='creator'?'Creador — acceso gratis':'Cuenta de prueba — acceso pendiente de pago'}`:'No has iniciado sesión.';
    if(form) form.hidden=!!s; if(logout) logout.hidden=!s;
    const gate=$('accountGate'); if(gate) gate.textContent=s?(s.role==='creator'?'Acceso gratuito del creador activo.':'Cuenta creada en modo demostración; el pago aún no se verifica automáticamente.'):'Crea una cuenta o inicia sesión para ver tu estado.';
  };
  const register=async()=>{
    const email=$('accountEmail')?.value.trim().toLowerCase(), pass=$('accountPassword')?.value||'';
    if(!email||!email.includes('@')||pass.length<8){msg('Escribe un correo válido y una contraseña de al menos 8 caracteres.');return}
    const db=read(); if(db[email]){msg('Ese correo ya tiene una cuenta. Inicia sesión.');return}
    db[email]={passwordHash:await hash(pass),role:email===CREATOR?'creator':'customer',createdAt:new Date().toISOString()};save(db);
    setSession({email,role:db[email].role});msg('¡Cuenta creada en este dispositivo!',true);paint();
  };
  const login=async()=>{
    const email=$('accountEmail')?.value.trim().toLowerCase(), pass=$('accountPassword')?.value||'', acc=read()[email];
    if(!acc||acc.passwordHash!==await hash(pass)){msg('Correo o contraseña incorrectos.');return}
    setSession({email,role:acc.role});msg('Sesión iniciada.',true);paint();
  };
  document.addEventListener('DOMContentLoaded',()=>{
    $('registerBtn')?.addEventListener('click',register);$('loginBtn')?.addEventListener('click',login);
    $('logoutBtn')?.addEventListener('click',()=>{setSession(null);msg('Sesión cerrada.');paint()});paint();
  });
})();

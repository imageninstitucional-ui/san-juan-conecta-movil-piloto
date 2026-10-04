(()=>{
  const REDIRECT='https://imageninstitucional-ui.github.io/san-juan-conecta-movil-piloto/';
  const AUTH_BASE='https://tqzmggopevyzxgxijgzi.supabase.co/auth/v1';
  const PREFIX='sjc_mobile_v10_';

  function saveOAuthSession(){
    const raw=(location.hash||'').replace(/^#/,'');
    if(!raw)return false;
    const p=new URLSearchParams(raw);
    const err=p.get('error_description')||p.get('error');
    if(err){
      history.replaceState({},document.title,location.pathname+location.search);
      const el=document.getElementById('oauthStatus');
      if(el)el.textContent='Google no pudo completar el acceso: '+err;
      return false;
    }
    const access=p.get('access_token');
    if(!access)return false;
    const refresh=p.get('refresh_token')||'';
    const expires=Date.now()+((Number(p.get('expires_in'))||3600)*1000);
    localStorage.setItem(PREFIX+'access',access);
    localStorage.setItem(PREFIX+'refresh',refresh);
    localStorage.setItem(PREFIX+'expires',String(expires));
    history.replaceState({},document.title,location.pathname+location.search);
    location.replace(REDIRECT);
    return true;
  }

  function startGoogle(){
    if(!navigator.onLine){
      const el=document.getElementById('oauthStatus');
      if(el)el.textContent='Necesitas Internet para ingresar con Google.';
      return;
    }
    const el=document.getElementById('oauthStatus');
    if(el)el.textContent='Abriendo acceso institucional de Google…';
    location.assign(AUTH_BASE+'/authorize?provider=google&redirect_to='+encodeURIComponent(REDIRECT));
  }

  if(saveOAuthSession())return;
  const btn=document.getElementById('googleLoginBtn');
  if(btn)btn.addEventListener('click',startGoogle);
})();
import{S,i as d,a as M}from"./assets/vendor-DDdXnYQq.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function s(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(o){if(o.ep)return;o.ep=!0;const a=s(o);fetch(o.href,a)}})();const u=document.getElementById("search-form"),r=document.querySelector(".gallery"),h=document.getElementById("load-more"),p=document.querySelector(".loader"),y=document.querySelector(".loading-text"),g=document.querySelector(".end-message"),P="https://pixabay.com/api/",E="51560990-264b69e56c9798190df8f6558",q=new S(".gallery a");let i=1,w="",f=0;window.addEventListener("DOMContentLoaded",()=>{l();const e=new URLSearchParams(window.location.search).get("query");e&&(u.searchQuery.value=e,v(e))});u.addEventListener("submit",t=>{t.preventDefault();const e=u.searchQuery.value.trim();e&&(R(e),v(e))});h.addEventListener("click",()=>{i+=1,L(w,i)});function R(t){const e=`${window.location.pathname}?query=${encodeURIComponent(t)}`;window.history.pushState({path:e},"",e)}function v(t){w=t,i=1,f=0,r.innerHTML="",b(),l(),L(t,i)}async function L(t,e=1){x(),l();try{const s=await $(t,e);if(f=s.totalHits,s.hits.length===0&&e===1){d.warning({class:"my-warning-toast",message:"Sorry, no images match your search. Please try again!",position:"topRight"}),m();return}B(s.hits,e>1),I(e,f,s.hits.length)}catch{d.error({message:"Something went wrong. Please try again later.",position:"topRight"})}finally{m()}}async function $(t,e=1){const s={key:E,q:t,image_type:"photo",orientation:"horizontal",safesearch:"true",page:e,per_page:20},n=await M.get(P,{params:s});if(n.status!==200)throw new Error("Fetch failed");return n.data}function B(t,e=!1){const s=t.map(n=>`
      <li class="gallery-item">
        <div class="photo-card">
          <a class="gallery-link" href="${n.largeImageURL}">
            <img class="gallery-image" src="${n.webformatURL}" alt="${n.tags}" loading="lazy" />
          </a>
          <div class="info">
            <div class="info-column">
              <span class="info-label">Likes</span>
              <span class="info-value">${n.likes}</span>
            </div>
            <div class="info-column">
              <span class="info-label">Views</span>
              <span class="info-value">${n.views}</span>
            </div>
            <div class="info-column">
              <span class="info-label">Comments</span>
              <span class="info-value">${n.comments}</span>
            </div>
            <div class="info-column">
              <span class="info-label">Downloads</span>
              <span class="info-value">${n.downloads}</span>
            </div>
          </div>
        </div>
      </li>
    `).join("");e?r.insertAdjacentHTML("beforeend",s):r.innerHTML=s,q.refresh(),e&&O()}function I(t,e,s){const n=Math.ceil(e/40);t<n?(H(),b()):(l(),U(),d.info({class:"my-end-toast",message:"We're sorry, but you've reached the end of search results.",position:"topRight"}))}function O(){const t=r.querySelector(".gallery-item");if(!t)return;const{height:e}=t.getBoundingClientRect();window.scrollBy({top:e*2,behavior:"smooth"})}function x(){p.hidden=!1,y.hidden=!1}function m(){p.hidden=!0,y.hidden=!0}function H(){h.style.display="block"}function l(){h.style.display="none"}function U(){g.hidden=!1}function b(){g.hidden=!0}
//# sourceMappingURL=index.js.map

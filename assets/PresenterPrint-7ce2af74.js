import{f as d,h as _,j as h,ag as p,c as m,ah as u,l as n,ai as t,aj as o,y as s,F as f,ak as v,al as g,am as x,n as l,an as y,ao as b,m as k,ap as N,aq as w,_ as P}from"./nav-6e1350bc.js";import{N as V}from"./NoteViewer-8c633ddd.js";import{u as j}from"./index-679dc245.js";const S={class:"m-4"},L={class:"mb-10"},T={class:"text-4xl font-bold mt-2"},B={class:"opacity-50"},C={class:"text-lg"},H={class:"font-bold flex gap-2"},z={class:"opacity-50"},D=t("div",{class:"flex-auto"},null,-1),F={key:0,class:"border-gray-400/50 mb-8"},M=d({__name:"PresenterPrint",setup(q){_(h),p(`
@page {
  size: A4;
  margin-top: 1.5cm;
  margin-bottom: 1cm;
}
* {
  -webkit-print-color-adjust: exact;
}
html,
html body,
html #app,
html #page-root {
  height: auto;
  overflow: auto !important;
}
`),j({title:`Notes - ${m.title}`});const i=u(()=>x.slice(0,-1).map(a=>{var r;return(r=a.meta)==null?void 0:r.slide}).filter(a=>a!==void 0&&a.notesHTML!==""));return(a,r)=>(l(),n("div",{id:"page-root",style:g(s(w))},[t("div",S,[t("div",L,[t("h1",T,o(s(m).title),1),t("div",B,o(new Date().toLocaleString()),1)]),(l(!0),n(f,null,v(s(i),(e,c)=>(l(),n("div",{key:c,class:"flex flex-col gap-4 break-inside-avoid-page"},[t("div",null,[t("h2",C,[t("div",H,[t("div",z,o(e==null?void 0:e.no)+"/"+o(s(y)),1),b(" "+o(e==null?void 0:e.title)+" ",1),D])]),k(V,{"note-html":e.notesHTML,class:"max-w-full"},null,8,["note-html"])]),c<s(i).length-1?(l(),n("hr",F)):N("v-if",!0)]))),128))])],4))}}),W=P(M,[["__file","/home/runner/work/slidev-theme-dracula/slidev-theme-dracula/node_modules/.pnpm/@slidev+client@0.39.0_vite@4.1.0/node_modules/@slidev/client/internals/PresenterPrint.vue"]]);export{W as default};

import{a as m}from"./jsx-runtime-913be41c.js";import{I as o}from"./ImageGallery-e3f9f2c4.js";import"./index-2506bfc3.js";import"./iframe-f4e50d02.js";import"../sb-preview/runtime.js";import"./Icon-2ae3ebb0.js";import"./theme-ui-core-jsx-runtime.esm-9bc3c749.js";import"./emotion-element-6a883da9.browser.esm-becb4ad2.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-11801e73.js";import"./hoist-non-react-statics.cjs-dd442a32.js";import"./theme-ui-css.esm-a1197288.js";import"./emotion-styled.browser.esm-935c8bd8.js";import"./flag-unknown-42829506.js";import"./icon-star-active-309631d9.js";import"./theme-ui-components.esm-1dc2aee2.js";import"./emotion-react.browser.esm-ac7fc07b.js";const y=[{full:"https://picsum.photos/id/29/1500/1000",thumb:"https://picsum.photos/id/29/150/150"},{full:"https://picsum.photos/id/50/4000/3000",thumb:"https://picsum.photos/id/50/150/150"},{full:"https://picsum.photos/id/110/800/1200",thumb:"https://picsum.photos/id/110/150/150"},{full:"https://picsum.photos/id/2/1500/1500",thumb:"https://picsum.photos/id/2/150/150"}],t=y.map((e,f)=>({downloadUrl:e.full,contentType:"image/jpeg",fullPath:"cat.jpg",name:"cat"+f,type:"image/jpeg",size:115e3,thumbnailUrl:e.thumb,timeCreated:new Date().toISOString(),updated:new Date().toISOString()})),k={title:"Components/ImageGallery",component:o},r=e=>m(o,{images:t,...e}),s=e=>m(o,{images:t,...e,hideThumbnails:!0}),a=e=>m(o,{images:t,...e,hideThumbnails:!0,showNextPrevButton:!0});var p,i,n;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`imageUrls.map((elt, i) => {
  return {
    downloadUrl: elt.full,
    contentType: 'image/jpeg',
    fullPath: 'cat.jpg',
    name: 'cat' + i,
    type: 'image/jpeg',
    size: 115000,
    thumbnailUrl: elt.thumb,
    timeCreated: new Date().toISOString(),
    updated: new Date().toISOString()
  };
})`,...(n=(i=t.parameters)==null?void 0:i.docs)==null?void 0:n.source}}};var u,l,c;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`(props: Omit<ImageGalleryProps, 'images'>) => {
  return <ImageGallery images={testImages} {...props} />;
}`,...(c=(l=r.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var g,h,d;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`(props: Omit<ImageGalleryProps, 'images'>) => {
  return <ImageGallery images={testImages} {...props} hideThumbnails />;
}`,...(d=(h=s.parameters)==null?void 0:h.docs)==null?void 0:d.source}}};var I,b,S;a.parameters={...a.parameters,docs:{...(I=a.parameters)==null?void 0:I.docs,source:{originalSource:`(props: Omit<ImageGalleryProps, 'images'>) => {
  return <ImageGallery images={testImages} {...props} hideThumbnails showNextPrevButton={true} />;
}`,...(S=(b=a.parameters)==null?void 0:b.docs)==null?void 0:S.source}}};const q=["testImages","Default","NoThumbnails","ShowNextPrevButtons"];export{r as Default,s as NoThumbnails,a as ShowNextPrevButtons,q as __namedExportsOrder,k as default,t as testImages};
//# sourceMappingURL=ImageGallery.stories-3847767f.js.map

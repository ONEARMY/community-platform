import{a as p}from"./jsx-runtime-913be41c.js";import{I as r}from"./ImageGallery-1214bdcd.js";import"./index-2506bfc3.js";import"./iframe-b5fb84a4.js";import"../sb-preview/runtime.js";import"./emotion-styled.browser.esm-935c8bd8.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-11801e73.js";import"./emotion-element-6a883da9.browser.esm-becb4ad2.js";import"./Icon-976e5b12.js";import"./theme-ui-core-jsx-runtime.esm-9bc3c749.js";import"./hoist-non-react-statics.cjs-dd442a32.js";import"./theme-ui-css.esm-a1197288.js";import"./icon-verified-badge-3c009cbf.js";import"./icon-arrow-down-33f070d5.js";import"./icon-star-active-309631d9.js";import"./theme-ui-components.esm-784287e5.js";import"./emotion-react.browser.esm-ac7fc07b.js";const x=[{full:"https://picsum.photos/id/29/1500/1000",thumb:"https://picsum.photos/id/29/150/150"},{full:"https://picsum.photos/id/50/4000/3000",thumb:"https://picsum.photos/id/50/150/150"},{full:"https://picsum.photos/id/110/800/1200",thumb:"https://picsum.photos/id/110/150/150"},{full:"https://picsum.photos/id/2/1500/1500",thumb:"https://picsum.photos/id/2/150/150"}],t=x.map((e,N)=>({downloadUrl:e.full,contentType:"image/jpeg",fullPath:"cat.jpg",name:"cat"+N,type:"image/jpeg",size:115e3,thumbnailUrl:e.thumb,timeCreated:new Date().toISOString(),updated:new Date().toISOString()})),J={title:"Components/ImageGallery",component:r},s=e=>p(r,{images:t,...e}),a=e=>p(r,{images:t,...e,hideThumbnails:!0}),o=e=>p(r,{images:t,...e,hideThumbnails:!0,showNextPrevButton:!0}),m=e=>p(r,{images:[t[0]],...e,hideThumbnails:!0,showNextPrevButton:!0});var i,n,u;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`imageUrls.map((elt, i) => {
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
})`,...(u=(n=t.parameters)==null?void 0:n.docs)==null?void 0:u.source}}};var l,c,g;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`(props: Omit<ImageGalleryProps, 'images'>) => {
  return <ImageGallery images={testImages} {...props} />;
}`,...(g=(c=s.parameters)==null?void 0:c.docs)==null?void 0:g.source}}};var h,d,I;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`(props: Omit<ImageGalleryProps, 'images'>) => {
  return <ImageGallery images={testImages} {...props} hideThumbnails />;
}`,...(I=(d=a.parameters)==null?void 0:d.docs)==null?void 0:I.source}}};var S,b,y;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`(props: Omit<ImageGalleryProps, 'images'>) => {
  return <ImageGallery images={testImages} {...props} hideThumbnails showNextPrevButton={true} />;
}`,...(y=(b=o.parameters)==null?void 0:b.docs)==null?void 0:y.source}}};var w,P,f;m.parameters={...m.parameters,docs:{...(w=m.parameters)==null?void 0:w.docs,source:{originalSource:`(props: Omit<ImageGalleryProps, 'images'>) => {
  return <ImageGallery images={[testImages[0]]} {...props} hideThumbnails showNextPrevButton={true} />;
}`,...(f=(P=m.parameters)==null?void 0:P.docs)==null?void 0:f.source}}};const K=["testImages","Default","NoThumbnails","ShowNextPrevButtons","DoNotShowNextPrevButtons"];export{s as Default,m as DoNotShowNextPrevButtons,a as NoThumbnails,o as ShowNextPrevButtons,K as __namedExportsOrder,J as default,t as testImages};
//# sourceMappingURL=ImageGallery.stories-2428ba0e.js.map

import{a as s}from"./jsx-runtime-913be41c.js";import{I as r}from"./ImageGallery-352ae071.js";import"./index-2506bfc3.js";import"./iframe-c282611f.js";import"../sb-preview/runtime.js";import"./emotion-styled.browser.esm-935c8bd8.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-11801e73.js";import"./emotion-element-6a883da9.browser.esm-becb4ad2.js";import"./Icon-5a6c8159.js";import"./theme-ui-core-jsx-runtime.esm-9bc3c749.js";import"./hoist-non-react-statics.cjs-dd442a32.js";import"./theme-ui-css.esm-a1197288.js";import"./supporter-29075ee8.js";import"./icon-arrow-down-33f070d5.js";import"./icon-star-active-309631d9.js";import"./theme-ui-components.esm-784287e5.js";import"./emotion-react.browser.esm-ac7fc07b.js";const v=[{full:"https://picsum.photos/id/29/1500/1000",thumb:"https://picsum.photos/id/29/150/150"},{full:"https://picsum.photos/id/50/4000/3000",thumb:"https://picsum.photos/id/50/150/150"},{full:"https://picsum.photos/id/110/800/1200",thumb:"https://picsum.photos/id/110/150/150"},{full:"https://picsum.photos/id/2/1500/1500",thumb:"https://picsum.photos/id/2/150/150"}],t=v.map((e,O)=>({downloadUrl:e.full,contentType:"image/jpeg",fullPath:"cat.jpg",name:"cat"+O,type:"image/jpeg",size:115e3,thumbnailUrl:e.thumb,timeCreated:new Date().toISOString(),updated:new Date().toISOString()})),Q={title:"Components/ImageGallery",component:r},a=e=>s(r,{images:t,...e}),o=e=>s(r,{images:t,...e,hideThumbnails:!0}),m=e=>s(r,{images:[t[0]],...e}),p=e=>s(r,{images:t,...e,hideThumbnails:!0,showNextPrevButton:!0}),i=e=>s(r,{images:[t[0]],...e,hideThumbnails:!0,showNextPrevButton:!0});var n,u,l;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`imageUrls.map((elt, i) => {
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
})`,...(l=(u=t.parameters)==null?void 0:u.docs)==null?void 0:l.source}}};var g,c,h;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`(props: Omit<ImageGalleryProps, 'images'>) => {
  return <ImageGallery images={testImages} {...props} />;
}`,...(h=(c=a.parameters)==null?void 0:c.docs)==null?void 0:h.source}}};var d,I,S;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`(props: Omit<ImageGalleryProps, 'images'>) => {
  return <ImageGallery images={testImages} {...props} hideThumbnails />;
}`,...(S=(I=o.parameters)==null?void 0:I.docs)==null?void 0:S.source}}};var b,y,P;m.parameters={...m.parameters,docs:{...(b=m.parameters)==null?void 0:b.docs,source:{originalSource:`(props: Omit<ImageGalleryProps, 'images'>) => {
  return <ImageGallery images={[testImages[0]]} {...props} />;
}`,...(P=(y=m.parameters)==null?void 0:y.docs)==null?void 0:P.source}}};var w,f,G;p.parameters={...p.parameters,docs:{...(w=p.parameters)==null?void 0:w.docs,source:{originalSource:`(props: Omit<ImageGalleryProps, 'images'>) => {
  return <ImageGallery images={testImages} {...props} hideThumbnails showNextPrevButton={true} />;
}`,...(G=(f=p.parameters)==null?void 0:f.docs)==null?void 0:G.source}}};var N,T,x;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`(props: Omit<ImageGalleryProps, 'images'>) => {
  return <ImageGallery images={[testImages[0]]} {...props} hideThumbnails showNextPrevButton={true} />;
}`,...(x=(T=i.parameters)==null?void 0:T.docs)==null?void 0:x.source}}};const R=["testImages","Default","NoThumbnails","HideThumbnailForSingleImage","ShowNextPrevButtons","DoNotShowNextPrevButtons"];export{a as Default,i as DoNotShowNextPrevButtons,m as HideThumbnailForSingleImage,o as NoThumbnails,p as ShowNextPrevButtons,R as __namedExportsOrder,Q as default,t as testImages};
//# sourceMappingURL=ImageGallery.stories-19299661.js.map

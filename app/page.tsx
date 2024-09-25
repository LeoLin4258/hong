'use client'

import { useState } from 'react';

export default function Home() {
  const iframeProxyUrl = "/hong";
  const [text, setText] = useState("");

  // const handleGetIframeDom = () => {
  //   const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
  //   const fdoc1 = iframe.contentDocument;
  //   const element = fdoc1?.getElementsByClassName("text-lg font-semibold text-black")[0] as HTMLElement;
  //   console.log(444, element?.innerText);
  //   setText(element?.innerText);
  // }

  const getIframUrl = () => {
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    const iframeSrc = iframe.contentWindow?.location.href;
    console.log(333, iframeSrc);
  }

  // const handleRewriteUrl = () => {
  //   const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
  //   const iframeSrc = iframe.contentWindow?.location.href;
  //   console.log(8888888, iframeSrc);

  //   if (iframeSrc) {
  //     const url = new URL(iframeSrc);
  //     const pathSegments = url.pathname.split('/');

  //     if (pathSegments[1] !== 'hong') {
  //       const newPath = '/hong' + url.pathname;
  //       const newUrl = `${url.protocol}//${url.host}${newPath}${url.search}${url.hash}`;
  //       iframe.src = newUrl;
  //       console.log('URL rewritten:', newUrl);
  //     } else {
  //       console.log('URL already contains /hong, no rewrite needed');
  //     }
  //   } else {
  //     console.log('Unable to get iframe URL');
  //   }
  // }

  return (
    <div id='xxx' className="w-full h-screen flex items-center justify-start gap-2 bg-zinc-700">
      <iframe id="myIframe" className="w-full h-full rounded-xl overflow-hidden" src={iframeProxyUrl} />

      <div className="w-80 h-full flex flex-col gap-2 p-4 bg-zinc-900 rounded-xl overflow-hidden">
        <p>Dev</p>
        {/* <button onClick={handleGetIframeDom}>Get Iframe DOM</button>
         */}

        <button onClick={getIframUrl}>Get Iframe URL</button>
        {text}
      </div>
    </div>
  );
}
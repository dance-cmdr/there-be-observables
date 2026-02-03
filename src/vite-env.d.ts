/// <reference types="vite/client" />

// Asset imports
declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

 
declare module '*.json' {
  const value: unknown;
  export default value;
}

declare module '*?raw' {
  const content: string;
  export default content;
}

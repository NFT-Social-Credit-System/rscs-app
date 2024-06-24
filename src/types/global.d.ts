/**
 * @author Ozzy(@Zerocousin) for Remilia Social Credit System
 */

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NEXT_PUBLIC_INFURA_URL: string;
      }
    }
  }
  
export {};
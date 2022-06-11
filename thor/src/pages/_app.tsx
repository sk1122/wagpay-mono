import '../styles/global.css';

import type { AppProps } from 'next/app';

import { ConnectWalletProvider } from '@/contexts/ConnectWalletContext';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <div className="min-h-screen bg-wagpay-dark text-white">
    <ConnectWalletProvider>
      <Component {...pageProps} />
    </ConnectWalletProvider>
  </div>
);

export default MyApp;

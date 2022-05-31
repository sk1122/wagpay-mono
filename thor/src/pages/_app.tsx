import '../styles/global.css';

import type { AppProps } from 'next/app';

import { ConnectWalletProvider } from '@/contexts/ConnectWalletContext';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ConnectWalletProvider>
    <Component {...pageProps} />
  </ConnectWalletProvider>
);

export default MyApp;

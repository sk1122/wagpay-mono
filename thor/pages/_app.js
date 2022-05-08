import '../styles/globals.css'
import { AppContext } from '../context'
import { useState } from "react"

function MyApp({ Component, pageProps }) {
  const [amount, setAmount] = useState('');
  const [BaseToken, setBaseToken] = useState(JSON.stringify({ name: "ETH", chainId: 1, decimals: 18 }));
  const [ToToken, setToToken] = useState(JSON.stringify({ name: "MATIC", chainId: 137, decimals: 18 }));
  const [BaseTokenValue, setBaseTokenValue] = useState(0)
  const [ToTokenValue, setToTokenValue] = useState()

  let shared_state = {
    amount,
    setAmount,
    BaseToken,
    setBaseToken,
    ToToken,
    setToToken,
    BaseTokenValue,
    setBaseTokenValue,
    ToTokenValue,
    setToTokenValue
  }

  return (
    <AppContext.Provider value={shared_state}>
      <Component {...pageProps} />
    </AppContext.Provider>
  )
}

export default MyApp

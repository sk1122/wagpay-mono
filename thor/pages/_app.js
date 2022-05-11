import '../styles/globals.css'
import { AppContext, DropDowncontext } from '../context'
import { useState } from "react"

function MyApp({ Component, pageProps }) {
  const [amount, setAmount] = useState('');
  const [BaseChain, setBaseChain] = useState();
  const [toChain, setToChain] = useState()
  const [BaseToken, setBaseToken] = useState({ name: "ETH", value: JSON.stringify({ name: "ETH", chainId: 1, decimals: 18 }) });
  const [ToToken, setToToken] = useState({ name: "MATIC", value: JSON.stringify({ name: "MATIC", chainId: 137, decimals: 18 }) });
  const [BaseTokenValue, setBaseTokenValue] = useState(0)
  const [ToTokenValue, setToTokenValue] = useState(0)


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
    setToTokenValue,
    BaseChain, setBaseChain,
    toChain, setToChain

  }

  const [baseChainDropDownOpen, setBaseChainOpen] = useState(false)
  const [toChainDropDownOpen, setToChainOpen] = useState(false)
  const [baseTokenDropDownOpen, setBaseTokenOpen] = useState(false)
  const [toTokenDropDownOpen, setTokenChainOpen] = useState(false)

  const closeDropdowns = () => {
    setBaseChainOpen(false)
    setToChainOpen(false)
    setBaseTokenOpen(false)
    setTokenChainOpen(false)
  }

  let DropDownsState = {
    baseChainDropDownOpen, setBaseChainOpen,
    toChainDropDownOpen, setToChainOpen,
    baseTokenDropDownOpen, setBaseTokenOpen,
    toTokenDropDownOpen, setTokenChainOpen,
    closeDropdowns
  };



  return (
    <DropDowncontext.Provider value={DropDownsState} >
      <AppContext.Provider value={shared_state}>
        <Component {...pageProps} />
      </AppContext.Provider>
    </DropDowncontext.Provider>
  )
}

export default MyApp

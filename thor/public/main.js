const login = async () => {
	var elem = document.createElement("script");
    elem.type = "text/javascript";
    elem.innerHTML = `try {
		console.log(window.ethereum, window.solana, window)
		const { ethereum } = window;
  
		if (ethereum) {
		  const accounts = await ethereum.request({
			method: "eth_requestAccounts",
		  });
  
		  if (accounts.length !== 0) {
			console.log("FOUND", accounts)
		  } else {
			console.log("Not Found");
		  }
		} else {
		  console.log("Install Metamask");
		}
	  } catch (e) {
		console.log(e);
	  }`;
    return document.head.appendChild(elem);
  };

window.onload = function() {
	login().then(a => console.log(a)).catch(e => console.error(e))
}
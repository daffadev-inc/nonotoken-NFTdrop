export const explorerUrl = () => {
  const address = process.env.NEXT_PUBLIC_DROP_ADDRESS

  switch (process.env.NEXT_PUBLIC_CHAIN_ID) {
    case '1':
      // Mainnet
      return `https://etherscan.io/token/${address}`
    case '4':
      // Rinkeby
      return `https://rinkeby.etherscan.io/token/${address}`
    case '5':
      // Goerli
      return `https://goerli.etherscan.io/token/${address}`
    case '137':
      // Polygon
      return `https://polygonscan.com/token/${address}`
    case '80001':
      // Munbai
      return `https://mumbai.polygonscan.com/token/${address}`
    case '250':
      // Fantom
      return `https://ftmscan.com/token/${address}`
    case '4002':
      // FantomTestnet
      return `https://testnet.ftmscan.com/token/${address}`
    default:
      return ''
  }
}

export const swapUrl = () => {
  const token = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS
  const chain = process.env.NEXT_PUBLIC_CHAIN_ID

  switch (process.env.NEXT_PUBLIC_CHAIN_ID) {
    case '250':
      // Mainnet
      return `https://app.sushi.com/swap?inputCurrency=0x4E15361FD6b4BB609Fa63C81A2be19d873717870&outputCurrency=${token}&chainId=${chain}`
    default:
      return ``
  }
}

export const openseaUrl = () => {
  const name = process.env.NEXT_PUBLIC_CONTRACT_NAME

  switch (process.env.NEXT_PUBLIC_CHAIN_ID) {
    case '1':
      // Mainnet
      return `https://opensea.io/collection/${name}`
    case '4':
      // Rinkeby
      return `https://testnets.opensea.io/collection/${name}`
    default:
      return ``
  }
}

export const twitterUrl = () => {
  return `https://twitter.com/${process.env.NEXT_PUBLIC_TWITER_ACCOUNT}`
}

export const instagramUrl = () => {
  return `https://www.instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_ACCOUNT}`
}

export const discordUrl = () => {
  return `${process.env.NEXT_PUBLIC_DISCORD_URL}`
}

export const snsLinks = {
  explorerUrl,
  openseaUrl,
  twitterUrl,
  instagramUrl,
  discordUrl,
}

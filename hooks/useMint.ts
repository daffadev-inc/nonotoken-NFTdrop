import { useNFTDrop } from '@thirdweb-dev/react'
import { useContext } from 'react'
import { useToast } from '@chakra-ui/react'

import {
  useAddress,
  useMetamask,
  useNetwork,
  useNetworkMismatch,
} from '@thirdweb-dev/react'

import { NftContractContext } from '../contexts/NftContractProvider'

export const useMint = () => {
  const nftDrop = useNFTDrop(process.env.NEXT_PUBLIC_DROP_ADDRESS)
  const store = useContext(NftContractContext)

  const alert = useToast()

  const address = useAddress()
  const connectWithMetamask = useMetamask()
  const [, switchNetwork] = useNetwork()
  const isOnWrongNetwork = useNetworkMismatch()

  const mint = async () => {
    if (!address) {
      connectWithMetamask()
      return
    }

    if (isOnWrongNetwork) {
      switchNetwork && switchNetwork(Number(process.env.NEXT_PUBLIC_CHAIN_ID))
      return
    }

    store.setIsClaiming && store.setIsClaiming(true)

    try {
      const minted = await nftDrop?.claim(1)
      alert({
          title: 'Berhasil.',
          description: "NFT berhasil di Mint.",
          status: 'success',
          duration: 7000,
          isClosable: true,
        })
    } catch (error) {
      console.error(error)
      alert({
          title: 'Gagal.',
          description: "NFT gagal di Mint.",
          status: 'error',
          duration: 7000,
          isClosable: true,
        })
    } finally {
      store.setIsClaiming && store.setIsClaiming(false)
    }
  }

  return { mint }
}

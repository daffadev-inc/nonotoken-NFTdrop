import { Flex, Spinner, Text, VStack, Button, Box, Badge, useToast } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Stack
} from '@chakra-ui/react'
import {
  ThirdwebNftMedia,
  useAddress,
  useMetamask,
  useNFTDrop,
  useToken,
  useTokenBalance,
  useOwnedNFTs,
  useContract,
  useNetwork,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useConnectWallet } from '../../hooks/useConnectWallet'
import stake from '../../styles/Stake.module.css';

const nftDropContractAddress = (process.env.NEXT_PUBLIC_DROP_ADDRESS);
const tokenContractAddress = (process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS);
const stakingContractAddress = (process.env.NEXT_PUBLIC_STAKE_CONTRACT_ADDRESS);

const Component: React.FC = () => {
  // Wallet Connection Hooks
  const address = useAddress();
  const { connectWallet } = useConnectWallet()
  const [, switchNetwork] = useNetwork()
  const isOnWrongNetwork = useNetworkMismatch()

  const alert = useToast()
  // Contract Hooks
  const nftDropContract = useNFTDrop(nftDropContractAddress);
  const tokenContract = useToken(tokenContractAddress);

  const { contract, isLoading } = useContract(stakingContractAddress);

  // Load Unstaked NFTs
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);

  // Load Balance of Token
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);

  const [stakedNfts, setStakedNfts] = useState<any[]>([]);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();

  useEffect(() => {
    if (!contract) return;

    async function loadStakedNfts() {
      const stakedTokens = await contract?.call("getStakedTokens", address);

      // For each staked token, fetch it from the sdk
      const stakedNfts = await Promise.all(
        stakedTokens?.map(
          async (stakedToken: { staker: string; tokenId: BigNumber }) => {
            const nft = await nftDropContract?.get(stakedToken.tokenId);
            return nft;
          }
        )
      );

      setStakedNfts(stakedNfts);
      console.log("setStakedNfts", stakedNfts);
    }

    if (address) {
      loadStakedNfts();
    }

    if (isOnWrongNetwork) {
      switchNetwork && switchNetwork(Number(process.env.NEXT_PUBLIC_CHAIN_ID))
      return
    }

  }, [address, contract, nftDropContract]);

  useEffect(() => {
    if (!contract || !address) return;

    async function loadClaimableRewards() {
      const cr = await contract?.call("availableRewards", address);
      console.log("Loaded claimable rewards", cr);
      setClaimableRewards(cr);
    }

    loadClaimableRewards();
  }, [address, contract]);

  async function stakeNft(id: BigNumber) {
    if (!address) return;

    const isApproved = await nftDropContract?.isApproved(
      address,
      stakingContractAddress!
    );
    // If not approved, request approval
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress!, true);
    }
    try {
    const stake = await contract?.call("stake", id)
      alert({
          title: 'Berhasil.',
          description: "Stake NFT berhasil... Refresh halaman jika belum muncul.",
          status: 'success',
          duration: 7000,
          isClosable: true,
        })
    } catch (error) {
      console.error(error)
      alert({
          title: 'Gagal.',
          description: "Stake gagal, coba lagi...",
          status: 'error',
          duration: 7000,
          isClosable: true,
        })
    } 
  }

  async function withdraw(id: BigNumber) {
    try {
    const withdraw = await contract?.call("withdraw", id)
      alert({
          title: 'Berhasil.',
          description: "Withdraw NFT berhasil 🤗️",
          status: 'success',
          duration: 7000,
          isClosable: true,
        })
    } catch (error) {
      console.error(error)
      alert({
          title: 'Gagal.',
          description: "Withdraw gagal 😥️ coba lagi...",
          status: 'error',
          duration: 7000,
          isClosable: true,
        })
    } 
  }

  async function claimRewards() {
    try {
    const claim = await contract?.call("claimRewards")
      alert({
          title: 'Berhasil.',
          description: "Token NoC Berhasil di claim 🤩️",
          status: 'success',
          duration: 7000,
          isClosable: true,
        })
    } catch (error) {
      console.error(error)
      alert({
          title: 'Gagal.',
          description: "Gagal claim token, coba lagi...",
          status: 'error',
          duration: 7000,
          isClosable: true,
        })
    } 
  }

  if (isLoading) {
    return <>
    <Flex
      maxW={'8xl'}
      justifyContent="center"
      h="100%"
      alignItems="center"
      mx="auto"
    >
      <VStack spacing={4}>
        <Spinner size="xl" />
        <Text>Loading Contracts ...</Text>
      </VStack>
    </Flex></>;
  }

  return (
<>
      {!address ? (
    <Box
      zIndex={20}
      className={stake.midCenter}
    >
    <Flex
      maxW={'8xl'}
      justifyContent="center"
      h="100%"
      alignItems="center"
      mx="auto"
    >
      <VStack spacing={4}>
        <Button onClick={connectWallet}>
          Connect Wallet
        </Button>
      </VStack>
    </Flex>
    </Box>
      ) : (
    <div className={stake.flexContainer}>
          <div className={stake.tokenStake}>
        <Stack direction='row' mb={5}>
          <Badge colorScheme='purple'>Your NonoTokens</Badge>
        </Stack>
            <Box className={stake.boxReward}>
<Stat>
  <StatLabel>Claimable Rewards</StatLabel>
  <StatNumber>
                <b>
                  {!claimableRewards
                    ? "Loading..."
                    : ethers.utils.formatUnits(claimableRewards, 18)}
                </b>{" "}
                {tokenBalance?.symbol}
</StatNumber>
  <StatHelpText></StatHelpText>
</Stat>
            </Box>
            <Box className={stake.boxReward}>
<Stat>
  <StatLabel>Current Balance</StatLabel>
  <StatNumber>
                <b>{tokenBalance?.displayValue}</b> {tokenBalance?.symbol}
  </StatNumber>
  <StatHelpText></StatHelpText>
</Stat>
              <h3></h3>
              <p>
              </p>
            </Box>

          <Button colorScheme='blue' variant='solid' float='right'
            onClick={() => claimRewards()}
          >
            Claim Rewards
          </Button>
          </div>

          <div className={stake.nftStake}>
<Tabs variant='enclosed'>
  <TabList>
    <Tab>Your Unstaked NFTs</Tab>
    <Tab>Your Staked NFTs</Tab>
  </TabList>
  <TabPanels>
    <TabPanel px={0}>
          <Box className={stake.boxNft}>
            {ownedNfts?.map((nft) => (
              <Box className={stake.mediaNft} key={nft.metadata.id.toString()}>
                <ThirdwebNftMedia
                  metadata={nft.metadata}
                />
                  <Text
                    as="h4"
                    fontSize={{ base: 'sm', md: 'lg' }}
                    mt={2}
                    textAlign="center"
                    fontWeight="bold"
                  >
                    {nft.metadata.name}
                  </Text>
                <Button colorScheme='blue' variant='solid'
                  onClick={() => stakeNft(nft.metadata.id)}
                >
                  Stake
                </Button>
              </Box>
            ))}
            </Box>
    </TabPanel>
    <TabPanel px={0}>
          <Box className={stake.boxNft}>
            {stakedNfts?.map((nft) => (
              <Box className={stake.mediaNft} key={nft.metadata.id.toString()}>
                <ThirdwebNftMedia
                  metadata={nft.metadata}
                />
                  <Text
                    as="h4"
                    fontSize={{ base: 'sm', md: 'lg' }}
                    mt={2}
                    textAlign="center"
                    fontWeight="bold"
                  >
                    {nft.metadata.name}
                  </Text>
                <Button colorScheme='blue' variant='solid'
                  onClick={() => withdraw(nft.metadata.id)}
                >
                  Withdraw
                </Button>
              </Box>
            ))}
          </Box>
    </TabPanel>
  </TabPanels>
</Tabs>

          </div>
        </div>
      )}
    </>
  )
}

export { Component as Stake }

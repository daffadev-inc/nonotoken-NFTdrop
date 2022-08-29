import type { NextPage } from 'next'
import Head from 'next/head'
import type { NextPageWithLayout } from './_app'
import type { ReactElement } from 'react'
import { CommonLayout } from '../layouts/CommonLayout'
import { Stake } from '../components/templates/Stake'

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title></title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stake />
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <CommonLayout>{page}</CommonLayout>
}

export default Home

import Head from "next/head"
import { Flex, Text } from '@chakra-ui/react'

export default function Home(){
  return(
    <>
    <Head>
      <title>Barber Gold - Seu sistema completo!</title>
    </Head>
      <Flex background={'barber.900'} height={'100vh'} alignItems='center' justifyContent='center'>
        <Text color={'white'}>Página Home</Text>
      </Flex>
    </>
  )
}
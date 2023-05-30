import { useState, useContext } from "react"
import Head from "next/head"
import Image from "next/image"
import logoImg from '../../../public/images/logo.png'
import { Flex, Text, Center, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import Link from "next/link"
import { AuthContext } from "@/src/context/AuthContext"

import { canSSRGuest } from "@/src/utils/canSSRGuest"


export default function Register(){

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [show, setShow] = useState(false);

    const { signUp } = useContext(AuthContext);


    function handleClick(){
        setShow(!show);
    }

    async function handleRegister(){

        if(name === '' && email === '' && password === ''){
            return;
        }

        await signUp({
            name,
            email,
            password
        })
    }

  return(
    <>
    <Head>
      <title>Crie sua conta no Barber Gold!</title>
    </Head>
      <Flex background={'barber.900'} height={'100vh'} alignItems='center' justifyContent='center'>

        <Flex width={640} direction="column" p={14} rounded={8}>
            <Center p={4}>
                <Image
                   src={logoImg} 
                   quality={100}
                   width={340}
                   style={{objectFit: 'fill'}}
                   alt="Logo barber gold"
                />
            </Center>

            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                background="barber.400"
                color="#FFF"
                variant="filled"
                size="lg"
                placeholder="Nome da Barbearia"
                type="text"
                mb={3}
                _hover={{background: '#0e0916'}}
            />

            <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                background="barber.400"
                color="#FFF"
                variant="filled"
                size="lg"
                placeholder="email@email.com"
                type="email"
                mb={3}
                _hover={{background: '#0e0916'}}
            />

            <InputGroup size='md' mb={8}>
                <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    background="barber.400"
                    color="#FFF"
                    variant="filled"
                    size="lg"
                    type={show ? 'text' : 'password'}
                    placeholder='Enter password'
                    _hover={{background: '#0e0916'}}
                />
                <InputRightElement width='4.5rem' marginTop={1}>
                    <Button h='1.75rem' size='sm' onClick={handleClick} color="gray.900">
                    {show ? 'Hide' : 'Show'}
                    </Button>
                </InputRightElement>
            </InputGroup>

            <Button
                background="button.cta"
                mb={6}
                color="gray.900"
                size="lg"
                _hover={{bg: "#ffb13e"}}
                onClick={handleRegister}
            >
                Cadastrar
            </Button>

            <Center mt="2">
                <Link href="/login">
                    <Text color="#FFF">Já possui conta? <strong>Acessar!</strong></Text>
                </Link>
            </Center>

        </Flex>

      </Flex>
    </>
  )
}


export const getServerSideProps = canSSRGuest(async (ctx) => {
    return {
        props: {}
    }
})
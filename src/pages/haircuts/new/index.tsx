import { useState } from "react";
import Head from "next/head";
import { Sidebar } from "@/src/components/sidebar";
import {
    Flex,
    Text,
    useMediaQuery,
    Button,
    Heading,
    Input
 } from "@chakra-ui/react";
import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";
import Router from "next/router";

import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { setupAPIClient } from "@/src/services/api";

interface NewHaircutProps{
    subscription: boolean;
    count: number;
}


export default function NewHaircut({ subscription, count }:NewHaircutProps){
    const [isMobile] = useMediaQuery(("max-width: 580px"))

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");


    

    async function handleCreateHaircut(){
        
        if(name === "" || price ===""){
            return;
        }

        try{

            const api = setupAPIClient();

            await api.post('/haircut', {
                name: name,
                price: Number(price),
            })

            Router.push('/haircuts')


        }catch(err){
            console.log(err)
            alert("Erro ao cadastrar esse modelo")
        }

    }

   return(
    <>
        <Head>
            <title>Barber Gold - Novo modelo de corte</title>
        </Head>
        <Sidebar>
            <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
                
                <Flex
                    direction={isMobile ? "column" : "row" }
                    w="100%"
                    align={isMobile ? "flex-start" : "center"}
                    mb={isMobile ? 4 : 0}
                >
                    <Link href="/haircuts">
                        <Button 
                        p={4} 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center" 
                        mr={4}
                        color="gray.900"
                        bg="#FFF"
                        >
                            <FiChevronLeft size={24} color="#000"/>
                            Voltar
                        </Button>
                    </Link>

                    <Heading
                        color="orange.900"
                        mt={4}
                        mb={4}
                        mr={4}
                        fontSize={isMobile ? "29px" : "3xl"}
                    >
                        Modelos de Corte
                    </Heading>
                </Flex>

                <Flex
                    maxW="700px"
                    bg="barber.400"
                    w="100%"
                    alignItems="center"
                    justify="center"
                    pt={8}
                    pb={8}
                    direction="column"
                >
                    <Heading fontSize={isMobile ? "22" : "3xl"} color="#FFF" mb={5}>
                        Cadastrar Modelo
                    </Heading>

                    <Input
                        placeholder="Nome do corte"
                        size="lg"
                        type="text"
                        w="85%"
                        bg="gray.900"
                        mb={5} 
                        disabled={!subscription && count >= 3}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                        placeholder="Valor do corte ex: 25.99"
                        size="lg"
                        type="text"
                        w="85%"
                        bg="gray.900"
                        mb={5}
                        disabled={!subscription && count >= 3}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <Button
                        w="85%"
                        size="lg"
                        color="gray.900"
                        mb={6}
                        bg="button.cta"
                        _hover={{ bg: "#FFb13e" }}
                        onClick={handleCreateHaircut}
                        isDisabled={!subscription && count >= 3}
                    >
                        Cadastrar
                    </Button>


                        {!subscription && count >= 3 && (
                            <Flex direction="row" align="center" justifyContent="center">
                                <Text mr={1}>
                                    Você atingiu seu limite de corte.
                                </Text>
                                <Link href="/planos">
                                    <Text color="#31FB6A" fontWeight="bold">
                                        Seja premium!
                                    </Text>
                                </Link>
                        </Flex>
                        )}
              

                </Flex>

            </Flex>
        </Sidebar>
    </>
   )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {
    
    try{

        const api = setupAPIClient(ctx);

        const response = await api.get('/haircut/check')

        const count = await api.get('/haircut/count')

        return {
            props: {
                subscription: response.data?.subscriptions?.status === 'active' ? true : false,
                count: count.data
            }
        }

    }catch(err){
        console.log(err)

        return{
            redirect:{
                destination: '/dashboard',
                permanent: false
            }
        }
    }

})
import { useContext, useState } from "react";
import Head from "next/head";
import {
    Flex,
    Text,
    Heading,
    Box,
    Input,
    Button
} from '@chakra-ui/react';
import { Sidebar } from "@/src/components/sidebar";
import Link from "next/link";

import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { AuthContext } from "@/src/context/AuthContext";
import { setupAPIClient } from "@/src/services/api";



interface UserProps{
    id: string;
    name: string;
    email: string;
    endereco: string | null;
}


interface ProfileProps{
    user: UserProps;
    premium: boolean;
}


export default function Profile({ user, premium }:ProfileProps){
    const { logoutUser } = useContext(AuthContext);

    const [name, setName] = useState(user && user?.name );
    const [endereco, setEndereco] = useState(user?.endereco ? user?.endereco : '');



    async function handleLogout(){
        await logoutUser();
    }


    async function handleUpdateUser(){
        
        if(name === ''){
            return;
        }

        try{

        const apiClient = setupAPIClient();

        await apiClient.put('/users', {
            name: name,
            endereco: endereco
        })

        alert("Dados alterados com sucesso!")


        }catch(err){
            console.log(err);
        }
        


    }

    return(
        <>
            <Head>
                <title>Meu perfil - Barber Gold</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="center" justifyContent="flex-start">

                    <Flex w="100%" direction="row" alignItems="center" justifyContent="center">
                        <Heading fontSize="3xl" mt={4} mb={4} color="orange.900">Minha conta</Heading>
                    </Flex>

                    <Flex pt={8} pb={8} background="barber.400" maxW="700px" w="100%" direction="column" alignItems="center" justifyContent="center" borderRadius={8}>

                        <Flex direction="column" w="85%">
                            <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                                Nome da barbearia:
                            </Text>
                            <Input
                                w="100%"
                                background="gray.900"
                                placeholder="Nome da barbearia"
                                size="lg"
                                type="text"
                                mb={3}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                                Endereço:
                            </Text>
                            <Input
                                w="100%"
                                background="gray.900"
                                placeholder="Endereço da barbearia"
                                size="lg"
                                type="text"
                                mb={3}
                                value={endereco}
                                onChange={(e) => setEndereco(e.target.value)}
                            />

                            <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                                Plano atual:
                            </Text>

                            <Flex
                                direction="row"
                                w="100%"
                                mb={3}
                                p={1}
                                borderWidth={1}
                                rounded={6}
                                background="barber.900"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Text p={2} fontSize="lg" color={premium ? "#Fba931" : "#4dffb4"}>
                                    Plano {premium ? "Premium" : "Grátis"}
                                </Text>

                                <Link href="/planos">
                                    <Box cursor="pointer" p={1} pl={2} pr={2} background="#00cd52" rounded={4} color="white">
                                        Mudar Plano
                                    </Box>
                                </Link>
                            </Flex>

                            <Button
                                w="100%"
                                mt={3}
                                mb={4}
                                bg="button.cta"
                                size="lg"
                                _hover={{ bg: "#FFb13e" }}
                                onClick={handleUpdateUser}
                            >
                                Salvar
                            </Button>

                            <Button
                                 w="100%"
                                 mt={3}
                                 mb={6}
                                 bg="transparent"
                                 borderWidth={2}
                                 borderColor="red.500"
                                 size="lg"
                                 _hover={{ bg: "#ec2d2d" }}
                                 onClick={handleLogout}
                            >
                                Sair da conta
                            </Button>

                        </Flex>

                    </Flex>

                </Flex>
            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {

    try{

        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/me')

        const user = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            endereco: response.data.endereco
        }

        return{
            props: {
                user: user,
                premium: response.data.subscriptions?.status === 'active' ? true : false
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
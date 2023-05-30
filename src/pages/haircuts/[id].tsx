import { useState, ChangeEvent } from "react";
import Head from "next/head";
import {
    Flex,
    Text,
    Heading,
    Button,
    useMediaQuery,
    Input,
    Stack,
    Switch
} from "@chakra-ui/react";
import { FiChevronLeft } from "react-icons/fi";
import Link from "next/link";

import { setupAPIClient } from "@/src/services/api";
import { Sidebar } from "@/src/components/sidebar";
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import Router from "next/router";


interface HaircutProps{
    id: string;
    name: string;
    price: string | number;
    status: boolean;
    user_id: string
}


interface SubscriptionProps{
    id: string;
    status: string;
}

interface EditHaircutProps{
    haircut: HaircutProps;
    subscription: SubscriptionProps | null;
}



export default function EditHaircut({haircut, subscription}: EditHaircutProps){

    const [isMobile] = useMediaQuery(("max-width: 588px"));

    const [name, setName] = useState(haircut?.name);
    const [price, setPrice] = useState(haircut?.price);
    const [status, setStatus] = useState(haircut?.status);

    const [disableHaircut, setDisableHaircut] = useState(haircut?.status ? "disabled" : "enabled");



     function handleChangeStatus(e:ChangeEvent<HTMLInputElement>){
        if(e.target.value === 'disabled'){
            setDisableHaircut("enabled")
            setStatus(false)
        }else{
            setDisableHaircut("disabled");
            setStatus(true);
        }
    }


    async function handleUpdate(){
        if(name === "" || price === ""){
            return;
        }

        try{

            const apiClient = setupAPIClient();

            await apiClient.put('/haircut', {
                name: name,
                price: Number(price),
                status: status,
                haircut_id: haircut?.id
            })

            Router.push('/haircuts')
            alert("Corte atualizado com sucesso!")

        }catch(err){
            console.log(err);
        }
    }

    return(
        <>
            <Head>
                <title>Editando modelo de corte - Barber Gold</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">

                    <Flex
                        direction={isMobile ? "column" : "row"} 
                        w="100%"
                        alignItems={isMobile ? "flex-start" : "center"}
                        mb={isMobile ? 4 : 0}   
                    >
                        <Link href="/haircuts">
                            <Button 
                                p={4} 
                                display="flex" 
                                alignItems="center" 
                                justifyContent="center" 
                                mr={3}
                                bg="gray.700" _hover={{ background: "gray.700" }}
                            >
                                <FiChevronLeft size={24} color="#fff"/>
                                Voltar
                            </Button>
                        </Link>

                        <Heading fontSize={isMobile ? "22px" : "3xl"} color="white"> 
                            Editar corte
                        </Heading>
                    </Flex>

                    <Flex 
                        maxW="700px" 
                        pt={8} 
                        pb={8} 
                        w="100%" 
                        bg="barber.400"
                        direction="column"
                        align="center"
                        justifyContent="center"
                        mt={4}
                        >
                            <Heading fontSize={isMobile ? "22px" : "3xl"} mb={4}>
                                Editar Corte
                            </Heading>

                            <Flex w="85%" direction="column">
                                <Input
                                    placeholder="Nome do corte"
                                    bg="gray.900"
                                    mb={3}
                                    size="lg"
                                    type="text"
                                    w="100%"
                                    disabled={subscription?.status !== 'active'}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />

                                <Input
                                    placeholder="Preço do corte ex 42.90"
                                    bg="gray.900"
                                    mb={3}
                                    size="lg"
                                    type="number"
                                    w="100%"
                                    disabled={subscription?.status !== 'active'}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />

                                <Stack mb={6} align="center" direction="row">
                                    <Text>Desativar corte</Text>
                                    <Switch
                                        size="lg"
                                        colorScheme="red"
                                        value={disableHaircut}
                                        isChecked={disableHaircut === 'disabled' ? false : true}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeStatus(e)}
                                    />
                                </Stack>

                                <Button
                                    mb={6}
                                    w="100%"
                                    bg="button.cta"
                                    color="gray.900"
                                    _hover={{ bg: "#FFb13e" }}
                                    onClick={handleUpdate}
                                    
                                >
                                    Salvar
                                </Button>

                                {
                                   subscription?.status !== "active" && (
                                    <Flex direction="row" align="center" justifyContent="center">
                                        <Link href="/planos">
                                            <Text fontWeight="bold" color="#31FB6A">Seja Premium</Text>
                                        </Link>
                                        <Text ml={1}>e tenha todos acessos liberados!</Text>
                                    </Flex>
                                   ) 
                                }

                            </Flex>
                    </Flex>

                </Flex>
            </Sidebar>
        </>
    )
}



export const getServerSideProps = canSSRAuth(async (ctx) => {
    const { id } = ctx.params;
    
    try{
        const apiClient = setupAPIClient(ctx);

        const check = await apiClient.get('/haircut/check');

        const response = await apiClient.get('/haircut/detail', {
            params:{
                haircut_id: id,
            }
        })

        return{
            props:{
                haircut: response.data,
                subscription: check.data?.subscriptions
            }
        }


    }catch(err){
        console.log(err)

        return{
            redirect:{
                destination: '/haircuts',
                permanent: false
            }
            
        }
    }

})
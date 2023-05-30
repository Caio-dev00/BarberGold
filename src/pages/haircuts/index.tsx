import { useState, ChangeEvent } from "react";
import Head from "next/head";
import { Sidebar } from "@/src/components/sidebar";
import { 
    Flex,
    Text,
    Heading,
    Button,
    Stack,
    Switch,
    useMediaQuery,
    Link,
 } from "@chakra-ui/react"

import { IoMdPricetag } from 'react-icons/io'
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { setupAPIClient } from "@/src/services/api";


interface HaircutsItem{
    id: string;
    name: string;
    price: string | number;
    status: boolean;
}


interface HaircutRequest{
    haircuts: HaircutsItem[];
}


export default function Haircuts({haircuts}: HaircutRequest){

    const [isMobile] = useMediaQuery("(max-width: 588px)")

    const [haircutList, setHaircutList] = useState<HaircutsItem[]>(haircuts || [])
    const [disbaledHaircut, setDisabledHaircut] = useState("enabled")



    async function handleDisable(e:ChangeEvent<HTMLInputElement>){
        const apiClient = setupAPIClient();
        
        if(e.target.value === "disabled"){
            setDisabledHaircut("enabled") 
            
            const response = await apiClient.get('/haircuts',{
                params:{
                    status: true
                }
            })

            setHaircutList(response.data)
            
        }else{
            setDisabledHaircut("disabled")

            const response = await apiClient.get('/haircuts',{
                params:{
                    status: false
                }
            })

            setHaircutList(response.data)
        }

    }

    return(
        <>
            <Head>
                <title>Cortes de Cabelo - Barber Gold</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">

                    <Flex
                      direction={isMobile ? 'column' : 'row'}
                      w="100%"
                      alignItems={isMobile ? 'flex-start' : 'center'}
                      justifyContent="flex-start"
                      mb={0} 
                    >
                        <Heading
                            fontSize={isMobile ? '28px' : '3xl'}
                            mt={4}
                            mb={4}
                            mr={4}
                            color="orange.900"
                        >
                            Modelos de Cortes
                        </Heading>

                        <Link href="/haircuts/new">
                            <Button bg="gray.700" _hover={{ background: "gray.700" }}>
                                Cadastrar novo
                            </Button>
                        </Link>

                        <Stack ml="auto" align="center" direction="row">
                            <Text fontWeight="bold">{disbaledHaircut === "enabled" ? "ATIVOS" : "INATIVOS"}</Text>
                            <Switch
                                colorScheme="green"
                                size="lg"
                                value={disbaledHaircut}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleDisable(e)}
                                isChecked={disbaledHaircut === "disabled" ? false : true}
                            />
                        </Stack>
                    </Flex>

                      {haircutList.map(haircut => (
                            <Link key={haircut.id} href={`/haircuts/${haircut.id}`} width="100%" 
                            style={{ textDecoration: "none" }}> 
                                <Flex
                                  justifyContent="space-between"
                                  cursor="pointer"   
                                  p={4} 
                                  bg={disbaledHaircut === "enabled" ? "barber.400" : "red.900"}
                                  direction={isMobile ? "column" : "row"}
                                  alignItems={isMobile ? "flex-start" : "center"}
                                  rounded="4"
                                  mb={2}
                                  >
                                      <Flex mb={isMobile ? 2 : 0} direction="row" alignItems="center" justifyContent="center">
                                          <IoMdPricetag size={28} color="#fba931"/>
                                          <Text fontWeight="bold"  color="#fba931" ml={4} noOfLines={2}>
                                              {haircut.name}
                                          </Text>
                                      </Flex> 
  
                                      <Text fontWeight="bold">
                                          Preço: R$ {haircut.price}
                                      </Text>  
                                </Flex>
                            </Link>  
                      ))}
                 
                </Flex>
            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async(ctx) => {
    
    try{
       
        const apiCliente = setupAPIClient(ctx);
        const response = await apiCliente.get('/haircuts',{
            params: {
                status: true,
            }
        })

        if(response.data === null){
            return{
                redirect:{
                    destination: '/dashboard',
                    permanent: false
                }
            }
        }

        return{
            props: {
                haircuts: response.data
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
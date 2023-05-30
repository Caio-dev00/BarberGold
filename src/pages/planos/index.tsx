import { useState } from "react";
import Head from "next/head";
import { Sidebar } from "@/src/components/sidebar";
import { 
  Flex,
  Text,
  Heading,
  Button,
  useMediaQuery
} from "@chakra-ui/react";

import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { setupAPIClient } from "@/src/services/api";
import { getStripeJs } from "@/src/services/stripe-js";



interface PlanosProp{
  premium: boolean;
}


export default function Planos({premium}: PlanosProp){
  const [isMobile] = useMediaQuery("(max-width: 580px)")


  const handleSubscribe = async () => {
    
    if(premium){
      return;
    }

    try{

      const apiClient = setupAPIClient();
      const response = await apiClient.post('/subscribe')

      const { sessionId } = response.data;

      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({ sessionId: sessionId })

    }catch(err){
      console.log(err);
    }

  } 



  async function handleCreatePortal(){
    
    try{

      if(!premium){
        return;
      }

      const apiClient = setupAPIClient();

      const response = await apiClient.post('/create-portal')

      const { sessionId } = response.data;

      window.location.href = sessionId;

    }catch(err){
      console.log(err.message);
    }
  }

  return (
    <>
      <Head>
        <title>Sua assinatura Premium - Barber Gold</title>
      </Head>
      <Sidebar>
        <Flex w="100%" direction="column" align="flex-start" justify="flex-start">
          <Heading color="#FFF" fontSize="3xl" mt={4} mb={4} mr={4}>
            Planos
          </Heading>
        </Flex>

        <Flex pb={8} maxW="780px" w="100%" direction="column" align="flex-start" justify="flex-start">

          <Flex w="100%" gap={4} flexDirection={isMobile ? "column" : "row"}>
            <Flex rounded={4} p={2} flex={1} bg="barber.400" direction="column">
                <Heading 
                  textAlign="center" 
                  fontSize="2xl" 
                  mt={2} mb={4} 
                  color="#00cd52"
                >
                  Plano Grátis
                </Heading>

                <Text fontWeight="medium" ml={4} mb={2}> - Registrar cortes.</Text>
                <Text fontWeight="medium" ml={4} mb={2}> - Criar apenas 3 modelos de corte.</Text>
                <Text fontWeight="medium" ml={4} mb={2}> - Editar dados do perfil.</Text>
            </Flex>

            <Flex rounded={4} p={2} flex={1} bg="barber.400" direction="column">
                <Heading 
                  textAlign="center" 
                  fontSize="2xl" 
                  mt={2} mb={4} 
                  color="orange.900"
                >
                  Premium
                </Heading>

                <Text fontWeight="medium" ml={4} mb={2}> - Registrar cortes ilimitados.</Text>
                <Text fontWeight="medium" ml={4} mb={2}> - Criar modelos ilimitados.</Text>
                <Text fontWeight="medium" ml={4} mb={2}> - Editar modelos de corte.</Text>
                <Text fontWeight="medium" ml={4} mb={2}> - Editar dados do perfil.</Text>
                <Text fontWeight="medium" ml={4} mb={2}> - Receber todas atualizações.</Text>
                <Text fontWeight="bold" color="orange.900" fontSize="2xl" ml={4} mb={2}>R$ 9.99</Text>

                <Button
                  bg={premium ? "#gray.900" : "button.cta"}
                  m={2}
                  color={premium ? "#gray.200" : "gray.900"}
                  fontWeight="bold"
                  _hover={{ bg: premium ? "#gray.900" : "#ffbb55" }}
                  onClick={handleSubscribe}
                  isDisabled={premium ? true : false}
                >
                  {premium ? (
                    "VOCÊ JÁ É PREMIUM"
                  ) : (
                    "VIRAR PREMIUM"
                  )}
                </Button>

                  {premium && (
                    <Button
                      bg="white"
                      m={2}
                      color="barber.900"
                      fontWeight="bold"
                      onClick={ handleCreatePortal }
                    >
                      ALTERAR ASSINATURA
                    </Button>
                  )}

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

    return{
      props:{
        premium: response.data?.subscriptions?.status === 'active' ? true : false
      }
    }


  }catch(err){
    console.log(err)

    return{
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    }
  }

})


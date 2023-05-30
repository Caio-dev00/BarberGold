import { ChangeEvent, useState } from "react";
import { Sidebar } from "@/src/components/sidebar";
import Head from "next/head";
import {
  Flex,
  Text,
  Button,
  Heading,
  Input,
  Select
} from "@chakra-ui/react";

import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { setupAPIClient } from "@/src/services/api";
import Router from "next/router";


interface HaircutProps{
  id: string;
  name: string;
  price: string | number;
  status: boolean;
  user_id: string
}


interface NewProps{
  haircut: HaircutProps[]
}

export default function New({haircut}: NewProps){

  const [customer, setCustomer] = useState("");
  const [haircutSelected, setHaircutSelected] = useState(haircut[0])



  async function handleNewCustomer(){


    if(customer === ""){
      alert('Preencha o nome do cliente')
      return;
    }
    
    try{

      const apiClient = setupAPIClient();
      await apiClient.post('/schedule', {
        customer: customer,
        haircut_id: haircutSelected?.id
      })

      Router.push('/dashboard')

    }catch(err){
      console.log(err)
      alert("Erro ao registrar")
    }

  }


  function handleChangeSelect(id: string){

    const haircutItem = haircut.find(item => item.id === id);

    setHaircutSelected(haircutItem)

  }

  return(
    <>
      <Head>
        <title>Novo agendamento - Barber Gold</title>
      </Head>
      <Sidebar>
          <Flex direction="column" align="center" justify="flex-start">
              <Flex
                w="100%"
                align="center"
                justify="center"
              >
                  <Heading fontSize="3xl" mt={4} mb={4} mr={4}>Novo agendamento</Heading>
              </Flex>

              <Flex
                maxW="700px"
                pt={8}
                pb={8}
                w="100%"
                direction="column"
                align="center"
                justify="center"
                bg="barber.400"
              >
                <Input
                  placeholder="Nome do cliente"
                  w="85%"
                  mb={3}
                  size="lg"
                  type="text"
                  bg="barber.900"
                  value={customer}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomer(e.target.value)}
                /> 

                <Select mb={3} size="lg" w="85%" bg="barber.900" onChange={ (e) => handleChangeSelect(e.target.value)}>
                  {
                    haircut?.map( item => (
                      <option style={{ backgroundColor:"#FFF", color: "#000" }} key={item?.id} value={item?.id}>{item?.name}</option>
                    ))
                  }
                </Select>

                <Button 
                  w="85%" 
                  bg="button.cta" 
                  size="lg" 
                  color="gray.900" 
                  _hover={{ bg: "#ffb13e" }}
                  onClick={handleNewCustomer}
                >
                  Cadastrar
                </Button>

              </Flex>

          </Flex>
      </Sidebar>
    </>
  )
}



export const getServerSideProps = canSSRAuth(async (ctx) => {

  try {

    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/haircuts', {
      params:{
        status: true
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
        haircut: response.data
      }
    }


  }catch(err){
    console.log(err);

    return{
      redirect:{
        destination: '/dashboard',
        permanent: false
      }
    }
  }

})


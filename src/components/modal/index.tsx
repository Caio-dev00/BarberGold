
import { 
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Flex
 } from "@chakra-ui/react"
 import { ScheduleItem } from "@/src/pages/dashboard";

 import { FiUser, FiScissors } from "react-icons/fi"
 import { FaMoneyBillAlt } from "react-icons/fa"

 interface ModalInfoProps{
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data: ScheduleItem;
  finishService: () => Promise<void>;
 }

export function ModalInfo({ isOpen, onOpen, onClose, data, finishService}: ModalInfoProps){
  return(
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent bg="barber.400">
        <ModalHeader>Próximo</ModalHeader>
        <ModalCloseButton/>

        <ModalBody>
          <Flex align="center" mb={3}>
            <FiUser size={28} color="#FFb13e"/>
            <Text ml={3} fontSize="2xl" fontWeight="bold" color="#FFF">{data?.customer}</Text>
          </Flex>

          <Flex align="center" mb={3}>
            <FiScissors size={28} color="#FFF"/>
            <Text ml={3} fontSize="large" color="#FFF">{data?.haircut.name}</Text>
          </Flex>

          <Flex align="center" mb={3}>
            <FaMoneyBillAlt size={28} color="#46ef75"/>
            <Text ml={3} fontSize="large" color="#FFb13e">R$ {data?.haircut?.price}</Text>
          </Flex>


          <ModalFooter>
            <Button
              bg="button.cta"
              _hover={{ bg: "#FFb13e" }}
              color="gray.900"
              mr={3}
              onClick={() => finishService()}
            >
              Finzalizar serviço
            </Button>
          </ModalFooter>


        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
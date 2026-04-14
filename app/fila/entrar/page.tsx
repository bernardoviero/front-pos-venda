'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FormEvent, useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { AppShell } from '@/components/layout/app-shell';
import { createQueueEntry } from '@/lib/api';

export default function EnterQueuePage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const created = await createQueueEntry(name);

      toast({
        title: 'Cliente inserido na fila.',
        description: `${created.name} recebeu o numero ${created.id}.`,
        status: 'success',
        duration: 3500,
        isClosable: true,
      });

      setName('');
    } catch (error) {
      toast({
        title: 'Nao foi possivel cadastrar.',
        description: error instanceof Error ? error.message : 'Tente novamente.',
        status: 'error',
        duration: 3500,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <AppShell
        title="Entrada na fila"
        subtitle="Cadastre rapidamente o cliente para iniciar o atendimento."
      >
        <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={6}>
          <Card>
            <CardBody>
              <Box as="form" onSubmit={handleSubmit}>
                <Stack spacing={6}>
                  <Stack spacing={1}>
                    <Text fontSize="lg" fontWeight="bold">
                      Novo atendimento
                    </Text>
                    <Text color="gray.600">
                      Informe o nome do cliente para colocá-lo na fila.
                    </Text>
                  </Stack>

                  <FormControl isRequired>
                    <FormLabel>Nome do cliente</FormLabel>
                    <Input
                      size="lg"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Ex.: Maria Souza"
                    />
                  </FormControl>

                  <Button type="submit" size="lg" isLoading={loading} loadingText="Salvando">
                    Entrar na fila
                  </Button>
                </Stack>
              </Box>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Fluxo sugerido</StatLabel>
                <StatNumber>3 passos</StatNumber>
                <StatHelpText mb={4}>
                  Cadastro, atendimento e conclusao.
                </StatHelpText>
              </Stat>

              <Stack spacing={4} color="gray.700">
                <Text>1. Cadastre o cliente assim que ele chegar.</Text>
                <Text>2. Na tela de fila, marque quando o atendimento iniciar.</Text>
                <Text>3. Finalize com status concluido ao encerrar o caso.</Text>
              </Stack>
            </CardBody>
          </Card>

          <Card bg="brand.700" color="white">
            <CardBody>
              <Stack spacing={4}>
                <Text fontSize="lg" fontWeight="bold">
                  Dica para a operacao
                </Text>
                <Text color="whiteAlpha.900">
                  Se quiser reduzir filas visuais, deixe a equipe atualizando o status
                  em tempo real na tela principal. Isso ajuda todos a enxergarem o
                  andamento sem precisar recarregar manualmente a API.
                </Text>
              </Stack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </AppShell>
    </AuthGuard>
  );
}

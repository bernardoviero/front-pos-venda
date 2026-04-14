'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
import { getStoredToken, saveToken } from '@/lib/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nextPath, setNextPath] = useState('/fila');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (getStoredToken()) {
      router.replace('/fila');
    }

    const params = new URLSearchParams(window.location.search);
    const requestedPath = params.get('next');

    if (requestedPath?.startsWith('/')) {
      setNextPath(requestedPath);
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await login(username, password);
      saveToken(data.access_token);

      toast({
        title: 'Login realizado com sucesso.',
        status: 'success',
        duration: 2500,
        isClosable: true,
      });

      router.replace(nextPath);
    } catch (error) {
      toast({
        title: 'Nao foi possivel entrar.',
        description: error instanceof Error ? error.message : 'Verifique usuario e senha.',
        status: 'error',
        duration: 3500,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" py={10}>
      <Container maxW="6xl">
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} alignItems="center">
          <Stack spacing={6}>
            <Stack spacing={3}>
              <Text
                fontSize="sm"
                fontWeight="bold"
                letterSpacing="0.08em"
                textTransform="uppercase"
                color="brand.600"
              >
                Portal de atendimento
              </Text>
              <Heading size="2xl" lineHeight="1.1">
                Controle a fila de forma simples e segura.
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="xl">
                Faça login para cadastrar clientes na fila, acompanhar o andamento
                dos atendimentos e atualizar os status com poucos cliques.
              </Text>
            </Stack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Card bg="whiteAlpha.900">
                <CardBody>
                  <Text fontWeight="bold">Login com JWT</Text>
                  <Text mt={2} color="gray.600">
                    Sessao protegida para cada operacao da API.
                  </Text>
                </CardBody>
              </Card>

              <Card bg="whiteAlpha.900">
                <CardBody>
                  <Text fontWeight="bold">Fila organizada</Text>
                  <Text mt={2} color="gray.600">
                    Visualizacao clara do que esta aguardando ou em atendimento.
                  </Text>
                </CardBody>
              </Card>

              <Card bg="whiteAlpha.900">
                <CardBody>
                  <Text fontWeight="bold">Atualizacao rapida</Text>
                  <Text mt={2} color="gray.600">
                    Mudanca de status com acoes diretas na tela principal.
                  </Text>
                </CardBody>
              </Card>
            </SimpleGrid>
          </Stack>

          <Card bg="white" border="1px solid" borderColor="blackAlpha.100">
            <CardBody p={{ base: 6, md: 8 }}>
              <Box as="form" onSubmit={handleSubmit}>
                <Stack spacing={5}>
                  <Stack spacing={1}>
                    <Heading size="lg">Entrar</Heading>
                    <Text color="gray.600">
                      Use as credenciais configuradas no backend Nest.
                    </Text>
                  </Stack>

                  <FormControl isRequired>
                    <FormLabel>Usuario</FormLabel>
                    <Input
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="Digite seu usuario"
                      size="lg"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Senha</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none">
                        <LockIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Digite sua senha"
                      />
                    </InputGroup>
                  </FormControl>

                  <Button type="submit" size="lg" isLoading={loading} loadingText="Entrando">
                    Acessar painel
                  </Button>
                </Stack>
              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

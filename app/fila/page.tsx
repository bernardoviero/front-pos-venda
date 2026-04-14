'use client';

import {
  Badge,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  HStack,
  Spinner,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { AppShell } from '@/components/layout/app-shell';
import { getQueueEntries, updateQueueStatus } from '@/lib/api';
import type { QueueItem, QueueStatus } from '@/types/queue';

const statusMeta: Record<
  QueueStatus,
  {
    label: string;
    colorScheme: 'yellow' | 'blue' | 'green';
  }
> = {
  WAITING: { label: 'Aguardando', colorScheme: 'yellow' },
  IN_SERVICE: { label: 'Em atendimento', colorScheme: 'blue' },
  DONE: { label: 'Concluido', colorScheme: 'green' },
};

export default function QueuePage() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const toast = useToast();

  const loadQueue = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }

    try {
      const queue = await getQueueEntries();
      setItems(queue);
    } catch (error) {
      toast({
        title: 'Erro ao carregar a fila.',
        description: error instanceof Error ? error.message : 'Tente novamente.',
        status: 'error',
        duration: 3500,
        isClosable: true,
      });
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, [toast]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      loadQueue(false);
    }, 8000);

    return () => window.clearInterval(interval);
  }, [loadQueue]);

  const handleStatusChange = async (id: number, status: QueueStatus) => {
    setUpdatingId(id);

    try {
      await updateQueueStatus(id, status);
      await loadQueue(false);

      toast({
        title: 'Status atualizado.',
        status: 'success',
        duration: 2200,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Nao foi possivel atualizar o status.',
        description: error instanceof Error ? error.message : 'Tente novamente.',
        status: 'error',
        duration: 3500,
        isClosable: true,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const waitingCount = items.filter((item) => item.status === 'WAITING').length;
  const inServiceCount = items.filter((item) => item.status === 'IN_SERVICE').length;
  const doneCount = items.filter((item) => item.status === 'DONE').length;

  return (
    <AuthGuard>
      <AppShell
        title="Fila de atendimento"
        subtitle="Acompanhe a ordem da fila e atualize o andamento do atendimento."
      >
        <Stack spacing={6}>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
            <GridItem>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Total na fila</StatLabel>
                    <StatNumber>{items.length}</StatNumber>
                    <StatHelpText>Visao geral do dia</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Aguardando</StatLabel>
                    <StatNumber>{waitingCount}</StatNumber>
                    <StatHelpText>Clientes esperando</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Em atendimento</StatLabel>
                    <StatNumber>{inServiceCount}</StatNumber>
                    <StatHelpText>Operacoes em andamento</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Concluidos</StatLabel>
                    <StatNumber>{doneCount}</StatNumber>
                    <StatHelpText>Casos finalizados</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          <Card>
            <CardBody>
              <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap={4} direction={{ base: 'column', md: 'row' }} mb={6}>
                <Stack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold">
                    Painel da fila
                  </Text>
                  <Text color="gray.600">
                    Atualizacao automatica a cada 8 segundos.
                  </Text>
                </Stack>

                <Button onClick={() => loadQueue()} isLoading={loading}>
                  Atualizar agora
                </Button>
              </Flex>

              {loading ? (
                <Flex minH="220px" align="center" justify="center">
                  <Spinner size="xl" color="brand.500" thickness="4px" />
                </Flex>
              ) : items.length === 0 ? (
                <Flex
                  minH="220px"
                  align="center"
                  justify="center"
                  borderRadius="2xl"
                  bg="gray.50"
                >
                  <Stack spacing={2} textAlign="center">
                    <Text fontWeight="bold">Nenhum cliente na fila.</Text>
                    <Text color="gray.600">
                      Use a tela de entrada para cadastrar o primeiro atendimento.
                    </Text>
                  </Stack>
                </Flex>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Ordem</Th>
                      <Th>Cliente</Th>
                      <Th>Status</Th>
                      <Th>Entrada</Th>
                      <Th textAlign="right">Acoes</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {items.map((item, index) => (
                      <Tr key={item.id}>
                        <Td fontWeight="bold">#{index + 1}</Td>
                        <Td>{item.name}</Td>
                        <Td>
                          <Badge colorScheme={statusMeta[item.status].colorScheme} px={3} py={1} borderRadius="full">
                            {statusMeta[item.status].label}
                          </Badge>
                        </Td>
                        <Td>
                          {new Intl.DateTimeFormat('pt-BR', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          }).format(new Date(item.createdAt))}
                        </Td>
                        <Td>
                          <HStack justify="flex-end" spacing={2}>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(item.id, 'IN_SERVICE')}
                              isDisabled={item.status === 'IN_SERVICE' || item.status === 'DONE'}
                              isLoading={updatingId === item.id}
                            >
                              Atender
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(item.id, 'DONE')}
                              isDisabled={item.status === 'DONE'}
                              isLoading={updatingId === item.id}
                            >
                              Concluir
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Stack>
      </AppShell>
    </AuthGuard>
  );
}

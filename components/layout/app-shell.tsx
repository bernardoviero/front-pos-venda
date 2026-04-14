'use client';

import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { clearToken } from '@/lib/auth';

type AppShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const links = [
  { href: '/fila', label: 'Ver fila' },
  { href: '/fila/entrar', label: 'Entrar na fila' },
];

export function AppShell({ title, subtitle, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearToken();
    router.replace('/login');
  };

  return (
    <Box minH="100vh" py={{ base: 6, md: 10 }}>
      <Container maxW="6xl">
        <Stack spacing={8}>
          <Flex
            align={{ base: 'flex-start', md: 'center' }}
            justify="space-between"
            direction={{ base: 'column', md: 'row' }}
            gap={4}
            bg="whiteAlpha.900"
            borderRadius="3xl"
            border="1px solid"
            borderColor="blackAlpha.100"
            px={{ base: 5, md: 8 }}
            py={{ base: 5, md: 6 }}
            backdropFilter="blur(14px)"
          >
            <Stack spacing={1}>
              <Text
                fontSize="sm"
                fontWeight="bold"
                letterSpacing="0.08em"
                textTransform="uppercase"
                color="brand.600"
              >
                Atendimento pós-venda
              </Text>
              <Heading size="lg">{title}</Heading>
              <Text color="gray.600">{subtitle}</Text>
            </Stack>

            <Stack direction={{ base: 'column', md: 'row' }} spacing={3} w={{ base: 'full', md: 'auto' }}>
              <HStack spacing={3} flexWrap="wrap">
                {links.map((link) => {
                  const active = pathname === link.href;

                  return (
                    <Button
                      key={link.href}
                      as={Link}
                      href={link.href}
                      variant={active ? 'solid' : 'ghost'}
                      colorScheme={active ? 'brand' : undefined}
                    >
                      {link.label}
                    </Button>
                  );
                })}
              </HStack>

              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </Stack>
          </Flex>

          {children}
        </Stack>
      </Container>
    </Box>
  );
}

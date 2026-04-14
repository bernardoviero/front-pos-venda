'use client';

import { Center, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getStoredToken } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getStoredToken() ? '/fila' : '/login');
  }, [router]);

  return (
    <Center minH="100vh">
      <Spinner size="xl" color="brand.500" thickness="4px" />
    </Center>
  );
}

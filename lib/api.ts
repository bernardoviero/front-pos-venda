import { getStoredToken } from '@/lib/auth';
import type { QueueItem, QueueStatus } from '@/types/queue';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

type LoginResponse = {
  access_token: string;
};

async function request<T>(path: string, init?: RequestInit, auth = true): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');

  if (auth) {
    const token = getStoredToken();

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = 'Nao foi possivel concluir a solicitacao.';

    try {
      const body = await response.json();
      const errorMessage = Array.isArray(body.message)
        ? body.message.join(', ')
        : body.message;

      if (errorMessage) {
        message = errorMessage;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function login(username: string, password: string) {
  return request<LoginResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    },
    false,
  );
}

export function createQueueEntry(name: string) {
  return request<QueueItem>('/queue', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export function getQueueEntries() {
  return request<QueueItem[]>('/queue', { method: 'GET' });
}

export function updateQueueStatus(id: number, status: QueueStatus) {
  return request(`/queue/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

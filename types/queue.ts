export type QueueStatus = 'WAITING' | 'IN_SERVICE' | 'DONE';

export type QueueItem = {
  id: number;
  name: string;
  status: QueueStatus;
  createdAt: string;
};

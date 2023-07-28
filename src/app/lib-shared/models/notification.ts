export class Notification {
  id: string;
  type: number;
  message: NotificationPayload;
  sendTo: Array<number>;
  read: Array<NotificationRead>;
  createdUserId: number;
  createdDate: Date;
}

export class NotificationRead {
  userId: number;
  readTime: Date;
}

export class NotificationPayload {
  id: string;
  title: string;
  content: string;
  icon: string;
  time: Date;
}


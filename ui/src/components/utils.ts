import notification from "antd/lib/notification";

export const getIndex = (columns: string[], colName: string) => columns.findIndex((column) => column === colName);

type NotificationType = "success" | "info" | "warning" | "error";

interface NotifyParam {
  type: NotificationType;
  message?: string;
  description?: string;
  duration?: number | null;
}

export const notify = ({ type, message, description, duration }: NotifyParam) => {
  notification[type]({
    message,
    description,
    duration,
  });
};

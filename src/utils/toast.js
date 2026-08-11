import { notification } from "antd";

notification.config({
  placement: "top",
  duration: 3,
});

export const toast = {
  success: (msg) => notification.success({ message: msg }),
  error: (msg) => notification.error({ message: msg }),
};

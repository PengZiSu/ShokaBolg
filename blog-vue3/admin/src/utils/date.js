import { dayjs } from "element-plus";

export const formatDate = (date, format = "YYYY-MM-DD") => {
  if (date == null) {
    return "";
  }
  return dayjs(date).format(format);
};

export const formatDateTime = (date, format = "YYYY-MM-DD HH:mm:ss") => {
  return formatDate(date, format);
};

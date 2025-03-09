import { request } from "@/utils/request"

/**
 * 启动流程
 * @param data
 * @returns {*}
 */
export const startWorkFlow = (data: object): any => {
  return request.post('/workflow/task/startWorkFlow', data);
};

/**
 * 办理流程
 * @param data
 * @returns {*}
 */
export const completeTask = (data: object): any => {
  return request.post('/workflow/task/completeTask',data);
};


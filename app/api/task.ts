import { Task } from '@/types/type';
import axios from 'axios';

const API_URL = 'http://localhost:4000/tasks';

// control the delay to simulate a network request
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// get tasks
export const getTasks = async (): Promise<Task[]> => {
  await delay(500);
  const { data } = await axios.get(API_URL);
  return data;
};

// update task status
export const updateTaskStatus = async (taskId: string, newColumn: string) => {
  const { data } = await axios.patch(`${API_URL}/${taskId}`, { column: newColumn });
  return data;
};

// create new task
export const createTask = async (task: { title: string; description: string; column: string }) => {
  await delay(1000);
  const { data } = await axios.post(API_URL, task);
  return data;
};

export const updateTask = async (task: Task) => {
  await delay(1000);
  const { data } = await axios.put(`${API_URL}/${task.id}`, task);
  return data;
};

export const deleteTask = async (id: string) => {
  await delay(1000);
  await axios.delete(`${API_URL}/${id}`);
};
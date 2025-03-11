export const handler = async (): Promise<void> => {
  await Promise.reject(new Error('Vong is too handsome!'));
  return;
};

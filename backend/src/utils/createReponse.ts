export const createReponse = (
  success: any,
  data: any = null,
  error: any = null,
) => {
  return {
    success,
    data,
    error: error?.message || error,
  };
};

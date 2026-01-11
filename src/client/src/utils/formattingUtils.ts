export const getFullName = (user: {
  first_name?: string;
  last_name?: string;
}) => `${user?.first_name} ${user?.last_name}`;

export const createQRUrl = (cardId: string) => {
  return `https://app.bonchicares.in/health-card/${cardId}`;
};

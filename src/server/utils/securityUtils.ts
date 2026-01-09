import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

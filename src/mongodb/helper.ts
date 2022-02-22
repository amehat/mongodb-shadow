const generateId = (): number => {
  return Math.floor(Math.random() * 1000000000000000000);
};

// eslint-disable-next-line import/prefer-default-export
export { generateId };

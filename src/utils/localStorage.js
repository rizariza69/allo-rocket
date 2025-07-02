const LOCAL_KEY = "addedRockets";

export const getLocalRockets = () => {
  const data = localStorage.getItem(LOCAL_KEY);
  return data ? JSON.parse(data) : [];
};

export const addLocalRocket = (rocket) => {
  const rockets = getLocalRockets();
  rockets.push(rocket);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(rockets));
};

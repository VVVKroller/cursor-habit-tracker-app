interface LoginParams {
  email: string;
  password: string;
  loginCallback: () => void;
  errorCallback: (error: any) => void;
}

export const loginUser = async ({
  email,
  password,
  loginCallback,
  errorCallback,
}: LoginParams) => {
  try {
    // Here you would typically make an API call to your backend
    // For now, we'll just simulate a successful login
    if (email && password) {
      loginCallback();
    } else {
      errorCallback(new Error("Please fill in all fields"));
    }
  } catch (error) {
    errorCallback(error);
  }
};

export default {
  loginUser,
};

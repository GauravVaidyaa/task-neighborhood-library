export const handleApiError = (error) => {
  if (error.response) {
    return {
      message: error.response.data?.message || "Server error",
      status: error.response.status,
    };
  }

  if (error.request) {
    return {
      message: "Network error. Please try again.",
      status: 0,
    };
  }

  return {
    message: error.message || "Unexpected error",
    status: -1,
  };
};

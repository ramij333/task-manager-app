



const fetcher = async ({ method, url, data }: { method: string; url: string; data?: any }) => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot access localStorage on the server.");
    }
    const token = localStorage.getItem("token");
    
    // Check if token exists
    if (!token) {
      throw new Error("No token found. Please log in again.");
    }

    const response = await fetch(url, {
      method, // The HTTP method (GET, POST, PUT, etc.)
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: data ? JSON.stringify(data) : undefined, // Attach the task data for POST/PUT requests
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    return await response.json(); // Return the response data
  } catch (error) {
    // Handle fetch errors
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
};
export default fetcher;


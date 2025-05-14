
// import API from "./api";

// const fetcher = (url: string) => API.get(url).then(res => res.data);

// export default fetcher;


// import axios from "axios";
// import API from "./api"; 

// const fetcher = async (url: string) => {
  
//   try {
//     const token = localStorage.getItem("token")
//     const res = await API.get(url);  
//     // const res = await axios.get(`http://localhost:5000/api${url}`, {
//     //   headers: {
//     //     Authorization: `Bearer ${token}`,
//     //   },
//     // });
    
//     return res.data; 
//   } catch (error) {
    
//     if (axios.isAxiosError(error)) {
//       throw new Error(error.response?.data?.message || "An error occurred");
//     }
//     throw new Error("An unknown error occurred");
//   }
// };

// export default fetcher;


const fetcher = async ({ method, url, data }: { method: string; url: string; data?: any }) => {
  try {
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




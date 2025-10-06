import React, { useState, useEffect } from "react";
import { Signup as SignupComponent } from "../components";
import axios from "axios";
import Cookie from "cookies-js";
import Error from "../pages/ErrorPage";
import Swal from "sweetalert2"; // Import SweetAlert
import withReactContent from "sweetalert2-react-content"; // React support for SweetAlert

const MySwal = withReactContent(Swal); // Initialize SweetAlert2 with React

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const token = Cookie.get("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_URL}user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUser(res?.data?.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to fetch user data");
        // Show error alert using SweetAlert
        MySwal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to fetch user data. Please try again later.",
        });
      }
    };
    fetchUserData();
  }, [token]);

  // Function to handle profile update
  const handleUpdateProfile = async (updatedUserData) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_URL}user/profile`,
        updatedUserData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        // Show success alert with SweetAlert after successful profile update
        MySwal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: "Your profile has been updated successfully.",
        });
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Show error alert with SweetAlert in case of failure
      MySwal.fire({
        icon: "error",
        title: "Update Failed!",
        text: "An error occurred while updating your profile.",
      });
    }
  };

  // Render the Error component if an error occurred
  if (error) {
    return (
      <div className="py-8">
        <Error message={error} />
      </div>
    );
  }

  return (
    <div className="py-8">
      {user ? (
        // Pass the `handleUpdateProfile` function to the `SignupComponent`
        <SignupComponent user={user} onSubmit={handleUpdateProfile} />
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
};

export default EditProfile;

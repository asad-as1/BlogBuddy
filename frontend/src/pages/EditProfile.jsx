import React, {useState, useEffect} from "react";
import { Signup as SignupComponent } from '../components'
import axios from "axios"

const EditProfile = () => {
  const [user, setUser] = useState([]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_URL}user/profile`, {
          withCredentials: true,
        });
        setUser(res?.data?.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);


  return (
    <div className="py-8">
      <SignupComponent user={user} />
    </div>
  );
};

export default EditProfile;

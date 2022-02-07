import React from "react";
import UsersList from "../components/UsersList";

const USER = [
  {
    id: "u1",
    name: "Vinay Chaurasia",
    image:
      "https://www.hdnicewallpapers.com/Walls/Big/Dog/Cute_Dog_Puppy_Image.jpg",
    places: 3,
  },
];

const Users = () => {
  return <UsersList items={USER} />;
};

export default Users;

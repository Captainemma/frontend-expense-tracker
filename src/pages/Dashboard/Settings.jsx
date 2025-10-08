import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { toast, Toaster } from "react-hot-toast";

function Settings() {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = localStorage.getItem("token");

  // Load current user data
  useEffect(() => {
    axios
      .get("http://localhost:7000/api/v1/auth/getUser", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => toast.error("Error fetching user"));
  }, [token]);

  // Upload profile picture
  const handleProfilePicUpload = async () => {
    if (!profilePic) return;

    try {
      const formData = new FormData();
      formData.append("image", profilePic);

      const res = await axios.post(
        "http://localhost:7000/api/v1/auth/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile picture updated!");
      setUser({ ...user, profilePic: res.data.imageUrl });
      setProfilePic(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload profile picture");
    }
  };

  // Update name & email
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        "http://localhost:7000/api/v1/auth/updateUser",
        { fullName: user.fullName, email: user.email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile updated successfully!");
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      await axios.put(
        "http://localhost:7000/api/v1/auth/change-password",
        { oldPassword: currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to change password");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <DashboardLayout>
     
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>

        {/* Profile Section */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Profile Management</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={
                  profilePic
                    ? URL.createObjectURL(profilePic)
                    : user.profilePic || "https://via.placeholder.com/100"
                }
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePic(e.target.files[0])}
                className="text-sm"
              />
              <button
                type="button"
                onClick={handleProfilePicUpload}
                className="px-4 py-2 bg-[#875cf5] text-white rounded-lg hover:bg-[#744ce6]"
              >
                Upload
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={user.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-[#875cf5]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-[#875cf5]/50"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-[#875cf5] text-white rounded-lg hover:bg-[#744ce6]"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Change Password Section */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Current Password */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-[#875cf5]/50"
              />
              <button
                type="button"
                className="absolute right-3 top-[32px]"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-[#875cf5]/50"
              />
              <button
                type="button"
                className="absolute right-3 top-[32px]"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Confirm New Password */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-[#875cf5]/50"
              />
              <button
                type="button"
                className="absolute right-3 top-[32px]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;

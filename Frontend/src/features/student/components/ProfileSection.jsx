import React, { useState } from "react";

const ProfileSection = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    course: user?.course || "",
    school: user?.school || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await onUpdate(formData); // API call
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Profile</h2>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            Edit ✏️
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-500 text-sm"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Profile Top */}
      <div className="flex items-center gap-4 mb-6">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-bold">
          {user.username?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h3 className="text-lg font-semibold">{user.username}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Form / Info */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Username */}
        <div>
          <label className="text-sm text-gray-500">Username</label>
          {isEditing ? (
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <p className="font-medium">{user.username}</p>
          )}
        </div>

        {/* Course */}
        <div>
          <label className="text-sm text-gray-500">Course</label>
          {isEditing ? (
            <input
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <p className="font-medium">{user.course}</p>
          )}
        </div>

        {/* Enrollment */}
        <div>
          <label className="text-sm text-gray-500">Enrollment</label>
          <p className="font-medium">{user.enrollment}</p>
        </div>

        {/* School */}
        <div>
          <label className="text-sm text-gray-500">School</label>
          {isEditing ? (
            <input
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <p className="font-medium">{user.school}</p>
          )}
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;

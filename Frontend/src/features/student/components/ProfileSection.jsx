const ProfileSection = ({ user }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>

      {user && (
        <div className="space-y-2">
          <p><b>Name:</b> {user.username}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Course:</b> {user.course}</p>
          <p><b>Enrollment:</b> {user.enrollment}</p>
          <p><b>School:</b> {user.school}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
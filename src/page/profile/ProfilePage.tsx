// src/components/ProfileCard.tsx
import React from "react";

interface ProfileCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  stats?: {
    problemsSolved: number;
    challengesParticipated: number;
    teams: number;
  };
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  avatarUrl = "https://i.pravatar.cc/150",
  stats = {
    problemsSolved: 0,
    challengesParticipated: 0,
    teams: 0,
  },
}) => {
  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 mx-auto mb-4">
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name & Email */}
        <h2 className="text-2xl font-semibold text-center mb-1">{name}</h2>
        <p className="text-gray-500 text-center mb-6">{email}</p>

        {/* Stats */}
        <div className="flex justify-around bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 p-4 rounded-2xl mb-6 shadow-inner">
          <div className="text-center">
            <p className="text-xl font-bold text-purple-700">
              {stats.problemsSolved}
            </p>
            <p className="text-gray-600 text-sm">Solved</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-pink-700">
              {stats.challengesParticipated}
            </p>
            <p className="text-gray-600 text-sm">Challenges</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-blue-700">{stats.teams}</p>
            <p className="text-gray-600 text-sm">Teams</p>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button className="w-full py-2 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-600 transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;

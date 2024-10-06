import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaComments } from "react-icons/fa";
import FollowButton from "./FollowButton";

const People = () => {
  const dispatch = useDispatch();
  const { currentuser } = useSelector((state) => state.user);

  const followers = currentuser.userDetails.followers;
  const following = currentuser.userDetails.following;

  const [showFollowers, setShowFollowers] = useState(true);

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">
        {showFollowers ? "List of Followers" : "List of Following"}
      </h1>

      <div className="mb-5 flex space-x-4">
        <button
          onClick={() => setShowFollowers(true)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            showFollowers ? "bg-fuchsia-500 text-white" : "bg-neutral-900"
          } hover:bg-fuchsia-600`}
        >
          Followers
        </button>
        <button
          onClick={() => setShowFollowers(false)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            !showFollowers ? "bg-fuchsia-500 text-white" : "bg-neutral-900"
          } hover:bg-fuchsia-600`}
        >
          Following
        </button>
      </div>

      {/* Conditionally render the list of Followers or Following */}
      <div className="w-full max-w-md">
        {showFollowers ? (
          followers.length > 0 ? (
            <ul className="list-none">
              {followers.map((follower, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-neutral-950 shadow-slate-600  shadow-md rounded-lg p-4 mb-2 transition-transform duration-200 hover:scale-105"
                >
                  <span className="font-semibold text-lg">
                    {follower.username}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="text-xl text-gray-600 hover:text-fuchsia-500 transition-colors duration-200">
                      <FaComments />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No followers found.</p>
          )
        ) : following.length > 0 ? (
          <ul className="list-none">
            {following.map((person, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-neutral-950 shadow-slate-600  shadow-md rounded-lg p-4 mb-2 transition-transform duration-200 hover:scale-105"
              >
                <span className="font-semibold text-lg">{person.username}</span>
                <div className="flex items-center space-x-2">
                  <button className="text-xl text-gray-600 hover:text-fuchsia-500 transition-colors duration-200">
                    <FaComments />
                  </button>
                  <FollowButton userId={person.id} username={person.username} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No following found.</p>
        )}
      </div>
    </div>
  );
};

export default People;

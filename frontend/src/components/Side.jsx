import React from "react";
import { FaRocket, FaLock, FaUsers, FaChartLine } from "react-icons/fa";

const Side = () => {
  return (
<div className="xs:rounded-bl-[12px] xs:rounded-br-[12px] md:rounded-bl-[12px] md:rounded-br-[12px] lg:rounded-tr-[12px] lg:rounded-br-[10px] mt-0 lg:mt-8 flex flex-col items-center justify-center w-full lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-6 lg:p-12 mb-10">
<div className="max-w-md text-center lg:text-left">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Welcome to My BlogBuddy website</h1>
        <p className="text-lg lg:text-xl text-blue-100 mb-6">
          Discover a world of opportunities, connection, and growth.
        </p>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <FaRocket className="text-3xl lg:text-4xl text-yellow-300" />
            <div>
              <h3 className="font-semibold text-lg">Accelerate Your Journey</h3>
              <p className="text-blue-200 text-sm">
                Unlock your potential with cutting-edge tools and resources.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <FaLock className="text-3xl lg:text-4xl text-green-300" />
            <div>
              <h3 className="font-semibold text-lg">Secure & Private</h3>
              <p className="text-blue-200 text-sm">
                Your data is protected with state-of-the-art security measures.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <FaUsers className="text-3xl lg:text-4xl text-red-300" />
            <div>
              <h3 className="font-semibold text-lg">Community Driven</h3>
              <p className="text-blue-200 text-sm">
                Connect, collaborate, and grow with like-minded individuals.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <FaChartLine className="text-3xl lg:text-4xl text-pink-300" />
            <div>
              <h3 className="font-semibold text-lg">Track Your Progress</h3>
              <p className="text-blue-200 text-sm">
                Visualize your growth and achievements in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Side;

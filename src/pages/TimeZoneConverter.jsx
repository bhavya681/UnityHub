import React, { useState, useEffect } from 'react';

const TimeZoneConverter = () => {
  const [fromTimeZone, setFromTimeZone] = useState('');
  const [toTimeZone, setToTimeZone] = useState('');
  const [time, setTime] = useState('');
  const [difference, setDifference] = useState('');
  const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString());
  const [isDaytime, setIsDaytime] = useState(true);

  const timeZones = [
    "America/New_York", "Europe/London", "Asia/Tokyo", "Australia/Sydney",
    "America/Los_Angeles", "America/Chicago", "Europe/Berlin", "Europe/Paris",
    "Asia/Shanghai", "Asia/Hong_Kong", "Asia/Singapore", "Asia/Seoul",
    "Europe/Moscow", "America/Toronto", "Europe/Madrid", "Europe/Rome",
    "Africa/Cairo", "America/Sao_Paulo", "Pacific/Auckland", "Asia/Bangkok",
    "Africa/Johannesburg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString());
      setIsDaytime(now.getHours() >= 6 && now.getHours() < 18);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateTimeDifference = (from, to) => {
    if (from && to) {
      const fromDate = new Date().toLocaleString('en-US', { timeZone: from });
      const toDate = new Date().toLocaleString('en-US', { timeZone: to });
      const diff = (new Date(toDate) - new Date(fromDate)) / 3600000;
      setDifference(diff);
      setTime(new Date().toLocaleTimeString('en-US', { timeZone: to }));
    }
  };

  const flipTimeZones = () => {
    const temp = fromTimeZone;
    setFromTimeZone(toTimeZone);
    setToTimeZone(temp);
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-500 ${isDaytime ? 'bg-gradient-to-br from-blue-50 to-cyan-50' : 'bg-gradient-to-br from-gray-900 to-blue-900'}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Global Time Converter
          </h1>
          <div className="flex items-center justify-center space-x-4">
            <div className={`p-4 rounded-xl shadow-lg ${isDaytime ? 'bg-white' : 'bg-gray-800'}`}>
              <span className="text-sm font-semibold text-gray-500">Local Time</span>
              <p className={`text-2xl font-mono ${isDaytime ? 'text-blue-600' : 'text-blue-400'}`}>
                {localTime}
              </p>
            </div>
          </div>
        </div>

        {/* Converter Section */}
        <div className="grid md:grid-cols-3 gap-6 items-center">
          {/* From Timezone */}
          <div className={`p-6 rounded-2xl shadow-xl ${isDaytime ? 'bg-white' : 'bg-gray-800'}`}>
            <label className={`block text-sm font-medium ${isDaytime ? 'text-gray-700' : 'text-gray-300'}`}>
              From Timezone
            </label>
            <select
              value={fromTimeZone}
              onChange={(e) => {
                setFromTimeZone(e.target.value);
                calculateTimeDifference(e.target.value, toTimeZone);
              }}
              className={`mt-2 w-full p-3 rounded-lg border font-medium ${
                isDaytime 
                  ? 'border-gray-200 focus:ring-2 focus:ring-blue-500' 
                  : 'border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-400'
              }`}
            >
              <option value="">Select Origin</option>
              {timeZones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Flip Button */}
          <div className="flex justify-center">
            <button
              onClick={flipTimeZones}
              className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          {/* To Timezone */}
          <div className={`p-6 rounded-2xl shadow-xl ${isDaytime ? 'bg-white' : 'bg-gray-800'}`}>
            <label className={`block text-sm font-medium ${isDaytime ? 'text-gray-700' : 'text-gray-300'}`}>
              To Timezone
            </label>
            <select
              value={toTimeZone}
              onChange={(e) => {
                setToTimeZone(e.target.value);
                calculateTimeDifference(fromTimeZone, e.target.value);
              }}
              className={`mt-2 w-full p-3 rounded-lg border font-medium ${
                isDaytime 
                  ? 'border-gray-200 focus:ring-2 focus:ring-blue-500' 
                  : 'border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-400'
              }`}
            >
              <option value="">Select Destination</option>
              {timeZones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Section */}
        {time && (
          <div className={`p-8 rounded-2xl shadow-xl ${isDaytime ? 'bg-white' : 'bg-gray-800'}`}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className={`text-sm font-semibold ${isDaytime ? 'text-gray-600' : 'text-gray-400'}`}>
                  Converted Time
                </span>
                <p className={`text-3xl font-mono ${isDaytime ? 'text-blue-600' : 'text-blue-400'}`}>
                  {time}
                </p>
              </div>
              <div className="space-y-2">
                <span className={`text-sm font-semibold ${isDaytime ? 'text-gray-600' : 'text-gray-400'}`}>
                  Time Difference
                </span>
                <div className="flex items-center space-x-2">
                  <span className={`text-3xl font-bold ${
                    difference > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {difference > 0 ? `+${difference}` : difference}
                  </span>
                  <span className={`text-lg ${isDaytime ? 'text-gray-600' : 'text-gray-400'}`}>
                    hours
                  </span>
                </div>
              </div>
            </div>
            
            {/* Timeline Visualization */}
            <div className="mt-6 relative pt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-between">
                <div className="flex flex-col items-center">
                  <div className={`h-3 w-3 rounded-full ${isDaytime ? 'bg-blue-600' : 'bg-blue-400'}`}></div>
                  <span className={`mt-2 text-sm ${isDaytime ? 'text-gray-600' : 'text-gray-300'}`}>Origin</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`h-3 w-3 rounded-full ${difference > 0 ? 'bg-green-600' : 'bg-red-600'}`}></div>
                  <span className={`mt-2 text-sm ${isDaytime ? 'text-gray-600' : 'text-gray-300'}`}>Now</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`h-3 w-3 rounded-full ${isDaytime ? 'bg-blue-600' : 'bg-blue-400'}`}></div>
                  <span className={`mt-2 text-sm ${isDaytime ? 'text-gray-600' : 'text-gray-300'}`}>Destination</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timezone Globe Visualization */}
        <div className={`p-6 rounded-2xl shadow-xl ${isDaytime ? 'bg-white' : 'bg-gray-800'}`}>
          <div className="flex items-center justify-center space-x-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`text-lg font-semibold ${isDaytime ? 'text-gray-800' : 'text-gray-200'}`}>
              {timeZones.length} Major Time Zones Supported
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeZoneConverter;
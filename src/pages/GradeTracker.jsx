import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const GradeTracker = () => {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [grade, setGrade] = useState('');

  const addCourse = () => {
    if (courseName.trim() !== '' && grade.trim() !== '' && !isNaN(grade)) {
      const newCourse = { id: uuidv4(), name: courseName, grade: parseFloat(grade) };
      setCourses([...courses, newCourse]);
      setCourseName('');
      setGrade('');
    }
  };

  const deleteCourse = (id) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
  };

  const calculateGPA = () => {
    if (courses.length === 0) return 0;
    const totalGrades = courses.reduce((acc, course) => acc + course.grade, 0);
    return (totalGrades / courses.length).toFixed(2);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md min-h-[70vh]">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Grade Tracker</h2>
      <div className="mb-4 flex flex-col md:flex-row md:space-x-4">
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="flex-grow border border-gray-300 rounded-md px-4 py-2 mb-2 md:mb-0 focus:outline-none focus:border-blue-500"
          placeholder="Course Name"
        />
        <input
          type="text"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="flex-grow border border-gray-300 rounded-md px-4 py-2 mb-2 md:mb-0 focus:outline-none focus:border-blue-500"
          placeholder="Grade"
        />
        <button
          onClick={addCourse}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Add
        </button>
      </div>
      <ul className="mt-4">
        {courses.map(course => (
          <li key={course.id} className="flex justify-between items-center bg-gray-100 border border-gray-200 rounded-md py-3 px-4 mb-2">
            <span className="text-lg">{course.name}</span>
            <span className="text-lg font-semibold">{course.grade}</span>
            <button
              onClick={() => deleteCourse(course.id)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="text-right mt-4">
        <h3 className="text-2xl font-bold">Current GPA: {calculateGPA()}</h3>
      </div>
    </div>
  );
};

export default GradeTracker;

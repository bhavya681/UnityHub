import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircleIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  TrashIcon,
  ChartBarIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

const Trail = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ 
    name: "", 
    description: "", 
    milestones: [], 
    newMilestone: "" 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const addProject = () => {
    if (newProject.name && newProject.description) {
      setProjects([...projects, { 
        ...newProject, 
        id: Date.now(),
        progress: 0,
        milestones: newProject.milestones.map(m => ({ text: m, completed: false }))
      }]);
      setNewProject({ name: "", description: "", milestones: [], newMilestone: "" });
    }
  };

  const addMilestone = () => {
    if (newProject.newMilestone) {
      setNewProject(prev => ({
        ...prev,
        milestones: [...prev.milestones, prev.newMilestone],
        newMilestone: ""
      }));
    }
  };

  const toggleMilestone = (projectId, milestoneIndex) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        const updated = [...project.milestones];
        updated[milestoneIndex].completed = !updated[milestoneIndex].completed;
        const progress = (updated.filter(m => m.completed).length / updated.length) * 100;
        return { ...project, milestones: updated, progress };
      }
      return project;
    }));
  };

  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
            <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
              <ChartBarIcon className="w-10 h-10" />
              Project Flow Manager
            </h1>
            <p className="text-blue-100 mt-2">Track, manage, and conquer your projects</p>
          </div>

          {/* Project Creation Section */}
          <div className="p-8 border-b border-gray-100">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <div className="flex gap-4">
                  <input
                    name="name"
                    value={newProject.name}
                    onChange={handleInputChange}
                    placeholder="Next Big Thing"
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newProject.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Project vision and goals..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Milestones
                </label>
                <div className="flex gap-4">
                  <input
                    value={newProject.newMilestone}
                    onChange={(e) => setNewProject(prev => ({ ...prev, newMilestone: e.target.value }))}
                    placeholder="Critical milestone..."
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <button
                    onClick={addMilestone}
                    className="px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <PlusCircleIcon className="w-5 h-5" />
                    Add Step
                  </button>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {newProject.milestones.map((milestone, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      <BookmarkIcon className="w-4 h-4" />
                      {milestone}
                    </motion.div>
                  ))}
                </div>
              </div>

              <button
                onClick={addProject}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-shadow"
              >
                Launch Project
              </button>
            </div>
          </div>

          {/* Projects List */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <DocumentTextIcon className="w-6 h-6" />
              Active Projects
            </h2>

            <AnimatePresence>
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group mb-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                        <p className="text-gray-600 mt-1">{project.description}</p>
                      </div>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-blue-600">{Math.round(project.progress)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {project.milestones.map((milestone, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                          onClick={() => toggleMilestone(project.id, index)}
                        >
                          <CheckCircleIcon
                            className={`w-5 h-5 ${
                              milestone.completed 
                                ? 'text-green-500' 
                                : 'text-gray-300'
                            }`}
                          />
                          <span className={`${milestone.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {milestone.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Trail;
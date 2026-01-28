import { createContext, useContext, useState, useCallback } from 'react';
import { projectAPI, phaseAPI, aiAPI } from '../services/api';

const ProjectContext = createContext(null);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectAPI.getAll();
      setProjects(response.data.data);
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch projects';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single project
  const fetchProject = useCallback(async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectAPI.getById(projectId);
      setSelectedProject(response.data.data);
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch project';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create project
  const createProject = useCallback(async (projectData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectAPI.create(projectData);
      const newProject = response.data.data;
      setProjects((prev) => [newProject, ...prev]);
      return { success: true, project: newProject };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create project';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update project
  const updateProject = useCallback(async (projectId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectAPI.update(projectId, updateData);
      const updatedProject = response.data.data;
      
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? updatedProject : p))
      );
      
      if (selectedProject?._id === projectId) {
        setSelectedProject(updatedProject);
      }
      
      return { success: true, project: updatedProject };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update project';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  // Delete project
  const deleteProject = useCallback(async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      await projectAPI.delete(projectId);
      
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      
      if (selectedProject?._id === projectId) {
        setSelectedProject(null);
      }
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete project';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  // Assign developers to project
  const assignDevelopers = useCallback(async (projectId, developerIds) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectAPI.assignDevelopers(projectId, developerIds);
      const updatedProject = response.data.data;
      
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? updatedProject : p))
      );
      
      if (selectedProject?._id === projectId) {
        setSelectedProject(updatedProject);
      }
      
      return { success: true, project: updatedProject };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to assign developers';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  // Add phase to project
  const addPhase = useCallback(async (projectId, phaseData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectAPI.addPhase(projectId, phaseData);
      const updatedProject = response.data.data;
      
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? updatedProject : p))
      );
      
      if (selectedProject?._id === projectId) {
        setSelectedProject(updatedProject);
      }
      
      return { success: true, project: updatedProject };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add phase';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  // Update phase
  const updatePhase = useCallback(async (phaseId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await phaseAPI.update(phaseId, updateData);
      const { project: updatedProject } = response.data.data;
      
      setProjects((prev) =>
        prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
      );
      
      if (selectedProject?._id === updatedProject._id) {
        setSelectedProject(updatedProject);
      }
      
      return { success: true, project: updatedProject };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update phase';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  // Add comment to phase
  const addComment = useCallback(async (phaseId, text) => {
    try {
      setError(null);
      const response = await phaseAPI.addComment(phaseId, text);
      return { success: true, comments: response.data.data.comments };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add comment';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  // Get AI summaries
  const getMyPerformance = useCallback(async () => {
    try {
      const response = await aiAPI.getMyPerformance();
      return { success: true, data: response.data.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to get performance summary';
      return { success: false, error: message };
    }
  }, []);

  const getDeveloperSummary = useCallback(async (developerId) => {
    try {
      const response = await aiAPI.getDeveloperSummary(developerId);
      return { success: true, data: response.data.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to get developer summary';
      return { success: false, error: message };
    }
  }, []);

  const getProjectSummary = useCallback(async (projectId) => {
    try {
      const response = await aiAPI.getProjectSummary(projectId);
      return { success: true, data: response.data.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to get project summary';
      return { success: false, error: message };
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    projects,
    selectedProject,
    loading,
    error,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    assignDevelopers,
    addPhase,
    updatePhase,
    addComment,
    setSelectedProject,
    getMyPerformance,
    getDeveloperSummary,
    getProjectSummary,
    clearError,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;

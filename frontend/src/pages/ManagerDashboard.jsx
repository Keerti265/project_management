import { useState, useEffect, useCallback } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, Button, Spinner, Alert, Badge, Modal } from '../components/common';
import ProjectCard from '../components/projects/ProjectCard';
import PhaseItem from '../components/projects/PhaseItem';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import AddPhaseModal from '../components/projects/AddPhaseModal';
import AssignDevelopersModal from '../components/projects/AssignDevelopersModal';
import PerformanceSummary from '../components/dashboard/PerformanceSummary';
import {
  FiPlus,
  FiArrowLeft,
  FiUsers,
  FiLayers,
  FiCalendar,
  FiTrendingUp,
  FiTrash2,
} from 'react-icons/fi';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const {
    projects,
    selectedProject,
    loading,
    error,
    fetchProjects,
    fetchProject,
    createProject,
    deleteProject,
    assignDevelopers,
    addPhase,
    updatePhase,
    addComment,
    setSelectedProject,
    getProjectSummary,
    getDeveloperSummary,
    clearError,
  } = useProjects();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddPhaseModal, setShowAddPhaseModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showProjectSummary, setShowProjectSummary] = useState(false);
  const [selectedDeveloperForSummary, setSelectedDeveloperForSummary] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectClick = (project) => {
    fetchProject(project._id);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const handleStatusChange = async (phaseId, newStatus) => {
    await updatePhase(phaseId, { status: newStatus });
  };

  const handleAddComment = async (phaseId, text) => {
    await addComment(phaseId, text);
    // Refresh project to get updated comments
    if (selectedProject) {
      fetchProject(selectedProject._id);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      const result = await deleteProject(selectedProject._id);
      if (result.success) {
        setSelectedProject(null);
      }
    }
  };

  const fetchProjectSummaryCallback = useCallback(() => {
    if (selectedProject) {
      return getProjectSummary(selectedProject._id);
    }
    return Promise.resolve({ success: false, error: 'No project selected' });
  }, [selectedProject, getProjectSummary]);

  const fetchDeveloperSummaryCallback = useCallback(() => {
    if (selectedDeveloperForSummary) {
      return getDeveloperSummary(selectedDeveloperForSummary._id);
    }
    return Promise.resolve({ success: false, error: 'No developer selected' });
  }, [selectedDeveloperForSummary, getDeveloperSummary]);

  // Dashboard Stats
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === 'active').length,
    totalPhases: projects.reduce((sum, p) => sum + (p.phases?.length || 0), 0),
    completedPhases: projects.reduce(
      (sum, p) =>
        sum + (p.phases?.filter((ph) => ph.status === 'completed').length || 0),
      0
    ),
  };

  if (loading && !selectedProject && projects.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={clearError}
          className="mb-6"
        />
      )}

      {selectedProject ? (
        // Project Detail View
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToProjects}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedProject.title}
                </h1>
                <p className="text-gray-500">{selectedProject.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge status={selectedProject.status} />
              <Button
                variant="outline"
                onClick={() => setShowProjectSummary(true)}
              >
                <FiTrendingUp className="w-4 h-4 mr-2" />
                AI Summary
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteProject}
              >
                <FiTrash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Phases Column */}
            <div className="lg:col-span-2">
              <Card>
                <Card.Header className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Project Phases
                  </h2>
                  <Button size="sm" onClick={() => setShowAddPhaseModal(true)}>
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Phase
                  </Button>
                </Card.Header>
                <Card.Body>
                  {selectedProject.phases?.length > 0 ? (
                    <div className="space-y-3">
                      {selectedProject.phases.map((phase) => (
                        <PhaseItem
                          key={phase._id}
                          phase={phase}
                          onStatusChange={handleStatusChange}
                          onAddComment={handleAddComment}
                          canUpdateStatus={true}
                          isManager={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FiLayers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No phases yet. Add your first phase to get started.</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Developers */}
              <Card>
                <Card.Header className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Team</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAssignModal(true)}
                  >
                    <FiUsers className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </Card.Header>
                <Card.Body>
                  {selectedProject.developers?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedProject.developers.map((dev) => (
                        <div
                          key={dev._id}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() => setSelectedDeveloperForSummary(dev)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-600">
                                {dev.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {dev.name}
                              </p>
                              <p className="text-xs text-gray-500">{dev.email}</p>
                            </div>
                          </div>
                          <FiTrendingUp className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No developers assigned
                    </p>
                  )}
                </Card.Body>
              </Card>

              {/* Progress Overview */}
              <Card>
                <Card.Header>
                  <h3 className="font-semibold text-gray-900">Progress</h3>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-4">
                    <p className="text-4xl font-bold text-primary-600">
                      {selectedProject.progress || 0}%
                    </p>
                    <p className="text-sm text-gray-500">Complete</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div
                      className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${selectedProject.progress || 0}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedProject.phasesCount?.completed || 0}
                      </p>
                      <p className="text-gray-500">Completed</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedProject.phasesCount?.in_progress || 0}
                      </p>
                      <p className="text-gray-500">In Progress</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        // Projects List View
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-500">Here's an overview of your projects</p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <FiPlus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <Card.Body className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-3">
                  <FiLayers className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalProjects}
                </p>
                <p className="text-sm text-gray-500">Total Projects</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <FiCalendar className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeProjects}
                </p>
                <p className="text-sm text-gray-500">Active Projects</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <FiLayers className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalPhases}
                </p>
                <p className="text-sm text-gray-500">Total Phases</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-3">
                  <FiTrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedPhases}
                </p>
                <p className="text-sm text-gray-500">Completed Phases</p>
              </Card.Body>
            </Card>
          </div>

          {/* Projects Grid */}
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Your Projects
          </h2>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onClick={() => handleProjectClick(project)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <Card.Body className="text-center py-12">
                <FiLayers className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first project to get started
                </p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <FiPlus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </Card.Body>
            </Card>
          )}
        </div>
      )}

      {/* Modals */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createProject}
      />

      <AddPhaseModal
        isOpen={showAddPhaseModal}
        onClose={() => setShowAddPhaseModal(false)}
        onSubmit={addPhase}
        projectId={selectedProject?._id}
      />

      <AssignDevelopersModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onSubmit={assignDevelopers}
        projectId={selectedProject?._id}
        currentDevelopers={selectedProject?.developers || []}
      />

      {/* Project Summary Modal */}
      <Modal
        isOpen={showProjectSummary}
        onClose={() => setShowProjectSummary(false)}
        title="Project Performance Summary"
        size="lg"
      >
        {selectedProject && (
          <PerformanceSummary
            fetchSummary={fetchProjectSummaryCallback}
            title={`${selectedProject.title} Performance`}
          />
        )}
      </Modal>

      {/* Developer Summary Modal */}
      <Modal
        isOpen={!!selectedDeveloperForSummary}
        onClose={() => setSelectedDeveloperForSummary(null)}
        title="Developer Performance Summary"
        size="lg"
      >
        {selectedDeveloperForSummary && (
          <PerformanceSummary
            fetchSummary={fetchDeveloperSummaryCallback}
            title={`${selectedDeveloperForSummary.name}'s Performance`}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default ManagerDashboard;

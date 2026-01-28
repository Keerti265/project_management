import { useState, useEffect, useCallback } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, Button, Spinner, Alert, Badge } from '../components/common';
import ProjectCard from '../components/projects/ProjectCard';
import PhaseItem from '../components/projects/PhaseItem';
import PerformanceSummary from '../components/dashboard/PerformanceSummary';
import {
  FiArrowLeft,
  FiLayers,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
} from 'react-icons/fi';

const DeveloperDashboard = () => {
  const { user } = useAuth();
  const {
    projects,
    selectedProject,
    loading,
    error,
    fetchProjects,
    fetchProject,
    updatePhase,
    addComment,
    setSelectedProject,
    getMyPerformance,
    clearError,
  } = useProjects();

  const [showPerformance, setShowPerformance] = useState(false);

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

  // Get my phases across all projects
  const myPhases = projects.flatMap((project) =>
    (project.phases || [])
      .filter(
<<<<<<< HEAD
        (phase) => {
          const assignedId = phase.assignedDeveloper?.id || phase.assignedDeveloper?._id || phase.assignedDeveloper;
          return assignedId === user?.id;
        }
=======
        (phase) =>
          phase.assignedDeveloper?._id === user?.id ||
          phase.assignedDeveloper === user?.id
>>>>>>> 1560859db2d664fdbf609d8aae45b92a884b1103
      )
      .map((phase) => ({
        ...phase,
        projectTitle: project.title,
<<<<<<< HEAD
        projectId: project._id || project.id,
=======
        projectId: project._id,
>>>>>>> 1560859db2d664fdbf609d8aae45b92a884b1103
      }))
  );

  const myPhasesInProject = selectedProject
    ? (selectedProject.phases || []).filter(
<<<<<<< HEAD
        (phase) => {
          const assignedId = phase.assignedDeveloper?.id || phase.assignedDeveloper?._id || phase.assignedDeveloper;
          return assignedId === user?.id;
        }
=======
        (phase) =>
          phase.assignedDeveloper?._id === user?.id ||
          phase.assignedDeveloper === user?.id
>>>>>>> 1560859db2d664fdbf609d8aae45b92a884b1103
      )
    : [];

  // Dashboard Stats
  const stats = {
    totalAssigned: myPhases.length,
    completed: myPhases.filter((p) => p.status === 'completed').length,
    inProgress: myPhases.filter((p) => p.status === 'in_progress').length,
    overdue: myPhases.filter(
      (p) => p.status !== 'completed' && new Date(p.deadline) < new Date()
    ).length,
  };

  // Upcoming deadlines
  const upcomingDeadlines = myPhases
    .filter((p) => p.status !== 'completed')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

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
            <Badge status={selectedProject.status} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Phases */}
            <div className="lg:col-span-2">
              <Card>
                <Card.Header>
                  <h2 className="text-lg font-semibold text-gray-900">
                    My Assigned Phases
                  </h2>
                </Card.Header>
                <Card.Body>
                  {myPhasesInProject.length > 0 ? (
                    <div className="space-y-3">
                      {myPhasesInProject.map((phase) => (
                        <PhaseItem
                          key={phase._id}
                          phase={phase}
                          onStatusChange={handleStatusChange}
                          onAddComment={handleAddComment}
                          canUpdateStatus={true}
                          isManager={false}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FiLayers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No phases assigned to you in this project.</p>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* All Project Phases (read-only) */}
              <Card className="mt-6">
                <Card.Header>
                  <h2 className="text-lg font-semibold text-gray-900">
                    All Project Phases
                  </h2>
                </Card.Header>
                <Card.Body>
                  {selectedProject.phases?.length > 0 ? (
                    <div className="space-y-3">
                      {selectedProject.phases.map((phase) => {
<<<<<<< HEAD
                        const assignedId = phase.assignedDeveloper?.id || phase.assignedDeveloper?._id || phase.assignedDeveloper;
                        const isMyPhase = assignedId === user?.id;
=======
                        const isMyPhase =
                          phase.assignedDeveloper?._id === user?.id ||
                          phase.assignedDeveloper === user?.id;
>>>>>>> 1560859db2d664fdbf609d8aae45b92a884b1103
                        return (
                          <PhaseItem
                            key={phase._id}
                            phase={phase}
                            onStatusChange={handleStatusChange}
                            onAddComment={handleAddComment}
                            canUpdateStatus={isMyPhase}
                            isManager={false}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No phases in this project yet.
                    </p>
                  )}
                </Card.Body>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Progress */}
              <Card>
                <Card.Header>
                  <h3 className="font-semibold text-gray-900">Project Progress</h3>
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
                        {selectedProject.phasesCount?.total || 0}
                      </p>
                      <p className="text-gray-500">Total</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Project Manager */}
              <Card>
                <Card.Header>
                  <h3 className="font-semibold text-gray-900">Project Manager</h3>
                </Card.Header>
                <Card.Body>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-primary-600">
                        {selectedProject.manager?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedProject.manager?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedProject.manager?.email}
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        // Dashboard View
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-500">
                Here's an overview of your assigned tasks
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPerformance(!showPerformance)}
            >
              <FiTrendingUp className="w-4 h-4 mr-2" />
              My Performance
            </Button>
          </div>

          {/* Performance Summary */}
          {showPerformance && (
            <div className="mb-8">
              <PerformanceSummary
                fetchSummary={getMyPerformance}
                title="My Performance Summary"
              />
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <Card.Body className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-3">
                  <FiLayers className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalAssigned}
                </p>
                <p className="text-sm text-gray-500">Assigned Phases</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <FiCheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completed}
                </p>
                <p className="text-sm text-gray-500">Completed</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <FiClock className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.inProgress}
                </p>
                <p className="text-sm text-gray-500">In Progress</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3">
                  <FiCalendar className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.overdue}
                </p>
                <p className="text-sm text-gray-500">Overdue</p>
              </Card.Body>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Projects */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Assigned Projects
              </h2>
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      No projects assigned
                    </h3>
                    <p className="text-gray-500">
                      You'll see projects here once a manager assigns you to one.
                    </p>
                  </Card.Body>
                </Card>
              )}
            </div>

            {/* Upcoming Deadlines */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Upcoming Deadlines
              </h2>
              <Card>
                <Card.Body>
                  {upcomingDeadlines.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingDeadlines.map((phase) => {
                        const isOverdue =
                          new Date(phase.deadline) < new Date();
                        const daysUntil = Math.ceil(
                          (new Date(phase.deadline) - new Date()) /
                            (1000 * 60 * 60 * 24)
                        );

                        return (
                          <div
                            key={phase._id}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900 text-sm">
                                {phase.name}
                              </span>
                              <Badge status={phase.status} />
                            </div>
                            <p className="text-xs text-gray-500 mb-1">
                              {phase.projectTitle}
                            </p>
                            <p
                              className={`text-xs font-medium ${
                                isOverdue ? 'text-red-600' : 'text-gray-600'
                              }`}
                            >
                              {isOverdue
                                ? `Overdue by ${Math.abs(daysUntil)} days`
                                : daysUntil === 0
                                ? 'Due today'
                                : `Due in ${daysUntil} days`}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <FiCalendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No upcoming deadlines</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DeveloperDashboard;

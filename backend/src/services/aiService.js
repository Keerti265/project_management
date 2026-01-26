const mockDb = require('../config/mockDb');

/**
 * AI Service
 * Generates performance summaries using mock AI logic
 */
class AIService {
  /**
   * Generate developer performance summary
   */
  async getDeveloperSummary(developerId) {
    const developer = mockDb.findUserById(developerId);

    if (!developer) {
      const error = new Error('Developer not found');
      error.statusCode = 404;
      throw error;
    }

    if (developer.role !== 'developer') {
      const error = new Error('User is not a developer');
      error.statusCode = 400;
      throw error;
    }

    // Find all projects where developer is assigned
    const projects = mockDb.findProjectsByDeveloper(developerId);

    // Collect all phases assigned to this developer
    const assignedPhases = [];
    projects.forEach((project) => {
      project.phases.forEach((phase) => {
        if (phase.assignedDeveloper === developerId) {
          assignedPhases.push({
            ...phase,
            projectTitle: project.title,
            projectId: project._id,
          });
        }
      });
    });

    // Calculate metrics
    const metrics = this.calculateMetrics(assignedPhases);

    // Generate natural language summary
    const summary = this.generateDeveloperNarrativeSummary(
      developer.name,
      metrics,
      assignedPhases
    );

    return {
      developerId,
      developerName: developer.name,
      summary,
      metrics,
      phases: assignedPhases.map((p) => ({
        name: p.name,
        projectTitle: p.projectTitle,
        status: p.status,
        deadline: p.deadline,
        completedAt: p.completedAt,
        isOnTime: this.isOnTime(p),
      })),
    };
  }

  /**
   * Generate project performance summary
   */
  async getProjectSummary(projectId) {
    const project = mockDb.findProjectById(projectId);

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    const populatedProject = mockDb.populateProject(project);

    // Calculate project-wide metrics
    const projectMetrics = this.calculateMetrics(project.phases);

    // Calculate per-developer metrics
    const developerMetrics = this.calculateDeveloperMetrics(project.phases);

    // Generate project narrative
    const summary = this.generateProjectNarrativeSummary(
      project.title,
      projectMetrics,
      developerMetrics,
      project.phases
    );

    return {
      projectId,
      projectTitle: project.title,
      summary,
      projectMetrics,
      developerMetrics,
      timeline: this.generateTimeline(project.phases),
    };
  }

  /**
   * Calculate performance metrics from phases
   */
  calculateMetrics(phases) {
    const total = phases.length;
    const completed = phases.filter((p) => p.status === 'completed').length;
    const inProgress = phases.filter((p) => p.status === 'in_progress').length;
    const pending = phases.filter((p) => p.status === 'pending').length;
    const delayed = phases.filter((p) => p.status === 'delayed').length;

    // Calculate on-time deliveries
    const completedPhases = phases.filter((p) => p.status === 'completed');
    const onTime = completedPhases.filter((p) => this.isOnTime(p)).length;
    const late = completedPhases.length - onTime;

    // Calculate average delay for late tasks
    let avgDelayDays = 0;
    const latePhases = completedPhases.filter((p) => !this.isOnTime(p));
    if (latePhases.length > 0) {
      const totalDelayDays = latePhases.reduce((sum, p) => {
        return sum + this.getDelayDays(p);
      }, 0);
      avgDelayDays = Math.round(totalDelayDays / latePhases.length);
    }

    // Calculate overdue tasks
    const overdue = phases.filter((p) => {
      if (p.status === 'completed') return false;
      return new Date(p.deadline) < new Date();
    }).length;

    return {
      total,
      completed,
      inProgress,
      pending,
      delayed,
      onTime,
      late,
      overdue,
      avgDelayDays,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      onTimeRate: completedPhases.length > 0
        ? Math.round((onTime / completedPhases.length) * 100)
        : 0,
    };
  }

  /**
   * Calculate metrics per developer
   */
  calculateDeveloperMetrics(phases) {
    const developerMap = new Map();

    phases.forEach((phase) => {
      if (!phase.assignedDeveloper) return;

      const devId = phase.assignedDeveloper;
      const developer = mockDb.findUserById(devId);
      const devName = developer?.name || 'Unknown';

      if (!developerMap.has(devId)) {
        developerMap.set(devId, {
          developerId: devId,
          developerName: devName,
          phases: [],
        });
      }

      developerMap.get(devId).phases.push(phase);
    });

    return Array.from(developerMap.values()).map((dev) => ({
      developerId: dev.developerId,
      developerName: dev.developerName,
      metrics: this.calculateMetrics(dev.phases),
    }));
  }

  /**
   * Check if phase was completed on time
   */
  isOnTime(phase) {
    if (!phase.completedAt || !phase.deadline) return false;
    return new Date(phase.completedAt) <= new Date(phase.deadline);
  }

  /**
   * Get delay in days for a phase
   */
  getDelayDays(phase) {
    if (!phase.completedAt || !phase.deadline) return 0;
    const deadline = new Date(phase.deadline);
    const completed = new Date(phase.completedAt);
    const diffTime = completed - deadline;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  /**
   * Generate timeline of project phases
   */
  generateTimeline(phases) {
    const sortedPhases = [...phases].sort(
      (a, b) => new Date(a.deadline) - new Date(b.deadline)
    );

    return sortedPhases.map((phase) => {
      const developer = phase.assignedDeveloper
        ? mockDb.findUserById(phase.assignedDeveloper)
        : null;

      return {
        name: phase.name,
        deadline: phase.deadline,
        completedAt: phase.completedAt,
        status: phase.status,
        assignedTo: developer?.name || 'Unassigned',
        isOnTime: phase.status === 'completed' ? this.isOnTime(phase) : null,
        delayDays: phase.status === 'completed' ? this.getDelayDays(phase) : null,
      };
    });
  }

  /**
   * Generate natural language summary for developer
   */
  generateDeveloperNarrativeSummary(name, metrics, phases) {
    if (metrics.total === 0) {
      return `${name} currently has no assigned phases. Consider assigning tasks to begin performance tracking.`;
    }

    const parts = [];

    parts.push(
      `${name} has been assigned ${metrics.total} phase${metrics.total !== 1 ? 's' : ''} across various projects.`
    );

    if (metrics.completed > 0) {
      parts.push(
        `${metrics.completed} phase${metrics.completed !== 1 ? 's have' : ' has'} been completed (${metrics.completionRate}% completion rate).`
      );
    }

    if (metrics.completed > 0) {
      if (metrics.onTimeRate >= 90) {
        parts.push(
          `Excellent on-time delivery rate of ${metrics.onTimeRate}% - ${name} consistently meets deadlines.`
        );
      } else if (metrics.onTimeRate >= 70) {
        parts.push(
          `Good on-time delivery rate of ${metrics.onTimeRate}%. ${metrics.late} task${metrics.late !== 1 ? 's were' : ' was'} delivered late.`
        );
      } else if (metrics.onTimeRate >= 50) {
        parts.push(
          `On-time delivery rate of ${metrics.onTimeRate}% indicates room for improvement. ${metrics.late} task${metrics.late !== 1 ? 's were' : ' was'} delivered late with an average delay of ${metrics.avgDelayDays} day${metrics.avgDelayDays !== 1 ? 's' : ''}.`
        );
      } else {
        parts.push(
          `On-time delivery rate of ${metrics.onTimeRate}% suggests challenges meeting deadlines. Consider reviewing workload or providing additional support.`
        );
      }
    }

    if (metrics.inProgress > 0 || metrics.pending > 0) {
      const current = metrics.inProgress + metrics.pending;
      parts.push(
        `Currently, ${name} has ${current} active task${current !== 1 ? 's' : ''} (${metrics.inProgress} in progress, ${metrics.pending} pending).`
      );
    }

    if (metrics.overdue > 0) {
      parts.push(
        `Warning: ${metrics.overdue} task${metrics.overdue !== 1 ? 's are' : ' is'} overdue and require${metrics.overdue === 1 ? 's' : ''} immediate attention.`
      );
    }

    return parts.join(' ');
  }

  /**
   * Generate natural language summary for project
   */
  generateProjectNarrativeSummary(title, metrics, devMetrics, phases) {
    if (metrics.total === 0) {
      return `Project "${title}" has no phases defined yet. Add phases to begin tracking progress.`;
    }

    const parts = [];

    parts.push(
      `Project "${title}" consists of ${metrics.total} phase${metrics.total !== 1 ? 's' : ''}.`
    );

    if (metrics.completionRate === 100) {
      parts.push('All phases have been completed.');
    } else {
      parts.push(
        `Overall progress: ${metrics.completionRate}% complete (${metrics.completed}/${metrics.total} phases).`
      );
    }

    if (metrics.completed > 0) {
      parts.push(`On-time delivery rate: ${metrics.onTimeRate}%.`);

      if (metrics.late > 0) {
        parts.push(
          `${metrics.late} phase${metrics.late !== 1 ? 's were' : ' was'} delivered late with an average delay of ${metrics.avgDelayDays} day${metrics.avgDelayDays !== 1 ? 's' : ''}.`
        );
      }
    }

    if (metrics.inProgress > 0) {
      parts.push(`${metrics.inProgress} phase${metrics.inProgress !== 1 ? 's' : ''} currently in progress.`);
    }

    if (metrics.overdue > 0) {
      parts.push(
        `Risk Alert: ${metrics.overdue} phase${metrics.overdue !== 1 ? 's are' : ' is'} past deadline and not yet completed.`
      );
    }

    if (devMetrics.length > 0) {
      const topPerformer = devMetrics.reduce((best, dev) => {
        if (!best || dev.metrics.onTimeRate > best.metrics.onTimeRate) {
          return dev;
        }
        return best;
      }, null);

      if (topPerformer && topPerformer.metrics.completed > 0) {
        parts.push(
          `Top performer: ${topPerformer.developerName} with ${topPerformer.metrics.onTimeRate}% on-time delivery rate.`
        );
      }
    }

    return parts.join(' ');
  }
}

module.exports = new AIService();

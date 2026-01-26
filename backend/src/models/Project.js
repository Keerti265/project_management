const mongoose = require('mongoose');

/**
 * Comment Schema (embedded in Phase)
 */
const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Phase Schema (embedded in Project)
 * Represents a phase/milestone within a project
 */
const PhaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Phase name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'delayed'],
      default: 'pending',
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    completedAt: {
      type: Date,
      default: null,
    },
    assignedDeveloper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    comments: [CommentSchema],
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['pending', 'in_progress', 'completed', 'delayed'],
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save middleware to track status changes
 */
PhaseSchema.pre('save', function (next) {
  // If status changed, record completion time for 'completed' status
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
    }
  }
  next();
});

/**
 * Project Schema
 * Main schema for projects with embedded phases
 */
const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    developers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    phases: [PhaseSchema],
    status: {
      type: String,
      enum: ['active', 'completed', 'on_hold', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster queries
ProjectSchema.index({ manager: 1 });
ProjectSchema.index({ developers: 1 });
ProjectSchema.index({ 'phases.assignedDeveloper': 1 });
ProjectSchema.index({ status: 1 });

/**
 * Virtual: Calculate project progress percentage
 */
ProjectSchema.virtual('progress').get(function () {
  if (this.phases.length === 0) return 0;
  const completedPhases = this.phases.filter(
    (phase) => phase.status === 'completed'
  ).length;
  return Math.round((completedPhases / this.phases.length) * 100);
});

/**
 * Virtual: Get phases count by status
 */
ProjectSchema.virtual('phasesCount').get(function () {
  return {
    total: this.phases.length,
    pending: this.phases.filter((p) => p.status === 'pending').length,
    in_progress: this.phases.filter((p) => p.status === 'in_progress').length,
    completed: this.phases.filter((p) => p.status === 'completed').length,
    delayed: this.phases.filter((p) => p.status === 'delayed').length,
  };
});

/**
 * Static method: Find projects by developer
 * Returns projects where developer is assigned to project or any phase
 */
ProjectSchema.statics.findByDeveloper = async function (developerId) {
  return this.find({
    $or: [
      { developers: developerId },
      { 'phases.assignedDeveloper': developerId },
    ],
  })
    .populate('manager', 'name email')
    .populate('developers', 'name email')
    .populate('phases.assignedDeveloper', 'name email')
    .populate('phases.comments.author', 'name email');
};

/**
 * Instance method: Check if user has access to project
 */
ProjectSchema.methods.hasAccess = function (userId, userRole) {
  if (userRole === 'manager') {
    return this.manager.toString() === userId.toString();
  }
  
  // Developer has access if assigned to project or any phase
  const isProjectDeveloper = this.developers.some(
    (dev) => dev.toString() === userId.toString()
  );
  const isPhaseDeveloper = this.phases.some(
    (phase) =>
      phase.assignedDeveloper &&
      phase.assignedDeveloper.toString() === userId.toString()
  );
  
  return isProjectDeveloper || isPhaseDeveloper;
};

/**
 * Instance method: Get phase by ID
 */
ProjectSchema.methods.getPhase = function (phaseId) {
  return this.phases.id(phaseId);
};

module.exports = mongoose.model('Project', ProjectSchema);

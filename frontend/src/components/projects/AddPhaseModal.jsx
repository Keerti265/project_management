import { useState, useEffect } from 'react';
import { Modal, Input, Button, Alert, Select } from '../common';
import { authAPI } from '../../services/api';

const AddPhaseModal = ({ isOpen, onClose, onSubmit, projectId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: '',
    assignedDeveloper: '',
  });
  const [developers, setDevelopers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await authAPI.getDevelopers();
        setDevelopers(response.data.data);
      } catch (err) {
        console.error('Failed to fetch developers:', err);
      }
    };

    if (isOpen) {
      fetchDevelopers();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Phase name is required';
    }
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const phaseData = {
      name: formData.name,
      description: formData.description,
      deadline: formData.deadline,
    };
    
    if (formData.assignedDeveloper) {
      phaseData.assignedDeveloper = formData.assignedDeveloper;
    }

    const result = await onSubmit(projectId, phaseData);
    setLoading(false);

    if (result.success) {
      setFormData({
        name: '',
        description: '',
        deadline: '',
        assignedDeveloper: '',
      });
      onClose();
    } else {
      setError(result.error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      deadline: '',
      assignedDeveloper: '',
    });
    setErrors({});
    setError('');
    onClose();
  };

  // Get min date (today)
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Phase">
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Phase Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="e.g., Design Phase, Development, Testing"
          required
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter phase description (optional)"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none transition-all duration-200"
          />
        </div>

        <Input
          label="Deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
          error={errors.deadline}
          min={minDate}
          required
        />

        <Select
          label="Assign Developer"
          name="assignedDeveloper"
          value={formData.assignedDeveloper}
          onChange={handleChange}
          placeholder="Select a developer (optional)"
          options={developers.map((dev) => ({
<<<<<<< HEAD
            value: dev.id || dev._id,
=======
            value: dev._id,
>>>>>>> 1560859db2d664fdbf609d8aae45b92a884b1103
            label: dev.name,
          }))}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Add Phase
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPhaseModal;

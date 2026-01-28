import { useState, useEffect } from 'react';
import { Modal, Button, Alert } from '../common';
import { authAPI } from '../../services/api';
import { FiCheck } from 'react-icons/fi';

const AssignDevelopersModal = ({
  isOpen,
  onClose,
  onSubmit,
  projectId,
  currentDevelopers = [],
}) => {
  const [developers, setDevelopers] = useState([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
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
<<<<<<< HEAD
      // Set initially selected developers (handle both id and _id formats)
      setSelectedDevelopers(currentDevelopers.map((d) => d.id || d._id || d));
=======
      // Set initially selected developers
      setSelectedDevelopers(currentDevelopers.map((d) => d._id || d));
>>>>>>> 1560859db2d664fdbf609d8aae45b92a884b1103
    }
  }, [isOpen, currentDevelopers]);

  const toggleDeveloper = (devId) => {
<<<<<<< HEAD
    if (!devId) return; // Guard against null/undefined
=======
>>>>>>> 1560859db2d664fdbf609d8aae45b92a884b1103
    setSelectedDevelopers((prev) =>
      prev.includes(devId)
        ? prev.filter((id) => id !== devId)
        : [...prev, devId]
    );
  };

  const handleSubmit = async () => {
    if (selectedDevelopers.length === 0) {
      setError('Please select at least one developer');
      return;
    }

    setLoading(true);
    const result = await onSubmit(projectId, selectedDevelopers);
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
  };

  const handleClose = () => {
    setSelectedDevelopers([]);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Assign Developers">
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-4"
        />
      )}

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-3">
          Select developers to assign to this project:
        </p>

        <div className="space-y-2 max-h-64 overflow-y-auto">
<<<<<<< HEAD
          {developers.map((dev) => {
            const devId = dev.id || dev._id;
            const isSelected = selectedDevelopers.includes(devId);
            return (
              <div
                key={devId}
                onClick={() => toggleDeveloper(devId)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <p className="font-medium text-gray-900">{dev.name}</p>
                  <p className="text-sm text-gray-500">{dev.email}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            );
          })}
=======
          {developers.map((dev) => (
            <div
              key={dev._id}
              onClick={() => toggleDeveloper(dev._id)}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                selectedDevelopers.includes(dev._id)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div>
                <p className="font-medium text-gray-900">{dev.name}</p>
                <p className="text-sm text-gray-500">{dev.email}</p>
              </div>
              {selectedDevelopers.includes(dev._id) && (
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <FiCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
>>>>>>> 1560859db2d664fdbf609d8aae45b92a884b1103
        </div>

        {developers.length === 0 && (
          <p className="text-center text-gray-500 py-4">No developers found</p>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <span className="text-sm text-gray-500">
          {selectedDevelopers.length} developer(s) selected
        </span>
        <div className="flex space-x-3">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            Assign
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignDevelopersModal;

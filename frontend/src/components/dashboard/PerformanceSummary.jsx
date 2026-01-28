import { useState, useEffect } from 'react';
import { Card, Spinner, Alert } from '../common';
import { FiTrendingUp, FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';

const PerformanceSummary = ({ fetchSummary, title = 'Performance Summary' }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      const result = await fetchSummary();
      setLoading(false);

      if (result.success) {
        setSummary(result.data);
      } else {
        setError(result.error);
      }
    };

    loadSummary();
  }, [fetchSummary]);

  if (loading) {
    return (
      <Card>
        <Card.Body className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Card.Body>
          <Alert type="error" message={error} />
        </Card.Body>
      </Card>
    );
  }

  if (!summary) {
    return null;
  }

  const { metrics } = summary;

  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FiTrendingUp className="w-5 h-5 mr-2 text-primary-600" />
          {title}
        </h3>
      </Card.Header>
      <Card.Body>
        {/* AI Generated Summary */}
        <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-100">
          <p className="text-gray-700 leading-relaxed">{summary.summary}</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2">
              <FiCheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
            <p className="text-sm text-gray-500">Total Phases</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mb-2">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.completed}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full mb-2">
              <FiClock className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.onTimeRate}%</p>
            <p className="text-sm text-gray-500">On-Time Rate</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mb-2">
              <FiAlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.overdue}</p>
            <p className="text-sm text-gray-500">Overdue</p>
          </div>
        </div>

        {/* Progress bars */}
        <div className="mt-6 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Completion Rate</span>
              <span className="text-sm font-medium text-gray-900">{metrics.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${metrics.completionRate}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">On-Time Delivery</span>
              <span className="text-sm font-medium text-gray-900">{metrics.onTimeRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  metrics.onTimeRate >= 70 ? 'bg-emerald-600' : metrics.onTimeRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${metrics.onTimeRate}%` }}
              />
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PerformanceSummary;

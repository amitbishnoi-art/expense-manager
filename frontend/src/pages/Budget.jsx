import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { getErrorMessage } from '../utils/helpers';
import Layout from '../components/layout/Layout';
import BudgetForm from '../components/budget/BudgetForm';
import BudgetList from '../components/budget/BudgetList';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/budgets');
      setBudgets(data.budgets);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/budgets/${deleteTarget._id}`);
      toast.success('Budget removed');
      setDeleteTarget(null);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout pageTitle="Budgets">
      <div className="space-y-6">
        <BudgetForm onSaved={load} existingCategories={budgets.map((b) => b.category)} />

        {loading ? (
          <Card className="flex h-48 items-center justify-center">
            <Spinner size={28} />
          </Card>
        ) : (
          <BudgetList budgets={budgets} onDelete={setDeleteTarget} />
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete budget?"
        description={`This removes the monthly budget for "${deleteTarget?.category}". Past transactions are not affected.`}
        confirmLabel="Delete"
      />
    </Layout>
  );
}

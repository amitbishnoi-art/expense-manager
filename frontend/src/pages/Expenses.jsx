import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useAppData } from '../context/DataContext';
import { getErrorMessage } from '../utils/helpers';
import Layout from '../components/layout/Layout';
import ExpenseFilters, { emptyFilters } from '../components/expenses/ExpenseFilters';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseFormModal from '../components/expenses/ExpenseFormModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';

export default function Expenses() {
  const { refresh } = useAppData();
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ expenses: [], pagination: { total: 0, totalPages: 1, limit: 20 } });
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit: 20 };
      Object.keys(params).forEach((k) => params[k] === '' && delete params[k]);
      const { data } = await api.get('/expenses', { params });
      setData(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset to page 1 whenever the filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const handleExport = async () => {
    try {
      const response = await api.get('/expenses/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expenses-export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/expenses/${deleteTarget._id}`);
      toast.success('Transaction deleted');
      setDeleteTarget(null);
      load();
      refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout pageTitle="Transactions" onAddExpense={() => { setEditingExpense(null); setFormOpen(true); }}>
      <div className="space-y-4">
        <ExpenseFilters filters={filters} onChange={setFilters} onExport={handleExport} />

        {loading ? (
          <Card className="flex h-64 items-center justify-center">
            <Spinner size={28} />
          </Card>
        ) : (
          <>
            <ExpenseList
              expenses={data.expenses}
              onEdit={(exp) => { setEditingExpense(exp); setFormOpen(true); }}
              onDelete={setDeleteTarget}
            />
            {data.expenses.length > 0 && (
              <div className="overflow-hidden rounded-card border border-border bg-surface">
                <Pagination
                  page={data.pagination.page}
                  totalPages={data.pagination.totalPages}
                  total={data.pagination.total}
                  limit={data.pagination.limit}
                  onChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      <ExpenseFormModal
        open={formOpen}
        expense={editingExpense}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false);
          load();
          refresh();
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete transaction?"
        description={`This will permanently remove "${deleteTarget?.title}". This action can't be undone.`}
        confirmLabel="Delete"
      />
    </Layout>
  );
}

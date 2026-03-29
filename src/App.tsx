import { useState, useEffect } from "react";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import MonthDetails from "./pages/MonthDetails";
import { useMonths } from "./hooks/useMonths";
import { Toaster } from "react-hot-toast";
import AddMonthModal from "./components/modals/AddMonthModal";

function App() {
  const {
    months,
    selectedMonthId,
    setSelectedMonthId,
    deleteMonth,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    initializeWithSampleData,
  } = useMonths();
  const [isAddMonthOpen, setIsAddMonthOpen] = useState(false);

  useEffect(() => {
    initializeWithSampleData();
  }, [initializeWithSampleData]);

  const selectedMonth = months.find((m) => m.id === selectedMonthId) || null;

  const handleSelectMonth = (monthId: string | null) => {
    setSelectedMonthId(monthId);
  };

  const handleBack = () => {
    console.log('App: back from details');
    setSelectedMonthId(null);
  };

  return (
    <Layout
      months={months}
      selectedMonthId={selectedMonthId}
      onSelectMonth={handleSelectMonth}
      onDeleteMonth={deleteMonth}
      onOpenAddMonth={() => setIsAddMonthOpen(true)}
    >
      {selectedMonth ? (
        <MonthDetails
          month={selectedMonth}
          allMonths={months}
          onBack={handleBack}
          onAddTransaction={addTransaction}
          onDeleteTransaction={deleteTransaction}
          onEditTransaction={updateTransaction}
        />
      ) : (
        <Home
          onSelectMonth={handleSelectMonth}
        />
      )}
      <Toaster position="bottom-right" />
      <AddMonthModal
        isOpen={isAddMonthOpen}
        onClose={() => setIsAddMonthOpen(false)}
      />
    </Layout>
  );
}

export default App;

import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { motion, AnimatePresence } from 'framer-motion';

const InvoiceGenerator = () => {
  const [invoices, setInvoices] = useState([]);
  const [newInvoice, setNewInvoice] = useState({
    type: 'Invoice',
    client: '',
    amount: '',
    dueDate: '',
    description: '',
    companyName: '',
    companyAddress: '',
    customerAddress: '',
    invoiceNumber: '',
    invoiceDate: '',
    tax: '',
    terms: 'Payment is due within 15 days',
  });

  const [error, setError] = useState(null);  // Track validation errors

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice({ ...newInvoice, [name]: value });
  };

  const addInvoice = () => {
    if (validateInvoice(newInvoice)) {
      setInvoices([...invoices, newInvoice]);
      resetForm();
      setError(null);  // Reset error on successful submission
    } else {
      setError('Please fill all required fields correctly.');
    }
  };

  const validateInvoice = (invoice) => {
    return (
      invoice.client &&
      invoice.amount &&
      invoice.dueDate &&
      invoice.description &&
      invoice.companyName &&
      invoice.invoiceNumber &&
      invoice.invoiceDate
    );
  };

  const resetForm = () => {
    setNewInvoice({
      type: 'Invoice',
      client: '',
      amount: '',
      dueDate: '',
      description: '',
      companyName: '',
      companyAddress: '',
      customerAddress: '',
      invoiceNumber: '',
      invoiceDate: '',
      tax: '',
      terms: 'Payment is due within 15 days',
    });
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount).toFixed(2);
  };

  const downloadPDF = (invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(invoice.type, 20, 20);
    doc.setFontSize(12);
    doc.text(`From: ${invoice.companyName}`, 20, 30);
    doc.text(`Address: ${invoice.companyAddress}`, 20, 35);
    doc.text(`Bill To: ${invoice.client}`, 20, 45);
    doc.text(`Customer Address: ${invoice.customerAddress}`, 20, 50);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 60);
    doc.text(`Invoice Date: ${invoice.invoiceDate}`, 20, 65);
    doc.text(`Due Date: ${invoice.dueDate}`, 20, 70);

    doc.autoTable({
      startY: 80,
      head: [['Description', 'Amount', 'Tax']],
      body: [
        [invoice.description, `$${formatCurrency(invoice.amount)}`, `$${formatCurrency(invoice.tax)}`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [66, 88, 255] },
    });

    doc.text(`Subtotal: $${formatCurrency(invoice.amount)}`, 20, doc.autoTable.previous.finalY + 10);
    doc.text(`Total: $${formatCurrency(parseFloat(invoice.amount) + parseFloat(invoice.tax))}`, 20, doc.autoTable.previous.finalY + 15);
    doc.text(`Terms: ${invoice.terms}`, 20, doc.autoTable.previous.finalY + 25);

    doc.save(`invoice_${invoice.invoiceNumber}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50 py-12 px-4"
    >
      <motion.h1
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="text-6xl text-center font-bold mb-12 bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text text-transparent"
      >
        Invoice Generator Pro
      </motion.h1>

      {error && (
        <motion.div
          className="bg-red-500 text-white p-4 rounded-xl mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {error}
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <motion.div
          whileHover={{ boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.3)' }}
          className="bg-white/80 rounded-3xl shadow-2xl p-10 backdrop-blur-xl border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Invoice Type Selector */}
            <motion.select
              whileTap={{ scale: 0.98 }}
              name="type"
              value={newInvoice.type}
              onChange={handleInputChange}
              className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300"
            >
              <option value="Invoice">Invoice</option>
              <option value="Tax Invoice">Tax Invoice</option>
              <option value="Proforma Invoice">Proforma Invoice</option>
              <option value="Receipt">Receipt</option>
              <option value="Sales Receipt">Sales Receipt</option>
              <option value="Cash Receipt">Cash Receipt</option>
              <option value="Quote">Quote</option>
              <option value="Estimate">Estimate</option>
              <option value="Credit Memo">Credit Memo</option>
              <option value="Credit Note">Credit Note</option>
              <option value="Purchase Order">Purchase Order</option>
              <option value="Delivery Note">Delivery Note</option>
            </motion.select>

            {/* Dynamic Input Fields */}
            {Object.keys(newInvoice).map((key) => {
              if (key === 'type') return null;
              return key === 'description' || key === 'terms' ? (
                <motion.textarea
                  key={key}
                  whileFocus={{ scale: 1.02 }}
                  name={key}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  value={newInvoice[key]}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 md:col-span-2 min-h-[120px] resize-none"
                />
              ) : (
                <motion.input
                  key={key}
                  whileFocus={{ scale: 1.02 }}
                  type={key.includes('date') ? 'date' : key === 'amount' || key === 'tax' || key === 'invoiceNumber' ? 'number' : 'text'}
                  name={key}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  value={newInvoice[key]}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300"
                />
              );
            })}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.2)' }}
            whileTap={{ scale: 0.98 }}
            onClick={addInvoice}
            className="w-full mt-10 bg-gradient-to-r from-violet-600 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Generate Professional Invoice
          </motion.button>
        </motion.div>

        {/* Invoice Display */}
        <motion.div layout className="mt-16 space-y-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text text-transparent">Your Invoices</h2>
          <AnimatePresence>
            {invoices.map((invoice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                whileHover={{ scale: 1.02, boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.2)' }}
                className="p-8 bg-white/80 rounded-2xl shadow-xl backdrop-blur-xl border border-gray-100"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-800">{invoice.client}</h3>
                    <p className="text-lg text-gray-600">Amount: ${invoice.amount}</p>
                    <p className="text-lg text-gray-600">Due: {invoice.dueDate}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => downloadPDF(invoice)}
                    className="px-8 py-3 bg-gradient-to-r from-violet-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  >
                    Download PDF
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default InvoiceGenerator;

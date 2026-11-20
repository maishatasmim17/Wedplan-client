"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/lib/utils";
import { CreditCard, CheckCircle2 } from "lucide-react";

export default function AdminTransactionsPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [token]);

  const fetchTransactions = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.transactions) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      showToast("Failed to fetch platform transactions", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-stone-100">Platform Transactions</h1>
        <p className="text-xs text-stone-400 mt-1">
          Audit vendor membership upgrades, Stripe checkout sessions, and payment verification records.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-stone-400 text-xs">Loading transaction logs...</p>
        </div>
      ) : transactions.length > 0 ? (
        <div className="rounded-3xl bg-stone-900/90 border border-stone-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950 text-stone-400 font-mono uppercase tracking-wider border-b border-stone-800">
                <tr>
                  <th className="p-4">Vendor Information</th>
                  <th className="p-4">Subscription Plan</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-stone-800/30 transition">
                    <td className="p-4">
                      <p className="font-semibold text-stone-100">
                        {tx.vendorId?.businessName || tx.vendorId?.name || "Vendor"}
                      </p>
                      <p className="text-stone-400 text-[11px]">{tx.vendorId?.email}</p>
                    </td>

                    <td className="p-4 font-mono uppercase text-amber-400 font-semibold">
                      {tx.plan}
                    </td>

                    <td className="p-4 font-mono font-bold text-stone-100">
                      ${tx.amount.toFixed(2)} {tx.currency?.toUpperCase()}
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        {tx.status}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-stone-400">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-stone-900/40 rounded-3xl border border-stone-800">
          <CreditCard className="w-12 h-12 text-stone-500 mx-auto mb-3" />
          <h3 className="text-base font-serif font-bold text-stone-200">No Transactions Yet</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto mt-1">
            When vendors purchase Premium membership tiers via Stripe, audit logs will be preserved here.
          </p>
        </div>
      )}
    </div>
  );
}

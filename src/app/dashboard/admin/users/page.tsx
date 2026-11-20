"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/lib/utils";
import { Search, ShieldAlert, ShieldCheck, User as UserIcon } from "lucide-react";

export default function AdminUsersPage() {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, token]);

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (roleFilter !== "all") params.append("role", roleFilter);

      const res = await fetch(`${API_BASE_URL}/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      showToast("Failed to fetch user list", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleBlock = async (id: string, currentBlocked: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${id}/block`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isBlocked: !currentBlocked })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || "Action failed", "error");
        return;
      }

      showToast(data.message || "User status updated", "success");
      fetchUsers();
    } catch (err) {
      showToast("Error toggling user block status", "error");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-stone-100">Registered Users Directory</h1>
        <p className="text-xs text-stone-400 mt-1">
          Review, filter, and manage platform participants with server-enforced role access.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearch} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-rose-500 transition"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-300 focus:outline-none focus:border-rose-500 transition"
          >
            <option value="all">All Roles</option>
            <option value="vendor">Vendors</option>
            <option value="customer">Customers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-stone-400 text-xs">Loading users...</p>
        </div>
      ) : users.length > 0 ? (
        <div className="rounded-3xl bg-stone-900/90 border border-stone-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950 text-stone-400 font-mono uppercase tracking-wider border-b border-stone-800">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Subscription</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-stone-800/30 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {u.image ? (
                          <img
                            src={u.image}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-rose-500/30"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-rose-900/80 text-rose-200 flex items-center justify-center font-bold">
                            {u.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-stone-100">{u.name}</p>
                          <p className="text-stone-400">{u.email}</p>
                          {u.businessName && (
                            <p className="text-[10px] text-rose-400 font-mono mt-0.5">
                              {u.businessName}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold ${
                          u.role === "admin"
                            ? "bg-purple-950 text-purple-400 border border-purple-500/30"
                            : u.role === "vendor"
                            ? "bg-amber-950 text-amber-400 border border-amber-500/30"
                            : "bg-stone-800 text-stone-300 border border-stone-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-stone-300 capitalize">
                      {u.role === "vendor" ? u.subscriptionPlan || "free" : "N/A"}
                    </td>

                    <td className="p-4">
                      {u.isBlocked ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] bg-red-950 text-red-400 border border-red-500/30 font-semibold">
                          Blocked
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-semibold">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      {u.role !== "admin" ? (
                        <button
                          onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                            u.isBlocked
                              ? "bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30"
                              : "bg-red-950 hover:bg-red-900 text-red-300 border border-red-500/30"
                          }`}
                        >
                          {u.isBlocked ? "Unblock User" : "Block User"}
                        </button>
                      ) : (
                        <span className="text-[11px] text-stone-500 font-mono">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-stone-900/40 rounded-3xl border border-stone-800">
          <p className="text-xs text-stone-400">No users found matching query criteria.</p>
        </div>
      )}
    </div>
  );
}

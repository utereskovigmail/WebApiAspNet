import { useEffect, useState } from "react";
import ENV from "../../env";
import api from "../../components/axios/authorized";

const PAGE_SIZE = 10;

interface User {
    id: number;
    email: string;
    fullName: string;
    roles: string[];
}

export default function AdminUserSearchPage() {
    const [query, setQuery] = useState("");
    const [role, setRole] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    useEffect(() => {
        loadUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    async function loadUsers() {
        setLoading(true);

        const params = new URLSearchParams({
            query,
            role,
            page: page.toString(),
            pageSize: PAGE_SIZE.toString(),
        });

        const response = await api.get(
            `${ENV.API_BASE_URL}/api/entity/SearchUsers?${params}`
        );

        if (response.status === 200) {
            setUsers(response.data.items);
            setTotal(response.data.totalCount);
        }

        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors p-6">
            <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                User Management
            </h1>

            {/* Filters */}
            <div className="bg-white dark:bg-white/[0.03]
                            border border-gray-200 dark:border-gray-800
                            rounded-xl shadow-md dark:shadow-lg
                            p-4 mb-6 flex flex-wrap gap-4 items-end">

                <input
                    placeholder="Search by name or email"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 min-w-[200px] px-3 py-2 rounded-md
                               border border-gray-300 dark:border-gray-700
                               bg-white dark:bg-gray-900
                               text-gray-900 dark:text-gray-100"
                />

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="px-3 py-2 rounded-md
                               border border-gray-300 dark:border-gray-700
                               bg-white dark:bg-gray-900
                               text-gray-900 dark:text-gray-100"
                >
                    <option value="">All roles</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                </select>

                <button
                    onClick={() => {
                        setPage(1);
                        loadUsers();
                    }}
                    className="px-5 py-2 rounded-md font-medium text-sm
                               bg-blue-600 text-white
                               hover:bg-blue-700
                               dark:bg-blue-500 dark:hover:bg-blue-600
                               transition"
                >
                    Search
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white dark:bg-white/[0.03]
                            border border-gray-200 dark:border-gray-800
                            rounded-xl shadow-md dark:shadow-lg">

                <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/50
                                      text-gray-700 dark:text-gray-300">
                    <tr>
                        <th className="text-left p-4">Email</th>
                        <th className="text-left p-4">Full Name</th>
                        <th className="text-left p-4">Roles</th>
                    </tr>
                    </thead>

                    <tbody>
                    {loading && (
                        <tr>
                            <td colSpan={3}
                                className="p-6 text-center text-gray-500">
                                Loading users…
                            </td>
                        </tr>
                    )}

                    {!loading && users.length === 0 && (
                        <tr>
                            <td colSpan={3}
                                className="p-6 text-center text-gray-500">
                                No users found
                            </td>
                        </tr>
                    )}

                    {!loading && users.map(u => (
                        <tr
                            key={u.id}
                            className="border-t border-gray-200 dark:border-gray-800
                                           hover:bg-gray-50 dark:hover:bg-gray-800/40"
                        >
                            <td className="p-4 text-gray-900 dark:text-gray-100">
                                {u.email}
                            </td>
                            <td className="p-4 text-gray-900 dark:text-gray-100">
                                {u.fullName}
                            </td>
                            <td className="p-4 flex flex-wrap gap-2">
                                {u.roles.map(r => (
                                    <span
                                        key={r}
                                        className="px-2 py-1 text-xs font-medium rounded-md
                                                       bg-blue-100 text-blue-700
                                                       dark:bg-blue-900/40 dark:text-blue-300"
                                    >
                                            {r}
                                        </span>
                                ))}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {page} of {totalPages}
                </span>

                <div className="flex gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 rounded-md text-sm font-medium
                                   border border-gray-300 dark:border-gray-700
                                   disabled:opacity-50
                                   text-gray-700 dark:text-gray-200
                                   hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        Previous
                    </button>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 rounded-md text-sm font-medium
                                   border border-gray-300 dark:border-gray-700
                                   disabled:opacity-50
                                   text-gray-700 dark:text-gray-200
                                   hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

const AdminAllUsers = () => {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [formData, setFormData] = useState({ username: "", email: "", role: "", password: "" });
    
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        
        if (!user) return; // Ждём, пока загрузится пользователь
        
        if (user.role !== "admin") {
            navigate("/"); // Нет прав — перенаправляем на главную
            return;
        }

        const fetchUsers = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Ошибка загрузки пользователей");
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error("Ошибка:", error);
            }
        };

        fetchUsers();
    }, [token, user, navigate]);



    if (!user) {
        return <h2>Загрузка...</h2>;
    }
    
    const handleEdit = (user) => {
        setEditUser(user);
        setFormData({ username: user.username, email: user.email, role: user.role, password: "" });
    };

    const saveEdit = async () => {
        try {
            const updatedData = { ...formData };

            if (!updatedData.password) {
                delete updatedData.password; // Не отправляем, если пароль не изменён
            }

            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users/${editUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) throw new Error("Ошибка обновления");

            setUsers(users.map(user => (user.id === editUser.id ? { ...user, ...updatedData } : user)));
            setEditUser(null);
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Вы уверены, что хотите удалить пользователя?")) return;

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Ошибка удаления");

            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    return (
        <>
        <Link to="/admin">Админка</Link>
        <div className="users-list">
            {users.map((user) => (
                <div className="user-card" key={user.id}>
                    <p><strong>ID:</strong> {user.id}</p>

                    <p><strong>Имя:</strong> 
                        {editUser?.id === user.id ? (
                            <input 
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        ) : (
                            user.username
                        )}
                    </p>

                    <p><strong>Email:</strong> 
                        {editUser?.id === user.id ? (
                            <input 
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        ) : (
                            user.email
                        )}
                    </p>

                    <p><strong>Роль:</strong> 
                        {editUser?.id === user.id ? (
                            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        ) : (
                            user.role
                        )}
                    </p>

                    <p><strong>Пароль:</strong> 
                        {editUser?.id === user.id ? (
                            <input 
                                type="password"
                                placeholder="Новый пароль (если нужно)"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        ) : (
                            "••••••"
                        )}
                    </p>

                    <div className="user-card-actions">
                        {editUser?.id === user.id ? (
                            <>
                                <button onClick={saveEdit}>Сохранить</button>
                                <button onClick={() => setEditUser(null)}>Отмена</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleEdit(user)}>Редактировать</button>
                                <button onClick={() => deleteUser(user.id)}>Удалить</button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
        </>
    )
}

export default AdminAllUsers

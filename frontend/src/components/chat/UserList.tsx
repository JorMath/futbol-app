import type { User } from '../../types/chat';
import './UserList.css';

interface UserListProps {
  users: User[];
  currentUserId: string;
  onlineUsers?: Set<string>;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  currentUserId,
  onlineUsers = new Set(),
}) => {
  return (
    <div className="user-list">
      <div className="user-list-header">
        <h3>Usuarios</h3>
        <span className="user-count">{users.length}</span>
      </div>
        <div className="user-list-content">
        {users.length === 0 ? (
          <div className="empty-state">
            <p>No hay otros usuarios conectados</p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="user-item"
            >
              <div className="user-avatar">
                <span className="avatar-text">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <div className="online-indicator" title="Conectado"></div>
              </div>
              
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

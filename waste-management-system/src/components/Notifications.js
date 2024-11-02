import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import '../styles/Notifications.css';
import '../App.css';

const notificationTypes = {
    full: { message: "Bin is Full", className: "alert full" },
    'near full': { message: "Bin is Near Full", className: "alert near-full" },
    'needs maintenance': { message: "Bin Needs Maintenance", className: "alert need-maintenance" },
    healthy: { message: "Bin is Healthy", className: "alert healthy" },
    empty: { message: "Bin is Empty", className: "alert empty" },
};

const Notifications = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const socket = io('http://localhost:3001', {
            transports: ['websocket'],
        });

        socket.on('binStatusUpdate', (data) => {
            const { binId, status } = data;
            const notification = notificationTypes[status];

            if (notification) {
                setAlerts((prevAlerts) => [
                    ...prevAlerts,
                    {
                        id: binId,
                        message: notification.message,
                        className: notification.className,
                        status: status,
                    },
                ]);
            } else {
                console.error(`Unknown status: ${status}`);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleAcknowledge = (id) => {
        console.log('Before acknowledge:', alerts);
        setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.id !== id));
        console.log('After acknowledge:', alerts.filter(alert => alert.id !== id));
    };

    return (
        <div className="notifications">
            <h3>Notifications & Alerts</h3>
            {alerts.length === 0 ? (
                <p>No notifications at this time.</p>
            ) : (
                <ul className="notification-list">
                    {alerts.map((alert, index) => (
                        <li
                            key={`${alert.id}-${index}`} // Use index to ensure unique keys for duplicates
                            className={alert.className}
                            onClick={() => handleAcknowledge(alert.id)} // Acknowledge on click
                        >
                            <span>{alert.message} (Bin ID: {alert.id})</span>
                            <button
                                className="acknowledge-btn"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering the li click
                                    handleAcknowledge(alert.id);
                                }}
                            >
                                Acknowledge
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;

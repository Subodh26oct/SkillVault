import { getDBStatus } from '../database/db.js';

export const checkHealth = async (req, res) => {
    try {
        const dbStatus = getDBStatus();
        
        const healthData = {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: {
                status: dbStatus.isConnected ? 'healthy' : 'unhealthy',
                readyState: getReadyStateText(dbStatus.readyState),
                host: dbStatus.host,
                name: dbStatus.name
            }
        };

        const statusCode = dbStatus.isConnected ? 200 : 503;
        res.status(statusCode).json(healthData);
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            message: 'Internal server error during health check'
        });
    }
};

function getReadyStateText(state) {
    switch (state) {
        case 0: return 'disconnected';
        case 1: return 'connected';
        case 2: return 'connecting';
        case 3: return 'disconnecting';
        case 99: return 'uninitialized';
        default: return 'unknown';
    }
}

const fileRoutes = require('./routes/files');
const userRoutes = require('./routes/users');
const archiveRoutes = require('./routes/archives');
const searchRoutes = require('./routes/search');

// 注册路由
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/archives', archiveRoutes);
app.use('/api/search', searchRoutes); 
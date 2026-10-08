import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import vehicleRoutes from './routes/vehicleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminVehicleRoutes from './routes/adminVehicleRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import adminInquiryRoutes from './routes/adminInquiryRoutes.js';

const app = express();
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/vehicles', adminVehicleRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin/inquiries', adminInquiryRoutes);

// Catches errors passed along with next(err)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
});

export default app;
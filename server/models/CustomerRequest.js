import mongoose from 'mongoose';

const customerRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contactInfo: {
    type: String,
    required: true,
  },
  desiredDressDescription: {
    type: String,
    required: true,
  },
  imageLocalPath: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Processing', 'Completed']
  }
}, { timestamps: true });

const CustomerRequest = mongoose.model('CustomerRequest', customerRequestSchema);

export default CustomerRequest;

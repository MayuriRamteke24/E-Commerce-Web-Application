import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    shippingAddress: {
      city: String,
      country: String,
      street: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Order', orderSchema);

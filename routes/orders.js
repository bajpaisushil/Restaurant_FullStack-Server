const { Order } = require("../models/orderModel");
const { auth, isUser, isAdmin } = require("../middleware/auth");

const router = require("express").Router();

router.post("/", isUser, async (req, res) => {
  const { data } = req.body;
  const newOrder = new Order({
    customerId: data.customer,
    products: data.items,
    total: data.amount_total,
    status: "pending",
  });
  try {
    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.log(err);
  }
});

router.get("/", isAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const orders = query
      ? await Order.find().sort({ _id: -1 }).limit(4)
      : await Order.find().sort({ _id: -1 });
    res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).send(updatedOrder);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/findOne/:id", isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "customerId",
      "name email"
    );
    if (!order) {
      return res.status(404).send("Order not found");
    }
    console.log("order", order);

    res.status(200).send(order);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;

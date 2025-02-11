const express = require("express");
const Transaction = require("../models/Transaction");
const router = express.Router();
const axios = require("axios");

// Initialize database
router.get("/initialize", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    await Transaction.deleteMany({});
    await Transaction.insertMany(response.data);
    res.json({ message: "Database initialized with seed data" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error initializing database", details: error.message });
  }
});

// List transactions with search and pagination
router.get("/transactions", async (req, res) => {
  try {
    const { month, search, page = 1, perPage = 10 } = req.query;

    if (!month || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: "Invalid month parameter" });
    }

    const query = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] },
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching transactions", details: error.message });
  }
});

// Statistics API
router.get("/statistics", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: "Invalid month parameter" });
    }

    const query = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] },
    };

    const totalSale = await Transaction.aggregate([
      { $match: { ...query, sold: true } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const totalSold = await Transaction.countDocuments({
      ...query,
      sold: true,
    });
    const totalNotSold = await Transaction.countDocuments({
      ...query,
      sold: false,
    });

    res.json({ totalSale: totalSale[0]?.total || 0, totalSold, totalNotSold });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching statistics", details: error.message });
  }
});

// Bar Chart API
router.get("/bar-chart", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: "Invalid month parameter" });
    }

    const query = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] },
    };

    const ranges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity },
    ];

    const data = await Promise.all(
      ranges.map(async ({ min, max }) => {
        const count = await Transaction.countDocuments({
          ...query,
          price: { $gte: min, $lte: max },
        });
        return { range: `${min}-${max === Infinity ? "above" : max}`, count };
      })
    );

    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching bar chart data", details: error.message });
  }
});

module.exports = router;

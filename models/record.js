const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    amount: { 
      type: Number, 
      required: true 
    },

    type: { 
      type: String, 
      enum: ["income", "expense"], 
      required: true 
    },

    category: { 
      type: String, 
      required: true 
    },

    date: { 
      type: Date, 
      default: Date.now 
    },

    notes: { 
      type: String 
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    // ✅ Soft delete support
    isDeleted: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Record", recordSchema);
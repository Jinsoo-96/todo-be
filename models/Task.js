const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = Schema(
  {
    task: {
      type: String,
      required: true,
    },
    isComplete: {
      type: Boolean,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true } //몽구스에서 제공하는 옵션
); // Schema.Types.ObjectId 몽구스에서 제공하는 데이터 타입

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

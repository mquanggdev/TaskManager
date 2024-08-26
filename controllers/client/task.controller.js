const Task = require("../../models/task.model");


// Get / client/index
module.exports.index = async (req, res) => {
  const find = {
    deleted : false
  }
  const status = req.query.status ;
  if(status) {
    find.status = status;
  }

  const sort = {} ;

  const sortKey = req.query.sortKey ;
  const sortValue = req.query.sortValue ;

  if(sortKey && sortValue) {
    sort[sortKey] = sortValue ;
  }
  const tasks = await Task.find(find).sort(sort);

  res.json(tasks);
};

// Get /client/detail
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const task = await Task.findOne({
      _id: id,
      deleted: false
    });

    res.json(task);
  } catch (error) {
    res.json({
      message: "Not Found"
    });
  }
};
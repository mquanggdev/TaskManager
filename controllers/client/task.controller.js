const Task = require("../../models/task.model");


// Get / tasks/index
module.exports.index = async (req, res) => {
  const find = {
    $or : [
      {
        createBy : req.user.id , 
        listUser : req.user.id
      }
    ],
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

  // Phân trang
  let limitItems = 2;
  if(req.query.limitItems) {
    limitItems = parseInt(req.query.limitItems);
  }

  let page = 1;
  if(req.query.page) {
    page = parseInt(req.query.page);
  }

  const skip = (page - 1) * limitItems;
  // Hết Phân trang


   // Tìm kiếm
   if(req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i");
    find.title = regex;
  }
  // Hết Tìm kiếm


  const tasks = await Task
  .find(find)
  .limit(limitItems)
  .skip(skip)
  .sort(sort)

  res.json(tasks);
};

// Get /tasks/detail
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

// Patch /tasks/change-status
module.exports.changeStatus = async (req,res) => {
  try {
    const ids = req.body.ids;
    const status = req.body.status;

    await Task.updateMany({
      _id: {$in : ids}
    }, {
      status: status
    });
    res.json({
      message : "Success"
    });
  } catch (error) {
    res.json({
      message: "Not Found"
    });
  }
};

// Post /tasks/create
module.exports.create = async (req,res) => {
  try {
    req.body.createdBy = req.user.id;
    const newTask = new Task(req.body);
    await newTask.save() ;
    res.json({
      message : "Add Success",
      task : newTask
    });
  } catch (error) {
    res.json({
      message: "Not Valid"
    });
  }
};


// Post /tasks/edit/:id
module.exports.edit = async (req,res) => {
  try {
    const id = req.params.id ;
    await Task.updateOne({
      _id : id
    } , req.body)
    res.json({
      message : "Edit Success"
    });
  } catch (error) {
    res.json({
      message: "Not Valid"
    });
  }
};

// Patch /tasks/delete
module.exports.delete = async (req,res) => {
  try {
    const ids = req.body.ids;

    await Task.updateMany({
      _id: { $in: ids }
    }, {
      deleted: true
    });


    res.json({
      message : "Delete Success"
    });
  } catch (error) {
    res.json({
      message: "Not Valid"
    });
  }
};
const catchAsync = require('../utils/catchAsync');
const accountService = require('../services/accountService');

exports.getAllAccounts = catchAsync(async (req, res, next) => {
  const results = await accountService.find();

  if (!results.length > 0) {
    return res.status(404).json({ message: 'no account found!' });
  }

  res.status(200).json({
    status: 'success',
    numOfAccounts: results.length,
    data: results
  });
});

exports.getOneAccount = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const result = await accountService.findOne(id);

  if (!result.length > 0) {
    return res.send({ message: 'no account found!' });
  }

  res.send({ account: result });
});

exports.createNewAccount = catchAsync(async (req, res, next) => {
  const result = await accountService.create(req.body);
  if (result !== true) {
    return res.send({ message: 'no account was created' });
  }

  const accounts = await accountService.find();
  console.log(accounts);
  res.status(202).json({
    status: 'success',
    message: 'new account was created',
    accounts
  });
});

exports.updateOneAccount = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const result = await accountService.updateOne(req.body, id);

  if (result.affectedRows !== 1) {
    return res
      .status(500)
      .json({ result: 'bad', message: 'no account was updated' });
  }

  const accounts = await accountService.find();

  if (!result.changedRows > 0) {
    return res.send({
      status: 'success',
      message: 'nothing new to updated',
      accounts
    });
  }

  res.status(202).json({
    status: 'success',
    message: 'the account was updated',
    accounts
  });
});

exports.deleteOneAccount = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const result = await accountService.deleteOne(id);

  if (result.affectedRows !== 1) {
    return res
      .status(404)
      .json({ status: 'bad', message: 'account was not deleted!' });
  }

  res.send(id);
});

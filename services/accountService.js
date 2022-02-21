const crypto = require('crypto');
const moment = require('moment');
const DB = require('../utils/db');

const MOMENT = moment().format();

module.exports.find = async function() {
  const sql = `SELECT * FROM account ORDER BY series DESC LIMIT 200;`;

  try {
    const accounts = await DB.query(sql);
    return accounts;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports.findOne = async function(id) {
  const sql = `SELECT * FROM account WHERE id = ?;`;

  try {
    const account = await DB.query(sql, [id]);
    return account;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports.create = async function(account) {
  const series = crypto.randomBytes(8).toString('hex');

  const {
    accountName,
    licenseType,
    accountStatus,
    licenseStartsFrom,
    licenseEndsAt,
    industryType,
    contactPerson,
    phoneNumber,
    address,
    softwareType,
    users,
    expDate
  } = account;

  console.log('account', account.accountName);

  let sql = `INSERT INTO account
            (
              series, accountName, licenseType, accountStatus, 
              licenseStartsFrom, licenseEndsAt, industryType, 
              contactPerson, phoneNumber, address, softwareType, 
              users, created_at, expDate
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  try {
    const result = await DB.query(sql, [
      series,
      accountName,
      licenseType,
      accountStatus,
      licenseStartsFrom,
      licenseEndsAt,
      industryType,
      contactPerson,
      phoneNumber,
      address,
      softwareType,
      users,
      MOMENT,
      expDate
    ]);
    console.log(result);
    return result.affectedRows === 1;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports.updateOne = async function(category, id, categoryImageUrl) {
  const { category_name, store_id } = category;

  let sql = `UPDATE category SET category_name = ?, category_image = ?, store_id = ?, updated_at = ? WHERE id = ?`;

  try {
    const result = await DB.query(sql, [
      category_name,
      categoryImageUrl,
      store_id,
      MOMENT,
      id
    ]);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports.deleteOne = async function(series) {
  let sql = `DELETE FROM account WHERE series = "${series}"`;

  try {
    const result = await DB.query(sql);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports.findOneColumn = async function(series, columnName) {
  const sql = `SELECT ${columnName} FROM account WHERE series = ?;`;

  try {
    const account = await DB.query(sql, [series]);
    return JSON.parse(JSON.stringify(account));
  } catch (err) {
    console.log(err);
    throw err;
  }
};

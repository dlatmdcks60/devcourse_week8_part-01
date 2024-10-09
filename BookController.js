const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
    let { category_id, news, limit, currentPage } = req.query;

    let offset = limit * (currentPage - 1);

    let sql = 'SELECT * FROM books';
    let value = [];
    if (category_id && news) {
        sql += ` WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERBAL 1 MONTH) AND NOW()`;
        value = [category_id];
    } else if (category_id) {
        sql += ` WHERE category_id=?`;
        value = [category_id];
    } else if (news) {
        sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERBAL 1 MONTH) AND NOW()`;
    }

    sql += ` LIMIT ? OFFSET ?`
    value.push(parseInt(limit), offset);

    conn.query(sql, value, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if (rows.length) {
            return res.status(StatusCodes.OK).json(rows);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    });
};

const bookDetail = (req, res) => {
    let { id } = req.params;

    let sql = `SELECT * FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id = ?;`;
    conn.query(sql, id, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if (rows[0]) {
            return res.status(StatusCodes.OK).json(rows);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    });
};

// const booksByCategory = (req, res) => {
// };

module.exports = {
    allBooks,
    bookDetail,
};

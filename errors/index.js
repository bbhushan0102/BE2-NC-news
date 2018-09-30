// exports.handle404s = (err, req, res, next) => {
//   if (err.status === 404) {
//     res.status(404).send({ msg: err.msg });
//   } else next(err);
// };

// exports.handle400s = (err, req, res, next) => {
//   if (err.name === "ValidationError" || err.name === "CastError") {
//     res.status(400).send({ msg: err.message });
//   } else next(err);
// };

// exports.handle500s = (err, req, res, next) => {
//   res.status(500).send("Internal server error");
// };

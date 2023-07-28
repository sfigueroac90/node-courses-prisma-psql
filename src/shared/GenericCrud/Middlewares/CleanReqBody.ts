export const removeNullOnBodyMiddleware = (req, res, next) => {
  const cleanedBody = Object.entries(req.body).reduce((body, [key, value]) => {
    if (value === null || value === undefined) {
      return body;
    }
    body[key] = value;
    return body;
  }, {});
  req.body = cleanedBody;
  next();
};

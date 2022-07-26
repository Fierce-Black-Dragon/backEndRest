exports.home = (req, res) => {
  try {
    res.status(200).json({
      Success: true,
      message: "Welcome to  urban fit api ",
    });
  } catch (e) {
    next(e);
  }
};

exports.getPosts = (req, res) => {
  res.json({
    posts: [{ title: "post one" }, { title: "posts two" }],
  });
};

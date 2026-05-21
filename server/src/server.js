const app = require('./app')

const PORT = process.env.PORT || 5000

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

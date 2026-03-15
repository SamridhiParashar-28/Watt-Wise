const bcrypt = require('bcryptjs');
// ... rest of imports and app setup ...

// Fake "database" for demo (later → MongoDB / SQLite / JSON file)
const users = []; // ← in memory only – lost on restart

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    if (users.some(u => u.username === username)) {
      return res.status(409).json({ success: false, message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({ username, password: hashedPassword });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      username
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // In real app → create JWT here
    res.json({
      success: true,
      message: 'Login successful',
      username,
      // token: jwt.sign({...}, secret)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
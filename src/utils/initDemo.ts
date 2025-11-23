// Initialize demo user for testing
const initializeDemoUser = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const demoUserExists = users.find((u: any) => u.email === 'demo@fitbuddy.com');
  
  if (!demoUserExists) {
    const demoUser = {
      id: 'demo-user-1',
      username: 'demouser',
      email: 'demo@fitbuddy.com',
      name: 'Demo User',
      password: 'demo123'
    };
    users.push(demoUser);
    localStorage.setItem('users', JSON.stringify(users));
  }
};

export { initializeDemoUser };

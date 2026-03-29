// Test API connection from frontend
const testApiConnection = async () => {
    console.log('🔍 Testing API Connection...\n');
    
    const testEndpoints = [
        { method: 'GET', url: 'http://localhost:5000/', description: 'API Root' },
        { method: 'POST', url: 'http://localhost:5000/api/auth/register', 
          data: { name: 'Test User', email: 'test@test.com', password: '123456' }, 
          description: 'Register' },
        { method: 'POST', url: 'http://localhost:5000/api/auth/login',
          data: { email: 'test@test.com', password: '123456' },
          description: 'Login' }
    ];
    
    for (const endpoint of testEndpoints) {
        console.log(`Testing: ${endpoint.description}`);
        console.log(`URL: ${endpoint.url}`);
        
        try {
            const response = await fetch(endpoint.url, {
                method: endpoint.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: endpoint.data ? JSON.stringify(endpoint.data) : undefined
            });
            
            console.log(`Status: ${response.status} ${response.statusText}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Response:', data);
            } else {
                console.log('Error:', await response.text());
            }
        } catch (error) {
            console.log('❌ Connection Failed:', error.message);
            console.log('💡 Make sure backend is running on port 5000');
        }
        
        console.log('---\n');
    }
};

testApiConnection();
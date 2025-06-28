const request = require('supertest');
const app = require('../server');

// ERROR 48: No proper test setup or teardown
// ERROR 49: Tests using production database instead of test database
// ERROR 50: No mocking of external dependencies

describe('Authentication Tests', () => {
    // ERROR 51: Hardcoded test data
    const testUser = {
        username: 'testuser123',
        email: 'test123@example.com',
        password: 'password123'
    };

    test('should register a new user', async () => {
        const response = await request(app)
            .post('/api/users')
            .send(testUser);
        
        // ERROR 52: Incomplete test assertions
        expect(response.status).toBe(201);
    });

    test('should login with valid credentials', async () => {
        // ERROR 53: Test depends on previous test (not isolated)
        const response = await request(app)
            .post('/api/login')
            .send({
                username: testUser.username,
                password: testUser.password
            });
        
        expect(response.status).toBe(200);
        // ERROR 54: Not testing token format or expiration
    });

    // ERROR 55: No negative test cases
    // ERROR 56: No edge case testing
    // ERROR 57: No security vulnerability testing
});

// ERROR 58: No integration tests
// ERROR 59: No load testing
// ERROR 60: No API documentation testing

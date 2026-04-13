const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Job = require('../models/Job');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Job.deleteMany({});
});

describe('Jobs API', () => {
  const sampleJob = {
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    role: 'Frontend',
    stack: ['React', 'TypeScript'],
    location: 'New York, NY',
    type: 'Hybrid',
    description: 'Looking for a great React developer.',
    salary: '$120k - $150k'
  };

  test('POST /api/jobs - should create a new job', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .send(sampleJob);
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toEqual(sampleJob.title);
    expect(res.body.company).toEqual(sampleJob.company);
  });

  test('GET /api/jobs - should return all jobs', async () => {
    await Job.create(sampleJob);
    await Job.create({ ...sampleJob, title: 'Backend Dev', role: 'Backend' });

    const res = await request(app).get('/api/jobs');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
  });

  test('GET /api/jobs?role=Frontend - should filter jobs by role', async () => {
    await Job.create(sampleJob);
    await Job.create({ ...sampleJob, title: 'Backend Dev', role: 'Backend' });

    const res = await request(app).get('/api/jobs?role=Frontend');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].role).toEqual('Frontend');
  });
});

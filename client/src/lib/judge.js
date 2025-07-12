import axios from 'axios';

const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com';

export async function checkJudge0Status() {
  try {
    const res = await axios.get(`${JUDGE0_API}/about`, {
      headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
    });
    console.log('✅ Judge0 Status:', res.data);
  } catch (err) {
    console.error('❌ Judge0 Status Check Failed:', err.message);
  }
}

export async function runCode(source_code, language_id, stdin = '') {
  try {
    console.log('🚀 Submitting code to Judge0');

    const response = await axios.post(
      `${JUDGE0_API}/submissions?base64_encoded=true&wait=true`,
      {
        source_code: btoa(source_code),
        language_id,
        stdin: btoa(stdin),
      },
      {
        headers: {
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error('❌ Judge0 error:', err.response?.data || err.message);
    throw err;
  }
}

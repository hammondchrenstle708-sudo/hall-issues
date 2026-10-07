// ⚠️ Replace with your GitHub username and repo name
const OWNER = 'yourusername';
const REPO = 'hall-issues';

const form = document.getElementById('issueForm');
const status = document.getElementById('status');
const issuesList = document.getElementById('issuesList');

// Load existing issues
async function loadIssues() {
  try {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues?state=open&per_page=10`);
    const issues = await res.json();

    if (!issues.length) {
      issuesList.innerHTML = '<p>No issues reported yet.</p>';
      return;
    }

    issuesList.innerHTML = issues.map(issue => `
      <div class="issue-card">
        <h3>${issue.title}</h3>
        <p>${issue.body ? issue.body.substring(0, 200) : ''}</p>
        <small>Opened ${new Date(issue.created_at).toLocaleDateString()}</small>
      </div>
    `).join('');
  } catch (err) {
    issuesList.innerHTML = '<p>Could not load issues.</p>';
  }
}

// Submit a new issue
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = 'Submitting...';

  const name = document.getElementById('name').value || 'Anonymous';
  const room = document.getElementById('room').value;
  const category = document.getElementById('category').value;
  const message = document.getElementById('message').value;

  const title = `[${category}] Room ${room}`;
  const body = `**Reported by:** ${name}\n**Room:** ${room}\n**Category:** ${category}\n\n${message}`;

  // ⚠️ You need a token with 'repo' scope (keep it private!)
  const TOKEN = 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN';

  try {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, body })
    });

    if (res.ok) {
      status.textContent = '✅ Issue submitted successfully!';
      form.reset();
      loadIssues();
    } else {
      status.textContent = '❌ Failed to submit. Try again.';
    }
  } catch (err) {
    status.textContent = '❌ Network error.';
  }
});

loadIssues();

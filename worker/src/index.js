export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const data = await request.json();

      // Honeypot check
      if (data.website) {
        return new Response(JSON.stringify({ error: "Invalid submission" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check required fields
      if (!data.org || !data.title || !data.email || !data.desc) {
         return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const issueTitle = `[${data.projectType === 'build' ? 'Build' : 'Service'}] ${data.title} - ${data.org}`;
      
      let bodyText = `### Organization\n${data.org}\n\n`;
      bodyText += `### Contact Email\n${data.email}\n\n`;
      bodyText += `### Description\n${data.desc}\n\n`;

      if (data.stack) {
        bodyText += `### Tech Stack\n${data.stack}\n\n`;
      }

      if (data.projectType === 'service') {
        if (data.tools) bodyText += `### Current tools\n${data.tools}\n\n`;
        if (data.timeline) bodyText += `### Timeline\n${data.timeline}\n\n`;
      } else if (data.projectType === 'build') {
        if (data.audience) bodyText += `### Audience\n${data.audience}\n\n`;
        if (data.content) bodyText += `### Content & Data\n${data.content}\n\n`;
        if (data.hosting) bodyText += `### Deployment Preference\n${data.hosting}\n\n`;
      }

      const githubRepoOwner = env.GITHUB_REPO_OWNER || "crosscollabtech";
      const githubRepoName = env.GITHUB_REPO_NAME || "CrossCollab.tech";
      
      if (!env.GITHUB_TOKEN) {
        return new Response(JSON.stringify({ error: "GITHUB_TOKEN secret is not set in the worker." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      let githubApiUrl;
      let reqBody;

      let usernameToInvite = null;

      if (data.projectType === 'build') {
        if (data.githubUser) {
          usernameToInvite = data.githubUser;
        } else if (data.email) {
          const searchUrl = `https://api.github.com/search/users?q=${encodeURIComponent(data.email)}`;
          const searchResponse = await fetch(searchUrl, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
              "User-Agent": "CrossCollab-Cloudflare-Worker"
            }
          });
          
          if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            if (searchData.total_count > 0 && searchData.items && searchData.items[0]) {
              usernameToInvite = searchData.items[0].login;
            }
          }
        }

        if (!usernameToInvite) {
          return new Response(JSON.stringify({ 
            error: "GITHUB_ACCOUNT_REQUIRED", 
            message: "A GitHub account is strictly required to scaffold a project repository. We couldn't find a GitHub account associated with your email. Please add your GitHub Username below or create a free account." 
          }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const newRepoName = (data.title || "new-project").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        // For crosscollabtech organization
        githubApiUrl = `https://api.github.com/orgs/${githubRepoOwner}/repos`;
        reqBody = {
          name: newRepoName,
          description: `Built for ${data.org}: ` + data.desc.substring(0, 250),
          private: false,
          has_issues: true,
          has_projects: true,
          auto_init: true
        };
      } else {
        githubApiUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepoName}/issues`;
        reqBody = {
          title: issueTitle,
          body: bodyText,
          labels: ['service request', 'needs triage']
        };
      }

      let githubResponse = await fetch(githubApiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
          "User-Agent": "CrossCollab-Cloudflare-Worker",
          "Accept": "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      // If org repo creation fails, fallback to user repo creation (in case GITHUB_TOKEN belongs to a normal user rather than an org)
      if (data.projectType === 'build' && githubResponse.status === 404) {
        githubApiUrl = `https://api.github.com/user/repos`;
        githubResponse = await fetch(githubApiUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
            "User-Agent": "CrossCollab-Cloudflare-Worker",
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqBody),
        });
      }

      if (!githubResponse.ok) {
        const errText = await githubResponse.text();
        console.error("GitHub API Error:", errText);
        return new Response(JSON.stringify({ error: "Failed to create resource on GitHub" }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const responseData = await githubResponse.json();

      let collaboratorAdded = false;
      let collaboratorMsg = usernameToInvite ? `Attempting to invite ${usernameToInvite}` : "";

      if (data.projectType === 'build' && usernameToInvite) {
        const repoFullName = responseData.full_name; // e.g. 'owner/repo'
        const collabUrl = `https://api.github.com/repos/${repoFullName}/collaborators/${usernameToInvite}`;
        const collabResponse = await fetch(collabUrl, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
            "User-Agent": "CrossCollab-Cloudflare-Worker",
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ permission: 'maintain' })
        });
            
        if (collabResponse.ok || collabResponse.status === 201 || collabResponse.status === 204) {
          collaboratorAdded = true;
          collaboratorMsg = `Invite sent to ${usernameToInvite}`;
        } else {
          collaboratorMsg = "Failed to add collaborator. The username may be invalid.";
          console.error("Failed to add collaborator:", await collabResponse.text());
        }
      }

      return new Response(JSON.stringify({ success: true, issueUrl: responseData.html_url, collaboratorAdded, collaboratorMsg }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};

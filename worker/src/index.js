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
      const githubApiUrl = `https://api.github.com/repos/${githubRepoOwner}/${githubRepoName}/issues`;
      
      if (!env.GITHUB_TOKEN) {
        return new Response(JSON.stringify({ error: "GITHUB_TOKEN secret is not set in the worker." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const githubResponse = await fetch(githubApiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
          "User-Agent": "CrossCollab-Cloudflare-Worker",
          "Accept": "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: issueTitle,
          body: bodyText,
          labels: [data.projectType === 'build' ? 'project request' : 'service request', 'needs triage']
        }),
      });

      if (!githubResponse.ok) {
        const errText = await githubResponse.text();
        console.error("GitHub API Error:", errText);
        return new Response(JSON.stringify({ error: "Failed to create issue on GitHub" }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const issueData = await githubResponse.json();

      return new Response(JSON.stringify({ success: true, issueUrl: issueData.html_url }), {
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

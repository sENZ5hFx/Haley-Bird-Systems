/**
 * Resume API Route - Generates living resume from Notion content
 * Real-time, dynamic, shows thinking evolution and methodologies
 */

import { Router } from 'express';
import { scanNotionGarden } from '../../lib/notionScanner';

const router = Router();

let resumeCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

/**
 * Format resume as markdown
 */
function formatResumeMarkdown(notionContent: any): string {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let markdown = `# HALEY BIRD
## Brand & Systems Architect | Design Practice Philosopher

**Portland, Oregon** | haley@example.com | [Living Portfolio](/)

---

## PHILOSOPHY

I design systems—not surfaces. Everything I make refuses the separation between *what* gets made and *how* it gets made. Brands and organizations are living systems that either expand or constrain human possibility. I build the former.

**Core practice:** Combining systems thinking with radical transparency, embodied learning, and vulnerable authenticity. I don't hide the thinking; I make it navigable.

---

## CORE METHODOLOGIES

`;

  // Add practices as methodologies
  if (notionContent.practices && Array.isArray(notionContent.practices)) {
    notionContent.practices.forEach((practice: any, idx: number) => {
      markdown += `### ${practice.title || `Practice ${idx + 1}`}
${practice.description || 'A core methodology and approach.'}

`;
    });
  }

  markdown += `---

## CASE STUDIES & PROJECTS

`;

  // Add case studies
  if (notionContent.cases && Array.isArray(notionContent.cases)) {
    notionContent.cases.forEach((caseItem: any, idx: number) => {
      markdown += `### ${caseItem.title || `Project ${idx + 1}`}

${caseItem.description || 'Project case study and systems thinking breakdown.'}

`;
    });
  }

  markdown += `---

## THINKING & JOURNEY

`;

  // Add journey entries
  if (notionContent.journey && Array.isArray(notionContent.journey)) {
    notionContent.journey.forEach((entry: any, idx: number) => {
      markdown += `### ${entry.title || `Reflection ${idx + 1}`}

${entry.description || 'Personal essay and reflection.'}

`;
    });
  }

  markdown += `---

## CONNECTIONS & SYSTEMS THINKING

How ideas interconnect across domains:

`;

  // Add connections
  if (notionContent.connections && Array.isArray(notionContent.connections)) {
    notionContent.connections.forEach((connection: any, idx: number) => {
      markdown += `- **${connection.title || `Connection ${idx + 1}`}**: ${connection.description || 'Networked idea and system thinking'}
`;
    });
  }

  markdown += `

---

## VALUES & APPROACH

### What I Believe
1. Process over polish—the work matters more than performance
2. Vulnerability as strength—show your thinking, failures, learning
3. Agency over capture—design for human possibility
4. Systems over surfaces—change structures, not aesthetics
5. Collaboration as thinking—best ideas emerge from genuine partnership

### What I Refuse
- False polish hiding actual problems
- Design that serves capture over liberation
- Vulnerability as performance
- Hierarchical thinking masked as collaboration

---

## TECHNICAL & STRATEGIC SKILLS

- Systems thinking and complex problem mapping
- Brand strategy and identity systems
- Information architecture (hierarchical and rhizomatic)
- Experience design for accessibility and agency
- Notion integration and knowledge management
- Collaborative facilitation and stakeholder alignment

---

**Last updated:** ${formattedDate}
*This is a living document. My thinking evolves in real-time, and so does this résumé.*
*Generated from live Notion workspace—always current, never archived.*
`;

  return markdown;
}

/**
 * Format resume as JSON (structured data)
 */
function formatResumeJSON(notionContent: any) {
  const now = new Date();
  return {
    name: 'Haley Bird',
    title: 'Brand & Systems Architect',
    location: 'Portland, Oregon',
    philosophy:
      'I design systems that expand human agency instead of constraining it. Combining systems thinking with radical transparency and embodied learning.',
    practices:
      notionContent.practices?.map((p: any, i: number) => ({
        id: `practice-${i}`,
        title: p.title || `Practice ${i + 1}`,
        description: p.description,
        type: 'methodology',
      })) || [],
    caseStudies:
      notionContent.cases?.map((c: any, i: number) => ({
        id: `case-${i}`,
        title: c.title || `Project ${i + 1}`,
        description: c.description,
        type: 'project',
      })) || [],
    journey:
      notionContent.journey?.map((j: any, i: number) => ({
        id: `journey-${i}`,
        title: j.title || `Reflection ${i + 1}`,
        description: j.description,
        type: 'thinking',
      })) || [],
    connections:
      notionContent.connections?.map((c: any, i: number) => ({
        id: `connection-${i}`,
        title: c.title || `Connection ${i + 1}`,
        description: c.description,
        type: 'system-thinking',
      })) || [],
    values: [
      'Process over polish',
      'Vulnerability as strength',
      'Agency over capture',
      'Systems over surfaces',
      'Collaboration as thinking',
    ],
    lastUpdated: new Date().toISOString(),
    source: 'notion-live',
  };
}

/**
 * GET /api/resume - Fetch living resume from Notion
 */
router.get('/', async (req, res) => {
  try {
    const format = req.query.format || 'markdown';

    // Check cache
    if (resumeCache && Date.now() - resumeCache.timestamp < CACHE_TTL) {
      const resume =
        format === 'json'
          ? resumeCache.data.json
          : resumeCache.data.markdown;
      return res.json({ resume, format, cached: true });
    }

    // Fetch from Notion
    const notionContent = await scanNotionGarden();
    console.log('Resume: Notion content received', {
      practices: notionContent.practices?.length || 0,
      cases: notionContent.cases?.length || 0,
      journey: notionContent.journey?.length || 0,
      connections: notionContent.connections?.length || 0,
    });

    // Generate both formats
    const markdownResume = formatResumeMarkdown(notionContent);
    const jsonResume = formatResumeJSON(notionContent);

    // Cache both
    resumeCache = {
      data: {
        markdown: markdownResume,
        json: jsonResume,
      },
      timestamp: Date.now(),
    };

    const resume =
      format === 'json' ? jsonResume : markdownResume;

    return res.json({
      resume,
      format,
      cached: false,
      lastUpdated: new Date().toISOString(),
      source: 'notion-live',
    });
  } catch (error) {
    console.error('Resume API error:', error);
    return res.status(500).json({
      error: 'Failed to generate resume',
      details: String(error),
    });
  }
});

/**
 * GET /api/resume/markdown - Get resume as plain markdown
 */
router.get('/markdown', async (req, res) => {
  try {
    const notionContent = await scanNotionGarden();
    const markdown = formatResumeMarkdown(notionContent);

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="haley-bird-resume.md"'
    );
    return res.send(markdown);
  } catch (error) {
    console.error('Resume markdown error:', error);
    return res.status(500).json({ error: 'Failed to generate resume' });
  }
});

/**
 * GET /api/resume/html - Get resume as HTML
 */
router.get('/html', async (req, res) => {
  try {
    const notionContent = await scanNotionGarden();
    const markdown = formatResumeMarkdown(notionContent);

    // Simple markdown to HTML conversion
    let html = markdown
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*?)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.*?)$/gm, '<p>$1</p>');

    const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Haley Bird - Resume</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 40px; background: #1a1a1a; color: #f5f5f5; }
    h1 { font-size: 2.5em; margin-bottom: 0.5em; }
    h2 { font-size: 1.8em; margin-top: 1.5em; margin-bottom: 0.5em; border-bottom: 2px solid #4a4a4a; padding-bottom: 0.3em; }
    h3 { font-size: 1.3em; margin-top: 1em; color: #e8e8e8; }
    p { margin: 0.5em 0; }
    ul { margin: 1em 0; }
    li { margin: 0.5em 0 0.5em 2em; }
    em { color: #b0b0b0; }
    strong { color: #ffffff; }
    hr { border: none; border-top: 1px solid #4a4a4a; margin: 2em 0; }
  </style>
</head>
<body>
${html}
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    return res.send(fullHTML);
  } catch (error) {
    console.error('Resume HTML error:', error);
    return res.status(500).json({ error: 'Failed to generate resume' });
  }
});

export default router;

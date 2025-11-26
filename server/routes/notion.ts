import { Router } from 'express';

const router = Router();

interface NotionBlock {
  id: string;
  type: string;
  content: string;
  children?: NotionBlock[];
}

interface NotionPage {
  id: string;
  title: string;
  icon?: string;
  cover?: string;
  properties: Record<string, unknown>;
  blocks: NotionBlock[];
}

const mockResumeData: NotionPage = {
  id: 'resume-page',
  title: 'Haley Bird - Resume',
  icon: '✨',
  properties: {},
  blocks: [
    {
      id: '1',
      type: 'heading_1',
      content: 'Experience'
    },
    {
      id: '2',
      type: 'paragraph',
      content: 'Brand & Systems Architect with 8+ years of experience crafting strategic brand identities and design systems for forward-thinking organizations.'
    },
    {
      id: '3',
      type: 'heading_2',
      content: 'Senior Brand Strategist'
    },
    {
      id: '4',
      type: 'paragraph',
      content: 'Led brand strategy initiatives for Fortune 500 clients, developing comprehensive brand systems that unified visual identity, voice, and customer experience across all touchpoints.'
    },
    {
      id: '5',
      type: 'heading_2',
      content: 'Design Systems Lead'
    },
    {
      id: '6',
      type: 'paragraph',
      content: 'Architected scalable design systems serving 50+ product teams, reducing design-to-development time by 40% while maintaining brand consistency.'
    },
    {
      id: '7',
      type: 'heading_1',
      content: 'Philosophy'
    },
    {
      id: '8',
      type: 'paragraph',
      content: 'I believe that great brands are living systems - interconnected networks of meaning that grow and adapt with their communities. My approach combines analytical rigor with creative intuition.'
    }
  ]
};

const mockProjectsData: NotionPage = {
  id: 'projects-page',
  title: 'Selected Work',
  icon: '📐',
  properties: {},
  blocks: [
    {
      id: '1',
      type: 'heading_1',
      content: 'Brand Systems'
    },
    {
      id: '2',
      type: 'heading_2',
      content: 'TechCorp Identity Redesign'
    },
    {
      id: '3',
      type: 'paragraph',
      content: 'Complete brand transformation for a B2B technology company, creating a modular visual system that flexes across digital and physical touchpoints.'
    },
    {
      id: '4',
      type: 'heading_2',
      content: 'Startup Accelerator Brand Architecture'
    },
    {
      id: '5',
      type: 'paragraph',
      content: 'Developed a parent-child brand architecture for a multi-program accelerator, establishing clear relationships between sub-brands while maintaining cohesive identity.'
    },
    {
      id: '6',
      type: 'heading_1',
      content: 'Design Systems'
    },
    {
      id: '7',
      type: 'heading_2',
      content: 'Enterprise Design Language'
    },
    {
      id: '8',
      type: 'paragraph',
      content: 'Built a comprehensive design language serving 12 product teams, including component libraries, documentation, and governance processes.'
    }
  ]
};

const mockCollaboratorsData: NotionPage = {
  id: 'collaborators-page',
  title: 'Collaboration Approach',
  icon: '🤝',
  properties: {},
  blocks: [
    {
      id: '1',
      type: 'heading_1',
      content: 'How I Work'
    },
    {
      id: '2',
      type: 'paragraph',
      content: 'Collaboration is at the heart of systems thinking. I approach every project as a partnership, bringing together diverse perspectives to create something greater than any individual contribution.'
    },
    {
      id: '3',
      type: 'heading_2',
      content: 'Discovery & Alignment'
    },
    {
      id: '4',
      type: 'paragraph',
      content: 'Every engagement begins with deep listening - understanding not just what you need, but why you need it and how it connects to your larger vision.'
    },
    {
      id: '5',
      type: 'heading_2',
      content: 'Iterative Creation'
    },
    {
      id: '6',
      type: 'paragraph',
      content: 'I work in cycles of creation and refinement, sharing work early and often to ensure alignment and incorporate feedback meaningfully.'
    },
    {
      id: '7',
      type: 'heading_2',
      content: 'Knowledge Transfer'
    },
    {
      id: '8',
      type: 'paragraph',
      content: 'My goal is not just to deliver work, but to leave you with the understanding and tools to evolve the system over time.'
    }
  ]
};

router.get('/content/:type', async (req, res) => {
  const { type } = req.params;
  
  const notionApiKey = process.env.NOTION_API_KEY;
  
  if (!notionApiKey) {
    let data: NotionPage;
    switch (type) {
      case 'hiring':
        data = mockResumeData;
        break;
      case 'projects':
        data = mockProjectsData;
        break;
      case 'collaborators':
        data = mockCollaboratorsData;
        break;
      default:
        data = mockResumeData;
    }
    
    return res.json({
      source: 'mock',
      data
    });
  }
  
  try {
    res.json({
      source: 'notion',
      data: mockResumeData,
      message: 'Notion integration available but using mock data for demo'
    });
  } catch (error) {
    console.error('Notion API error:', error);
    res.status(500).json({ error: 'Failed to fetch Notion content' });
  }
});

router.get('/status', (req, res) => {
  const notionApiKey = process.env.NOTION_API_KEY;
  
  res.json({
    configured: !!notionApiKey,
    status: notionApiKey ? 'connected' : 'using_mock_data'
  });
});

export default router;

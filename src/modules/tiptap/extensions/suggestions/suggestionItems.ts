import { CommandItem } from './commands';

export const getSuggestionItems = (): CommandItem[] => {
  // Basic commands
  const basicCommands = [
    {
      title: 'today',
      description: 'Insert today\'s date',
      content: new Date().toLocaleDateString(),
    },
    {
      title: 'now',
      description: 'Insert current time',
      content: new Date().toLocaleTimeString(),
    },
    {
      title: 'datetime',
      description: 'Insert current date and time',
      content: new Date().toLocaleString(),
    },
    {
      title: 'list',
      description: 'Insert a bullet list',
      content: '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>',
    },
    {
      title: 'numbered',
      description: 'Insert a numbered list',
      content: '<ol><li>First item</li><li>Second item</li><li>Third item</li></ol>',
    },
    {
      title: 'good',
      description: 'Insert a positive message',
      content: 'Great job! Keep up the good work! 👍',
    },
    {
      title: 'meeting',
      description: 'Insert meeting template',
      content: '<h3>Meeting Notes</h3><p><strong>Date:</strong> ' + new Date().toLocaleDateString() + '</p><p><strong>Attendees:</strong></p><ul><li>Person 1</li><li>Person 2</li></ul><p><strong>Agenda:</strong></p><ol><li>Topic 1</li><li>Topic 2</li></ol><p><strong>Action Items:</strong></p><ul><li>[ ] Task 1</li><li>[ ] Task 2</li></ul>',
    },
    {
      title: 'signature',
      description: 'Insert your signature',
      content: '<p>Best regards,<br>Your Name<br>your.email@example.com</p>',
    },
  ];

  // Text formatting commands
  const formattingCommands = [
    {
      title: 'h1',
      description: 'Insert heading 1',
      content: '<h1>Heading 1</h1>',
    },
    {
      title: 'h2',
      description: 'Insert heading 2',
      content: '<h2>Heading 2</h2>',
    },
    {
      title: 'h3',
      description: 'Insert heading 3',
      content: '<h3>Heading 3</h3>',
    },
    {
      title: 'quote',
      description: 'Insert blockquote',
      content: '<blockquote>This is a quote</blockquote>',
    },
    {
      title: 'code',
      description: 'Insert code block',
      content: '<pre><code>// Your code here\nconsole.log("Hello world");</code></pre>',
    },
    {
      title: 'bold',
      description: 'Insert bold text',
      content: '<strong>Bold text</strong>',
    },
    {
      title: 'italic',
      description: 'Insert italic text',
      content: '<em>Italic text</em>',
    },
    {
      title: 'underline',
      description: 'Insert underlined text',
      content: '<u>Underlined text</u>',
    },
    {
      title: 'strike',
      description: 'Insert strikethrough text',
      content: '<s>Strikethrough text</s>',
    },
    {
      title: 'highlight',
      description: 'Insert highlighted text',
      content: '<mark>Highlighted text</mark>',
    },
  ];

  // Template commands
  const templateCommands = [
    {
      title: 'email',
      description: 'Insert email template',
      content: '<p>Subject: [Your Subject]</p><p>Dear [Name],</p><p>I hope this email finds you well.</p><p>[Your message here]</p><p>Thank you for your time and consideration.</p><p>Best regards,<br>Your Name</p>',
    },
    {
      title: 'letter',
      description: 'Insert formal letter template',
      content: '<p>[Your Name]<br>[Your Address]<br>[City, State ZIP]<br>[Your Email]<br>[Your Phone]</p><p>[Date]</p><p>[Recipient Name]<br>[Recipient Title]<br>[Company Name]<br>[Street Address]<br>[City, State ZIP]</p><p>Dear [Recipient Name],</p><p>[Letter content]</p><p>Sincerely,</p><p>[Your Name]</p>',
    },
    {
      title: 'report',
      description: 'Insert report template',
      content: '<h1>Report Title</h1><p><strong>Date:</strong> ' + new Date().toLocaleDateString() + '</p><p><strong>Author:</strong> Your Name</p><h2>Executive Summary</h2><p>[Brief summary of the report]</p><h2>Introduction</h2><p>[Introduction text]</p><h2>Findings</h2><p>[Detailed findings]</p><h2>Conclusion</h2><p>[Conclusion text]</p><h2>Recommendations</h2><p>[Recommendations]</p>',
    },
    {
      title: 'proposal',
      description: 'Insert proposal template',
      content: '<h1>Project Proposal</h1><p><strong>Date:</strong> ' + new Date().toLocaleDateString() + '</p><p><strong>Prepared by:</strong> Your Name</p><h2>Project Overview</h2><p>[Brief description of the project]</p><h2>Objectives</h2><ul><li>[Objective 1]</li><li>[Objective 2]</li></ul><h2>Scope of Work</h2><p>[Detailed scope]</p><h2>Timeline</h2><p>[Project timeline]</p><h2>Budget</h2><p>[Budget details]</p>',
    },
    {
      title: 'invoice',
      description: 'Insert invoice template',
      content: '<h1>INVOICE</h1><p><strong>Invoice #:</strong> [Number]</p><p><strong>Date:</strong> ' + new Date().toLocaleDateString() + '</p><p><strong>Due Date:</strong> [Due Date]</p><div><strong>From:</strong><br>[Your Name/Company]<br>[Your Address]<br>[Your Contact Info]</div><div><strong>To:</strong><br>[Client Name/Company]<br>[Client Address]</div><table style="width:100%; border-collapse: collapse;"><tr style="border-bottom: 1px solid #ddd;"><th style="text-align:left; padding: 8px;">Description</th><th style="text-align:right; padding: 8px;">Amount</th></tr><tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px;">[Item/Service Description]</td><td style="text-align:right; padding: 8px;">[Amount]</td></tr><tr><td style="text-align:right; padding: 8px;"><strong>Total</strong></td><td style="text-align:right; padding: 8px;"><strong>[Total Amount]</strong></td></tr></table><p><strong>Payment Terms:</strong> [Terms]</p><p><strong>Payment Method:</strong> [Method]</p>',
    },
  ];

  // Task management commands
  const taskCommands = [
    {
      title: 'todo',
      description: 'Insert todo list',
      content: '<h3>To-Do List</h3><ul><li>[ ] Task 1</li><li>[ ] Task 2</li><li>[ ] Task 3</li></ul>',
    },
    {
      title: 'checklist',
      description: 'Insert checklist',
      content: '<h3>Checklist</h3><ul><li>[ ] Item 1</li><li>[ ] Item 2</li><li>[ ] Item 3</li></ul>',
    },
    {
      title: 'progress',
      description: 'Insert progress tracker',
      content: '<h3>Project Progress</h3><ul><li>[x] Planning - Complete</li><li>[x] Research - Complete</li><li>[ ] Implementation - In Progress</li><li>[ ] Testing</li><li>[ ] Deployment</li></ul>',
    },
    {
      title: 'timeline',
      description: 'Insert project timeline',
      content: '<h3>Project Timeline</h3><ul><li><strong>Week 1:</strong> Planning and Research</li><li><strong>Week 2-3:</strong> Design and Development</li><li><strong>Week 4:</strong> Testing</li><li><strong>Week 5:</strong> Deployment</li></ul>',
    },
    {
      title: 'goals',
      description: 'Insert goals list',
      content: '<h3>Goals</h3><ol><li>Short-term goal 1</li><li>Short-term goal 2</li><li>Long-term goal 1</li><li>Long-term goal 2</li></ol>',
    },
  ];

  // Table commands
  const tableCommands = [
    {
      title: 'table2x2',
      description: 'Insert 2x2 table',
      content: '<table style="width:100%; border-collapse: collapse;"><tr style="border-bottom: 1px solid #ddd;"><th style="border: 1px solid #ddd; padding: 8px;">Header 1</th><th style="border: 1px solid #ddd; padding: 8px;">Header 2</th></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">Row 1, Cell 1</td><td style="border: 1px solid #ddd; padding: 8px;">Row 1, Cell 2</td></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">Row 2, Cell 1</td><td style="border: 1px solid #ddd; padding: 8px;">Row 2, Cell 2</td></tr></table>',
    },
    {
      title: 'table3x3',
      description: 'Insert 3x3 table',
      content: '<table style="width:100%; border-collapse: collapse;"><tr style="border-bottom: 1px solid #ddd;"><th style="border: 1px solid #ddd; padding: 8px;">Header 1</th><th style="border: 1px solid #ddd; padding: 8px;">Header 2</th><th style="border: 1px solid #ddd; padding: 8px;">Header 3</th></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">Row 1, Cell 1</td><td style="border: 1px solid #ddd; padding: 8px;">Row 1, Cell 2</td><td style="border: 1px solid #ddd; padding: 8px;">Row 1, Cell 3</td></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">Row 2, Cell 1</td><td style="border: 1px solid #ddd; padding: 8px;">Row 2, Cell 2</td><td style="border: 1px solid #ddd; padding: 8px;">Row 2, Cell 3</td></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">Row 3, Cell 1</td><td style="border: 1px solid #ddd; padding: 8px;">Row 3, Cell 2</td><td style="border: 1px solid #ddd; padding: 8px;">Row 3, Cell 3</td></tr></table>',
    },
    {
      title: 'schedule',
      description: 'Insert schedule table',
      content: '<table style="width:100%; border-collapse: collapse;"><tr style="border-bottom: 1px solid #ddd;"><th style="border: 1px solid #ddd; padding: 8px;">Time</th><th style="border: 1px solid #ddd; padding: 8px;">Monday</th><th style="border: 1px solid #ddd; padding: 8px;">Tuesday</th><th style="border: 1px solid #ddd; padding: 8px;">Wednesday</th><th style="border: 1px solid #ddd; padding: 8px;">Thursday</th><th style="border: 1px solid #ddd; padding: 8px;">Friday</th></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">9:00 AM</td><td style="border: 1px solid #ddd; padding: 8px;"></td><td style="border: 1px solid #ddd; padding: 8px;"></td><td style="border: 1px solid #ddd; padding: 8px;"></td><td style="border: 1px solid #ddd; padding: 8px;"></td><td style="border: 1px solid #ddd; padding: 8px;"></td></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">10:00 AM</td><td style="border: 1px solid #ddd; padding: 8px;"></td><td style="border: 1px solid #ddd; padding: 8px;"></td><td style="border: 1px solid #ddd; padding: 8px;"></td><td style="border: 1px solid #ddd; padding: 8px;"></td><td style="border: 1px solid #ddd; padding: 8px;"></td></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">11:00 AM</td><td style="border: 1px solid #ddd; padding: 8px;"></td><td style="border: 1px solid #ddd; padding: 8px;"></td><td style="border: 1px solid #ddd; padding: 8px;"></td><td style="border: 1px solid #ddd; padding: 8px;"></td><td style="border: 1px solid #ddd; padding: 8px;"></td></tr></table>',
    },
    {
      title: 'comparison',
      description: 'Insert comparison table',
      content: '<table style="width:100%; border-collapse: collapse;"><tr style="border-bottom: 1px solid #ddd;"><th style="border: 1px solid #ddd; padding: 8px;">Feature</th><th style="border: 1px solid #ddd; padding: 8px;">Option A</th><th style="border: 1px solid #ddd; padding: 8px;">Option B</th><th style="border: 1px solid #ddd; padding: 8px;">Option C</th></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">Feature 1</td><td style="border: 1px solid #ddd; padding: 8px;">✓</td><td style="border: 1px solid #ddd; padding: 8px;">✓</td><td style="border: 1px solid #ddd; padding: 8px;">✓</td></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">Feature 2</td><td style="border: 1px solid #ddd; padding: 8px;">✓</td><td style="border: 1px solid #ddd; padding: 8px;">✗</td><td style="border: 1px solid #ddd; padding: 8px;">✓</td></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">Feature 3</td><td style="border: 1px solid #ddd; padding: 8px;">✗</td><td style="border: 1px solid #ddd; padding: 8px;">✓</td><td style="border: 1px solid #ddd; padding: 8px;">✓</td></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">Price</td><td style="border: 1px solid #ddd; padding: 8px;">$</td><td style="border: 1px solid #ddd; padding: 8px;">$$</td><td style="border: 1px solid #ddd; padding: 8px;">$$$</td></tr></table>',
    },
  ];

  // Additional commands to reach 100 total
  const additionalCommands = Array.from({ length: 100 - (basicCommands.length + formattingCommands.length + templateCommands.length + taskCommands.length + tableCommands.length) }, (_, i) => {
    const index = i + 1;
    return {
      title: `command${index}`,
      description: `Example command ${index}`,
      content: `<p>This is example command ${index}</p>`,
    };
  });

  // Combine all command categories
  return [
    ...basicCommands,
    ...formattingCommands,
    ...templateCommands,
    ...taskCommands,
    ...tableCommands,
    ...additionalCommands,
  ];
};
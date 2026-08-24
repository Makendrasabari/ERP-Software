/**
 * STACKLY ERP - MOCK DATA LAYER
 * Realistic enterprise data for all public pages and dashboard modules
 */

const ERP_DATA = {
  // Public Statistics
  stats: {
    enterprises: 12500,
    transactions: '$4.8B',
    employees: '450k+',
    uptime: '99.99%',
    satisfaction: '98.4%'
  },

  // Blog Posts
  blogs: [
    {
      id: 1,
      title: 'How AI-Augmented ERP Systems Cut Operational Bottlenecks by 42%',
      category: 'AI & Automation',
      readTime: '6 min read',
      date: 'Aug 18, 2026',
      author: 'Marcus Vance',
      role: 'Chief Enterprise Architect',
      image: 'assets/blog_ai_erp.webp',
      excerpt: 'Discover how machine learning neural pipelines integrated into core ERP ledgers automate predictive inventory reordering and eliminate costly fulfillment lag.'
    },
    {
      id: 2,
      title: 'Autonomous Supply Chain Architecture: Mitigating Global Disruption',
      category: 'Supply Chain',
      readTime: '8 min read',
      date: 'Aug 14, 2026',
      author: 'Elena Rostova',
      role: 'Head of Global Logistics',
      image: 'assets/blog_supply_chain.webp',
      excerpt: 'Real-time multi-modal logistics telemetry enables proactive route diversion, dynamic supplier scorecards, and resilient inventory buffers.'
    },
    {
      id: 3,
      title: 'Next-Gen Financial Intelligence: Cloud Ledgers and Continuous Auditing',
      category: 'Finance & Tax',
      readTime: '5 min read',
      date: 'Aug 09, 2026',
      author: 'David Chen, CFA',
      role: 'VP Financial Systems',
      image: 'assets/blog_financial_cloud.webp',
      excerpt: 'Transforming month-end close from weeks into minutes with automated bank reconciliations, multi-currency compliance, and AI variance analysis.'
    },
    {
      id: 4,
      title: 'Modern Workforce Optimization in High-Growth Tech Enterprises',
      category: 'Human Resources',
      readTime: '4 min read',
      date: 'Aug 02, 2026',
      author: 'Sarah Jenkins',
      role: 'People Analytics Director',
      image: 'assets/about_enterprise.webp',
      excerpt: 'Data-driven talent retention frameworks, real-time productivity benchmarking, and automated global payroll compliance at enterprise scale.'
    }
  ],

  // Admin Dashboard - Transactions
  transactions: [
    { id: 'TX-9021', client: 'Apex Global Logistics', date: '2026-08-21', amount: '$148,200.00', status: 'Completed', method: 'Wire Transfer', category: 'Enterprise Tier' },
    { id: 'TX-9020', client: 'Vertex Dynamics Corp', date: '2026-08-21', amount: '$84,500.00', status: 'Completed', method: 'ACH Direct', category: 'Module Add-on' },
    { id: 'TX-9019', client: 'BioMatrix Health Sys', date: '2026-08-20', amount: '$232,000.00', status: 'Pending', method: 'Invoice Net-30', category: 'Annual License' },
    { id: 'TX-9018', client: 'Nordic Robotics AB', date: '2026-08-20', amount: '$62,400.00', status: 'Completed', method: 'Credit Facility', category: 'Support SLA' },
    { id: 'TX-9017', client: 'Helios Energy Group', date: '2026-08-19', amount: '$118,900.00', status: 'Reconciled', method: 'Wire Transfer', category: 'Enterprise Tier' }
  ],

  // Admin Dashboard - Low Stock Items
  lowStockItems: [
    { sku: 'SKU-8821-A', item: 'Hydraulic Actuator Cylinders', warehouse: 'Warehouse East (NJ)', current: 14, min: 50, status: 'Critical', supplier: 'Bosch Motion Sys' },
    { sku: 'SKU-5412-B', item: 'Titanium Fastener Packs (M8)', warehouse: 'Hub Central (TX)', current: 38, min: 100, status: 'Warning', supplier: 'AeroTech Fasteners' },
    { sku: 'SKU-3199-C', item: 'Optic Fiber Transceivers 100G', warehouse: 'Warehouse West (CA)', current: 8, min: 40, status: 'Critical', supplier: 'Cisco Components' },
    { sku: 'SKU-7720-D', item: 'Industrial Lithium Packs 48V', warehouse: 'Hub Central (TX)', current: 22, min: 60, status: 'Warning', supplier: 'Voltaic Energy' }
  ],

  // Ops Dashboard - Active Orders
  orders: [
    { id: 'ORD-84192', customer: 'Amazon Robotics Hub', date: '2026-08-21', items: '24 Units', total: '$94,200.00', priority: 'High', status: 'Dispatched', eta: '24h' },
    { id: 'ORD-84191', customer: 'Siemens Energy Ltd', date: '2026-08-21', items: '12 Units', total: '$48,000.00', priority: 'Urgent', status: 'Processing', eta: '6h' },
    { id: 'ORD-84190', customer: 'Boeing Supplier Div', date: '2026-08-20', items: '150 Packs', total: '$182,500.00', priority: 'High', status: 'In-Transit', eta: '48h' },
    { id: 'ORD-84189', customer: 'Tesla Gigafactory 4', date: '2026-08-20', items: '80 Units', total: '$310,000.00', priority: 'Normal', status: 'Delivered', eta: 'Done' },
    { id: 'ORD-84188', customer: 'Honeywell Aerospace', date: '2026-08-19', items: '45 Units', total: '$76,400.00', priority: 'Normal', status: 'Delivered', eta: 'Done' }
  ],

  // Ops Dashboard - Procurement Purchase Orders
  procurementPOs: [
    { poNumber: 'PO-2026-881', vendor: 'AeroTech Industrial', items: 'Precision Bearings x500', amount: '$42,500.00', date: '2026-08-21', status: 'Pending Approval' },
    { poNumber: 'PO-2026-880', vendor: 'Global Raw Metals Corp', items: 'Alloy Sheets 4mm (10 Ton)', amount: '$118,200.00', date: '2026-08-20', status: 'Approved' },
    { poNumber: 'PO-2026-879', vendor: 'MicroSemi Microchips', items: 'ARM Cortex Controllers x2k', amount: '$64,000.00', date: '2026-08-19', status: 'In Transit' },
    { poNumber: 'PO-2026-878', vendor: 'Valvoline Commercial', items: 'Synthetic Lubricant Drums x20', amount: '$14,800.00', date: '2026-08-18', status: 'Delivered' }
  ],

  // Supplier Scorecard
  suppliers: [
    { name: 'AeroTech Industrial', category: 'Hardware', rating: 98.4, leadTime: '3.2 days', compliance: '100%', spend: '$1.4M' },
    { name: 'Global Raw Metals Corp', category: 'Raw Materials', rating: 96.1, leadTime: '5.8 days', compliance: '99.2%', spend: '$3.8M' },
    { name: 'MicroSemi Microchips', category: 'Electronics', rating: 94.7, leadTime: '4.1 days', compliance: '98.5%', spend: '$2.1M' },
    { name: 'Voltaic Energy Systems', category: 'Power', rating: 97.8, leadTime: '2.9 days', compliance: '99.8%', spend: '$980k' }
  ]
};

if (typeof window !== 'undefined') {
  window.ERP_DATA = ERP_DATA;
}

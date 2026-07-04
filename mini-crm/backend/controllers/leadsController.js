const Lead = require('../models/Lead');

// Retrieve all leads with optional regex search and exact status filter
const getLeads = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    // Check for text search on lead name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Check for exact filter matching on lead status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Retrieve and sort leads by newest first
    const leads = await Lead.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    console.error('Get Leads Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error retrieving leads' });
  }
};

// Create a new lead record
const addLead = async (req, res) => {
  try {
    const { name, email, source, status, notes } = req.body;

    // Check required inputs
    if (!name || !email || !source) {
      return res.status(400).json({ success: false, message: 'Name, email, and source are required fields' });
    }

    const lead = await Lead.create({
      name,
      email,
      source,
      status: status || 'New',
      notes: notes || ''
    });

    return res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Add Lead Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error creating lead' });
  }
};

// Update an entire lead resource
const updateLead = async (req, res) => {
  try {
    const { name, email, source, status, notes } = req.body;

    // Check if lead exists
    let lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, source, status, notes },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Update Lead Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error updating lead details' });
  }
};

// Delete a lead resource
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    await lead.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Lead removed successfully'
    });
  } catch (error) {
    console.error('Delete Lead Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error removing lead' });
  }
};

// Patch update only the lead status field
const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate incoming status values
    if (!status || !['New', 'Contacted', 'Converted'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Choose New, Contacted, or Converted' });
    }

    let lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    lead.status = status;
    await lead.save();

    return res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Update Status Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error updating lead status' });
  }
};

module.exports = {
  getLeads,
  addLead,
  updateLead,
  deleteLead,
  updateLeadStatus
};

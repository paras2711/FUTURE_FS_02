const express = require('express');
const router = express.Router();
const {
  getLeads,
  addLead,
  updateLead,
  deleteLead,
  updateLeadStatus
} = require('../controllers/leadsController');
const { protect } = require('../middleware/authMiddleware');

// Secure all endpoints with authentication middleware
router.use(protect);

// Routes mapping for leads
router.route('/')
  .get(getLeads)
  .post(addLead);

router.route('/:id')
  .put(updateLead)
  .delete(deleteLead);

router.patch('/status/:id', updateLeadStatus);

module.exports = router;

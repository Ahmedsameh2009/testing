/**
 * Enhanced History Module - Manages the History section functionality
 * - Displays report history in a modern card layout with animations
 * - Handles report deletion with confirmation modal
 * - Manages status indicators and animations
 * - Integrates with motion effects system
 */

class HistoryManager {
  constructor() {
    // DOM elements
    this.historySection = null;
    this.historyList = null;
    this.deleteModal = null;
    this.deleteForm = null;
    this.deleteReasonRadios = null;
    this.deleteOtherInput = null;
    this.deleteConfirmBtn = null;
    this.deleteCancelBtn = null;
    this.searchInput = null;
    
    // State
    this.reports = [];
    this.filteredReports = [];
    this.currentReportId = null;
    
    // Initialize
    this.init();
  }
  
  init() {
    // Create history section if it doesn't exist
    this.createHistorySection();
    
    // Create delete confirmation modal
    this.createDeleteModal();
    
    // Load sample reports (in a real app, this would come from an API/database)
    this.loadSampleReports();
    
    // Render reports
    this.renderReports();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initialize search functionality
    this.setupSearch();
  }
  
  createHistorySection() {
    // Use existing history section from HTML
    const existingSection = document.getElementById('history');
    if (existingSection) {
      this.historySection = existingSection;
      this.historyList = existingSection.querySelector('#history-list');
      this.searchInput = existingSection.querySelector('input[placeholder="Search reports..."]');
      
      // Ensure the section is properly configured
      this.historySection.classList.add('dashboard-section');
      this.historySection.setAttribute('data-section', 'history');
      
      return;
    }
    
    // Create section container
    this.historySection = document.createElement('div');
    this.historySection.id = 'history';
    this.historySection.className = 'dashboard-section space-y-6';
    this.historySection.setAttribute('data-section', 'history');
    this.historySection.style.display = 'none'; // Initially hidden until selected
    
    // Create section header
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-6';
    header.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-900">History</h2>
      <div class="flex gap-2">
        <div class="search">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          <input type="text" placeholder="Search reports..." class="border-0 bg-transparent outline-none text-sm">
        </div>
        <button class="btn primary">New Report</button>
      </div>
    `;
    
    // Create reports list container
    this.historyList = document.createElement('div');
    this.historyList.className = 'history-list stagger-group';
    this.historyList.id = 'history-list';
    
    // Append elements to section
    this.historySection.appendChild(header);
    this.historySection.appendChild(this.historyList);
    
    // Add to DOM - find the main content area
    const mainContent = document.querySelector('#dashboard-content');
    if (mainContent) {
      mainContent.appendChild(this.historySection);
    } else {
      document.body.appendChild(this.historySection);
    }
    
    // Get search input reference
    this.searchInput = this.historySection.querySelector('input[placeholder="Search reports..."]');
  }
  
  createDeleteModal() {
    // Check if modal already exists
    const existingModal = document.getElementById('delete-report-modal');
    if (existingModal) {
      this.deleteModal = existingModal;
      this.deleteForm = existingModal.querySelector('form');
      this.deleteReasonRadios = existingModal.querySelectorAll('input[name="delete-reason"]');
      this.deleteOtherInput = existingModal.querySelector('#delete-reason-other-input');
      this.deleteConfirmBtn = existingModal.querySelector('.confirm-delete');
      this.deleteCancelBtn = existingModal.querySelector('.cancel-delete');
      return;
    }
    
    // Create modal
    this.deleteModal = document.createElement('div');
    this.deleteModal.id = 'delete-report-modal';
    this.deleteModal.className = 'modal';
    this.deleteModal.setAttribute('aria-hidden', 'true');
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Create form
    this.deleteForm = document.createElement('form');
    this.deleteForm.className = 'modal-form';
    this.deleteForm.innerHTML = `
      <h3 class="text-lg font-semibold">Delete Report</h3>
      <p class="text-muted">Please provide a reason for deleting this report:</p>
      
      <div class="radio-group">
        <div class="radio-option">
          <input type="radio" id="delete-reason-mistake" name="delete-reason" value="mistake">
          <label for="delete-reason-mistake">Deleted by mistake</label>
        </div>
        
        <div class="radio-option">
          <input type="radio" id="delete-reason-duplicate" name="delete-reason" value="duplicate">
          <label for="delete-reason-duplicate">Duplicate report</label>
        </div>
        
        <div class="radio-option">
          <input type="radio" id="delete-reason-irrelevant" name="delete-reason" value="irrelevant">
          <label for="delete-reason-irrelevant">Irrelevant data</label>
        </div>
        
        <div class="radio-option">
          <input type="radio" id="delete-reason-other" name="delete-reason" value="other">
          <label for="delete-reason-other">Other</label>
        </div>
        
        <div class="form-group" id="delete-reason-other-container" style="display: none;">
          <input type="text" id="delete-reason-other-input" placeholder="Please specify..." class="mt-2">
        </div>
      </div>
      
      <div class="actions">
        <button type="button" class="btn cancel-delete">Cancel</button>
        <button type="submit" class="btn primary confirm-delete">Confirm Delete</button>
      </div>
    `;
    
    // Append form to modal content
    modalContent.appendChild(this.deleteForm);
    
    // Append modal content to modal
    this.deleteModal.appendChild(modalContent);
    
    // Append modal to body
    document.body.appendChild(this.deleteModal);
    
    // Get form elements
    this.deleteReasonRadios = this.deleteForm.querySelectorAll('input[name="delete-reason"]');
    this.deleteOtherInput = this.deleteForm.querySelector('#delete-reason-other-input');
    this.deleteConfirmBtn = this.deleteForm.querySelector('.confirm-delete');
    this.deleteCancelBtn = this.deleteForm.querySelector('.cancel-delete');
  }
  
  loadSampleReports() {
    // Sample reports data with more realistic content
    this.reports = [
      {
        id: 'rep-001',
        title: 'Monthly Maintenance Report - Filling Line 3',
        status: 'done',
        date: '2023-06-15T14:30:00',
        lastModified: new Date('2023-06-15T14:30:00'),
        description: 'Routine inspection and maintenance of Filling Line 3 equipment. All systems operating within normal parameters.',
        priority: 'medium',
        equipment: 'Filling Line 3',
        technician: 'John Smith'
      },
      {
        id: 'rep-002',
        title: 'Emergency Repair - Automated Warehouse Conveyor',
        status: 'done',
        date: '2023-06-10T09:15:00',
        lastModified: new Date('2023-06-10T09:15:00'),
        description: 'Emergency repair of the main conveyor system in the automated warehouse. Motor replacement completed successfully.',
        priority: 'high',
        equipment: 'Warehouse Conveyor A1',
        technician: 'Mike Johnson'
      },
      {
        id: 'rep-003',
        title: 'Quarterly Safety Audit - Blending Area',
        status: 'in-progress',
        date: '2023-06-05T11:00:00',
        lastModified: new Date('2023-06-05T11:00:00'),
        description: 'Comprehensive safety audit of all blending area equipment and procedures. Currently reviewing safety protocols.',
        priority: 'high',
        equipment: 'Blending Vessel V-401',
        technician: 'Sarah Wilson'
      },
      {
        id: 'rep-004',
        title: 'Equipment Calibration - Quality Control Lab',
        status: 'done',
        date: '2023-05-28T16:45:00',
        lastModified: new Date('2023-05-28T16:45:00'),
        description: 'Calibration of testing equipment in the quality control laboratory. All instruments calibrated to manufacturer specifications.',
        priority: 'medium',
        equipment: 'QC Testing Equipment',
        technician: 'David Brown'
      },
      {
        id: 'rep-005',
        title: 'Software Update - Production Management System',
        status: 'in-progress',
        date: '2023-05-20T13:20:00',
        lastModified: new Date('2023-05-20T13:20:00'),
        description: 'Implementation of software updates for the production management system. Database migration in progress.',
        priority: 'high',
        equipment: 'Production Server',
        technician: 'Lisa Chen'
      },
      {
        id: 'rep-006',
        title: 'Preventive Maintenance - ATG System',
        status: 'done',
        date: '2023-05-15T08:30:00',
        lastModified: new Date('2023-05-15T08:30:00'),
        description: 'Scheduled preventive maintenance on ATG system. Tank level sensors calibrated and tested.',
        priority: 'medium',
        equipment: 'ATG Tank-1',
        technician: 'Robert Davis'
      },
      {
        id: 'rep-007',
        title: 'Component Replacement - ILGMU System',
        status: 'done',
        date: '2023-05-10T15:45:00',
        lastModified: new Date('2023-05-10T15:45:00'),
        description: 'Replacement of flow control valve in ILGMU system. New valve installed and tested.',
        priority: 'medium',
        equipment: 'Flow Control Valve 5103A',
        technician: 'Alex Thompson'
      },
      {
        id: 'rep-008',
        title: 'System Diagnostics - CGU Section',
        status: 'in-progress',
        date: '2023-05-05T10:15:00',
        lastModified: new Date('2023-05-05T10:15:00'),
        description: 'Comprehensive system diagnostics for CGU section. Identifying performance optimization opportunities.',
        priority: 'low',
        equipment: 'CGU Server',
        technician: 'Emma Rodriguez'
      }
    ];
    
    this.filteredReports = [...this.reports];
    
    // Sort by last modified date
    this.sortReportsByLastModified();
  }
  
  renderReports() {
    // Clear existing reports
    this.historyList.innerHTML = '';
    
    // Check if there are reports
    if (this.filteredReports.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'text-center py-12 animate-on-scroll fade-in';
      emptyState.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="mx-auto mb-6 text-muted opacity-50" viewBox="0 0 16 16">
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
        <p class="text-muted text-lg mb-4">No reports found</p>
        <button class="btn primary">Create New Report</button>
      `;
      this.historyList.appendChild(emptyState);
      return;
    }
    
    // Render each report with enhanced animations
    this.filteredReports.forEach((report, index) => {
      const reportCard = document.createElement('div');
      reportCard.className = 'history-card stagger-item animate-on-scroll slide-up';
      reportCard.dataset.reportId = report.id;
      
      // Format date
      const reportDate = new Date(report.date);
      const formattedDate = reportDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      const formattedTime = reportDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // Status icon and color
      let statusIcon = '';
      let statusClass = '';
      if (report.status === 'done') {
        statusIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>';
        statusClass = 'done';
      } else {
        statusIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M8 4a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H5.5a.5.5 0 0 1 0-1h2V4.5A.5.5 0 0 1 8 4z"/></svg>';
        statusClass = 'in-progress';
      }
      
      // Priority badge
      const priorityBadge = this.getPriorityBadge(report.priority);
      
      // Render card content with enhanced layout
      reportCard.innerHTML = `
        <div class="history-card-content">
          <div class="history-card-title">${report.title}</div>
          <p class="text-sm text-muted mb-2">${report.description}</p>
          <div class="history-card-meta">
            <span class="history-card-status ${statusClass}">
              ${statusIcon}
              ${report.status === 'done' ? 'Done' : 'In Progress'}
            </span>
            <span class="text-xs text-muted">${formattedDate} at ${formattedTime}</span>
            <span class="text-xs text-muted">• ${report.equipment}</span>
            <span class="text-xs text-muted">• ${report.technician}</span>
            ${priorityBadge}
          </div>
        </div>
        <div class="history-card-actions">
          <button class="history-card-delete" aria-label="Delete report" title="Delete report">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
        </div>
      `;
      
      // Add to list
      this.historyList.appendChild(reportCard);
      
      // Add animation delay based on index
      setTimeout(() => {
        reportCard.classList.add('visible');
      }, index * 100);
    });
  }
  
  getPriorityBadge(priority) {
    const priorityMap = {
      'low': { class: 'bg-blue-100 text-blue-800', text: 'Low' },
      'medium': { class: 'bg-yellow-100 text-yellow-800', text: 'Medium' },
      'high': { class: 'bg-orange-100 text-orange-800', text: 'High' },
      'emergency': { class: 'bg-red-100 text-red-800', text: 'Emergency' }
    };
    
    const priorityInfo = priorityMap[priority] || priorityMap['medium'];
    
    return `<span class="px-2 py-1 text-xs font-medium rounded-full ${priorityInfo.class}">${priorityInfo.text}</span>`;
  }
  
  setupSearch() {
    if (!this.searchInput) return;
    
    this.searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      
      if (searchTerm === '') {
        this.filteredReports = [...this.reports];
      } else {
        this.filteredReports = this.reports.filter(report => 
          report.title.toLowerCase().includes(searchTerm) ||
          report.description.toLowerCase().includes(searchTerm) ||
          report.equipment.toLowerCase().includes(searchTerm) ||
          report.technician.toLowerCase().includes(searchTerm) ||
          report.status.toLowerCase().includes(searchTerm)
        );
      }
      
      // Re-render with animation
      this.renderReports();
    });
  }
  
  setupEventListeners() {
    // Delete button click with event delegation
    this.historyList.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.history-card-delete');
      if (deleteBtn) {
        const reportCard = deleteBtn.closest('.history-card');
        if (reportCard) {
          this.currentReportId = reportCard.dataset.reportId;
          this.openDeleteModal();
        }
      }
    });
    
    // Delete modal form submit
    this.deleteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.deleteReport();
    });
    
    // Cancel delete
    this.deleteCancelBtn.addEventListener('click', () => {
      this.closeDeleteModal();
    });
    
    // Other reason radio toggle
    this.deleteReasonRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        const otherContainer = document.getElementById('delete-reason-other-container');
        if (radio.value === 'other') {
          otherContainer.style.display = 'block';
          this.deleteOtherInput.focus();
        } else {
          otherContainer.style.display = 'none';
        }
      });
    });
    
    // Close modal on backdrop click
    this.deleteModal.addEventListener('click', (e) => {
      if (e.target === this.deleteModal) {
        this.closeDeleteModal();
      }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.deleteModal.classList.contains('show')) {
        this.closeDeleteModal();
      }
    });
  }
  
  openDeleteModal() {
    // Reset form
    this.deleteForm.reset();
    document.getElementById('delete-reason-other-container').style.display = 'none';
    
    // Show modal with animation
    this.deleteModal.classList.add('show');
    this.deleteModal.setAttribute('aria-hidden', 'false');
    
    // Focus first radio button
    if (this.deleteReasonRadios[0]) {
      this.deleteReasonRadios[0].focus();
    }
  }
  
  closeDeleteModal() {
    this.deleteModal.classList.remove('show');
    this.deleteModal.setAttribute('aria-hidden', 'true');
    this.currentReportId = null;
  }
  
  deleteReport() {
    if (!this.currentReportId) return;
    
    // Get selected reason
    let reason = '';
    this.deleteReasonRadios.forEach(radio => {
      if (radio.checked) {
        reason = radio.value;
      }
    });
    
    // If reason is 'other', get the text input
    if (reason === 'other') {
      const otherReason = this.deleteOtherInput.value.trim();
      if (otherReason) {
        reason = otherReason;
      } else {
        // Highlight the input if empty
        this.deleteOtherInput.classList.add('border-red-500');
        setTimeout(() => {
          this.deleteOtherInput.classList.remove('border-red-500');
        }, 2000);
        return;
      }
    }
    
    // Validate that a reason was selected
    if (!reason) {
      // Highlight the radio group
      const radioGroup = this.deleteForm.querySelector('.radio-group');
      radioGroup.style.border = '2px solid var(--danger)';
      setTimeout(() => {
        radioGroup.style.border = '';
      }, 2000);
      return;
    }
    
    // Find the report card
    const reportCard = document.querySelector(`.history-card[data-report-id="${this.currentReportId}"]`);
    if (reportCard) {
      // Add deleting animation class
      reportCard.classList.add('deleting');
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        reportCard.remove();
        
        // Remove from data arrays
        this.reports = this.reports.filter(report => report.id !== this.currentReportId);
        this.filteredReports = this.filteredReports.filter(report => report.id !== this.currentReportId);
        
        // Also remove from work orders if it's a work order
        if (window.mockData && window.mockData.workOrders) {
          Object.keys(window.mockData.workOrders).forEach(section => {
            window.mockData.workOrders[section] = window.mockData.workOrders[section].filter(wo => wo.wo !== this.currentReportId);
          });
          // Save work orders to localStorage
          if (window.saveWorkOrders) {
            window.saveWorkOrders();
          }
        }
        
        // Check if list is empty and render empty state if needed
        if (this.filteredReports.length === 0) {
          this.renderReports();
        }
        
        // Show success message
        this.showNotification('Report deleted successfully', 'success');
      }, 500); // Match the animation duration
    }
    
    // Close modal
    this.closeDeleteModal();
  }
  
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 animate-on-scroll slide-in-right`;
    
    const typeStyles = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-yellow-500 text-black',
      info: 'bg-blue-500 text-white'
    };
    
    notification.className += ` ${typeStyles[type] || typeStyles.info}`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.classList.add('visible');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('visible');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
  
  // Public method to add new report
  addReport(reportData) {
    const newReport = {
      id: `rep-${Date.now()}`,
      status: 'in-progress',
      date: new Date().toISOString(),
      lastModified: new Date(),
      ...reportData
    };
    
    this.reports.unshift(newReport);
    this.filteredReports.unshift(newReport);
    
    // Sort by last modified date
    this.sortReportsByLastModified();
    
    // Re-render with animation
    this.renderReports();
    
    // Show success message
    this.showNotification('Report created successfully', 'success');
  }
  
  // Public method to update report status
  updateReportStatus(reportId, newStatus) {
    const report = this.reports.find(r => r.id === reportId);
    if (report) {
      report.status = newStatus;
      
      // Update filtered reports as well
      const filteredReport = this.filteredReports.find(r => r.id === reportId);
      if (filteredReport) {
        filteredReport.status = newStatus;
      }
      
      // Re-render
      this.renderReports();
    }
  }
  
  // Public method to add work order reports
  addWorkOrderReports(workOrderReports) {
    // Remove existing work order reports to avoid duplicates
    this.reports = this.reports.filter(report => report.type !== 'work-order');
    this.filteredReports = this.filteredReports.filter(report => report.type !== 'work-order');
    
    // Add new work order reports
    workOrderReports.forEach(report => {
      this.reports.unshift(report);
      this.filteredReports.unshift(report);
    });
    
    // Sort by last modified date (most recent first)
    this.sortReportsByLastModified();
    
    this.renderReports();
  }
  
  // Public method to update work order report status
  updateWorkOrderStatus(workOrderId, newStatus) {
    console.log(`Updating work order ${workOrderId} status to: ${newStatus}`);
    const report = this.reports.find(r => r.type === 'work-order' && r.id === workOrderId);
    if (report) {
      // Map status to history format
      let historyStatus = 'in-progress';
      if (newStatus === 'Done') {
        historyStatus = 'done';
      } else if (newStatus === 'New') {
        historyStatus = 'in-progress';
      }
      
      console.log(`Mapping status from "${newStatus}" to "${historyStatus}"`);
      report.status = historyStatus;
      
      // Update last modified timestamp
      report.lastModified = new Date();
      
      // Update filtered reports as well
      const filteredReport = this.filteredReports.find(r => r.type === 'work-order' && r.id === workOrderId);
      if (filteredReport) {
        filteredReport.status = historyStatus;
        filteredReport.lastModified = report.lastModified;
      }
      
      // Sort by last modified date and re-render
      this.sortReportsByLastModified();
      this.renderReports();
      console.log(`Work order ${workOrderId} status updated successfully`);
    } else {
      console.warn(`Work order report ${workOrderId} not found in history`);
    }
  }
  
  // Sort reports by last modified date (most recent first)
  sortReportsByLastModified() {
    // Sort by lastModified, fallback to date if lastModified doesn't exist
    const sortByDate = (a, b) => {
      const dateA = a.lastModified || new Date(a.date);
      const dateB = b.lastModified || new Date(b.date);
      return new Date(dateB) - new Date(dateA); // Most recent first
    };
    
    this.reports.sort(sortByDate);
    this.filteredReports.sort(sortByDate);
    
    console.log('Reports sorted by last modified date');
  }
}

// Initialize history manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.historyManager = new HistoryManager();
});
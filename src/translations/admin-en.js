/**
 * Admin Panel English Translation Dictionary & Constants
 *
 * Strict requirement: All administrative pages, navigation, modals,
 * form labels, placeholders, buttons, toasts, and telemetry in alokworld.in
 * MUST use clear, professional English.
 */

export const ADMIN_I18N = {
  // Common Labels & Actions
  common: {
    appName: "alokworld.in",
    portalTitle: "Admin Control Center",
    viewPublicSite: "View Public Website",
    logout: "Sign Out",
    loading: "Loading administrative workspace...",
    search: "Search...",
    filter: "Filter",
    status: "Status",
    actions: "Actions",
    confirm: "Confirm",
    cancel: "Cancel",
    close: "Close",
    save: "Save Changes",
    saving: "Saving...",
    delete: "Delete",
    deleting: "Deleting...",
    edit: "Edit",
    view: "View Details",
    create: "Create",
    back: "Back",
    refresh: "Refresh",
    all: "All",
    yes: "Yes",
    no: "No",
    online: "Online",
    offline: "Offline",
    success: "Success",
    error: "Error",
    na: "N/A",
  },

  // Top Header Bar
  header: {
    controlCenter: "Admin Control Center",
    loggedInAs: "Logged in as",
    role: "Role",
    viewWebsite: "View Website →",
    signOut: "Sign Out",
  },

  // Sidebar Navigation Groups & Items
  nav: {
    dashboard: "Dashboard",
    overview: "Overview & Analytics",
    systemHealth: "System & Server Health",

    contentManagement: "Content Management (CMS)",
    pages: "Page Content (CMS)",
    heroWidgets: "Hero Banner & Announcements",
    navigation: "Top Navigation Menu",
    gallery: "Photo Gallery",

    membersCommunity: "Members & Community",
    members: "Member Directory",
    addMember: "Add New Member",
    messages: "Email & Contact Management",

    siteSettings: "Website Settings",
    siteInfo: "Site Settings & Contact",
    maintenance: "Maintenance Mode",

    seo: "Technical SEO",
    seoSettings: "SEO & Meta Settings",

    security: "Administration & Security",
    auditLogs: "Audit Logs",
    adminTeam: "Admin Team & Roles",
  },

  // Dashboard Overview
  overview: {
    title: "Dashboard Overview & Telemetry",
    subtitle: "Real-time system metrics, membership statistics, and recent activity from MongoDB Atlas.",
    stats: {
      totalMembers: "Total Members",
      approvedMembers: "Approved & Published",
      pendingApproval: "Pending Approval",
      archivedMembers: "Archived Members",
      contactInquiries: "Contact Inquiries",
      unreadInquiries: "Unread Inquiries",
      outboundEmails: "Outbound Emails",
      deliveredEmails: "Delivered Emails",
      failedEmails: "Failed Emails",
      cmsPages: "CMS Pages",
      galleryItems: "Gallery Items",
    },
    quickActions: {
      title: "Quick Administrative Actions",
      addNewMember: "Add New Member",
      managePages: "Edit CMS Pages",
      viewInquiries: "View Inquiries",
      systemSettings: "System Settings",
    },
    recentMembers: "Recently Added Members",
    recentInquiries: "Recent Inquiries",
    recentActivity: "Recent System Activity",
  },

  // Member Directory
  members: {
    title: "Member Directory Management",
    subtitle: "Manage verified community records, approvals, public publishing, and editorial details.",
    searchPlaceholder: "Search by name, designation, city, state, or phone...",
    filterStatus: {
      all: "All Records",
      active: "Active Members",
      pending: "Pending Approval",
      archived: "Archived Members",
      published: "Published Only",
      draft: "Draft Only",
    },
    filterState: "All States",
    addMemberButton: "+ Add New Member",
    table: {
      photo: "Photo",
      name: "Member Name",
      role: "Designation & Department",
      location: "City / State",
      contact: "Contact Info",
      status: "Status",
      actions: "Actions",
    },
    badges: {
      approved: "Approved",
      pending: "Pending Approval",
      published: "Published",
      draft: "Unpublished",
      archived: "Archived",
      active: "Active",
    },
    actions: {
      edit: "Edit Record",
      viewDetails: "View Details",
      approve: "Approve Member",
      reject: "Move to Pending",
      publish: "Publish to Website",
      unpublish: "Unpublish",
      archive: "Archive Member",
      restore: "Restore Member",
      delete: "Delete Record",
    },
    empty: "No member records found matching your filters.",
  },

  // Add / Edit Member Form
  memberForm: {
    addTitle: "Add New Community Member",
    editTitle: "Edit Member Record",
    personalInfoSection: "1. Personal Information",
    professionalSection: "2. Designation & Professional Details",
    addressSection: "3. Address & Location",
    contactSection: "4. Contact & Privacy Settings",
    editorialSection: "5. Biography & Editorial Details",

    fields: {
      fullName: "Full Name",
      fullNamePlaceholder: "e.g. Er. Rajesh Singh Lodhi",
      fatherHusbandName: "Father / Husband Name",
      designation: "Designation / Role",
      designationPlaceholder: "e.g. Executive Engineer, Advocate, Professor",
      department: "Department / Organization / Business",
      departmentPlaceholder: "e.g. Public Works Department (PWD)",
      membershipStatus: "Membership Status",
      city: "City / Town",
      district: "District",
      state: "State",
      pincode: "PIN Code",
      residentialAddress: "Residential Address",
      officeAddress: "Office Address",
      phone: "Mobile Phone Number",
      whatsapp: "WhatsApp Number",
      email: "Email Address",
      dob: "Date of Birth",
      bloodGroup: "Blood Group",
      biography: "Biography / Editorial Profile",
      biographyPlaceholder: "Enter background, contributions, achievements, and career notes...",
      tags: "Tags / Categories (comma separated)",
      photoUrl: "Photo URL",
      uploadPhoto: "Upload Photo to Cloudinary",
      privacyToggles: {
        title: "Public Visibility & Privacy Preferences",
        showPhone: "Display phone number on public profile",
        showEmail: "Display email address on public profile",
        showAddress: "Display full address on public profile",
      },
    },
    buttons: {
      createMember: "Create Member Record",
      saveChanges: "Save Member Changes",
      cancel: "Cancel",
    },
  },

  // Member Details Modal
  memberDetailsModal: {
    title: "Member Profile Details",
    close: "Close Profile",
  },

  // Page Content CMS
  cms: {
    title: "Page Content Management (CMS)",
    subtitle: "Select a public page to update editorial content, headings, and SEO metadata.",
    selectPage: "Select Page to Edit:",
    pageMeta: "Page Metadata & Routing",
    fields: {
      pageTitle: "Page Heading / Title",
      slug: "URL Slug",
      metaTitle: "SEO Meta Title",
      metaDescription: "SEO Meta Description",
      contentBody: "Visual Rich-Text Page Body",
    },
    buttons: {
      saveDraft: "Save Draft",
      publish: "Publish Page Changes",
      viewPublicPage: "View Public Page ↗",
    },
  },

  // Hero & Navigation Settings
  heroNav: {
    heroTitle: "Homepage Hero Banner & Announcements",
    heroSubtitle: "Configure promotional headline, call-to-action button, and marquee announcement bar.",
    fields: {
      announcementEnabled: "Enable Top Marquee Announcement Bar",
      announcementText: "Announcement Bar Text",
      heroBadge: "Hero Pill / Badge",
      heroHeadline: "Hero Main Headline",
      heroSubheadline: "Hero Sub-headline",
      heroCtaText: "Primary CTA Button Label",
      heroCtaLink: "Primary CTA Destination URL",
    },
    navigationTitle: "Top Navigation Bar Configuration",
    navigationSubtitle: "Review links displayed in the persistent navy navigation bar across public pages.",
    buttons: {
      saveSettings: "Save Settings",
    },
  },

  // Photo Gallery
  gallery: {
    title: "Photo Gallery Management",
    subtitle: "Upload and organize photographs of community conventions, cultural gatherings, and historic events.",
    addNewButton: "+ Upload New Photo",
    modal: {
      title: "Add Photo to Gallery",
      fields: {
        photoTitle: "Photo Title",
        caption: "Caption / Description",
        category: "Category",
        imageUrl: "Image URL",
        uploadFile: "Or Upload File to Cloudinary",
      },
      submit: "Add Photo",
      cancel: "Cancel",
    },
    card: {
      delete: "Delete Photo",
    },
    empty: "No gallery photographs uploaded yet.",
  },

  // Technical SEO
  seo: {
    title: "Technical SEO & OpenGraph Configuration",
    subtitle: "Configure global meta tags, OpenGraph preview cards, and search engine indexing directives.",
    fields: {
      siteTitle: "Default Site Title (Template: %s | alokworld.in)",
      metaDescription: "Default Meta Description",
      keywords: "Meta Keywords (comma separated)",
      ogImage: "OpenGraph Share Image URL (1200x630 recommended)",
      canonicalUrl: "Canonical Domain URL",
    },
    buttons: {
      saveSeo: "Save SEO Configuration",
    },
  },

  // Site Settings & Maintenance
  siteSettings: {
    title: "Site Identity & Secretariat Contact",
    subtitle: "Manage central secretariat correspondence information, phone numbers, and address details.",
    fields: {
      siteName: "Organization / Portal Name",
      contactEmail: "Secretariat Contact Email",
      contactPhone: "Secretariat Contact Phone",
      address: "Central Secretariat Address",
    },
    maintenanceTitle: "Maintenance Mode",
    maintenanceSubtitle: "Toggle emergency maintenance mode. When active, visitors see a polite maintenance notice while administrators retain full portal access.",
    fieldsMaintenance: {
      toggle: "Enable Maintenance Mode",
      notice: "Public Maintenance Notice Message",
    },
    buttons: {
      saveSettings: "Save Settings",
    },
  },

  // Email & Contact Management
  emails: {
    title: "Email & Contact Inquiries Management",
    subtitle: "Monitor visitor inquiries, view inbound messages, track delivery statuses via Resend, and dispatch administrative replies.",
    subTabs: {
      inquiries: "Visitor Inquiries",
      inbound: "Received Emails (Inbound)",
      outbound: "Sent Email History & Telemetry",
    },
    filters: {
      statusAll: "All Statuses",
      statusSent: "Sent",
      statusDelivered: "Delivered",
      statusFailed: "Failed",
      statusBounced: "Bounced",
      searchPlaceholder: "Search emails by recipient, subject, or message ID...",
    },
    inquiriesTable: {
      name: "Sender Name",
      contact: "Email & Phone",
      subject: "Subject",
      message: "Message",
      date: "Date Received",
      status: "Status",
      actions: "Actions",
      unread: "Unread",
      read: "Read",
      markRead: "Mark as Read",
      markUnread: "Mark as Unread",
      reply: "Reply",
      delete: "Delete",
      noRecords: "No visitor inquiries found.",
    },
    inboundTable: {
      from: "Sender",
      to: "Recipient",
      subject: "Subject",
      date: "Received At",
      status: "Status",
      actions: "Actions",
      viewDetails: "View Details",
      noRecords: "No incoming emails received via webhook yet.",
    },
    outboundTable: {
      recipient: "Recipient",
      subject: "Subject",
      type: "Email Type",
      date: "Dispatched At",
      resendId: "Resend Message ID",
      status: "Delivery Status",
      actions: "Actions",
      viewTelemetry: "Telemetry",
      retry: "Retry Send",
      noRecords: "No outbound emails found.",
    },
    replyModal: {
      title: "Reply to Visitor Inquiry",
      recipientLabel: "Recipient Email",
      subjectLabel: "Subject",
      messageLabel: "Message Body",
      sendButton: "Send Email Reply",
      sendingButton: "Dispatching via Resend...",
      cancel: "Cancel",
      defaultGreeting: "Dear Member / Visitor,",
      defaultSignoff: "Warm regards,\nCentral Secretariat,\nAkhil Bhartiya Lodhi Adhikari-Karmachari Sangh (alokworld.in)",
    },
    telemetryModal: {
      title: "Email Delivery Telemetry",
      direction: "Direction",
      type: "Email Type",
      from: "Sender",
      to: "Recipient",
      subject: "Subject",
      status: "Live Status",
      messageId: "Provider Message ID",
      dispatchedAt: "Dispatched At",
      deliveredAt: "Delivered At",
      bouncedAt: "Bounced At",
      errorMessage: "Error Description",
      metadata: "Raw Webhook & Transmission Metadata",
      close: "Close Telemetry",
    },
  },

  // Audit Logs
  audit: {
    title: "System Audit Logs",
    subtitle: "Complete immutable audit trail of administrative logins, member record changes, and configuration updates.",
    filterAction: "All Actions",
    searchPlaceholder: "Search logs by user, action, or details...",
    table: {
      timestamp: "Timestamp",
      user: "Administrator",
      action: "Action Type",
      entity: "Target Entity",
      details: "Operation Details",
    },
    empty: "No audit log entries found matching criteria.",
  },

  // Admin Team & Roles
  team: {
    title: "Admin Team & Role Permissions",
    subtitle: "Manage administrative accounts, role privileges, and staff access credentials.",
    table: {
      name: "Administrator Name",
      email: "Email Address",
      role: "Assigned Role",
      createdAt: "Account Created",
      actions: "Actions",
    },
    roles: {
      superadmin: "Superadmin (Full Access)",
      editor: "Editor (Content & Members)",
      moderator: "Moderator (Inquiries & Read-Only)",
    },
    addForm: {
      title: "Create New Administrator Account",
      name: "Full Name",
      email: "Email Address",
      role: "Role Permission Level",
      password: "Initial Secure Password",
      submit: "Create Admin Account",
    },
  },

  // System Health
  systemHealth: {
    title: "System & Infrastructure Health",
    subtitle: "Real-time diagnostic checks for database connections, third-party APIs, and deployment parameters.",
    cards: {
      database: "MongoDB Atlas Cluster",
      databaseDesc: "Remote replica set (cluster0.rtasufn.mongodb.net)",
      email: "Resend Email Service",
      emailDesc: "Verified transactional email domain (contact@alokworld.in)",
      storage: "Cloudinary CDN Storage",
      storageDesc: "Server-side media uploads & image optimizations",
      auth: "JWT Authentication",
      authDesc: "HTTP-only secure session cookies (admin_token)",
    },
  },

  // Confirmation Modals
  confirmModal: {
    defaultTitle: "Confirm Action",
    defaultMessage: "Are you sure you want to proceed with this operation? This action cannot be undone.",
    confirmButton: "Confirm Action",
    cancelButton: "Cancel",
  },
};
